from fastapi  import FastAPI
from datetime import datetime, UTC

#from sqlalchemy import Column, Integer, Boolean, String, datetime
from backend.database        import Base, engine
from pydantic                import BaseModel, EmailStr, Field, constr, field_validator
from backend.routes.user     import router as user_router
from backend.routes.calendar import router as calendar_router
from backend.routes.habits   import router as habits_router

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.include_router(user_router,     prefix = "/user",     tags=["User"])
app.include_router(calendar_router, prefix = "/calendar", tags=["Calendar"])
app.include_router(habits_router,   prefix = "/habits",   tags=["Habits"])

@app.get("/")
def read_root():
    return{"Homepage ig, not rlly sure how this works"}