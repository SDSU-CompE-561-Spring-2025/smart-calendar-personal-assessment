from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import backend.services.user as user_service
from backend.core.auth import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token
from backend.schemas.token import Token
from backend.schemas.user import UserCreate, UserResponse
from backend.services.dependencies import get_db

router = APIRouter()

# User
@router.post("", response_model = UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = user_service.create_user(db=db, user=user)
    return new_user

@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = user_service.authenticate_user(
        db, email=form_data.username, password=form_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "email": user.email}

@router.get("/logout")
def user_logout():
    return {"message": "User Logged Out"}

@router.delete("/{userId}") # needs (user, email, pass)
def del_user(db: Session = Depends(get_db), email = str, password = str):
    deleted = user_service.delete_user(db, email, password)
    if(deleted):
      return {"message": "Account Deleted"}
    return {"message": "Invalid"}
