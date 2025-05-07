from pydantic import BaseModel
from typing import Optional
from enum import Enum

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

# Base schema with default and optional settings
class CalendarBase(BaseModel):
    name: str = "My Calendar"
    theme: Optional[Theme] = Theme.DEFAULT
    mode: Optional[ThemeMode] = ThemeMode.LIGHT
    week_start: Optional[WeekStart] = WeekStart.SUNDAY

# Schema for creating a calendar (no additional fields needed)
class CalendarCreate(CalendarBase):
    pass

class CalendarUpdate(BaseModel):
    name: Optional[str] = None
    theme: Optional[Theme] = None
    mode: Optional[ThemeMode] = None
    week_start: Optional[WeekStart] = None

# Response schema including `id`
class CalendarResponse(CalendarBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
