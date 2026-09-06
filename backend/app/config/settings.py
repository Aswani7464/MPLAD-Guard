from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "MPLAD-Guard"
    app_version: str = "1.0.0"
    debug: bool = True

    database_url: str = ""

    supabase_url: str = ""
    supabase_key: str = ""

    secret_key: str = "change-this-secret-key"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
