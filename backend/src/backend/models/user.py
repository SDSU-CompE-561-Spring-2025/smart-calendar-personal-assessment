from sqlalchemy import Column, Integer, Boolean, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import INTERVAL
from sqlalchemy import relationship
from sqlalchemy.ext.declarative import declarative_base
from backend.database import Base
from datetime import datetime, UTC

class User(Base):
    __tablename__ = 'users'
    id: int = Column(Integer, primary_key=True, index=True)
    first_name: str = Column(String, nullable=False)
    last_name: str = Column(String, nullable=False)
    email: str = Column(String, unique=True, nullable=False)
    password: str = Column(String, nullable=False)
    verif_code: str = Column(String, nullable=True)
    acc_created: datetime = Column(DateTime, default=datetime.now(UTC))
