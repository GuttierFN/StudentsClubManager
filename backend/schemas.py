from pydantic import BaseModel

class ClubBase(BaseModel):
    name: str
    teacher: str
    description: str | None = None

class ClubCreate(ClubBase):
    pass

class ClubResponse(ClubBase):
    id: int

    class Config:
        from_attributes = True

class StudentBase(BaseModel):
    full_name: str
    group_name: str

class StudentCreate(StudentBase):
    pass

class StudentResponse(StudentBase):
    id: int

    class Config:
        from_attributes = True

class TimetableBase(BaseModel):
    club_id: int
    date: str
    time: str
    room: str

class TimetableCreate(TimetableBase):
    pass

class TimetableResponse(TimetableBase):
    id: int

    class Config:
        from_attributes = True