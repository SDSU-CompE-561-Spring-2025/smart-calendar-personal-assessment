from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timedelta

from backend.core.config import get_settings
from backend.models.event import Event
from backend.models.calendar import Calendar
from backend.schemas.event import EventCreate
from calendar import monthrange

settings = get_settings()

def create_event(db: Session, event: EventCreate, user_id: int):
    calendar = db.query(Calendar).filter(Calendar.user_id == user_id).first()
    if not calendar:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail = "Invalid Category Id")
    db_event = Event(
        user_id=user_id,
        name=event.name,
        date=event.date,
        duration=event.duration,
        description=event.description,
        calendar_id=calendar.id
    )

    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_event_by_id(db: Session, user_id: int, event_id: int):
    return db.query(Event).filter(Event.user_id == user_id, Event.id == event_id).first()

def get_all_events(db: Session, user_id: int):
    return db.query(Event).filter(Event.user_id == user_id).options(joinedload(Event.calendar)).all()

def get_day_events(db: Session, user_id: int, year: int, month: int, day: int):
    start = datetime(year, month, day)
    end = start + timedelta(days=1)

    return db.query(Event).filter(Event.user_id == user_id, Event.date >= start, Event.date < end)

def get_month_events(db: Session, user_id: int, year: int, month: int):
    start = datetime(year, month, 1)
    _, last_day = monthrange(year, month)
    end = datetime(year, month, last_day, 23, 59, 59, 999999)

    return db.query(Event).filter(Event.user_id == user_id, Event.date >= start, Event.date < end)

def update_event_by_id(db: Session, event_id: int, user_id: int, event: EventCreate):
    db_event = event.model_dump()

    if isinstance(db_event.get("duration"), (int, float)):
        db_event["duration"] = timedelta(seconds=db_event["duration"])

    db.query(Event).filter(Event.id == event_id, Event.user_id == user_id).update(db_event, synchronize_session="fetch")
    db.commit()
    return (db.query(Event).filter(Event.id == event_id, Event.user_id == user_id).first())

def delete_event_by_id(db: Session, event_id: int, user_id: int):
    db.query(Event).filter(Event.id == event_id, Event.user_id == user_id).delete()
    db.commit()
