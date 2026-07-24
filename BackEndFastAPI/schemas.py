from pydantic import BaseModel, EmailStr, field_validator
from datetime import date
import re

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    date_of_birth: date
    gender: str
    address: str
    phone_number: str

    @field_validator("full_name")
    def name_only_letters(cls, v):
        if not re.match(r"^[^\d\W]+(\s[^\d\W]+)*$", v, re.UNICODE):
            raise ValueError("Họ tên không hợp lệ")
        return v

    @field_validator("phone_number")
    def phone_digits_only(cls, v):
        if not re.match(r"^[0-9]{9,11}$", v):
            raise ValueError("Số điện thoại không hợp lệ")
        return v

    @field_validator("password")
    def strong_password(cls, v):
        pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$"
        if not re.match(pattern, v):
            raise ValueError("Mật khẩu yếu")
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str