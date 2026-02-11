from fastapi import FastAPI

from app.core.config import settings
from app.core.redis import init_redis, close_redis
from app.core.cors import setup_cors
from app.api import auth, chats, messages, users, websocket_route
#from app.core.database import engine
#from app.models import user, chat, message, message_status, chat_participants

app = FastAPI(title=settings.APP_NAME)
setup_cors(app)

'''
user.Base.metadata.create_all(bind=engine)
chat.Base.metadata.create_all(bind=engine)
message.Base.metadata.create_all(bind=engine)
message_status.Base.metadata.create_all(bind=engine)
chat_participants.Base.metadata.create_all(bind=engine)
'''

app.include_router(auth.router)
app.include_router(chats.router)
app.include_router(messages.router)
app.include_router(users.router)
app.include_router(websocket_route.router)


@app.on_event("startup")
async def startup_event():
    await init_redis()
    print("Redis on")


@app.on_event("shutdown")
async def shutdown_event():
    await close_redis()


@app.get("/health")
def health_check():
    return {"status": "ok"}

