import uuid
from datetime import datetime, timezone
from typing import Annotated, Optional

from pydantic import EmailStr, StringConstraints
from sqlalchemy import DateTime
from sqlmodel import Field, Relationship, SQLModel

Mobile10 = Annotated[
    str,
    StringConstraints(pattern=r"^\d{10}$")
]

def get_datetime_utc() -> datetime:
    return datetime.now(timezone.utc)


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=128)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    emps: list["Emp"] = Relationship(back_populates="owner", cascade_delete=True)
    deps: list["Dep"] = Relationship(back_populates="owner", cascade_delete=True)

# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID
    created_at: datetime | None = None


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int

class DepBase(SQLModel):
    dep_name: str = Field(default=None, max_length=200)
    dep_code: str = Field(default=None, max_length=50)
    dep_id: uuid.UUID = Field(default_factory=uuid.uuid4)


class DepCreate(DepBase):
    depuserid: uuid.UUID = Field(default_factory=uuid.uuid4)

class DepUpdate(DepBase):
    dep_name: str = Field(default=None, max_length=200)
    dep_code: str = Field(default=None, max_length=50)

class Dep(DepBase, table=True):
    dep_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    depuserid: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    owner: User | None = Relationship(back_populates="deps")
    emps: list["Emp"] = Relationship(back_populates="ownerdep", cascade_delete=True)

class DepPublic(DepBase):
    dep_id: uuid.UUID
    created_at: datetime | None = None


class DepsPublic(SQLModel):
    data: list[DepPublic]
    count: int

class Message(SQLModel):
    message: str

class EmpBase(SQLModel):
    workemail: EmailStr = Field(unique=True, index=True, max_length=200)
    name: str | None = Field(default=None, max_length=200)
    address: str | None = Field(default=None, max_length=200)
    mobile_number: Mobile10
    dep_name: str | None = Field(default=None, max_length=200)

class EmpCreate(EmpBase):
    depemp_id: uuid.UUID | None = Field(default=None, foreign_key="dep.dep_id")

class EmpUpdate(EmpBase):
    address: str | None = Field(default=None, max_length=200)
    mobile_number: Mobile10
    depemp_id: uuid.UUID | None = Field(default=None, foreign_key="dep.dep_id")

class Emp(EmpBase, table=True):
    empcode: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    emp_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    depemp_id: uuid.UUID = Field(default=None, foreign_key="dep.dep_id", nullable=True, ondelete="CASCADE")
    owner: User | None = Relationship(back_populates="emps")
    ownerdep: Dep | None = Relationship(back_populates="emps")
    
class EmpPublic(EmpBase):
    empcode: uuid.UUID
    emp_id: uuid.UUID
    depemp_id: Optional[uuid.UUID] = None
    created_at: datetime | None = None


class EmpsPublic(SQLModel):
    data: list[EmpPublic]
    count: int

class Message(SQLModel):
    message: str

# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime | None = None


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)
