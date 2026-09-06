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

    response = (
        supabase
        .table("projects")
        .update(project_data)
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
