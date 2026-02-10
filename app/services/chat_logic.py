from sqlalchemy.orm import Session
from app.models.chat import Chat
from app.models.chat_participants import ChatParticipant

def get_chat_participants_ids(db: Session, chat_id: int) -> list[int]:
    """
    Returns a list of user_ids for a given chat.
    If chat is group -> all participants.
    If chat is 1-on-1 -> both users.
    """
    participants = db.query(ChatParticipant.user_id).filter(ChatParticipant.chat_id == chat_id).all()
    return [p[0] for p in participants]
