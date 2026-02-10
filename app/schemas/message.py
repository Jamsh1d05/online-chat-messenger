from datetime import datetime
from pydantic import BaseModel

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    chat_id: int
    sender_id: int

class MessageOut(MessageBase):
    id: int
    chat_id: int
    sender_id: int
    created_at: datetime

    class Config:
        from_attributes = True
