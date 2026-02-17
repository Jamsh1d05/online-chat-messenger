from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.user import UserOut, UserUpdate
from app.models.user import User
from app.core.database import get_db
from app.crud.user import get_user_by_username, get_user_by_id, update_user
from app.api.dependencies.api_dep import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserOut)
def read_current_user(current_user=Depends(get_current_user)):
    return current_user

@router.get("/{user_id}", response_model=UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/me", response_model=UserOut)
def update_current_user(user_update: UserUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user = update_user(db, current_user.id, user_update)
    return user

@router.get("/", response_model=List[UserOut])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(User).offset(skip).limit(limit).all()

