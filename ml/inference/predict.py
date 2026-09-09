import pandas as pd

from models.risk_model import RiskModel
from models.prediction_model import PredictionModel
from preprocessing.clean_data import clean_data
from preprocessing.feature_engineering import create_features


def prepare_features(data):
    """
    Prepare project data for ML prediction.
    """

    data = clean_data(data)
    data = create_features(data)

    feature_columns = [
        "budget",
        "progress",
        "remaining_progress",
        "budget_per_progress"
    ]

    return data[feature_columns]


def predict_risk(model, data):
    """
    Predict risk scores for projects.
    """

    features = prepare_features(data)

    predictions = model.predict(features)

    return predictions


def predict_project(model, data):
    """
    Predict future project values such as progress.
    """

    features = prepare_features(data)

    predictions = model.predict(features)

    return predictions


def predict_from_project(project):
    """
    Prepare a single project for prediction.

    Parameters:
        project (dict): Project information.

    Returns:
        pandas.DataFrame: Prepared project features.
    """

    data = pd.DataFrame([project])

    return prepare_features(data)
