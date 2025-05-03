from collections.abc import Callable
from datetime import UTC, datetime, timedelta
from typing import Optional, ClassVar

from pydantic import BaseModel, Field

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
