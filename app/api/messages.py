from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.message import MessageCreate, MessageOut
from app.core.database import get_db
from app.crud.message import get_message, get_messages_by_chat, create_message

router = APIRouter(prefix="/messages", tags=["messages"])

@router.post("/", response_model=MessageOut)
def send_message(message_in: MessageCreate, db: Session = Depends(get_db)):
    return create_message(db, message_in)

@router.get("/chat/{chat_id}", response_model=List[MessageOut])
def get_chat_messages(chat_id: int, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return get_messages_by_chat(db, chat_id, skip, limit)

@router.get("/{message_id}", response_model=MessageOut)
def get_message_endpoint(message_id: int, db: Session = Depends(get_db)):
    message = get_message(db, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message
