from datetime import datetime
from pydantic import BaseModel

class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str

    class Config:
        from_attributes = True

class User(UserBase):
    id: int
    first_name: str
    last_name: str
    email: str
    verif_code: str
    acc_created: datetime
    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    verif_code: str
    acc_created: datetime

    class Config:
        from_attributes = True

class DeleteUserPayload(BaseModel):
    email: str
    password: str
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    password: str | None = None  # Optional new password
    
    class Config:
        from_attributes = True