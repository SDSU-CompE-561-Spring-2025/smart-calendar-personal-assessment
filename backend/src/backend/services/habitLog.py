from sqlalchemy.orm import Session
from datetime import date
from fastapi import HTTPException
from backend.models.habit import Habit
from backend.models.habitLog import HabitLog
from backend.schemas.habitLog import HabitLogResponse

def mark_habit_completed_for_date(
    db: Session,
    habit_id: int,
    user_id: int,
    log_date: date
) -> HabitLogResponse | None:
    # Check habit ownership
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == user_id
    ).first()
    if not habit:
        return None

    # Prevent duplicate logs
    existing_log = db.query(HabitLog).filter_by(
        habit_id=habit_id,
        date=log_date
    ).first()

    if existing_log:
        raise HTTPException(status_code=409, detail="Habit already logged for this date.")

    # Create new log
    log = HabitLog(habit_id=habit_id, user_id=user_id, date=log_date)
    db.add(log)
    db.commit()
    db.refresh(log)

    return HabitLogResponse(
        id=log.id,
        habit_id=log.habit_id,
        user_id=log.user_id,
        date=log.date,
        created_at=log.created_at,
        habit_name=habit.name
    )

def get_logs_for_habit(db: Session, habit_id: int, user_id: int) -> list[HabitLogResponse]:
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).first()
    if not habit:
        return []

    logs = db.query(HabitLog).filter_by(habit_id=habit_id, user_id=user_id).order_by(HabitLog.date).all()

    return [
        HabitLogResponse(
            id=log.id,
            habit_id=log.habit_id,
            user_id=log.user_id,
            date=log.date,
            created_at=log.created_at,
            habit_name=habit.name
        )
        for log in logs
    ]

def get_todays_habit_logs(db: Session, user_id: int) -> list[HabitLogResponse]:
    today = date.today()

    logs = (
        db.query(HabitLog)
        .join(Habit)
        .filter(HabitLog.user_id == user_id, HabitLog.date == today)
        .all()
    )

    return [
        HabitLogResponse(
            id=log.id,
            habit_id=log.habit_id,
            user_id=log.user_id,
            date=log.date,
            created_at=log.created_at,
            habit_name=log.habit.name  # Accessing via relationship
        )
        for log in logs
    ]
