import pandas as pd


def create_features(data):
    """
    Create useful features for ML risk and prediction models.

    Parameters:
        data (pd.DataFrame): Cleaned project data.

    Returns:
        pd.DataFrame: Data with engineered features.
    """

    df = data.copy()

    # Progress-based feature
    if "progress" in df.columns:
        df["remaining_progress"] = 100 - df["progress"]

    # Budget-related feature
    if "budget" in df.columns and "progress" in df.columns:
        df["budget_per_progress"] = df["budget"] / df["progress"].replace(0, 1)

    return df
