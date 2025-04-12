from fastapi import APIRouter

router = APIRouter()

# Habits
@router.post("")
def create_habit():
    return {0}

@router.put("/{habitId}")
def update_habit():
    return {0}

@router.get("/{habitId}")
def retrieve_habit():
    return {0}

@router.delete("")
def delete_habit():
    return {0}
