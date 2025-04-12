from pydantic import BaseModel
from datetime import datetime

class CalendarBase(BaseModel): 
    display_type: str
    name: str
class CalendarCreate(CalendarBase): 
    pass
class Calendar(CalendarBase): 
    id: int
    class Config:
        orm_mode = True