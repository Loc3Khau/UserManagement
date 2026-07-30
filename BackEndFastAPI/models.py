from sqlalchemy import Column, Integer, String, Date, Enum, DateTime, func
from database import Base
import enum

class GenderEnum(str, enum.Enum):
    nam = "nam"
    nu = "nu"

class RoleEnum(str, enum.Enum):
    admin = "admin"
    user = "user"

class StatusEnum(str, enum.Enum):
    active = "active"
    locked = "locked"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    date_of_birth = Column(Date)
    gender = Column(Enum(GenderEnum))
    address = Column(String(255))
    phone_number = Column(String(15))
    avatar_url = Column(String(255), nullable=True)
    role = Column(Enum(RoleEnum), default=RoleEnum.user)
    status = Column(Enum(StatusEnum), default=StatusEnum.active)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())