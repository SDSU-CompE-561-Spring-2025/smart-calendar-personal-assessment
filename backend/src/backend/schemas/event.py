from datetime import datetime, timedelta
from typing import Optional, Any
from pydantic import BaseModel, field_validator, field_serializer

class EventBase(BaseModel):
    name: str
    date: datetime
    duration: timedelta
    description: Optional[str] = None
    @field_validator('duration', mode='before')
    @classmethod
    def parse_duration(cls, v: Any) -> timedelta:
        if isinstance(v, timedelta):
            return v
        if isinstance(v, (int, float)):
            return timedelta(seconds=v)
        if isinstance(v, str):
            try:
                h, m, s = map(int, v.split(':'))
                return timedelta(hours=h, minutes=m, seconds=s)
            except Exception:
                raise ValueError("Duration must be in 'HH:MM:SS' format")
        raise ValueError("Invalid duration format")

    @field_serializer('duration', return_type=int)
    def serialize_duration(self, v: timedelta, _info) -> int:
        return int(v.total_seconds())

class EventCreate(EventBase):
    pass
class EventResponse(EventBase):
    id: int
    date: datetime
    duration: timedelta
    description: str

    class Config:
        from_attributes = True
