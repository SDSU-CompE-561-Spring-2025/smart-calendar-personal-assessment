from fastapi import FastAPI

#from sqlalchemy import Column, Integer, Boolean, String, datetime
from backend.database import Base, engine
from backend.middleware.cors import get_cors_config
from backend.middleware.logging import LoggingMiddleware
from backend.routes.calendar import router as calendar_router
from backend.routes.habits import router as habits_router
from backend.routes.user import router as user_router

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.add_middleware(LoggingMiddleware)
app.include_router(user_router,     prefix = "/user",     tags=["User"])
app.include_router(calendar_router, prefix = "/calendar", tags=["Calendar"])
app.include_router(habits_router,   prefix = "/habits",   tags=["Habits"])

cors_config = get_cors_config()
app.add_middleware(cors_config["middleware_class"], **cors_config["options"])

@app.get("/")
def read_root():
    return{"Homepage ig, not rlly sure how this works"}
