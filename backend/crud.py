from sqlalchemy.orm import Session
import models

def get_list(db: Session, model, skip: int = 0, limit: int = 100):
    return db.query(model).order_by(model.id).offset(skip).limit(limit).all()

def get_by_id(db: Session, model, record_id: int):
    return db.get(model, record_id)

def create(db: Session, model, values: dict):
    record = model(**values)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def update(db: Session, record, values: dict):
    for key, value in values.items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record

def delete(db: Session, record):
    db.delete(record)
    db.commit()

def club_students(db: Session, club_id: int):
    return (
        db.query(models.Student)
        .join(models.Enrollment, models.Enrollment.student_id == models.Student.id)
        .filter(models.Enrollment.club_id == club_id)
        .order_by(models.Student.full_name)
        .all()
    )

def attendance_for_lesson(db: Session, lesson: models.Timetable):
    students = club_students(db, lesson.club_id)
    saved_marks = {
        row.student_id: row.present
        for row in db.query(models.AttendanceRecord)
        .filter(models.AttendanceRecord.timetable_id == lesson.id)
        .all()
    }
    return [
        {
            "student_id": student.id,
            "full_name": student.full_name,
            "group_name": student.group_name,
            "present": saved_marks.get(student.id, False),
        }
        for student in students
    ]

def save_attendance(db: Session, lesson: models.Timetable, marks: list[dict]):
    enrolled_ids = {
        student.id for student in club_students(db, lesson.club_id)
    }
    requested_ids = [mark["student_id"] for mark in marks]

    if len(requested_ids) != len(set(requested_ids)):
        return "duplicate_students"
    if set(requested_ids) - enrolled_ids:
        return "student_not_enrolled"

    existing = {
        row.student_id: row
        for row in db.query(models.AttendanceRecord)
        .filter(models.AttendanceRecord.timetable_id == lesson.id)
        .all()
    }
    for mark in marks:
        record = existing.get(mark["student_id"])
        if record is None:
            db.add(
                models.AttendanceRecord(
                    timetable_id=lesson.id,
                    student_id=mark["student_id"],
                    present=mark["present"],
                )
            )
        else:
            record.present = mark["present"]
    db.commit()
    return attendance_for_lesson(db, lesson)
