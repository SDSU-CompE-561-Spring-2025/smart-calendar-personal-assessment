from datetime import timedelta

from fastapi          import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm   import Session

from backend.core.auth import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, decode_access_token, oauth_scheme

from backend.core.dependencies import get_db
import backend.services.user as user_service
from backend.schemas.token import Token
from backend.schemas.user import UserBase, UserResponse, DeleteUserPayload, UserUpdate
from backend.models.user import User as models

router = APIRouter()

# User
@router.post("", response_model=UserResponse, status_code=201)
def create_user(*, db: Session = Depends(get_db), user: UserBase):
    newUser = user_service.create_user(db=db, user=user)
    if newUser is None:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = "Invalid Email")
    return newUser  

@router.get("/me", response_model=UserResponse)
def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth_scheme)):
    token_data = decode_access_token(token)
    user = user_service.get_user_by_email(db=db, email=token_data.email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.get("/get_self", response_model=UserResponse)
def get_self_user(db: Session = Depends(get_db), email: str = None):
    if email is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is required")

    user = user_service.get_user_by_email(db=db, email=email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user

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

@router.delete("/{userId}") # needs (user, email, pass)
def del_user(*, db: Session = Depends(get_db), user: DeleteUserPayload):
    deleted = user_service.delete_user(db, user.email, user.password)
    if(deleted):
      return {"message": "Account Deleted"}
    raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED, detail = "Invalid Email/Password")

@router.put("/update", response_model=UserResponse)
def update_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db), 
    token: str = Depends(oauth_scheme)
):
    """
    Update the current user's information
    """
    # Get current user from token
    token_data = decode_access_token(token)
    current_user = user_service.get_user_by_email(db=db, email=token_data.email)
    
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
    
    # Create update data dictionary
    update_data = {
        "first_name": user_update.first_name,
        "last_name": user_update.last_name,
        "email": user_update.email
    }
    
    # Update user information
    updated_user = user_service.update_user(
        db=db, 
        user_id=current_user.id, 
        user_data=update_data,
        new_password=user_update.password
    )
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Failed to update user information. Email may already be in use."
        )
    
    return updated_user