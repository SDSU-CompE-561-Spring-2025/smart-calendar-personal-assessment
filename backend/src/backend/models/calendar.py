from sqlalchemy import Column, Integer, Boolean, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import INTERVAL
from sqlalchemy import relationship
from sqlalchemy.ext.declarative import declarative_base
from database import Base
from datetime import datetime

Base = declarative_base()

class Calendar(Base):
    __tablename__ = 'calendar'
    id = Column(Integer, primary_key=True, index=True, autoincrement = True)
    name = Column(String, nullable=False)
    display_type = Column(String, nullable=False)