import json
from typing import Dict, List
from fastapi import WebSocket, WebSocketDisconnect


class ConnectionManager:
    def __init__(self):
        # user_id -> WebSocket connections
        self.active_connections: Dict[int, List[WebSocket]] = {}

    @property
    def redis(self):
        from app.core.redis import redis_client
        if redis_client is None:
            raise RuntimeError("Redis client is not initialized. Check your startup lifespan.")
        return redis_client

    async def connect(self, user_id: int, websocket: WebSocket):
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, user_id: int, websocket: WebSocket):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: int):
        websocket = self.active_connections.get(user_id)
        if websocket:
            await websocket.send_text(message)

    async def send_to_user(self, user_id: int, message: dict):
        connections = self.active_connections.get(user_id, [])
        for ws in connections:
            await ws.send_json(message)
            
    async def publish(self, channel: str, message: str):
        await self.redis.publish(channel, json.dumps(message))

    async def subscribe(self, channel: str):
        if self.redis is None:
            raise RuntimeError("Redis not initialized")

        print("Subscribing with Redis client:", self.redis)
        pubsub = self.redis.pubsub()
        await pubsub.subscribe(channel)

        try:
            async for message in pubsub.listen():
                if message["type"] == "message":
                    yield json.loads(message["data"])
        finally:
            await pubsub.unsubscribe(channel)
            await pubsub.close()
    
