import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest
from pathlib import Path

from app.ai.preprocess import build_feature_matrix

MODEL_PATH = Path("app/ai/model.pkl")


def train():
    # TODO: Replace with real training data
    data = {
        "amount": [10000, 15000, 12000, 900000, 17500, 11000, 2000000],
    }
    df = pd.DataFrame(data)
    X = build_feature_matrix(df)

    model = IsolationForest(contamination=0.1, random_state=42)
    model.fit(X)

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")


if __name__ == "__main__":
    train()
