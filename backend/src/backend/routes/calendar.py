from fastapi import APIRouter

router = APIRouter()

#Calendar
@router.get("/events")
def retrieve_all_events():
    return {"message": "All Events Retrieved"}

@router.get("/events/{eventId}")
def retrieve_event():
  return {"message": "Event Retrieved"}

@router.post("/events")
def create_event():
    return {"message": "Event Created"}

@router.put("/events/{eventId}")
def update_event():
    return {"message": "Event Updated"}

@router.delete("/events/{eventId}")
def delete_event():
    return {"message": "Event Deleted"}
