from pydantic import BaseModel, field_validator, model_validator
from typing import Optional, List
from datetime import date

class HabitBase(BaseModel):
    name: str
    quantity: Optional[int] = None
    duration: Optional[int] = None
    days_of_week: Optional[List[str]] = []
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    category_id: int

    @field_validator('days_of_week')
    @classmethod
    def validate_days(cls, days):
        allowed = {'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'}
        invalid = [d for d in days if d.lower() not in allowed]
        if invalid:
            raise ValueError(f"Invalid days: {', '.join(invalid)}")
        return [d.lower() for d in days]

    @model_validator(mode='after')
    def validate_quantity_or_duration(self):
        # More robust validation for quantity and duration
        has_quantity = self.quantity is not None and self.quantity > 0
        has_duration = self.duration is not None and self.duration > 0
        
        if not has_quantity and not has_duration:
            raise ValueError("You must provide either quantity or duration.")
        
        if has_quantity and has_duration:
            raise ValueError("Provide only one: quantity or duration, not both.")
            
        return self

class HabitCreate(HabitBase):
    pass

class HabitCompleteUpdate(BaseModel):
    completed: bool

class HabitUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = None
    duration: Optional[int] = None
    days_of_week: Optional[List[str]] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    category_id: Optional[int] = None

    @field_validator('days_of_week')
    @classmethod
    def validate_days(cls, days):
        if days is None:
            return None
        allowed = {'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'}
        invalid = [d for d in days if d.lower() not in allowed]
        if invalid:
            raise ValueError(f"Invalid days: {', '.join(invalid)}")
        return [d.lower() for d in days]

    @model_validator(mode='after')
    def validate_quantity_or_duration(self):
        # Skip validation if neither field is being updated
        if self.quantity is None and self.duration is None:
            return self
            
        # More robust validation for quantity and duration
        has_quantity = self.quantity is not None and self.quantity > 0
        has_duration = self.duration is not None and self.duration > 0
        
        if has_quantity and has_duration:
            raise ValueError("Provide only one: quantity or duration, not both.")
            
        return self

class HabitResponse(HabitBase):
    id: int
    completed: bool
    category_name: Optional[str]

    class Config:
        from_attributes = True
