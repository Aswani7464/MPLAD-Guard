from sklearn.metrics import mean_absolute_error, mean_squared_error


def evaluate_regression_model(model, X_test, y_test):
    """
    Evaluate a regression model.

    Parameters:
        model: Trained ML model.
        X_test: Test features.
        y_test: Actual values.

    Returns:
        dict: Evaluation metrics.
    """

    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    mse = mean_squared_error(y_test, predictions)

    return {
        "mae": mae,
        "mse": mse
    }
