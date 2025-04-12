from pydantic import BaseModel
from datetime import datetime

class HabitBase(BaseModel):
    month: int = datetime.now().month  
    day: int = datetime.now().day      
    year: int = datetime.now().year    
    name: str
    duration:  timedelta = timedelta(second=0)              
    quantity: int = 0                  
    category: str
    description: str = None            
    completed: bool = False            
class HabitCreate(HabitBase):
    pass  # Uses all fields from the base model
class Habit(HabitBase):
    id: int
    class Config:
        orm_mode = True