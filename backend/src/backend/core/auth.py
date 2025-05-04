from datetime import UTC, datetime, timedelta

import jwt
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError
from passlib.context import CryptContext
from starlette.status import HTTP_401_UNAUTHORIZED

from backend.core.config import settings
from backend.schemas.token import TokenData

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth_scheme = OAuth2PasswordBearer(tokenUrl="user/login") # replace "token" with api endpoint for the token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash (password: str):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now(UTC) + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

#Add decode access token function
def decode_access_token(token: str ) -> TokenData:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=HTTP_401_UNAUTHORIZED, detail = "Invalid token"
            )
        return TokenData(email=email)
    except InvalidTokenError:
        raise HTTPException(status_code = HTTP_401_UNAUTHORIZED, detail = "Invalid token")
