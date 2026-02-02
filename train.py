"""
Optional training script (already trained models are packaged in ./models).

If you want to retrain locally:
1) Put the Excel file at: data/CRISP DM Business Understanding_CIBC.xlsx
2) Run: python train.py
"""

import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import roc_auc_score

DATA_PATH = "data/CRISP DM Business Understanding_CIBC.xlsx"
SHEET_NAME = "Credit Risk Dataset"
MODEL_DIR = "models"

FEATURES = [
    "age","employment_years","monthly_income","credit_score",
    "loan_amount","loan_term","monthly_debt","debt_to_income_ratio"
]

def main():
    os.makedirs(MODEL_DIR, exist_ok=True)

    df = pd.read_excel(DATA_PATH, sheet_name=SHEET_NAME)

    df2 = pd.DataFrame({
        "age": df["Age"],
        "employment_years": df["Years_in_Job"],
        "monthly_income": df["Monthly_Income"],
        "credit_score": df["Credit_Score"],
        "loan_amount": df["Loan_Amount"],
        "loan_term": df["Loan_Term_Months"],
        "debt_to_income_ratio": df["Debt_to_Income_Ratio"],
        "loan_default": df["Loan_Default"],  # 0 good, 1 default
    })

    df2["monthly_debt"] = df2["monthly_income"] * df2["debt_to_income_ratio"]

    X = df2[FEATURES]
    y = df2["loan_default"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    logistic = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        ("clf", LogisticRegression(max_iter=2000, class_weight="balanced", random_state=42))
    ])

    rf = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("clf", RandomForestClassifier(
            n_estimators=300,
            class_weight="balanced_subsample",
            random_state=42,
            n_jobs=-1
        ))
    ])

    logistic.fit(X_train, y_train)
    rf.fit(X_train, y_train)

    log_auc = roc_auc_score(y_test, logistic.predict_proba(X_test)[:, 1])
    rf_auc = roc_auc_score(y_test, rf.predict_proba(X_test)[:, 1])

    joblib.dump(logistic, f"{MODEL_DIR}/logistic_model.joblib")
    joblib.dump(rf, f"{MODEL_DIR}/rf_model.joblib")

    best = logistic if log_auc >= rf_auc else rf
    best_name = "logistic" if log_auc >= rf_auc else "rf"
    joblib.dump(best, f"{MODEL_DIR}/best_model.joblib")

    meta = {
        "features": FEATURES,
        "target": "loan_default",
        "logistic_auc": round(float(log_auc), 4),
        "rf_auc": round(float(rf_auc), 4),
        "best_model": best_name
    }
    joblib.dump(meta, f"{MODEL_DIR}/meta.joblib")

    print("Saved models to ./models")
    print(meta)

if __name__ == "__main__":
    main()
