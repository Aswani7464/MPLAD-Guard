import pandas as pd

from models.anomaly_model import AnomalyModel
from preprocessing.clean_data import clean_data
from preprocessing.feature_engineering import create_features


def train_anomaly_model(data):
    """
    Train the anomaly detection model.

    Parameters:
        data (pd.DataFrame): Project monitoring data.

    Returns:
        AnomalyModel: Trained anomaly model.
    """

    # Clean the data
    data = clean_data(data)

    # Create ML features
    data = create_features(data)

    # Features used for anomaly detection
    feature_columns = [
        "budget",
        "progress",
        "remaining_progress",
        "budget_per_progress"
    ]

    X = data[feature_columns]

    # Create and train model
    model = AnomalyModel()
    model.train(X)

    return model
