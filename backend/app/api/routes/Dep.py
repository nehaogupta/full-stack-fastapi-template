import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import col, func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Dep, DepCreate, DepPublic, DepsPublic, DepUpdate, Message

router = APIRouter(tags=["deps"])

@router.get("/", response_model=DepsPublic)
def read_deps(session: SessionDep, current_user: CurrentUser,skip: int = 0,limit: int = 10) -> Any:
    """
    Retrieve Departments.
    """
    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(Dep)

        count = session.exec(count_statement).one()
        statement = (
            select(Dep).order_by(col(Dep.created_at).desc()).offset(skip).limit(limit)
        )
        deps = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(Dep)
            .where(Dep.dep_id == current_user.id)
        )
        count = session.exec(count_statement).one()
        statement = (
            select(Dep)
            .where(Dep.dep_id == current_user.id)
            .order_by(col(Dep.created_at).desc())
            .offset(skip)
            .limit(limit)
        )
        deps = session.exec(statement).all()

    return DepsPublic(data=deps, count=count)

@router.get("/{depcode}", response_model=DepPublic)
def read_dep(session: SessionDep, current_user: CurrentUser, depcode: uuid.UUID) -> Any:
    """
    Get Department by Depcode.
    """
    deps = session.get(Dep, depcode)
    if not deps:
        raise HTTPException(status_code=404, detail="Department not found")
    if not current_user.is_superuser and (deps.dep_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return deps

@router.post("/", response_model=DepPublic)
def create_dep(session: SessionDep, current_user: CurrentUser, dep_in: DepCreate) -> Any:
    """
    Create new Department.
    """
    deps = session.exec(select(Dep).where(Dep.dep_name == dep_in.dep_name)).first()
    if deps:
        raise HTTPException(status_code=400, detail="Department with this name already exists")
    deps = Dep.from_orm(dep_in)
    deps.dep_id = current_user.id
    session.add(deps)
    session.commit()
    session.refresh(deps)
    return deps

@router.patch("/{dep_id}", response_model=DepPublic)
def update_dep(*,session: SessionDep, current_user: CurrentUser, dep_id: uuid.UUID, dep_in: DepUpdate) -> Any:
    """
    Update Department.
    """
    deps = session.get(Dep, dep_id)
    if not deps:
        raise HTTPException(status_code=404, detail="Department not found")
    if not current_user.is_superuser and (deps.dep_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    update_dep = dep_in.model_dump(exclude_unset=True)
    deps.sqlmodel_update(update_dep)
    session.add(deps)
    session.commit()
    session.refresh(deps)
    return deps

@router.delete("/{dep_id}", response_model=Message)
def delete_dep(session: SessionDep, current_user: CurrentUser, dep_id: uuid.UUID) -> Any:
    """
    Delete Department.
    """
    deps = session.get(Dep, dep_id)
    if not deps:
        raise HTTPException(status_code=404, detail="Department not found")
    if not current_user.is_superuser and (deps.dep_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    session.delete(deps)
    session.commit()
    return Message(message="Department deleted successfully")
