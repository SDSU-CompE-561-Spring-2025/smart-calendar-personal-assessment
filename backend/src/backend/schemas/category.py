from pydantic import BaseModel

class CategoryBase(BaseModel):
    name: str
class CategoryCreate(CategoryBase):
    pass
class CategoryResponse(CategoryBase):
    id: int
    name: str
    class Config:
        from_attributes = True
