def calculate_risk_score(
    financial_risk: float,
    delay_risk: float,
    anomaly_score: float
) -> dict:

    score = (
        financial_risk * 0.4
        + delay_risk * 0.35
        + anomaly_score * 0.25
    )

    score = round(score, 2)

    if score >= 70:
        level = "high"
    elif score >= 40:
        level = "medium"
    else:
        level = "low"

    return {
        "risk_score": score,
        "risk_level": level
    }
