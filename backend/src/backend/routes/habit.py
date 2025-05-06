from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import backend.services.habit as habit_service
import backend.services.user as user_service
import backend.services.habitLog as habitLog_service
from backend.core.auth import decode_access_token, oauth_scheme
from backend.core.dependencies import get_db
from backend.schemas.habit import HabitCreate, HabitResponse, HabitUpdate
from backend.schemas.habitLog import HabitLogCreate, HabitLogResponse
from backend.models.category import Category
from typing import Annotated
from datetime import date


router = APIRouter()

# Habits
@router.post("", response_model=HabitResponse)
def create_new_habit(
    habit: HabitCreate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user_id = user_service.get_user_by_email(db, email).id

    category = db.query(Category).filter_by(id=habit.category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Category Id")

    db_habit = habit_service.create_habit(db, habit, user_id)

    return HabitResponse(
        id=db_habit.id,
        name=db_habit.name,
        quantity=db_habit.quantity,
        duration=db_habit.duration,
        days_of_week=db_habit.day_list,
        start_date=db_habit.start_date,
        end_date=db_habit.end_date,
        category_id=db_habit.category_id,
        completed=db_habit.completed,
        category_name=db_habit.category_name  # from hybrid_property
    )

@router.get("", response_model=list[HabitResponse])
def get_habits(
    db: Session = Depends(get_db), token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user = user_service.get_user_by_email(db, email)

    return habit_service.get_all_habits(db, user.id)

@router.get("/today", response_model=list[HabitResponse])
def get_todays_habits(
    db: Session = Depends(get_db),
    token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user_id = user_service.get_user_by_email(db, email).id

    return habit_service.get_todays_habits(db, user_id)

@router.get("/on-date", response_model=list[HabitResponse])
def get_habits_for_date(
    date_query: Annotated[date, Query(..., description="The date to fetch habits for (YYYY-MM-DD)")],
    db: Session = Depends(get_db),
    token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user_id = user_service.get_user_by_email(db, email).id

    return habit_service.get_habits_for_date(db, user_id, date_query)

@router.post("/{habit_id}/log", response_model=HabitLogResponse)
def log_habit_completion(
    habit_id: int,
    log_data: HabitLogCreate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user_id = user_service.get_user_by_email(db, email).id

    log = habitLog_service.mark_habit_completed_for_date(db, habit_id, user_id, log_data.date)

    if log is None:
        raise HTTPException(status_code=404, detail="Habit not found")

    return log

@router.get("/{habit_id}/logs", response_model=list[HabitLogResponse])
def get_habit_logs(
    habit_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user_id = user_service.get_user_by_email(db, email).id

    logs = habitLog_service.get_logs_for_habit(db, habit_id, user_id)

    if not logs:
        raise HTTPException(status_code=404, detail="Habit not found or no logs")

    return logs

@router.put("/{habit_id}", response_model=HabitResponse)
def update_habit(
    habit_id: int,
    update_data: HabitUpdate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user_id = user_service.get_user_by_email(db, email).id

    # ✅ If category_id is included, validate it
    if update_data.category_id is not None:
        category = db.query(Category).filter_by(id=update_data.category_id).first()
        if not category:
            raise HTTPException(status_code=400, detail="Invalid category_id")

    updated_habit = habit_service.update_habit_by_id(db, user_id, habit_id, update_data)

    if updated_habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")

    return HabitResponse(
        id=updated_habit.id,
        name=updated_habit.name,
        quantity=updated_habit.quantity,
        duration=updated_habit.duration,
        days_of_week=updated_habit.day_list,
        start_date=updated_habit.start_date,
        end_date=updated_habit.end_date,
        category_id=updated_habit.category_id,
        completed=updated_habit.completed,
        category_name=updated_habit.category_name
    )

@router.delete("/{habit_id}")
def delete_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user_id = user_service.get_user_by_email(db, email).id

    success = habit_service.delete_habit_by_id(db, user_id, habit_id)
    if not success:
        raise HTTPException(status_code=404, detail="Habit not found")

    return {"message": "Habit deleted successfully"}
