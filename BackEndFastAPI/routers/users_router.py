import uuid
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from auth import get_current_user, require_admin

router = APIRouter(prefix="/users", tags=["users"])

ALLOWED_TYPES = {"image/png", "image/jpeg"}
MAX_SIZE = 2 * 1024 * 1024  # 2MB


# --- Hồ sơ của chính mình ---
@router.get("/me")
def get_my_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "date_of_birth": current_user.date_of_birth,
        "gender": current_user.gender,
        "address": current_user.address,
        "phone_number": current_user.phone_number,
        "avatar_url": current_user.avatar_url,
        "role": current_user.role,
    }


@router.put("/me")
def update_my_profile(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    editable_fields = ["full_name", "address", "phone_number", "date_of_birth"]
    for field in editable_fields:
        if field in data:
            setattr(current_user, field, data[field])
    db.commit()
    return {"message": "Cập nhật hồ sơ thành công"}


# --- Upload ảnh đại diện cho CHÍNH MÌNH (lấy từ token, không nhận user_id qua URL) ---
@router.post("/me/avatar")
async def upload_my_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Bạn chọn sai kiểu ảnh")

    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(400, "Bạn chọn ảnh nhiều dung lượng quá")

    filename = f"static/avatars/{uuid.uuid4()}.png"
    with open(filename, "wb") as f:
        f.write(contents)

    current_user.avatar_url = f"/{filename}"
    db.commit()
    return {"avatar_url": current_user.avatar_url}


# --- Các API chỉ dành cho Admin ---
@router.get("/")
def list_users(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    users = db.query(User).filter(User.role == "user").all()
    return [
        {
            "id": u.id,
            "full_name": u.full_name,
            "email": u.email,
            "status": u.status,
        }
        for u in users
    ]


@router.get("/{user_id}")
def get_user_profile(user_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "Không tìm thấy người dùng")
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "date_of_birth": user.date_of_birth,
        "gender": user.gender,
        "address": user.address,
        "phone_number": user.phone_number,
        "status": user.status,
    }


@router.put("/lock/{user_id}")
def toggle_lock_user(user_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "Không tìm thấy người dùng")
    user.status = "locked" if user.status == "active" else "active"
    db.commit()
    return {"id": user.id, "status": user.status}