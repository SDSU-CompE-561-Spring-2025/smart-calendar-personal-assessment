from fastapi        import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.services.dependencies import get_db
from backend.schemas.calendar      import CalendarResponse, CalendarCreate
import backend.services.calendar as calendar_service
from backend.core.auth import decode_access_token, oauth_scheme
import backend.services.user as user_service


router = APIRouter()

#Calendar
@router.put("/{calendar_id}", response_model=CalendarResponse)
def update_calendar(
    calendar_id: int, calendar: CalendarCreate, db: Session = Depends(get_db), token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user = user_service.get_user_by_email(db, email)

    calendar = calendar_service.update_calendar_by_id(db, calendar_id, calendar, user.id)
    if calendar is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Calendar not found"
        )

    return calendar
