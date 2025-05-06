from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timedelta
from backend.core.config import get_settings
from backend.models.event import Event
from backend.schemas.event import EventCreate, EventResponse
from calendar import monthrange

settings = get_settings()

def create_event(db: Session, event: EventCreate, user_id: int, calendar_id: int):
    db_event = Event(
        user_id=user_id,
        name=event.name,
        start_time=event.start_time,
        end_time=event.end_time,
        calendar_id=calendar_id
    )

    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    duration = int((db_event.end_time - db_event.start_time).total_seconds() // 60)

    return EventResponse(
        id=db_event.id,
        name=db_event.name,
        start_time=db_event.start_time,
        end_time=db_event.end_time,
        duration=duration
    )

def get_event_by_id(db: Session, user_id: int, event_id: int) -> EventResponse | None:
    event = db.query(Event).filter(Event.user_id == user_id, Event.id == event_id).first()
    if event is None:
        return None

    duration = int((event.end_time - event.start_time).total_seconds() // 60)

    return EventResponse(
        id=event.id,
        name=event.name,
        start_time=event.start_time,
        end_time=event.end_time,
        duration=duration
    )

def get_all_events(db: Session, user_id: int) -> list[EventResponse]:
    events = db.query(Event).filter(Event.user_id == user_id).options(joinedload(Event.calendar)).all()
    return [
        EventResponse(
            id=e.id,
            name=e.name,
            start_time=e.start_time,
            end_time=e.end_time,
            duration=int((e.end_time - e.start_time).total_seconds() // 60)
        )
        for e in events
    ]


def get_day_events(db: Session, user_id: int, year: int, month: int, day: int) -> list[EventResponse]:
    start = datetime(year, month, day)
    end = start + timedelta(days=1)

    events = db.query(Event).filter(
        Event.user_id == user_id,
        Event.start_time >= start,
        Event.start_time < end
    ).all()

    return [
        EventResponse(
            id=e.id,
            name=e.name,
            start_time=e.start_time,
            end_time=e.end_time,
            duration=int((e.end_time - e.start_time).total_seconds() // 60)
        )
        for e in events
    ]

def get_month_events(db: Session, user_id: int, year: int, month: int) -> list[EventResponse]:
    start = datetime(year, month, 1)
    _, last_day = monthrange(year, month)
    end = datetime(year, month, last_day, 23, 59, 59, 999999)

    events = db.query(Event).filter(
        Event.user_id == user_id,
        Event.start_time >= start,
        Event.start_time <= end
    ).all()

    return [
        EventResponse(
            id=e.id,
            name=e.name,
            start_time=e.start_time,
            end_time=e.end_time,
            duration=int((e.end_time - e.start_time).total_seconds() // 60)
        )
        for e in events
    ]

def update_event_by_id(db: Session, event_id: int, user_id: int, event: EventCreate) -> EventResponse | None:
    db_event_data = event.model_dump()

    # Remove duration if present — it's computed, not stored
    db_event_data.pop("duration", None)

    db.query(Event).filter(
        Event.id == event_id, Event.user_id == user_id
    ).update(db_event_data, synchronize_session="fetch")

    db.commit()

    updated = db.query(Event).filter(
        Event.id == event_id, Event.user_id == user_id
    ).first()

    if updated:
        duration = int((updated.end_time - updated.start_time).total_seconds() // 60)
        return EventResponse(
            id=updated.id,
            name=updated.name,
            start_time=updated.start_time,
            end_time=updated.end_time,
            duration=duration
        )
    return None

def delete_event_by_id(db: Session, event_id: int, user_id: int) -> bool:
    deleted = db.query(Event).filter(
        Event.id == event_id, Event.user_id == user_id
    ).delete()
    db.commit()
    return deleted > 0
