from sqlalchemy.orm import Session
from backend.core.config      import get_settings
from backend.models.calendar  import Calendar
from backend.schemas.calendar import CalendarCreate, CalendarUpdate

settings = get_settings()

def create_calendar(db: Session, calendar: CalendarCreate, user_id: int):
    db_calendar = Calendar(
        name=calendar.name,
        user_id=user_id,
        theme=calendar.theme,
        mode=calendar.mode,
        week_start=calendar.week_start,
    )
    db.add(db_calendar)
    db.commit()
    db.refresh(db_calendar)
    return db_calendar

def update_calendar(db: Session, calendar_id: int, updates: CalendarUpdate, user_id: int):
    db_calendar = db.query(Calendar).filter(Calendar.id == calendar_id, Calendar.user_id == user_id).first()
    if not db_calendar:
        return None  # You can raise an HTTPException here if you're in the route

    # Apply only the fields that were sent (not None)
    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_calendar, field, value)

    db.commit()
    db.refresh(db_calendar)
    return db_calendar

def get_calendar_by_id(db: Session, calendar_id: int, user_id: int):
    return db.query(Calendar).filter(Calendar.id == calendar_id, Calendar.user_id == user_id).first()
