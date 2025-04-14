from fastapi import APIRouter

router = APIRouter()

# User
@router.post("/user")
def create_user(fname, lname, email, password):
    return {"message": "User Created"}

@router.get("/user")
def get_all_users():
    return {"message": "All Users Retrieved"}

@router.get("/user/login")
def user_login(email,password):
    return {"message": "User Logged In"}

@router.get("/user/logout")
def user_logout():
    return {"message": "User Logged Out"}

@router.delete("/user/{userId}")
def delete_acc():
    return {"message": "Account Deleted"}
