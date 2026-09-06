from fastapi import Request
from fastapi.responses import JSONResponse


async def auth_middleware(request: Request, call_next):

    public_paths = {
        "/",
        "/health",
        "/docs",
        "/openapi.json",
        "/redoc"
    }

    if request.url.path in public_paths:
        return await call_next(request)

    return await call_next(request)
