from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from app.schemas.message import MessageOut

class ChatBase(BaseModel):
    title: Optional[str] = None

class ChatCreate(ChatBase):
    pass

class ChatOut(ChatBase):
    id: int
    created_at: datetime
    messages: List[MessageOut] = []

    class Config:
        from_attributes = True
