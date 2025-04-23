from sqlalchemy.orm import Session

from backend.core.config import get_settings
from backend.models.category import Category
from backend.schemas.category import CategoryCreate

settings = get_settings()

# Category CRUD operations
def create_category(db: Session, category: CategoryCreate, user_id: int):
    db_category = Category(
        user_id=user_id,
        name=category.name,
    )

    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_category(db: Session, category_id: int):
    return db.query(Category).filter(Category.id == category_id).first()

def get_all_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Category).offset(skip).limit(limit).all()

def update_category(db: Session, category_id: int, updated_name: str):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if db_category:
        db_category.name = updated_name
        db.commit()
        db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: int):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if db_category:
        db.delete(db_category)
        db.commit()
    return db_category
