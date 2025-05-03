from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Calendar(Base):
    __tablename__ = 'calendar'
    id           = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name         = Column(String,  nullable=False)
    display_type = Column(String,  nullable=False)

    user_id      = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)

    users         = relationship("User",     back_populates="calendars")
    # events       = relationship("Event",    back_populates="calendar", cascade="all, delete-orphan")
    # habits       = relationship("Habit",    back_populates="calendar", cascade="all, delete-orphan")
    # categories   = relationship("Category", back_populates="calendar", cascade="all, delete-orphan")