from app.database.connection import get_supabase_client


def get_all_projects():
    supabase = get_supabase_client()

    response = (
        supabase
        .table("projects")
        .select("*")
        .execute()
    )

    return response.data


def get_project_by_id(project_id: int):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("projects")
        .select("*")
        .eq("id", project_id)
        .execute()
    )

    if response.data:
        return response.data[0]

    return None


def create_project(project_data: dict):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("projects")
        .insert(project_data)
        .execute()
    )

    return response.data


def update_project(project_id: int, project_data: dict):
    supabase = get_supabase_client()

    # Update the project
    response = (
        supabase
        .table("projects")
        .update({
            "name": project_data.get("name"),
            "description": project_data.get("description"),
            "location": project_data.get("location"),
            "latitude": project_data.get("latitude"),
            "longitude": project_data.get("longitude"),
            "budget": project_data.get("budget"),
            "status": project_data.get("status"),
            "completion_percentage": project_data.get(
                "completion_percentage", 0
            ),
        })
        .eq("id", project_id)
        .execute()
    )

    return response.data


def delete_project(project_id: int):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("projects")
        .delete()
        .eq("id", project_id)
        .execute()
    )

    return response.data


def create_notification(notification_data: dict):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("notifications")
        .insert(notification_data)
        .execute()
    )

    return response.data