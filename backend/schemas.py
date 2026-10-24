from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    full_name: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=6)
    role: str = Field(default="student", pattern="^(student|teacher)$")

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    full_name: str
    role: str

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse

class AccessTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class RefreshRequest(BaseModel):
    refresh_token: str

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
