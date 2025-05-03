from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship
from backend.core.database import Base

class Habit(Base):
    __tablename__ = 'habits'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    month = Column(Integer, nullable=False)
    day = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    duration = Column(Integer, nullable=True)
    quantity = Column(Integer, nullable=True, default=0)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False)

    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # Link to user
    category_id = Column(Integer, ForeignKey('categories.id'), nullable = False)

    user = relationship("User", back_populates="habits")
    category = relationship("Category", back_populates = "habits")

    @hybrid_property
    def category_name(self):
        return self.category.category_name
