from pydantic import BaseModel


class CalendarBase(BaseModel):
    name: str = "My Calendar"

class CalendarCreate(CalendarBase):
    pass

class CalendarResponse(CalendarBase):
    id: int
    name: str

    class Config:
        from_attributes = True
