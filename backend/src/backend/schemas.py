from pydantic import BaseModel
from datetime import datetime

class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str
class UserCreate(UserBase):
    password: str
class User(UserBase):
    id: int
    acc_created = datetime
    class Config:
        orm_mode = True

class CalendarBase(BaseModel): 
    display_type: str
    name: str
class CalendarCreate(CalendarBase): 
    pass
class Calendar(CalendarBase): 
    id: int
    class Config:
        orm_mode = True

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

class CategoryBase(BaseModel):
    name: str
class CategoryCreate(CategoryBase):
    pass
class Category(CategoryBase):
    id: int
    class Config: 
        orm_mode = True
