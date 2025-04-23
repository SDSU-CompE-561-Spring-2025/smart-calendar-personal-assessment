from datetime import datetime

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, relationship
from sqlalchemy.dialects.postgresql import INTERVAL
from sqlalchemy.ext.declarative import declarative_base

# from backend.database import Base

Base = declarative_base()

class Habit(Base):
    __tablename__ = 'habit'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # Link to user
    user = relationship("User", back_populates="habits")
    month = Column(Integer, nullable=False, default=datetime.now(datetime.timezone.utc).month)
    day = Column(Integer, nullable=False, default=datetime.now(datetime.timezone.utc).day)
    year = Column(Integer, nullable=False, default=datetime.now(datetime.timezone.utc).year)
    name = Column(String, nullable=False)
    duration = Column(INTERVAL, nullable=True)
    #duration = Column(Integer, nullable=True, default=0)
    quantity = Column(Integer, nullable=True, default=0)
    category = Column(String, nullable=False)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
