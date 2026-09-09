from pathlib import Path

from services.assistant import AIAssistant


PROMPT_FILE = (
    Path(__file__).resolve().parent.parent
    / "prompts"
    / "report_generation.txt"
)


def load_report_prompt():
    """
    Load the AI report generation prompt template.
    """

    with open(PROMPT_FILE, "r", encoding="utf-8") as file:
        return file.read()


def generate_ai_report(project):
    """
    Generate an AI-based project monitoring report.
    """

    prompt_template = load_report_prompt()

    prompt = prompt_template.format(
        project_name=project.get("name", "Unknown"),
        description=project.get("description", ""),
        category=project.get("category", "Unknown"),
        location=project.get("location", "Unknown"),
        budget=project.get("budget", 0),
        progress=project.get("progress", 0),
        status=project.get("status", "Unknown"),
        risk_score=project.get("risk_score", 0),
        risk_level=project.get("risk_level", "Unknown"),
        verification_status=project.get(
            "verification_status",
            "Unknown"
        ),
    )

    assistant = AIAssistant()

    return assistant.generate_response(prompt)
