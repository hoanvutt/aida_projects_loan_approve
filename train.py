import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, classification_report

DATA_PATH = "CRISP DM Business Understanding_CIBC.xlsx"
OUTPUT_MODEL_PATH = "app/model.joblib"

def main():
    df = pd.read_excel(DATA_PATH)

    # Derive Monthly_Debt from DTI and income (dataset doesn't have monthly_debt directly)
    df["Monthly_Debt"] = df["Debt_to_Income_Ratio"] * df["Monthly_Income"]

    X = df[[
        "Age",
        "Marital_Status",
        "Residential_Status",
        "Years_in_Job",
        "Monthly_Income",
        "Credit_Score",
        "Loan_Amount",
        "Loan_Term_Months",
        "Interest_Rate_%",
        "Monthly_Debt"
    ]].copy()

    y = (df["Loan_Default"].astype(str).str.strip().str.lower() == "yes").astype(int)

    categorical = ["Marital_Status", "Residential_Status"]
    numeric = [c for c in X.columns if c not in categorical]

    preprocess = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
            ("num", StandardScaler(), numeric),
        ]
    )

    clf = LogisticRegression(max_iter=2000, class_weight="balanced", solver="lbfgs")

    pipe = Pipeline(steps=[("preprocess", preprocess), ("model", clf)])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    pipe.fit(X_train, y_train)
    proba = pipe.predict_proba(X_test)[:, 1]
    auc = roc_auc_score(y_test, proba)

    print("ROC AUC:", round(auc, 4))
    print(classification_report(y_test, pipe.predict(X_test)))

    joblib.dump(pipe, OUTPUT_MODEL_PATH)
    print("Saved:", OUTPUT_MODEL_PATH)

if __name__ == "__main__":
    main()
