import os


class AIAssistant:
    """
    Basic AI assistant service for MPLAD-Guard.

    The actual AI provider can be connected later.
    """

    def __init__(self):
        self.api_key = os.getenv("AI_API_KEY")

    def generate_response(self, prompt):
        """
        Generate an AI response from a prompt.

        This is a placeholder until an AI provider is connected.
        """

        if not prompt:
            return "Please provide a prompt."

        if not self.api_key:
            return (
                "AI service is not configured yet. "
                "Please configure the AI API key."
            )

        # AI provider integration will be added later.
        return "AI response will be generated here."
