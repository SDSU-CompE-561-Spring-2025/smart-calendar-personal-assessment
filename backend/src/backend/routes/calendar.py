from fastapi        import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.services.dependencies import get_db
from backend.schemas.calendar      import CalendarCreate

router = APIRouter()

#Calendar
@router.get("/events")
def retrieve_all_events():
    return {"message": "All Events Retrieved"}

@router.get("/events/{eventId}")
def retrieve_event():
  return {"message": "Event Retrieved"}

@router.post("/create")
def create_calendar(*, db: Session = Depends(get_db), name: str = "My Calendar", display_type: int = 0):
    user_calendar = CalendarCreate(name = name, display_type = display_type)
    return calendar_service.create_calendar(db=db, calendar=user_calendar)

@router.post("/events")
def create_event():
    return {"message": "Event Created"}

@router.put("/events/{eventId}")
def update_event():
    return {"message": "Event Updated"}

@router.delete("/events/{eventId}")
def delete_event():
    return {"message": "Event Deleted"}
