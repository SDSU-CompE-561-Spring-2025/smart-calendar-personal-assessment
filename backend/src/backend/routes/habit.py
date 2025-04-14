# from fastapi import APIRouter

# router = APIRouter()

# # Habits
# @router.post("/")
# def create_habit():
#     return {"message": "Habit Created"}

# @router.put("/{habitId}")
# def update_habit():
#     return {"message": "Habit Updated"}

# @router.get("/{habitId}")
# def retrieve_habit():
#     return {"message": "Habit Retrieved"}

# @router.delete("/")
# def delete_habit():
#     return {"message": "Habit Deleted"}

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

# Assuming your db dependency and models/schemas are defined elsewhere
from backend.services.dependencies import get_db  # This should return a Session instance
from backend.schemas.habit import HabitCreate, HabitResponse
from backend.services.habit import create_habit, get_habit, get_user_habits, update_habit

router = APIRouter()


@router.post("/habits", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
def create_a_habit(
    habit: HabitCreate,
    user_id: int = Query(..., description="ID of the user to which this habit belongs"),
    db: Session = Depends(get_db),
):
    """
    Create a new habit for a given user.
    """
    new_habit = create_habit(db, habit, user_id)
    return new_habit


@router.get("/habits/{habit_id}", response_model=HabitResponse)
def read_habit(habit_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a habit by its ID.
    """
    db_habit = get_habit(db, habit_id)
    if db_habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    return db_habit


@router.get("/users/{user_id}/habits", response_model=List[HabitResponse])
def read_user_habits(user_id: int, db: Session = Depends(get_db)):
    """
    Retrieve all habits associated with a particular user.
    """
    habits = get_user_habits(db, user_id)
    return habits


@router.put("/habits/{habit_id}", response_model=HabitResponse)
def update_existing_habit(habit_id: int, habit: HabitCreate, db: Session = Depends(get_db)):
    """
    Update an existing habit by ID.
    """
    updated = update_habit(db, habit_id, habit)
    if updated is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    return updated
