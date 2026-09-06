from supabase import create_client, Client

from app.config.settings import settings


supabase: Client | None = None


def get_supabase_client() -> Client:
    if not settings.supabase_url or not settings.supabase_key:
        raise ValueError(
            "Supabase URL and Supabase key are not configured."
        )

    return create_client(
        settings.supabase_url,
        settings.supabase_key
    )


def initialize_database():
    global supabase

    if settings.supabase_url and settings.supabase_key:
        supabase = create_client(
            settings.supabase_url,
            settings.supabase_key
        )
