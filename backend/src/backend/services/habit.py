from sqlalchemy.orm import Session, joinedload
from backend.core.config import get_settings
from backend.models.habit import Habit
from backend.schemas.habit import HabitCreate

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
        description=habit.description,
        completed=habit.completed,
        category_id=habit.category_id
    )

    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

def get_all_habits(db: Session, user_id: int):
    return db.query(Habit).filter(Habit.user_id == user_id).options(joinedload(Habit.category)).all()

def get_habits_by_date(db: Session, month: int, day: int, year: int, user_id: int):
    return db.query(Habit).filter(Habit.user_id == user_id, Habit.month == month, Habit.day == day, Habit.year == year).options(joinedload(Habit.category)).all()

def update_habit_by_id(db: Session, habit_id: int, user_id: int, habit: HabitCreate):
    db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).update(habit.model_dump(), synchronize_session="fetch")
    db.commit()
    return (db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).first())

def delete_habit_by_id(db: Session, habit_id: int, user_id: int):
    db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).delete()
    db.commit()

def get_habit_by_id(db: Session, habit_id: int, user_id: int):
    return (
        db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).first()
    )
