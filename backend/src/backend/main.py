from fastapi import FastAPI

app = FastAPI()

# User 
@app.post("/user")
def createUser(fName, lName, email, password):
    return {0}

@app.get("/user")
def getAllUsers():
    return {"lalalalla"}

@app.get("/user/login")
def userLogin(email,password):
    return {"idk something abt login"}

@app.get("/user/logout")
def userLogout():
    return {0}

@app.delete("/user/{userId}")
def deleteAcc():
    return {0}

#Calendar
@app.get("/calendar/events")
def retrieveAllEvents():
    return {0}

@app.get("/calendar/events/{eventId}")
def retrieveEvent():
  return {0}

@app.post("/calendar/events")
def createEvent():
    return {0}

@app.put("calendar/events/{eventId}")
def updateEvent():
    return {0}

@app.delete("/calendar/events/{eventId}")
def deleteEvent():
    return {0}

# Habits
@app.post("/habits")
def createHabit():
    return {0}

@app.put("/habits/{habitId}")
def updateHabit():
    return {0}

@app.get("/habits/{habitId}")
def retrieveHabit():
    return {0}

@app.delete("/habits")
def deleteHabit():
    return {0}
