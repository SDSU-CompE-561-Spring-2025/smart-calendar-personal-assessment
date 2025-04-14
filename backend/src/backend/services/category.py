from sqlalchemy.orm import Session

from backend.models.category import Category
from backend.schemas.category import CategoryCreate, CategoryUpdate
from backend.config import get_settings
# from backend.models.user import User

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