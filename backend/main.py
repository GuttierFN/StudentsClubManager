from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models
import schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Students Club Manager API", version="1.0")

@app.get("/")
def root():
    return {"message": "Backend is running successfully"}

@app.post("/clubs/", response_model=schemas.ClubResponse, status_code=status.HTTP_201_CREATED)
def create_club(club: schemas.ClubCreate, db: Session = Depends(get_db)):
    db_club = models.Club(**club.dict())
    db.add(db_club)
    db.commit()
    db.refresh(db_club)
    return db_club

@app.get("/clubs/", response_model=list[schemas.ClubResponse])
def get_clubs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Club).offset(skip).limit(limit).all()

@app.get("/clubs/{club_id}", response_model=schemas.ClubResponse)
def get_club(club_id: int, db: Session = Depends(get_db)):
    club = db.query(models.Club).filter(models.Club.id == club_id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Кружок не найден")
    return club

@app.put("/clubs/{club_id}", response_model=schemas.ClubResponse)
def update_club(club_id: int, club_data: schemas.ClubCreate, db: Session = Depends(get_db)):
    club = db.query(models.Club).filter(models.Club.id == club_id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Кружок не найден")
    for key, value in club_data.dict().items():
        setattr(club, key, value)
    db.commit()
    db.refresh(club)
    return club

@app.delete("/clubs/{club_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_club(club_id: int, db: Session = Depends(get_db)):
    club = db.query(models.Club).filter(models.Club.id == club_id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Кружок не найден")
    db.delete(club)
    db.commit()
    return None

@app.post("/students/", response_model=schemas.StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    db_student = models.Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@app.get("/students/", response_model=list[schemas.StudentResponse])
def get_students(db: Session = Depends(get_db)):
    return db.query(models.Student).all()

@app.post("/timetables/", response_model=schemas.TimetableResponse, status_code=status.HTTP_201_CREATED)
def create_timetable(item: schemas.TimetableCreate, db: Session = Depends(get_db)):
    club = db.query(models.Club).filter(models.Club.id == item.club_id).first()
    if not club:
        raise HTTPException(status_code=400, detail="Указанный кружок не существует")
    db_item = models.Timetable(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/timetables/", response_model=list[schemas.TimetableResponse])
def get_timetables(db: Session = Depends(get_db)):
    return db.query(models.Timetable).all()