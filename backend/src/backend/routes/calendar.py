from fastapi import APIRouter

router = APIRouter()

@router.get("/events")
#Calendar
def retrieve_all_events():
    return {0}

@router.get("/events/{eventId}")
def retrieve_event():
  return {0}

@router.post("/events")
def create_event():
    return {0}

@router.put("/events/{eventId}")
def update_event():
    return {0}

@router.delete("/events/{eventId}")
def delete_event():
    return {0}