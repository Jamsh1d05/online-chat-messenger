from pydantic import BaseModel
from typing import Optional

class WSMessageIn(BaseModel):
    chat_id: int
    message: str

class WSMessageOut(BaseModel):
    from_user: int
    chat_id: int
    message: str
    created_at: Optional[str] = None
