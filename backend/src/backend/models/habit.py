from sqlalchemy import Column, Integer, Boolean, String, ForeignKey
from sqlalchemy.dialects.postgresql import INTERVAL
from sqlalchemy.orm import relationship
from backend.database import Base
from datetime import datetime


class Habit(Base):
    __tablename__ = 'habit'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # Link to user
    user = relationship("User", back_populates="habits")
    month = Column(Integer, nullable=False, default=datetime.now().month)
    day = Column(Integer, nullable=False, default=datetime.now().day)
    year = Column(Integer, nullable=False, default=datetime.now().year)
    name = Column(String, nullable=False)
    duration = Column(INTERVAL, nullable=True)
    #duration = Column(Integer, nullable=True, default=0)
    quantity = Column(Integer, nullable=True, default=0)
    category = Column(String, nullable=False)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
