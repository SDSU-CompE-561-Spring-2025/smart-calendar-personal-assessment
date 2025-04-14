from fastapi import APIRouter

router = APIRouter()

# Habits
@router.post("/")
def create_habit():
    return {"message": "Habit Created"}

@router.put("/{habitId}")
def update_habit():
    return {"message": "Habit Updated"}

@router.get("/{habitId}")
def retrieve_habit():
    return {"message": "Habit Retrieved"}

@router.delete("/")
def delete_habit():
    return {"message": "Habit Deleted"}
