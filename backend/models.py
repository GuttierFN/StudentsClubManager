from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time
from sqlalchemy.orm import relationship
from database import Base

class Club(Base):
    __tablename__ = "clubs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    teacher = Column(String, nullable=False)
    description = Column(String, nullable=True)

    timetables = relationship("Timetable", back_populates="club", cascade="all, delete-orphan")

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    group_name = Column(String, nullable=False)

class Timetable(Base):
    __tablename__ = "timetables"

    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(Integer, ForeignKey("clubs.id", ondelete="CASCADE"), nullable=False)
    date = Column(String, nullable=False)
    time = Column(String, nullable=False)
    room = Column(String, nullable=False)

    club = relationship("Club", back_populates="timetables")