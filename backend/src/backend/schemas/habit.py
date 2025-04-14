from pydantic import BaseModel, field_validator
from datetime import datetime
from datetime import timedelta
from typing import Optional

class HabitBase(BaseModel):
    __tablename__ = 'habit'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # Link to user
    user = relationship("User", back_populates="habits")
    month: int = datetime.now().month  
    day: int = datetime.now().day      
    year: int = datetime.now().year    
    name: Optional[str] = None
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
