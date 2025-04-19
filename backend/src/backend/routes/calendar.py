from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.schemas.event import Event, EventCreate, create_event, update_event, delete_event
from backend.routes.calendar import calendar
from backend.schemas.calendar import Calendar, CalendarCreate, create_calendar
from backend.services.dependencies import get_db

router = APIRouter(prefix="/api/events", tags=["Events"])
router = APIRouter(prefix="/api/calendars", tags=["Calendars"])

@router.post("/", response_model=Calendar)
def create_calendar_endpoint(calendar: CalendarCreate, user_id: int, db: Session = Depends(get_db)):
    return create_calendar(db=db, calendar=calendar, user_id=user_id)

@router.post("/", response_model=dict)
def create_event_endpoint(event: EventCreate, user_id: int, db: Session = Depends(get_db)):
    return create_event(db=db, event=event, user_id=user_id)

@router.put("/{event_id}", response_model=Event)
def update_event_endpoint(event_id: int, updated_event: EventCreate, db: Session = Depends(get_db)):
    return update_event(db=db, event_id=event_id, updated_event=updated_event)

@router.get("/{event_id}", response_model=Event)
def retrieve_event(event_id: int, db: Session = Depends(get_db)):
    return retrieve_event(db=db, event_id=event_id)

@router.get("/", response_model=list[Event])
def retrieve_events(db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    return retrieve_events(db=db, skip=skip, limit=limit)

@router.delete("/{event_id}", response_model=dict)
def delete_event_endpoint(event_id: int, db: Session = Depends(get_db)):
    return delete_event(db=db, event_id=event_id)
