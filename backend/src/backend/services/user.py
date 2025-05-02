from sqlalchemy.orm import Session

from backend.core.auth import get_password_hash
from backend.core.config import get_settings
from backend.core.security import verify_password
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
        verif_code=verification_code,
    )

    db.add(db_user)
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

# def user_login(db: Session, email: str, password: str):
#     user = db.query(User).filter(User.email == email).first()
#     if not user:
#         return False
#     if not verify_password(password, user.password):
#       return False
#     return user

def delete_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
      return False
    if not verify_password(password, user.password):
      return False
    db.delete(user)
    db.commit()
    return True
