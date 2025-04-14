from sqlalchemy.orm import Session

from backend.models.calendar import Calendar
from backend.schemas.calendar import CalendarCreate, CalendarUpdate
from backend.config import get_settings
# from backend.models.user import User

settings = get_settings()

def create_calendar(db: Session, calendar: CalendarCreate, user_id: int):
    db_calendar = Calendar(
        user_id=user_id,
        name=calendar.name,
    )
    
    db.add(db_calendar)
    db.commit()
    db.refresh(db_calendar)
    return db_calendar

