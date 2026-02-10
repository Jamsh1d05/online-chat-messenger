from fastapi import Depends, WebSocket, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.core.database import SessionLocal

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User

async def get_current_user_ws(websocket: WebSocket, db: Session):
    token = websocket.query_params.get("token")
    if not token:
        return None

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        username = payload.get("sub")
        
        if not username:
            return None
    
    except JWTError:
        return None
    

    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        return user
    finally:
        db.close()
