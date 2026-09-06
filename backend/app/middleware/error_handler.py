from fastapi import Request
from fastapi.responses import JSONResponse


def register_error_handlers(app):

    @app.exception_handler(ValueError)
    async def value_error_handler(
        request: Request,
        exc: ValueError
    ):
        return JSONResponse(
            status_code=400,
            content={
                "error": str(exc)
            }
        )

    @app.exception_handler(Exception)
    async def general_error_handler(
        request: Request,
        exc: Exception
    ):
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal server error"
            }
        )
