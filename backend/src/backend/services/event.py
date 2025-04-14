from sqlalchemy.orm import Session

from backend.models.event import Event
from backend.schemas.event import EventCreate
# from backend.models.user import User
from backend.config import get_settings

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