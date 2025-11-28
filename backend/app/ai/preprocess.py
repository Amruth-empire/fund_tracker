import pandas as pd


def build_feature_matrix(df: pd.DataFrame):
    """
    Example preprocessor for ML model.
    Expect columns: amount, project_id, vendor_frequency, etc.
    """
    features = df[["amount"]].copy()
    return features
