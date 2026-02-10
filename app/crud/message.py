from sqlalchemy.orm import Session
from app.models.message import Message
from app.schemas.message import MessageCreate

def get_message(db: Session, message_id: int):
    return db.query(Message).filter(Message.id == message_id).first()

def get_messages_by_chat(db: Session, chat_id: int, skip: int = 0, limit: int = 100):
    return db.query(Message).filter(Message.chat_id == chat_id).offset(skip).limit(limit).all()

def create_message(db: Session, message_in: MessageCreate):
    message = Message(
        chat_id=message_in.chat_id,
        sender_id=message_in.sender_id,
        content=message_in.content,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message
