from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import backend.services.category as category_service
import backend.services.user as user_service
from backend.core.auth import decode_access_token, oauth_scheme
from backend.core.dependencies import get_db
from backend.schemas.category import CategoryCreate, CategoryResponse

router = APIRouter()

@router.post("/", response_model = CategoryResponse)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth_scheme)
    ):


    email = decode_access_token(token).email
    user = user_service.get_user_by_email(db, email)

    user_id = user.id

    return category_service.create_category(db, category, user_id)
