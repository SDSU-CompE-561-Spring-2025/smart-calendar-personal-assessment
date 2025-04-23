from pydantic import BaseModel


class Token(BaseModel):
  access_token: str
  token_type: str
  email: str
  class Config:
        from_attributes = True

  class TokenData(BaseModel):
    email: str | None = None
