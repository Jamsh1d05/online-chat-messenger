from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

def setup_cors(app):
    if settings.CORS_ALLOWED_ORIGINS == "*":
        allow_origins = ["*"]
    else:
        allow_origins = [
            origin.strip()
            for origin in settings.CORS_ALLOWED_ORIGINS.split(",")
            if origin.strip()
        ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allow_origins,
        allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
        allow_methods=[
            m.strip() for m in settings.CORS_ALLOW_METHODS.split(",")
        ],
        allow_headers=[
            h.strip() for h in settings.CORS_ALLOW_HEADERS.split(",")
        ],
    )
