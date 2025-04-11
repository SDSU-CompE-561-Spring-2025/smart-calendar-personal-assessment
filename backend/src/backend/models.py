from sqlalchemy import Column, Integer, Boolean, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import INTERVAL
from sqlalchemy import relationship
from sqlalchemy.ext.declarative import declarative_base # database
Base = declarative_base() # database
from database import Base
from datetime import datetime


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    acc_created = Column(DateTime, default=datetime.now)

class Calendar(Base):
    __tablename__ = 'calendar'
    id = Column(Integer, primary_key=True, index=True, autoincrement = True)
    name = Column(String, nullable=False)
    display_type = Column(String, nullable=False)

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

class Category(Base):
    __tablename__ = 'category'
    id = Column(Integer, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # Link to user
    user = relationship("User", back_populates="category") 
    name = Column(String, nullable=False)
