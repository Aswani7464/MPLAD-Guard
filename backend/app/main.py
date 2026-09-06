from fastapi import FastAPI

app = FastAPI(
    title="MPLAD-Guard API",
    description="MPLAD-Guard Project Monitoring and Risk Analysis API",
    version="1.0.0"
)


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
