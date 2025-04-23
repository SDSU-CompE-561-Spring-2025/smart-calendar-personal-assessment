from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, relationship
from sqlalchemy.ext.declarative import declarative_base

# from backend.database import Base

Base = declarative_base()

class Event(Base):
    __tablename__ = 'event'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # Link to user
    user = relationship("User", back_populates="event")
    name = Column(String, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    email = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    recurring = Column(Boolean, default=False)
    description = Column(String, nullable=True)
