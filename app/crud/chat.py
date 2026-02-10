import select
from sqlalchemy.orm import Session
from app.models.chat import Chat
from app.models.chat_participants import ChatParticipant
from app.schemas.chat import ChatCreate

def get_chat(db: Session, chat_id: int):
    return db.query(Chat).filter(Chat.id == chat_id).first()

def get_chats(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Chat).offset(skip).limit(limit).all()

def get_chat_participants(db, chat_id: int) -> list[int]:
    result = db.execute(
        select(ChatParticipant.user_id)
        .where(ChatParticipant.chat_id == chat_id)
    )
    return result.scalars().all()

def create_chat(db: Session, chat_in: ChatCreate):
    chat = Chat(title=chat_in.title)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat
