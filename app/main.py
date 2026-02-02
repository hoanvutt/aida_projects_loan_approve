from __future__ import annotations

import os
from typing import Optional, Literal, Dict, Any

import joblib
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel, Field

# Load model once at startup
MODEL_PATH = os.getenv("MODEL_PATH", os.path.join(os.path.dirname(__file__), "model.joblib"))
model = joblib.load(MODEL_PATH)

app = FastAPI(title="Loan Approval (Logistic Regression)", version="1.0.0")


class LoanApplication(BaseModel):
    # Requested inputs
    age: int = Field(..., ge=18, le=100, description="Applicant age")
    Marital_Status: str = Field(..., description="e.g., Single, Married, Divorced, Widowed")
    Residential_Status: str = Field(..., description="e.g., Own, Rent, Live with family")
    employment_years: float = Field(..., ge=0, le=60, description="Years in current job")
    monthly_income: float = Field(..., ge=0, description="Monthly income (CAD)")
    credit_score: int = Field(..., ge=300, le=900, description="Credit score")
    loan_amount: float = Field(..., ge=0, description="Requested loan amount (CAD)")
    loan_term: int = Field(..., ge=1, description="Loan term in months")
    Interest_Rate: float = Field(..., ge=0, le=100, description="Annual interest rate (%)")
    monthly_debt: float = Field(..., ge=0, description="Total monthly debt payments (CAD)")


class PredictionResponse(BaseModel):
    approve: bool
    default_probability: float
    threshold: float
    notes: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionResponse)
def predict(applicant: LoanApplication):
    # Build a single-row dataframe in the same schema used for training
    import pandas as pd

    X = pd.DataFrame([{
        "Age": applicant.age,
        "Marital_Status": applicant.Marital_Status,
        "Residential_Status": applicant.Residential_Status,
        "Years_in_Job": applicant.employment_years,
        "Monthly_Income": applicant.monthly_income,
        "Credit_Score": applicant.credit_score,
        "Loan_Amount": applicant.loan_amount,
        "Loan_Term_Months": applicant.loan_term,
        "Interest_Rate_%": applicant.Interest_Rate,
        "Monthly_Debt": applicant.monthly_debt,
    }])

    # Predict probability of default (1 = default)
    proba_default = float(model.predict_proba(X)[0][1])

    # Business rule: approve if default probability below threshold.
    # You can tune this threshold based on your risk appetite and validation results.
    threshold = float(os.getenv("DEFAULT_PROB_THRESHOLD", "0.50"))
    approve = proba_default < threshold

    notes = (
        "This is a preliminary ML screening (logistic regression). "
        "Final approval should also consider full credit policy, verification, and fraud checks."
    )
    return PredictionResponse(
        approve=approve,
        default_probability=proba_default,
        threshold=threshold,
        notes=notes
    )
