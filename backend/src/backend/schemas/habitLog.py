from pydantic import BaseModel
from datetime import date

# Used for POST /habits/{id}/log
class HabitLogCreate(BaseModel):
    date: date

# Used for responses
class HabitLogResponse(BaseModel):
    id: int
    habit_id: int
    user_id: int
    date: date
    habit_name: str  # Manually populated from the related Habit object

    class Config:
        from_attributes = True
