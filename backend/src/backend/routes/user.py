from fastapi import APIRouter

router = APIRouter()

# User
@router.post("")
def create_user(fname, lname, email, password):
    return {0}

@router.get("")
def get_all_users():
    return {"lalalalla"}

@router.get("/login")
def user_login(email,password):
    return {"idk something abt login"}

@router.get("/logout")
def user_logout():
    return {0}

@router.delete("/{userId}")
def delete_acc():
    return {0}