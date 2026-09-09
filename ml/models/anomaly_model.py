from sklearn.ensemble import IsolationForest


class AnomalyModel:
    """
    Machine learning model for detecting unusual project data.
    """

    def __init__(self, contamination="auto", random_state=42):
        self.model = IsolationForest(
            contamination=contamination,
            random_state=random_state
        )

    def train(self, X):
        """
        Train the anomaly detection model.
        """
        self.model.fit(X)
        return self

    def predict(self, X):
        """
        Detect anomalies.

        Returns:
            1  = normal
            -1 = anomaly
        """
        return self.model.predict(X)

    def anomaly_score(self, X):
        """
        Calculate anomaly scores.
        """
        return self.model.decision_function(X)
