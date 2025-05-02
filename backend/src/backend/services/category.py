from sqlalchemy.orm import Session

from backend.core.config import get_settings
from backend.models.category import Category
from backend.schemas.category import CategoryCreate, CategoryBase

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

def get_all_categories(db: Session, user_id: int):
    return db.query(Category).filter(Category.user_id == user_id).all()

def get_category_by_id(db: Session, category_id: int, user_id: int):
    return (
        db.query(Category).filter(Category.id == category_id, Category.user_id == user_id).first()
    )

def update_category_by_id(db: Session, category_id: int, category: CategoryBase, user_id: int):
    db_category = get_category_by_id(db, category_id, user_id)
    if db_category is None:
        return None
    for key, value in category.model_dump().items():
        setattr(db_category, key, value)
    db.commit()
    db.refresh(db_category)
    return db_category

def delete_category_by_id(db: Session, category_id: int, user_id: int):
    db.query(Category).filter(Category.id == category_id, Category.user_id == user_id).delete()
    db.commit()
