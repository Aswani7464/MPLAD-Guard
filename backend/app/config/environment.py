import os


def get_environment() -> str:
    return os.getenv("ENVIRONMENT", "development")


def is_production() -> bool:
    return get_environment().lower() == "production"
