from fastapi import APIRouter, Depends, HTTPException, status
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

@router.get("/", response_model = list[CategoryResponse])
def get_all_categories(
    db: Session = Depends(get_db), token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user = user_service.get_user_by_email(db, email)

    return category_service.get_all_categories(db, user.id)

@router.get("/{category_id}", response_model=CategoryResponse)
def get_category_details(
    category_id: int, db: Session = Depends(get_db), token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user = user_service.get_user_by_email(db, email)

    category = category_service.get_category_by_id(db, category_id, user.id)

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
        )
    return category

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category_details(
    category_id: int,
    category: CategoryCreate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth_scheme),
):
    email = decode_access_token(token).email
    user = user_service.get_user_by_email(db, email)

    category = category_service.update_category_by_id(
        db, category_id, category, user.id
    )
    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
        )
    return category

@router.delete("/{category_id}")
def delete_category(
    category_id: int, db: Session = Depends(get_db), token: str = Depends(oauth_scheme)
):
    email = decode_access_token(token).email
    user = user_service.get_user_by_email(db, email)

    category = category_service.get_category_by_id(db, category_id, user.id)
    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
        )
    category_service.delete_category_by_id(db, category_id, user.id)
    return {"message": "Category deleted successfully"}
