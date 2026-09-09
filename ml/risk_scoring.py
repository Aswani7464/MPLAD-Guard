def calculate_risk_score(
    budget_risk=0,
    progress_risk=0,
    delay_risk=0,
    verification_risk=0
):
    """
    Calculate an overall project risk score.

    Each risk factor should normally be between 0 and 100.
    """

    score = (
        budget_risk * 0.25
        + progress_risk * 0.30
        + delay_risk * 0.25
        + verification_risk * 0.20
    )

    score = round(score, 2)

    if score >= 70:
        level = "High"
    elif score >= 40:
        level = "Medium"
    else:
        level = "Low"

    return {
        "score": score,
        "level": level
    }
