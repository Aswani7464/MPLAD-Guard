def classify_anomaly(result):
    """
    Convert the Isolation Forest result into a readable status.

    Isolation Forest:
        1  = Normal
       -1  = Anomaly
    """

    if result == -1:
        return "Anomaly"

    return "Normal"


def get_anomaly_summary(results):
    """
    Create a summary of anomaly detection results.
    """

    total = len(results)
    anomalies = sum(1 for result in results if result == -1)
    normal = total - anomalies

    return {
        "total": total,
        "anomalies": anomalies,
        "normal": normal
    }
