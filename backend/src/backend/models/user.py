from datetime import UTC, datetime
from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from backend.core.database import Base

class User(Base):
    __tablename__ = 'users'

    id:          int = Column(Integer, primary_key=True, index=True)
    first_name:  str = Column(String, nullable=False)
    last_name:   str = Column(String, nullable=False)
    email:       str = Column(String, unique=True, index=True)
    password:    str = Column(String)
    verif_code:  str = Column(String, nullable=True)
    acc_created: datetime = Column(DateTime, default=datetime.now(UTC))

    categories = relationship("Category", back_populates = "user")
    habits = relationship("Habit", back_populates = "user")
    calendar = relationship("Calendar", back_populates="user", cascade="all, delete-orphan")
    events = relationship("Event",back_populates="user" )
