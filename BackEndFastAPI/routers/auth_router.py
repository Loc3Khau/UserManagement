from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import RegisterRequest, LoginRequest
from auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(400, "Email đã được sử dụng")

    user = User(
        full_name=data.full_name,
        email=data.email,
        password_hash=hash_password(data.password),
        date_of_birth=data.date_of_birth,
        gender=data.gender,
        address=data.address,
        phone_number=data.phone_number,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Đăng ký thành công", "id": user.id}


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Sai email hoặc mật khẩu")
    if user.status == "locked":
        raise HTTPException(403, "Tài khoản đã bị khóa")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "id": user.id,
        "avatar_url": user.avatar_url,
    }