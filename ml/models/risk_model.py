from sklearn.ensemble import RandomForestRegressor


class RiskModel:
    """
    Machine learning model for predicting project risk scores.
    """

    def __init__(self, n_estimators=100, random_state=42):
        self.model = RandomForestRegressor(
            n_estimators=n_estimators,
            random_state=random_state
        )

    def train(self, X, y):
        """
        Train the risk model.

        Parameters:
            X: Input features.
            y: Risk scores.
        """
        self.model.fit(X, y)
        return self

    def predict(self, X):
        """
        Predict risk scores.
        """
        return self.model.predict(X)
