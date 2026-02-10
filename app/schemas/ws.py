from pydantic import BaseModel

class WSMessageIn(BaseModel):
    chat_id: int
    message: str

class WSMessageOut(BaseModel):
    from_user: int
    chat_id: int
    message: str
