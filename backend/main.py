from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
import crud
import models
import schemas
from config import CORS_ORIGINS
from database import Base, engine, get_db

app = FastAPI(title="Students Club Manager API", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)

def get_or_404(db: Session, model, record_id: int, title: str):
    record = crud.get_by_id(db, model, record_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"{title} не найден(а)")
    return record

def create_with_conflict_check(db: Session, model, values: dict, message: str):
    try:
        return crud.create(db, model, values)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail=message)

@app.get("/")
def root():
    return {"message": "Students Club Manager API is running:))))))))"}

@app.post("/clubs/", response_model=schemas.ClubResponse, status_code=status.HTTP_201_CREATED)
def create_club(payload: schemas.ClubCreate, db: Session = Depends(get_db)):
    return create_with_conflict_check(db, models.Club, payload.model_dump(), "Кружок с таким названием уже существует")

@app.get("/clubs/", response_model=list[schemas.ClubResponse])
def get_clubs(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return crud.get_list(db, models.Club, skip, limit)

@app.get("/clubs/{club_id}", response_model=schemas.ClubResponse)
def get_club(club_id: int, db: Session = Depends(get_db)):
    return get_or_404(db, models.Club, club_id, "Кружок")

@app.put("/clubs/{club_id}", response_model=schemas.ClubResponse)
def update_club(club_id: int, payload: schemas.ClubCreate, db: Session = Depends(get_db)):
    club = get_or_404(db, models.Club, club_id, "Кружок")
    try:
        return crud.update(db, club, payload.model_dump())
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Кружок с таким названием уже существует")

@app.delete("/clubs/{club_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_club(club_id: int, db: Session = Depends(get_db)):
    crud.delete(db, get_or_404(db, models.Club, club_id, "Кружок"))

@app.post("/students/", response_model=schemas.StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(payload: schemas.StudentCreate, db: Session = Depends(get_db)):
    return crud.create(db, models.Student, payload.model_dump())

@app.get("/students/", response_model=list[schemas.StudentResponse])
def get_students(db: Session = Depends(get_db)):
    return crud.get_list(db, models.Student)

@app.get("/students/{student_id}", response_model=schemas.StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)):
    return get_or_404(db, models.Student, student_id, "Студент")

@app.put("/students/{student_id}", response_model=schemas.StudentResponse)
def update_student(student_id: int, payload: schemas.StudentCreate, db: Session = Depends(get_db)):
    student = get_or_404(db, models.Student, student_id, "Студент")
    return crud.update(db, student, payload.model_dump())

@app.delete("/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: int, db: Session = Depends(get_db)):
    crud.delete(db, get_or_404(db, models.Student, student_id, "Студент"))

@app.post("/timetables/", response_model=schemas.TimetableResponse, status_code=status.HTTP_201_CREATED)
def create_timetable(payload: schemas.TimetableCreate, db: Session = Depends(get_db)):
    get_or_404(db, models.Club, payload.club_id, "Кружок")
    return crud.create(db, models.Timetable, payload.model_dump())

@app.get("/timetables/", response_model=list[schemas.TimetableResponse])
def get_timetables(db: Session = Depends(get_db)):
    return crud.get_list(db, models.Timetable)

@app.get("/timetables/{timetable_id}", response_model=schemas.TimetableResponse)
def get_timetable(timetable_id: int, db: Session = Depends(get_db)):
    return get_or_404(db, models.Timetable, timetable_id, "Занятие")

@app.put("/timetables/{timetable_id}", response_model=schemas.TimetableResponse)
def update_timetable(timetable_id: int, payload: schemas.TimetableCreate, db: Session = Depends(get_db)):
    lesson = get_or_404(db, models.Timetable, timetable_id, "Занятие")
    get_or_404(db, models.Club, payload.club_id, "Кружок")
    return crud.update(db, lesson, payload.model_dump())

@app.delete("/timetables/{timetable_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_timetable(timetable_id: int, db: Session = Depends(get_db)):
    crud.delete(db, get_or_404(db, models.Timetable, timetable_id, "Занятие"))

@app.get("/clubs/{club_id}/students", response_model=list[schemas.StudentResponse])
def get_club_students(club_id: int, db: Session = Depends(get_db)):
    get_or_404(db, models.Club, club_id, "Кружок")
    return crud.club_students(db, club_id)

@app.post(
    "/clubs/{club_id}/enrollments",
    response_model=schemas.EnrollmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def enroll_student(club_id: int, payload: schemas.EnrollmentCreate, db: Session = Depends(get_db)):
    get_or_404(db, models.Club, club_id, "Кружок")
    get_or_404(db, models.Student, payload.student_id, "Студент")
    existing = (
        db.query(models.Enrollment)
        .filter_by(club_id=club_id, student_id=payload.student_id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="Студент уже записан в этот кружок")
    return create_with_conflict_check(
        db,
        models.Enrollment,
        {"club_id": club_id, "student_id": payload.student_id},
        "Студент уже записан в этот кружок",
    )

@app.delete("/clubs/{club_id}/enrollments/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def unenroll_student(club_id: int, student_id: int, db: Session = Depends(get_db)):
    enrollment = (
        db.query(models.Enrollment)
        .filter_by(club_id=club_id, student_id=student_id)
        .first()
    )
    if enrollment is None:
        raise HTTPException(status_code=404, detail="Запись студента в кружок не найдена")
    crud.delete(db, enrollment)

@app.get(
    "/timetables/{timetable_id}/attendance",
    response_model=list[schemas.AttendanceResponse],
)
def get_attendance(timetable_id: int, db: Session = Depends(get_db)):
    lesson = get_or_404(db, models.Timetable, timetable_id, "Занятие")
    return crud.attendance_for_lesson(db, lesson)

@app.put(
    "/timetables/{timetable_id}/attendance",
    response_model=list[schemas.AttendanceResponse],
)
def save_attendance(
    timetable_id: int,
    payload: schemas.AttendanceUpdate,
    db: Session = Depends(get_db),
):
    lesson = get_or_404(db, models.Timetable, timetable_id, "Занятие")
    result = crud.save_attendance(db, lesson, [mark.model_dump() for mark in payload.marks])
    if result == "duplicate_students":
        raise HTTPException(status_code=422, detail="Студент указан в списке несколько раз")
    if result == "student_not_enrolled":
        raise HTTPException(status_code=400, detail="Можно отмечать только студентов, записанных в этот кружок")
    return result
