from pydantic import BaseModel
from datetime import datetime

class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str
class UserCreate(UserBase):
    password: str
class User(UserBase):
    id: int
    acc_created = datetime
    class Config:
        orm_mode = True