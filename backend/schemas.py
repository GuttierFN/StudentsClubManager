from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class ClubCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    teacher: str = Field(min_length=1, max_length=200)
    description: str | None = None

class ClubResponse(ClubCreate, ORMModel):
    id: int

class StudentCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=200)
    group_name: str = Field(min_length=1, max_length=100)

class StudentResponse(StudentCreate, ORMModel):
    id: int

class TimetableCreate(BaseModel):
    club_id: int = Field(gt=0)
    date: str = Field(min_length=1, max_length=30)
    time: str = Field(min_length=1, max_length=20)
    room: str = Field(min_length=1, max_length=100)

class TimetableResponse(TimetableCreate, ORMModel):
    id: int

class EnrollmentCreate(BaseModel):
    student_id: int = Field(gt=0)

class EnrollmentResponse(ORMModel):
    id: int
    club_id: int
    student_id: int
    enrolled_at: datetime

class AttendanceMark(BaseModel):
    student_id: int = Field(gt=0)
    present: bool

class AttendanceUpdate(BaseModel):
    marks: list[AttendanceMark] = Field(default_factory=list)

class AttendanceResponse(BaseModel):
    student_id: int
    full_name: str
    group_name: str
    present: bool
