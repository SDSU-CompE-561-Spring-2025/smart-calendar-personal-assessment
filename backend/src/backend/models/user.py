from sqlalchemy import Column, Integer, Boolean, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import INTERVAL
from sqlalchemy import relationship
from sqlalchemy.ext.declarative import declarative_base
from backend.database import Base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    acc_created = Column(DateTime, default=datetime.now)