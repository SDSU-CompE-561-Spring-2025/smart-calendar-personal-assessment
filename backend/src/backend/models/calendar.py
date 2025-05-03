from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.core.database import Base

class Calendar(Base):
    __tablename__ = 'calendars'
    id           = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name         = Column(String,  nullable=False)

    user_id      = Column(Integer, ForeignKey("users.id"), nullable=False)

    user         = relationship("User", back_populates="calendar")
    # events       = relationship("Event",    back_populates="calendar", cascade="all, delete-orphan")
