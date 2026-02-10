import select
from sqlalchemy.orm import Session
from app.models.chat import Chat
from app.models.chat_participants import ChatParticipant
from app.schemas.chat import ChatCreate

def get_chat(db: Session, chat_id: int):
    return db.query(Chat).options(joinedload(Chat.participants)).filter(Chat.id == chat_id).first()

from sqlalchemy.orm import joinedload

def get_chats(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Chat).options(joinedload(Chat.participants)).offset(skip).limit(limit).all()

def get_chat_participants(db, chat_id: int) -> list[int]:
    result = db.execute(
        select(ChatParticipant.user_id)
        .where(ChatParticipant.chat_id == chat_id)
    )
    return result.scalars().all()

def create_chat(db: Session, chat_in: ChatCreate, creator_id: int):
    chat = Chat(title=chat_in.title, is_group=chat_in.is_group)
    db.add(chat)
    db.commit()
    db.refresh(chat)

    # Add creator
    creator_participant = ChatParticipant(chat_id=chat.id, user_id=creator_id)
    db.add(creator_participant)

    # Add other participants
    if chat_in.participant_ids:
        for user_id in chat_in.participant_ids:
            if user_id != creator_id:
                participant = ChatParticipant(chat_id=chat.id, user_id=user_id)
                db.add(participant)
    
    db.commit()
    # Expire and refresh to load relationship
    db.expire(chat) 
    # Or query it back with options
    return get_chat(db, chat.id)
