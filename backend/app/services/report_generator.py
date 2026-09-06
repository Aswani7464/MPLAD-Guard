from datetime import datetime


def generate_report_data(
    project_id: int,
    title: str,
    report_type: str = "project"
) -> dict:

    return {
        "project_id": project_id,
        "title": title,
        "report_type": report_type,
        "generated_at": datetime.utcnow().isoformat()
    }
