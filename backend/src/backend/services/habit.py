from sqlalchemy.orm import Session
from backend.core.config import get_settings
from backend.models.habit import Habit
from backend.schemas.habit import HabitCreate, HabitResponse, HabitUpdate
from datetime import date


settings = get_settings()


def create_habit(db: Session, habit: HabitCreate, user_id: int):
    db_habit = Habit(
        user_id=user_id,
        name=habit.name,
        quantity=habit.quantity,
        duration=habit.duration,
        days_of_week=",".join(habit.days_of_week) if habit.days_of_week else None,
        start_date=habit.start_date,
        end_date=habit.end_date,
        category_id=habit.category_id
    )

    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

def get_all_habits(db: Session, user_id: int) -> list[HabitResponse]:
    habits = db.query(Habit).filter(Habit.user_id == user_id).all()

    return [
        HabitResponse(
            id=habit.id,
            name=habit.name,
            quantity=habit.quantity,
            duration=habit.duration,
            days_of_week=habit.day_list,  # converts from comma string to list
            start_date=habit.start_date,
            end_date=habit.end_date,
            category_id=habit.category_id,
            completed=habit.completed,
            category_name=habit.category_name
        )
        for habit in habits
    ]

def get_todays_habits(db: Session, user_id: int) -> list[HabitResponse]:
    habits = db.query(Habit).filter(Habit.user_id == user_id).all()
    return [
        HabitResponse(
            id=h.id,
            name=h.name,
            quantity=h.quantity,
            duration=h.duration,
            days_of_week=h.day_list,
            start_date=h.start_date,
            end_date=h.end_date,
            category_id=h.category_id,
            completed=h.completed,
            category_name=h.category_name
        )
        for h in habits
        if habit_is_scheduled_for_today(h)
    ]

def get_habits_for_date(db: Session, user_id: int, target_date: date) -> list[HabitResponse]:
    habits = db.query(Habit).filter(Habit.user_id == user_id).all()

    return [
        HabitResponse(
            id=h.id,
            name=h.name,
            quantity=h.quantity,
            duration=h.duration,
            days_of_week=h.day_list,
            start_date=h.start_date,
            end_date=h.end_date,
            category_id=h.category_id,
            completed=h.completed,
            category_name=h.category_name
        )
        for h in habits
        if habit_is_scheduled_for_day(h, target_date)
    ]

def update_habit_completion(db: Session, user_id: int, habit_id: int, completed: bool) -> HabitResponse | None:
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).first()

    if not habit:
        return None  # caller can raise 404

    habit.completed = completed
    db.commit()
    db.refresh(habit)

    return HabitResponse(
        id=habit.id,
        name=habit.name,
        quantity=habit.quantity,
        duration=habit.duration,
        days_of_week=habit.day_list,
        start_date=habit.start_date,
        end_date=habit.end_date,
        category_id=habit.category_id,
        completed=habit.completed,
        category_name=habit.category_name
    )

def update_habit_by_id(db: Session, user_id: int, habit_id: int, update_data: HabitUpdate) -> Habit | None:
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).first()
    if not habit:
        return None

    update_dict = update_data.dict(exclude_unset=True)
    if not update_dict:
        return habit  # No change, return as-is

    if "days_of_week" in update_dict:
        update_dict["days_of_week"] = ",".join(update_dict["days_of_week"])

    for key, value in update_dict.items():
        setattr(habit, key, value)

    db.commit()
    db.refresh(habit)
    return habit

def delete_habit_by_id(db: Session, user_id: int, habit_id: int) -> bool:
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).first()
    if not habit:
        return False

    db.delete(habit)
    db.commit()
    return True

def habit_is_scheduled_for_today(habit) -> bool:
    # Get today's day as "mon", "tue", etc.
    weekday_str = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][date.today().weekday()]
    return weekday_str in habit.day_list  # `day_list` is your @property

def habit_is_scheduled_for_day(habit, target_date: date) -> bool:
    weekday_str = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][target_date.weekday()]
    in_date_range = habit.start_date <= target_date and (habit.end_date is None or target_date <= habit.end_date)
    return in_date_range and weekday_str in habit.day_list

# def get_habits_by_date(db: Session, month: int, day: int, year: int, user_id: int):
#     return db.query(Habit).filter(Habit.user_id == user_id, Habit.month == month, Habit.day == day, Habit.year == year).options(joinedload(Habit.category)).all()

# def update_habit_by_id(db: Session, habit_id: int, user_id: int, habit: HabitCreate):
#     db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).update(habit.model_dump(), synchronize_session="fetch")
#     db.commit()
#     return (db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).first())

# def delete_habit_by_id(db: Session, habit_id: int, user_id: int):
#     db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).delete()
#     db.commit()

# def get_habit_by_id(db: Session, habit_id: int, user_id: int):
#     return (
#         db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).first()
#     )
