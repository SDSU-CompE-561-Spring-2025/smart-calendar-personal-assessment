from datetime import datetime

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, relationship
from sqlalchemy.dialects.postgresql import INTERVAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.hybrid import hybrid_property

Base = declarative_base()

class Habit(Base):
    __tablename__ = 'habits'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    month = Column(Integer, nullable=False, default=datetime.now(datetime.timezone.utc).month)
    day = Column(Integer, nullable=False, default=datetime.now(datetime.timezone.utc).day)
    year = Column(Integer, nullable=False, default=datetime.now(datetime.timezone.utc).year)
    name = Column(String, nullable=False)
    duration = Column(INTERVAL, nullable=True)
    quantity = Column(Integer, nullable=True, default=0)
    category = Column(String, nullable=False)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False)

    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # Link to user
    category_id = Column(Integer, ForeignKey('categories.id'), nullable = False)

    user = relationship("User", back_populates="habits")
    category = relationship("Category", back_populates = "habits")

    @hybrid_property
    def category_name(self):
        return self.category.category_name
