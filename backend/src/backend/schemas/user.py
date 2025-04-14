from datetime import datetime

from pydantic import BaseModel


class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    verification_code = str
class UserCreate(UserBase):
    password: str
class User(UserBase):
    id: int
    acc_created = datetime
    class Config:
        orm_mode = True
