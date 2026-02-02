# Loan Approval (Logistic Regression) - Railway Deployable

This project trains a **Logistic Regression** model (scikit-learn) and exposes it via a **FastAPI** API.

## What the model does
- Target in the dataset: `Loan_Default` (Yes/No)
- The API returns:
  - `default_probability` (probability applicant will default)
  - `approve` decision using a configurable threshold (`DEFAULT_PROB_THRESHOLD`, default 0.50)

## Features used (as you requested)
- `age`
- `Marital_Status`
- `Residential_Status`
- `employment_years`
- `monthly_income`
- `credit_score`
- `loan_amount`
- `loan_term`
- `Interest_Rate`
- `monthly_debt`

> Note: In the provided dataset, there is no `monthly_debt` column, so during training we derived it from  
> `Monthly_Debt = Debt_to_Income_Ratio * Monthly_Income`.  
> In the API you provide `monthly_debt` directly.

## Local run
```bash
python -m venv .venv
source .venv/bin/activate  # (Windows: .venv\Scripts\activate)
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Health check:
```bash
curl http://127.0.0.1:8000/health
```

Prediction example:
```bash
curl -X POST http://127.0.0.1:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 35,
    "Marital_Status": "Married",
    "Residential_Status": "Own",
    "employment_years": 5,
    "monthly_income": 6000,
    "credit_score": 720,
    "loan_amount": 25000,
    "loan_term": 60,
    "Interest_Rate": 9.5,
    "monthly_debt": 1200
  }'
```

## Railway deploy
1. Push this folder to GitHub (or upload it to Railway as a repo).
2. In Railway:
   - New Project → Deploy from GitHub Repo
   - Railway will detect `requirements.txt`
3. Set **Start Command** (if not using Procfile):
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
4. Optional environment variables:
   - `DEFAULT_PROB_THRESHOLD` (e.g. `0.45`)
   - `MODEL_PATH` (leave default unless you relocate the model)

## Files
- `app/main.py` FastAPI API
- `app/model.joblib` trained sklearn Pipeline (preprocessing + logistic regression)
- `requirements.txt`
- `Procfile`
