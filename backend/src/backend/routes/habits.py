from fastapi import APIRouter

router = APIRouter()

# Habits
@router.post("/habits")
def create_habit():
    return {"message": "Habit Created"}

@router.put("/habits/{habitId}")
def update_habit():
    return {"message": "Habit Updated"}

@router.get("/habits/{habitId}")
def retrieve_habit():
    return {"message": "Habit Retrieved"}

@router.delete("/habits")
def delete_habit():
    return {"message": "Habit Deleted"}
