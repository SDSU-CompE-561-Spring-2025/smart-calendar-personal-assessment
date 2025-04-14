from pydantic import BaseModel, field_validator
from datetime import datetime
from datetime import timedelta
from typing import Optional

class HabitBase(BaseModel):
    month: int = datetime.now().month  
    day: int = datetime.now().day      
    year: int = datetime.now().year    
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
    description: Optional[str] = None          
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
