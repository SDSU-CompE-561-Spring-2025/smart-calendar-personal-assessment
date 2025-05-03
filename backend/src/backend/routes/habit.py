from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import backend.services.habit as habit_service
import backend.services.user as user_service
from backend.core.auth import decode_access_token, oauth_scheme
from backend.core.dependencies import get_db
from backend.schemas.habit import HabitCreate, HabitResponse

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

    return habit_service.create_habit(db, habit, user_id)

@router.get("", response_model=list[HabitResponse])
def get_habits(
    db: Session = Depends(get_db), token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user = user_service.get_user_by_email(db, email)

    return habit_service.get_all_habits(db, user.id)

@router.get("/{month, day, year}",response_model=list[HabitResponse])
def get_daily_habits(
    month: int, day: int, year: int, db: Session = Depends(get_db), token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user = user_service.get_user_by_email(db, email)

    return habit_service.get_habits_by_data(db, month, day, year, user.id)

@router.put("/{habit_id}", response_model=HabitResponse)
def update_habit(
    habit_id: int, habit: HabitCreate, db: Session = Depends(get_db), token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user = user_service.get_user_by_email(db, email)

    return habit_service.update_habit_by_id(db, habit_id, user.id, habit)

@router.delete("/{habit_id}")
def delete_habit(
    habit_id: int, db: Session = Depends(get_db), token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user = user_service.get_user_by_email(db, email)

    habit = habit_service.get_habit_by_id(db, habit_id, user.id)
    if habit is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found"
        )
    habit_service.delete_habit_by_id(db, habit_id, user.id)
    return {"message": "Habit deleted successfully"}
