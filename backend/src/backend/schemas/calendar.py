from pydantic import BaseModel


class CalendarBase(BaseModel):
    id : int
    name: str
    display_type: str


class CalendarCreate(CalendarBase):
    display_type: int

class Calendar(CalendarBase):
    id: int
    name: str
    display_type: int
    user_id: int
    class Config:
        from_attributes = True