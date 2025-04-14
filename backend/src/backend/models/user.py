from datetime import datetime, UTC

from sqlalchemy import Column, DateTime, Integer, String

from backend.database import Base

# Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id: int = Column(Integer, primary_key=True, index=True)
    first_name: str = Column(String, nullable=False)
    last_name: str = Column(String, nullable=False)
    email: str = Column(String, unique=True, nullable=False)
    password: str = Column(String, nullable=False)
    verif_code: str = Column(String, nullable=True)
    acc_created: datetime = Column(DateTime, default=datetime.now(UTC))
