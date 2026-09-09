from pathlib import Path

from services.assistant import AIAssistant


PROMPT_FILE = (
    Path(__file__).resolve().parent.parent
    / "prompts"
    / "risk_explanation.txt"
)


def load_risk_prompt():
    """
    Load the risk explanation prompt template.
    """

    with open(PROMPT_FILE, "r", encoding="utf-8") as file:
        return file.read()


def explain_risk(project):
    """
    Generate an AI explanation for a project's risk.
    """

    prompt_template = load_risk_prompt()

    prompt = prompt_template.format(
        project_name=project.get("name", "Unknown"),
        category=project.get("category", "Unknown"),
        location=project.get("location", "Unknown"),
        budget=project.get("budget", 0),
        progress=project.get("progress", 0),
        status=project.get("status", "Unknown"),
        risk_score=project.get("risk_score", 0),
        risk_level=project.get("risk_level", "Unknown"),
    )

    assistant = AIAssistant()

    return assistant.generate_response(prompt)
