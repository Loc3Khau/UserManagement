from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import Base, engine
from routers import users_router
from routers import auth_router

# Tự động tạo các bảng trong database nếu chưa tồn tại (dựa theo models.py)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="App API", version="1.0.0")

# --- Cho phép React (chạy ở port khác) gọi được API này ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # địa chỉ React dev server (Vite mặc định)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Cho phép truy cập ảnh đại diện qua URL: http://localhost:8000/static/avatars/xxx.png ---
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- Gắn các nhóm API ---
app.include_router(auth_router.router)
app.include_router(users_router.router)


@app.get("/")
def root():
    return {"message": "API đang chạy!"}