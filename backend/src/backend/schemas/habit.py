from collections.abc import Callable
from datetime import UTC, datetime, timedelta, date
from typing import Optional, ClassVar
from pydantic import BaseModel, Field, model_validator
from backend.schemas.category import CategoryResponse


class HabitBase(BaseModel):
    month: int = Field(default_factory=lambda: datetime.now(UTC).month)
    day: int = Field(default_factory=lambda: datetime.now(UTC).day)
    year: int = Field(default_factory=lambda: datetime.now(UTC).year)
    name: str
    duration: int
    quantity: int
    description: str | None = None
    completed: bool = False
    category_id: int

    @model_validator(mode='after')
    def validate_date(self):
        try:
            date(self.year, self.month, self.day)
        except ValueError:
            raise ValueError("Invalid date: year, month, and day must form a valid calendar date")
        return self

class HabitCreate(HabitBase):
    pass

class HabitResponse(HabitBase):
    id: int
    month: int
    day: int
    year: int
    name: str
    duration: int
    quantity: int
    description: str
    completed: bool
    category_id: int
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True
        json_encoders: ClassVar[dict[type, Callable[[timedelta], int]]] = {
            timedelta: lambda v: int(v.total_seconds())
        }
