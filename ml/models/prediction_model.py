from sklearn.ensemble import RandomForestRegressor


class PredictionModel:
    """
    Machine learning model for predicting future project values,
    such as progress or expected project outcomes.
    """

    def __init__(self, n_estimators=100, random_state=42):
        self.model = RandomForestRegressor(
            n_estimators=n_estimators,
            random_state=random_state
        )

    def train(self, X, y):
        """
        Train the prediction model.

        Parameters:
            X: Input project features.
            y: Target value to predict.
        """
        self.model.fit(X, y)
        return self

    def predict(self, X):
        """
        Predict future project values.
        """
        return self.model.predict(X)
