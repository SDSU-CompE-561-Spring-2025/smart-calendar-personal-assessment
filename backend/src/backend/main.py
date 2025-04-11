from fastapi import FastAPI

from backend.database import Base, engine

Base.metadata.create_all(bind=engine)
app = FastAPI()

@app.get("/")
def read_root():
    return{"Homepage ig, not rlly sure how this works"}
# User
@app.post("/user")
def create_user(fname, lname, email, password):
    return {0}

@app.get("/user")
def get_all_users():
    return {"lalalalla"}

@app.get("/user/login")
def user_login(email,password):
    return {"idk something abt login"}

@app.get("/user/logout")
def user_logout():
    return {0}

@app.delete("/user/{userId}")
def delete_acc():
    return {0}

#Calendar
@app.get("/calendar/events")
def retrieve_all_events():
    return {0}

@app.get("/calendar/events/{eventId}")
def retrieve_event():
  return {0}

@app.post("/calendar/events")
def create_event():
    return {0}

@app.put("calendar/events/{eventId}")
def update_event():
    return {0}

@app.delete("/calendar/events/{eventId}")
def delete_event():
    return {0}

# Habits
@app.post("/habits")
def create_habit():
    return {0}

@app.put("/habits/{habitId}")
def update_habit():
    return {0}

@app.get("/habits/{habitId}")
def retrieve_habit():
    return {0}

@app.delete("/habits")
def delete_habit():
    return {0}
