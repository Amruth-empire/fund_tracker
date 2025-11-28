from pathlib import Path
import random

MODEL_PATH = Path("app/ai/model.pkl")

# For now using a dummy scorer.
# You can later load a real scikit-learn model from MODEL_PATH.


def score_invoice(amount: float, project_id: int, vendor_name: str):
    """
    Returns (risk_score, risk_level)
    Dummy logic: higher amounts => slightly higher risk.
    """
    base = min(max(amount / 100000 * 100, 5), 95)  # normalize
    noise = random.randint(-10, 10)
    score = int(min(max(base + noise, 0), 100))

    if score >= 75:
        level = "high"
    elif score >= 40:
        level = "medium"
    else:
        level = "low"

    return score, level
