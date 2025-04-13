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
    return {"message": "User Created"}

@app.get("/user")
def get_all_users():
    return {"message": "All Users Retrieved"}

@app.get("/user/login")
def user_login(email,password):
    return {"message": "User Logged In"}

@app.get("/user/logout")
def user_logout():
    return {"message": "User Logged Out"}

@app.delete("/user/{userId}")
def delete_acc():
    return {"message": "Account Deleted"}

#Calendar
@app.get("/calendar/events")
def retrieve_all_events():
    return {"message": "All Events Retrieved"}

@app.get("/calendar/events/{eventId}")
def retrieve_event():
  return {"message": "Event Retrieved"}

@app.post("/calendar/events")
def create_event():
    return {"message": "Event Created"}

@app.put("calendar/events/{eventId}")
def update_event():
    return {"message": "Event Updated"}

@app.delete("/calendar/events/{eventId}")
def delete_event():
    return {"message": "Event Deleted"}

# Habits
@app.post("/habits")
def create_habit():
    return {"message": "Habit Created"}

@app.put("/habits/{habitId}")
def update_habit():
    return {"message": "Habit Updated"}

@app.get("/habits/{habitId}")
def retrieve_habit():
    return {"message": "Habit Retrieved"}

@app.delete("/habits")
def delete_habit():
    return {"message": "Habit Deleted"}
