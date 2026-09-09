import pandas as pd


def clean_data(data):
    """
    Clean project monitoring data.

    Parameters:
        data (pd.DataFrame): Raw project data.

    Returns:
        pd.DataFrame: Cleaned project data.
    """

    df = data.copy()

    # Remove duplicate rows
    df = df.drop_duplicates()

    # Replace missing numeric values with 0
    numeric_columns = df.select_dtypes(include=["number"]).columns
    df[numeric_columns] = df[numeric_columns].fillna(0)

    # Replace missing text values with empty strings
    text_columns = df.select_dtypes(include=["object"]).columns
    df[text_columns] = df[text_columns].fillna("")

    return df
