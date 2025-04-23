from datetime import datetime

from pydantic import BaseModel


class EventBase(BaseModel):
    name: str
    start_date: datetime
    end_date: datetime
    start_time: datetime.now
    end_time: datetime.now
    recurring: bool = False # default to False
    description: str
class EventCreate(EventBase):
    pass
class Event(EventBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True
