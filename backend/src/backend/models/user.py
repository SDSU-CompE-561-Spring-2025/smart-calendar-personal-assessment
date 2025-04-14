from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from backend.database import Base

# Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    acc_created = Column(DateTime, default=datetime.now)
