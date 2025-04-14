from sqlalchemy.orm import Session

from backend.auth import get_password_hash
from backend.config import get_settings
from backend.models.user import User
from backend.schemas.user import UserBase

settings = get_settings()

# User CRUD operations
def create_user(db: Session, user: UserBase):
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
    print("User Created Successfully")
    return db_user

# in user.py in routes folder, add the following code
# import app.services.user as user_service
# replace the return message in create_user with the following code
#   new_user =  userservice.create_user()
#   return new_user
