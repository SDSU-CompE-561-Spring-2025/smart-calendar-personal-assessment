from fastapi import FastAPI

from backend.core.database import Base, engine
from backend.middleware.cors import get_cors_config, CORSMiddleware
from backend.middleware.logging import LoggingMiddleware
from backend.routes.calendar import router as calendar_router
from backend.routes.category import router as category_router
from backend.routes.habit import router as habits_router
from backend.routes.user import router as user_router
from backend.routes.event import router as event_router

Base.metadata.create_all(bind=engine)
app = FastAPI()

origins = ["http://localhost:3000"] # frontend URL for CORS
app.add_middleware(                 # allows requests from frontend
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,     # allows jwt tokens
        allow_methods=["*"],
        allow_headers=["*"])

app.add_middleware(LoggingMiddleware)
app.include_router(user_router,     prefix = "/user",     tags=["User"])
app.include_router(calendar_router, prefix = "/calendar", tags=["Calendar"])
app.include_router(habits_router,   prefix = "/habits",   tags=["Habits"])
app.include_router(category_router, prefix = "/category", tags = ["Categories"])
app.include_router(event_router, prefix = "/event", tags = ["Events"])

cors_config = get_cors_config()
app.add_middleware(cors_config["middleware_class"], **cors_config["options"])
