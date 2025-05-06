from datetime import datetime
from pydantic import BaseModel

class EventBase(BaseModel):
    name: str
    start_time: datetime
    end_time: datetime


class EventCreate(EventBase):
    pass
class EventResponse(EventBase):
    id: int
    start_time: datetime
    end_time: datetime
    duration: int

    class Config:
        from_attributes = True
