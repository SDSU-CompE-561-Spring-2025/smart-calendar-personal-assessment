from sqlalchemy.orm import Session
from backend.core.config      import get_settings
from backend.models.calendar  import Calendar
from backend.schemas.calendar import CalendarCreate, CalendarBase

settings = get_settings()

def create_calendar(db: Session, calendar: CalendarCreate, user_id: int):
    db_calendar = Calendar(
        name         = calendar.name,
        user_id      = user_id,
    )
    db.add(db_calendar)
    db.commit()
    db.refresh(db_calendar)
    return db_calendar

def update_calendar_by_id(db: Session, calendar_id: int, calendar: CalendarBase, user_id: int):
    db_calendar = get_calendar_by_id(db, calendar_id, user_id)
    if db_calendar is None:
        return None
    for key, value in calendar.model_dump().items():
        setattr(db_calendar, key, value)
    db.commit()
    db.refresh(db_calendar)
    return db_calendar


def get_calendar_by_id(db: Session, calendar_id: int, user_id: int):
    return (
        db.query(Calendar).filter(Calendar.id == calendar_id, Calendar.user_id == user_id).first()
    )









# def get_calendar(db: Session, calendar_id: int) -> Calendar:
#     return db.query(Calendar).filter(Calendar.id == calendar_id).first()

# def get_calendars(db: Session, skip: int = 0, limit: int = 100) -> list[Calendar]:
#     return db.query(Calendar).offset(skip).limit(limit).all()

# def update_calendar(db: Session, calendar_id: int, updated_calendar: CalendarCreate) -> Calendar:
#     db_calendar = db.query(Calendar).filter(Calendar.id == calendar_id).first()
#     if db_calendar:
#         for field, value in updated_calendar.items():
#             setattr(db_calendar, field, value)
#         db.commit()
#         db.refresh(db_calendar)
#     return db_calendar

# def delete_calendar(db: Session, calendar_id: int) -> Calendar:
#     db_calendar = db.query(Calendar).filter(Calendar.id == calendar_id).first()
#     if db_calendar:
#         db.delete(db_calendar)
#         db.commit()
#     return db_calendar
