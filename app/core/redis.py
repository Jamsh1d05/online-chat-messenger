from redis.asyncio import Redis
from app.core.config import settings

redis_client: Redis | None = None

async def init_redis():
    global redis_client
    try:
        redis_client = Redis.from_url(
            f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}",
            decode_responses=True,
            socket_connect_timeout=5 
        )

        if await redis_client.ping():
            print("Connected to Redis")
        else:
            raise ConnectionError("Redis ping failed")

    except Exception as e:
        print(f"Redis connection failed: {e}")
        redis_client = None
        raise e

async def close_redis():
    if redis_client:
        await redis_client.close()
