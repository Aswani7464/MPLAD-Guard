import pandas as pd

from models.risk_model import RiskModel
from preprocessing.clean_data import clean_data
from preprocessing.feature_engineering import create_features


def train_risk_model(data):
    """
    Train the project risk prediction model.

    Parameters:
        data (pd.DataFrame): Project monitoring data.

    Returns:
        RiskModel: Trained risk model.
    """

    # Clean the data
    data = clean_data(data)

    # Create ML features
    data = create_features(data)

    # Features used by the model
    feature_columns = [
        "budget",
        "progress",
        "remaining_progress",
        "budget_per_progress"
    ]

    X = data[feature_columns]

    # Risk score is the target value
    y = data["risk_score"]

    # Create and train model
    model = RiskModel()
    model.train(X, y)

    return model
