import pandas as pd
from sklearn.preprocessing import MinMaxScaler


def normalize_features(data, columns=None):
    """
    Normalize numerical features between 0 and 1.

    Parameters:
        data (pd.DataFrame): Input data.
        columns (list): Columns to normalize.

    Returns:
        pd.DataFrame: Normalized data.
    """

    df = data.copy()

    if columns is None:
        columns = df.select_dtypes(include=["number"]).columns.tolist()

    if not columns:
        return df

    scaler = MinMaxScaler()

    df[columns] = scaler.fit_transform(df[columns])

    return df
