from sqlalchemy.orm import Session
from backend.core.auth import get_password_hash
from backend.core.config import get_settings
from backend.core.security import verify_password
from backend.models.user import User
from backend.models.calendar import Calendar

settings = get_settings()

# User CRUD operations
def create_user(db: Session, user):
    hashed_password = get_password_hash(user.password)
    verification_code = "1234"  # Replace with actual verification code logic
    if db.query(User).filter(User.email == user.email).first():
        return None
    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password=hashed_password,
        verif_code=verification_code,
    )

    db.add(db_user)
    db.flush()

    db_calendar = Calendar(name = "My Calendar", user_id = db_user.id)
    db.add(db_calendar)

    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def delete_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
      return False
    if not verify_password(password, user.password):
      return False
    db.delete(user)
    db.commit()
    return user

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def update_user(db: Session, user_id: int, user_data: dict, new_password: str = None):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    
    # Update user fields that are provided
    if "first_name" in user_data and user_data["first_name"]:
        db_user.first_name = user_data["first_name"]
    
    if "last_name" in user_data and user_data["last_name"]:
        db_user.last_name = user_data["last_name"]
    
    if "email" in user_data and user_data["email"]:
        existing_user = db.query(User).filter(User.email == user_data["email"], User.id != user_id).first()
        if existing_user:
            return None  # Email already in use
        db_user.email = user_data["email"]
    
    if new_password:
        db_user.password = get_password_hash(new_password)
    
    db.commit()
    db.refresh(db_user)
    return db_user
