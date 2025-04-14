from sqlalchemy import Column, ForeignKey, Integer, String, relationship

from backend.database import Base

# Base = declarative_base()

class Category(Base):
    __tablename__ = 'category'
    id = Column(Integer, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # Link to user
    user = relationship("User", back_populates="category")
    name = Column(String, nullable=False)
