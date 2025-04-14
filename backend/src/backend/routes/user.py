from fastapi import APIRouter, Depends

import backend.services.user as user_service
from backend.services.dependencies import get_db
from backend.schemas.user import UserCreate, UserResponse
from sqlalchemy.orm import Session
router = APIRouter()

# User
@router.post("/", response_model = UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = user_service.create_user(db=db, user=user)
    return new_user

@router.get("/")
def get_all_users():
    return {"message": "All Users Retrieved"}

@router.get("/login")
def user_login(email,password):
    return {"message": "User Logged In"}

@router.get("/logout")
def user_logout():
    return {"message": "User Logged Out"}

@router.delete("/{userId}")
def delete_acc():
    return {"message": "Account Deleted"}
