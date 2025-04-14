from fastapi import APIRouter, Depends, HTTPException

import backend.services.category as category_service
from backend.schemas.category import CategoryCreate, Category
from backend.services.dependencies import get_db

from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/category")
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    new_category = category_service.create_category(db=db, category=category)
    return new_category

@router.get("/category/{id}")
def get_category(id: int, db: Session = Depends(get_db)):
    category = category_service.get_category(db=db, id=id)
    return category

@router.get("/categories")
def get_all_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    categories = category_service.get_all_categories(db=db, skip=skip, limit=limit)
    return categories

@router.put("/category/{id}")
def update_category(id: int, category: CategoryCreate, db: Session = Depends(get_db)):
    updated_category = category_service.update_category(db=db, id=id, category=category)
    return updated_category

@router.delete("/category/{id}")
def delete_category(id: int, db: Session = Depends(get_db)):
    deleted_category = category_service.delete_category(db=db, id=id)
    return deleted_category




