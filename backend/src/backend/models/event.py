from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.core.database import Base


class Event(Base):
    __tablename__ = 'events'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.now)

    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # Link to user
    calendar_id = Column(Integer, ForeignKey('calendars.id'), nullable = False)

    user = relationship("User", back_populates="events")
    calendar = relationship("Calendar", back_populates="events")
