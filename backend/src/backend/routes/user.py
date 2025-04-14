from fastapi import APIRouter

router = APIRouter()

# User
@router.post("/")
def create_user(fname, lname, email, password):
    return {"message": "User Created"}

@router.get("/")
def get_all_users():
    return {"message": "All Users Retrieved"}

@router.get("/login")
def user_login(email,password):
    return {"message": "User Logged In"}

@router.get("/logout")
def user_logout():
    return {"message": "User Logged Out"}

@router.delete("/{userId}")
def delete_acc():
    return {"message": "Account Deleted"}
