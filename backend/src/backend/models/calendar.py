from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

# from backend.database import Base

Base = declarative_base()

class Calendar(Base):
    __tablename__ = 'calendar'
    id = Column(Integer, primary_key=True, index=True, autoincrement = True)
    name = Column(String, nullable=False)
    display_type = Column(String, nullable=False)
