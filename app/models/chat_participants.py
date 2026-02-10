from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, func, Boolean
from sqlalchemy.orm import relationship
from app.models.base import Base


class ChatParticipant(Base):
    __tablename__ = "chat_participants"

    chat_id = Column(Integer, ForeignKey("chats.id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
