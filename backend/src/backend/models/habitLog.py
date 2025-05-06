from sqlalchemy import Column, Integer, ForeignKey, Date, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.core.database import Base

class HabitLog(Base):
    __tablename__ = 'habit_logs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    habit_id = Column(Integer, ForeignKey('habits.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    date = Column(Date, nullable=False)
    created_at = Column(Date, server_default=func.now())

    __table_args__ = (
        UniqueConstraint('habit_id', 'date', name='uq_habit_date'),
    )

    # Relationships
    habit = relationship("Habit", back_populates="habit_logs")
    user = relationship("User", back_populates="habit_logs")
