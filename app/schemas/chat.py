from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from app.schemas.message import MessageOut
from app.schemas.user import UserOut

class ChatBase(BaseModel):
    title: Optional[str] = None

class ChatCreate(ChatBase):
    is_group: bool = False
    participant_ids: List[int] = []

class ChatOut(ChatBase):
    id: int
    created_at: datetime
    messages: List[MessageOut] = []
    participants: List[UserOut] = []

    class Config:
        from_attributes = True
