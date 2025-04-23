from collections.abc import Callable
from datetime import datetime, timedelta
from typing import ClassVar

from pydantic import BaseModel, field_validator


class HabitBase(BaseModel):
    month: int = datetime.now(datetime.timezone.utc).month
    day: int = datetime.now(datetime.timezone.utc).day
    year: int = datetime.now(datetime.timezone.utc).year
    name: str
    duration: timedelta = timedelta(0)
    @field_validator('duration', mode='before')
    @classmethod
    def parse_duration(cls, value):
        if isinstance(value, int):
            return timedelta(seconds=value)
        if isinstance(value, str):
            pass
        return value
    quantity: int = 0
    category: str
    description: str | None = None
    completed: bool = False

class HabitCreate(HabitBase):
    pass

class Habit(HabitBase):
    id: int

    class Config:
        orm_mode: ClassVar[bool] = True
        json_encoders: ClassVar[dict[type, Callable[[timedelta], int]]] = {
            timedelta: lambda v: int(v.total_seconds())
        }
