from sqlalchemy.orm import Session
from backend.models.habit import Habit
from backend.schemas.habit import HabitCreate
from backend.config import get_settings
from datetime import timedelta

def create_habit(db: Session, habit: HabitCreate, user_id: int):
    db_habit = HabitModel(
        user_id=user_id,
        month=habit.month,
        day=habit.day,
        year=habit.year,
        name=habit.name,
        duration=habit.duration,
        quantity=habit.quantity,
        category=habit.category,
        description=habit.description,
        completed=habit.completed
    )
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

def get_habit(db: Session, habit_id: int):
    return db.query(HabitModel).filter(HabitModel.id == habit_id).first()

def get_user_habits(db: Session, user_id: int):
    return db.query(HabitModel).filter(HabitModel.user_id == user_id).all()

def update_habit(db: Session, habit_id: int, habit_data: HabitBase):
    db_habit = db.query(HabitModel).filter(HabitModel.id == habit_id).first()
    if not db_habit:
        return None
    update_fields = habit_data.dict(exclude_unset=True)
    for key, value in update_fields.items():
        setattr(db_habit, key, value)
    db.commit()
    db.refresh(db_habit)
    return db_habit
