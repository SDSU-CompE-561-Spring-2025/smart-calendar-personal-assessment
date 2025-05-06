from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, func
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship
from backend.core.database import Base


class Habit(Base):
    __tablename__ = 'habits'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=True, default=None)
    duration = Column(Integer, nullable=True, default=None)
    days_of_week = Column(String, nullable=True)
    start_date = Column(Date, nullable=False, default=func.now())
    end_date = Column(Date, nullable=True)
    completed = Column(Boolean, default=False)

    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)

    user = relationship("User", back_populates="habits")
    category = relationship("Category", back_populates="habits")

    @property
    def day_list(self):
        return self.days_of_week.split(",") if self.days_of_week else []

    def is_scheduled_for(self, day: str) -> bool:
        return day.lower() in self.day_list

    @hybrid_property
    def category_name(self):
        return self.category.name
