from sqlalchemy.orm import Session

from backend.auth import get_password_hash
from backend.config import get_settings
from backend.models.user import User
from backend.schemas.user import UserCreate

settings = get_settings()

# User CRUD operations
def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    verification_code = "1234"  # Replace with actual verification code logic
    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password=hashed_password,
        verification_code=verification_code,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_habit(db: Session, habit: HabitCreate, user_id: int):
    db_habit = Habit(
        user_id=user_id,
        month=habit.month,
        day=habit.day,
        year=habit.year,
        name=habit.name,
        duration=habit.duration,
        quantity=habit.quantity,
        category=habit.category,
        description=habit.description,
        completed=habit.completed,
    )
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

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


# in user.py in routes folder, add the following code
# import app.services.user as user_service
# replace the return message in create_user with the following code
#   new_user =  userservice.create_user()
#   return new_user
