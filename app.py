import os
import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel, Field

# By default, the app loads the packaged model files in ./models
MODEL_PATH = os.getenv("MODEL_PATH", "models/best_model.joblib")
META_PATH  = os.getenv("META_PATH", "models/meta.joblib")

app = FastAPI(title="Loan Decision API", version="1.0")

model = joblib.load(MODEL_PATH)
meta  = joblib.load(META_PATH)

FEATURES = meta["features"]
# This model predicts loan_default: 0 = good, 1 = default
TARGET = meta.get("target", "loan_default")

# Decision threshold on probability of DEFAULT (risk)
# Approve if prob_default < DEFAULT_PROB_THRESHOLD
DEFAULT_PROB_THRESHOLD = float(os.getenv("DEFAULT_PROB_THRESHOLD", "0.50"))

class LoanInput(BaseModel):
    age: int = Field(..., ge=18, le=100)
    employment_years: float = Field(..., ge=0, le=60)
    monthly_income: float = Field(..., gt=0)
    credit_score: int = Field(..., ge=300, le=900)
    loan_amount: float = Field(..., gt=0)
    loan_term: int = Field(..., ge=1, le=480)  # months
    monthly_debt: float = Field(..., ge=0)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": True,
        "target": TARGET,
        "default_prob_threshold": DEFAULT_PROB_THRESHOLD
    }

@app.post("/predict")
def predict(inp: LoanInput):
    debt_to_income_ratio = inp.monthly_debt / inp.monthly_income

    row = {
        "age": inp.age,
        "employment_years": inp.employment_years,
        "monthly_income": inp.monthly_income,
        "credit_score": inp.credit_score,
        "loan_amount": inp.loan_amount,
        "loan_term": inp.loan_term,
        "monthly_debt": inp.monthly_debt,
        "debt_to_income_ratio": debt_to_income_ratio,
    }

    X = pd.DataFrame([row], columns=FEATURES)

    # proba_default = P(loan_default = 1)
    proba_default = float(model.predict_proba(X)[0, 1])
    approved = int(proba_default < DEFAULT_PROB_THRESHOLD)

    return {
        "approved": approved,
        "prob_default": round(proba_default, 4),
        "default_prob_threshold": DEFAULT_PROB_THRESHOLD,
        "derived": {
            "debt_to_income_ratio": round(debt_to_income_ratio, 4)
        }
    }
