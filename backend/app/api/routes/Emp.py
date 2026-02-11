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
        emps = session.exec(statement).all()
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
        emps = session.exec(statement).all()

    return EmpsPublic(data=emps, count=count)

@router.get("/{id}", response_model=EmpPublic)
def read_emp(session: SessionDep, current_user: CurrentUser, emp_id: uuid.UUID) -> Any:
    """
    Get Employee by Empcode.
    """
    emp = session.get(Emp, emp_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    if not current_user.is_superuser and (emp.emp_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return emp

@router.post("/", response_model=EmpPublic)
def create_emp(session: SessionDep, current_user: CurrentUser, emp_in: EmpCreate) -> Any:
    """
    Create new Employee.
    """
    emp = session.exec(select(Emp).where(Emp.workemail == emp_in.workemail)).first()
    if emp:
        raise HTTPException(status_code=400, detail="Employee with this email already exists")
    emp = Emp.from_orm(emp_in)
    emp.emp_id = current_user.id
    session.add(emp)
    session.commit()
    session.refresh(emp)
    return emp

@router.patch("/{id}", response_model=EmpPublic)
def update_emp(session: SessionDep, current_user: CurrentUser, emp_id: uuid.UUID, emp_in: EmpUpdate) -> Any:
    """
    Update Employee.
    """
    emp = session.get(Emp, emp_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    if not current_user.is_superuser and (emp.emp_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    emp_data = emp_in.model_dump(exclude_unset=True)
    emp.sqlmodel_update(emp_data)
    session.add(emp)
    session.commit()
    session.refresh(emp)
    return emp

@router.delete("/{id}", response_model=Message)
def delete_emp(session: SessionDep, current_user: CurrentUser, emp_id: uuid.UUID) -> Any:
    """
    Delete Employee.
    """
    emp = session.get(Emp, emp_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    if not current_user.is_superuser and (emp.emp_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    session.delete(emp)
    session.commit()
    return Message(message="Employee deleted successfully")
