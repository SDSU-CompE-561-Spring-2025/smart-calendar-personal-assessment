from sqlalchemy import Column, Integer, Boolean, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import INTERVAL
from sqlalchemy import relationship
from sqlalchemy.ext.declarative import declarative_base
from database import Base
from datetime import datetime

Base = declarative_base()

class Category(Base):
    __tablename__ = 'category'
    id = Column(Integer, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # Link to user
    user = relationship("User", back_populates="category") 
    name = Column(String, nullable=False)