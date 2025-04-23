from sqlalchemy.orm import Session

from backend.config import get_settings
from backend.models.event import Event
from backend.schemas.event import EventCreate

settings = get_settings()

def create_event(db: Session, event: EventCreate, user_id: int):
    db_event = Event(
        user_id=user_id,
        name=event.name,
        start_date=event.start_date,
        end_date=event.end_date,
        start_time=event.start_time,
        end_time=event.end_time,
        recurring=event.recurring,
        description=event.description,
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_event(db: Session, event_id: int):
    return db.query(Event).filter(Event.id == event_id).first()

def get_all_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Event).offset(skip).limit(limit).all()

def update_event(db: Session, event_id: int, updated_event: EventCreate):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if db_event:
        db_event.name = updated_event.name
        db_event.start_date = updated_event.start_date
        db_event.end_date = updated_event.end_date
        db_event.start_time = updated_event.start_time
        db_event.end_time = updated_event.end_time
        db_event.recurring = updated_event.recurring
        db_event.description = updated_event.description
        db.commit()
        db.refresh(db_event)
    return db_event

def delete_event(db: Session, event_id: int):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if db_event:
        db.delete(db_event)
        db.commit()
    return db_event
