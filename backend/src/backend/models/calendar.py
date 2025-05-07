from enum import Enum
from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from backend.core.database import Base

# Frontend-compatible theme values
class Theme(str, Enum):
    DEFAULT = "default"
    GREEN = "theme-green"
    ORANGE = "theme-orange"
    PURPLE = "theme-purple"
    PINK = "theme-pink"
    RED = "theme-red"

class ThemeMode(str, Enum):
    LIGHT = "light"
    DARK = "dark"

class WeekStart(str, Enum):
    SUNDAY = "Sunday"
    MONDAY = "Monday"
    TUESDAY = "Tuesday"
    WEDNESDAY = "Wednesday"
    THURSDAY = "Thursday"
    FRIDAY = "Friday"
    SATURDAY = "Saturday"

class Calendar(Base):
    __tablename__ = 'calendars'

    id         = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name       = Column(String, nullable=False)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)

    # User-configurable settings
    theme      = Column(SQLAlchemyEnum(Theme), nullable=True, default=Theme.DEFAULT)
    mode       = Column(SQLAlchemyEnum(ThemeMode), nullable=True, default = ThemeMode.LIGHT)
    week_start = Column(SQLAlchemyEnum(WeekStart), nullable=True, default = WeekStart.SUNDAY)

    user       = relationship("User", back_populates="calendar")
    events     = relationship("Event", back_populates="calendar")
