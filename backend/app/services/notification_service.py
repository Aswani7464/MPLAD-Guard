from app.database.connection import get_supabase_client


def create_notification(
    user_id: int,
    title: str,
    message: str,
    notification_type: str = "general"
):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("notifications")
        .insert({
            "user_id": user_id,
            "title": title,
            "message": message,
            "notification_type": notification_type
        })
        .execute()
    )

    return response.data
