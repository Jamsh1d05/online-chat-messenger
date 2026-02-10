from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.chat import ChatCreate, ChatOut
from app.core.database import get_db
from app.crud.chat import get_chat, get_chats, create_chat

router = APIRouter(prefix="/chats", tags=["chats"])

@router.post("/", response_model=ChatOut)
def create_chat_endpoint(chat_in: ChatCreate, db: Session = Depends(get_db)):
    return create_chat(db, chat_in)

@router.get("/", response_model=List[ChatOut])
def list_chats(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return get_chats(db, skip, limit)

@router.get("/{chat_id}", response_model=ChatOut)
def get_chat_endpoint(chat_id: int, db: Session = Depends(get_db)):
    chat = get_chat(db, chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat
