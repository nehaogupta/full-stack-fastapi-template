import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import col, func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Emp, EmpCreate, EmpPublic, EmpsPublic, EmpUpdate, Message

router = APIRouter(prefix="/emps", tags=["emps"])

@router.get("/", response_model=EmpsPublic)
def read_emps(session: SessionDep, current_user: CurrentUser,skip: int = 0,limit: int = 10) -> Any:
    """
    Retrieve Employees.
    """
    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(Emp)
        count = session.exec(count_statement).one()
        statement = (
            select(Emp).order_by(col(Emp.created_at).desc()).offset(skip).limit(limit)
        )
        emp = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(Emp)
            .where(Emp.emp_id == current_user.id)
        )
        count = session.exec(count_statement).one()
        statement = (
            select(Emp)
            .where(Emp.emp_id == current_user.id)
            .order_by(col(Emp.created_at).desc())
            .offset(skip)
            .limit(limit)
        )
        emp = session.exec(statement).all()

    return EmpsPublic(data=emp, count=count)

@router.get("/{empcode}", response_model=EmpPublic)
def read_emp(session: SessionDep, current_user: CurrentUser, empcode: uuid.UUID) -> Any:
    """
    Get Employee by Empcode.
    """
    emps = session.get(Emp, empcode)
    if not emps:
        raise HTTPException(status_code=404, detail="Employee not found")
    if not current_user.is_superuser and (emps.empcode != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return emps

@router.post("/", response_model=EmpCreate)
def create_emp(session: SessionDep, current_user: CurrentUser, emp_in: EmpCreate) -> Any:
    """
    Create new Employee.
    """
    emps = session.exec(select(Emp).where(Emp.workemail == emp_in.workemail)).first()
    if emps:
        raise HTTPException(status_code=400, detail="Employee with this email already exists")
    emps = Emp.from_orm(emp_in)
    emps.emp_id = current_user.id
    session.add(emps)
    session.commit()
    session.refresh(emps)
    return emps

@router.patch("/{empcode}", response_model=EmpUpdate)
def update_emp(session: SessionDep, current_user: CurrentUser, empcode: uuid.UUID, emp_in: EmpUpdate) -> Any:
    """
    Update Employee.
    """
    emps = session.get(Emp, empcode)
    if not emps:
        raise HTTPException(status_code=404, detail="Employee not found")
    if not current_user.is_superuser and (emps.empcode != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    emp_data = emp_in.model_dump(exclude_unset=True)
    emps.sqlmodel_update(emp_data)
    session.add(emps)
    session.commit()
    session.refresh(emps)
    return emps

@router.delete("/{empcode}", response_model=Message)
def delete_emp(session: SessionDep, current_user: CurrentUser, empcode: uuid.UUID) -> Any:
    """
    Delete Employee.
    """
    emps = session.get(Emp, empcode)
    if not emps:
        raise HTTPException(status_code=404, detail="Employee not found")
    if not current_user.is_superuser and (emps.empcode != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    session.delete(emps)
    session.commit()
    return Message(message="Employee deleted successfully")
