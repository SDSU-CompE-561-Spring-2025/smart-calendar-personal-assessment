from datetime import datetime, timedelta

from pydantic import BaseModel, field_validator


class HabitBase(BaseModel):
    month: int = datetime.now(datetime.timezone.UTC).month
    day: int = datetime.now(datetime.timezone.UTC).day
    year: int = datetime.now(datetime.timezone.UTC).year
    name: str | None = None]
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
        orm_mode = True
        json_encoders = {
          timedelta: lambda v: int(v.total_seconds())
        }
