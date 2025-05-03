from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import backend.services.user as user_service
import backend.services.event as event_service
from backend.core.auth import decode_access_token, oauth_scheme
from backend.core.dependencies import get_db
from backend.schemas.event import EventCreate, EventResponse

router = APIRouter()

#Events
@router.post("", response_model=EventResponse)
def create_new_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user_id = user_service.get_user_by_email(db, email).id

    return event_service.create_event(db, event, user_id)

@router.get("/{event_id}", response_model=EventResponse)
def get_event(
    event_id: int,
    db: Session = Depends(get_db), token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user = user_service.get_user_by_email(db, email)

    return event_service.get_event_by_id(db, user.id, event_id)

@router.get("", response_model=list[EventResponse])
def get_events(
    db: Session = Depends(get_db), token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user = user_service.get_user_by_email(db, email)

    return event_service.get_all_events(db, user.id)

@router.get("/day", response_model=list[EventResponse])
def get_day_events(
    year: int,
    month: int,
    day: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user = user_service.get_user_by_email(db, email)

    return event_service.get_day_events(db, user.id, year, month, day)

@router.get("/month", response_model=list[EventResponse])
def get_month_events(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user = user_service.get_user_by_email(db, email)

    return event_service.get_month_events(db, user.id, year, month)

@router.put("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: int, event: EventCreate, db: Session = Depends(get_db), token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user = user_service.get_user_by_email(db, email)

    event=event_service.update_event_by_id(db, event_id, user.id, event)
    if event is None:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )

    return event

@router.delete("/{event_id}")
def delete_habit(
    event_id: int, db: Session = Depends(get_db), token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user = user_service.get_user_by_email(db, email)

    event = event_service.get_event_by_id(db, user.id, event_id)
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )
    event_service.delete_event_by_id(db, event_id, user.id)
    return {"message": "Habit deleted successfully"}
