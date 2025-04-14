from sqlalchemy.orm import Session

from backend.models.habit import Habit
from backend.schemas.habit import HabitCreate
from backend.config import get_settings
# from backend.models.user import User

settings = get_settings()

def create_habit(db: Session, habit: HabitCreate, user_id: int):
    db_habit = Habit(
        user_id=user_id,
        month=habit.month,
        day=habit.day,
        year=habit.year,
        name=habit.name,
        duration=habit.duration,
        quantity=habit.quantity,
        category=habit.category,
        description=habit.description,
        completed=habit.completed,
    )
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit