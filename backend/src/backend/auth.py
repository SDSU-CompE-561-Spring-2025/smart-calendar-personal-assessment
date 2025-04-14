from backend.config import settings
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta, UTC
import jwt

from backend.config import settings

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth_scheme = OAuth2PasswordBearer(tokenUrl="token") # replace "token" with api endpoint for the token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash (password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now(UTC) + {
        expires_delta if expires_delta else timedelta(minutes=15)
    }
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

#Add decode access token function
