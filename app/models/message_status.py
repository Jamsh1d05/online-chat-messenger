# app/models/message_status.py
from sqlalchemy import Column, Integer, ForeignKey, DateTime
from app.models.base import Base

class MessageStatus(Base):
    __tablename__ = "message_status"

    message_id = Column(
        Integer,
        ForeignKey("messages.id", ondelete="CASCADE"),
        primary_key=True
    )
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True
    )

    delivered_at = Column(DateTime(timezone=True))
    read_at = Column(DateTime(timezone=True))
