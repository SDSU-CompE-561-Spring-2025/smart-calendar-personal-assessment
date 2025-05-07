from fastapi        import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.core.auth import decode_access_token, oauth_scheme
from backend.services.dependencies import get_db
from backend.schemas.calendar      import CalendarResponse, CalendarUpdate
import backend.services.calendar as calendar_service
import backend.services.user as user_service


router = APIRouter()

#Calendar
@router.get("/calendars/{calendar_id}", response_model=CalendarResponse)
def read_calendar(calendar_id: int, db: Session = Depends(get_db), token: str = Depends(oauth_scheme)):

    email = decode_access_token(token).email
    user_id = user_service.get_user_by_email(db, email).id

    calendar = calendar_service.get_calendar_by_id(db, calendar_id, user_id)
    if not calendar:
        raise HTTPException(status_code=404, detail="Calendar not found")
    return calendar

@router.patch("/calendars/{calendar_id}", response_model=CalendarResponse)
def update_calendar_route(
    calendar_id: int,
    updates: CalendarUpdate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user_id = user_service.get_user_by_email(db, email).id

    calendar = calendar_service.update_calendar(db, calendar_id, updates, user_id)
    if not calendar:
        raise HTTPException(status_code=404, detail="Calendar not found")
    return calendar
