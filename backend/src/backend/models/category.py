from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from backend.core.database import Base


class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key = True, autoincrement=True, index=True)
    name = Column(String, unique = True, index = True, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))  # Link to user

    user = relationship("User", back_populates="categories")
    habits = relationship("Habit", back_populates = "category")
