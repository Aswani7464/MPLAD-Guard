from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth
from app.routes import projects
from app.routes import dashboard
from app.routes import risk
from app.routes import verification
from app.routes import analytics
from app.routes import reports
from app.routes import notifications


app = FastAPI(
    title="MPLAD-Guard API",
    description="MPLAD-Guard Project Monitoring and Risk Analysis API",
    version="1.0.0"
)


# Allow the React frontend to communicate with FastAPI
# This works for the deployed Render frontend as well as local development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routes
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(dashboard.router)
app.include_router(risk.router)
app.include_router(verification.router)
app.include_router(analytics.router)
app.include_router(reports.router)
app.include_router(notifications.router)


@app.get("/")
def root():
    return {
        "message": "MPLAD-Guard API is running",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }