from fastapi import APIRouter

router = APIRouter()

#Calendar
@router.get("/calendar/events")
def retrieve_all_events():
    return {"message": "All Events Retrieved"}

@router.get("/calendar/events/{eventId}")
def retrieve_event():
  return {"message": "Event Retrieved"}

@router.post("/calendar/events")
def create_event():
    return {"message": "Event Created"}

@router.put("calendar/events/{eventId}")
def update_event():
    return {"message": "Event Updated"}

@router.delete("/calendar/events/{eventId}")
def delete_event():
    return {"message": "Event Deleted"}
