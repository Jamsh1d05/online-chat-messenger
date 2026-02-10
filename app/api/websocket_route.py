import asyncio

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from app.websocket.manager import ConnectionManager
from sqlalchemy.orm import Session
from app.api.dependencies.websocket_dep import get_current_user_ws
from app.core.database import SessionLocal, get_db
from app.schemas.ws import WSMessageIn, WSMessageOut

router = APIRouter()
manager = ConnectionManager()


#@router.websocket("/ws/users/{userName}") - Private chat by username
#@router.websocket("/ws/friends/{userName}") - Users in friend list
#@router.websocket("/ws/group/{groupId}") - Group chat


@router.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    db = SessionLocal() 

    user = await get_current_user_ws(websocket, db)
    if not user:
        return

    await manager.connect(user.id, websocket)

    redis_channel = f"user:{user.id}"

    async def redis_listener():
        async for msg in manager.subscribe(redis_channel):
            await manager.send_to_user(user.id, msg)

    listener_task = asyncio.create_task(redis_listener())

    try:
        while True:
            data = await websocket.receive_json()
            msg = WSMessageIn(**data)

            # Get participants of the chat
            from app.services.chat_logic import get_chat_participants_ids
            participant_ids = get_chat_participants_ids(db, msg.chat_id)

            outgoing = WSMessageOut(
                from_user=user.id,
                chat_id=msg.chat_id,
                message=msg.message,
            ).dict()

            # Broadcast to all participants
            for participant_id in participant_ids:
                 await manager.publish(
                    channel=f"user:{participant_id}",
                    message=outgoing,
                )

    except WebSocketDisconnect:
        manager.disconnect(user.id, websocket)
        listener_task.cancel()