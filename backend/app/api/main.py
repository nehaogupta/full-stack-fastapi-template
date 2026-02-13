from fastapi import APIRouter

from app.api.routes import items, login, private, users, utils,Emp,dep
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(Emp.router,prefix="/api/v1/emps", tags=["Emps"])
api_router.include_router(dep.router,prefix="/api/v1/deps", tags=["deps"])
api_router.include_router(utils.router)
api_router.include_router(items.router)


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
