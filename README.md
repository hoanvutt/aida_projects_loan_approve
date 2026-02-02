# Loan Decision API (Railway-ready)

This repo is packaged with **pre-trained models** under `./models`.

## Run locally
```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload
```
Open:
- http://127.0.0.1:8000/docs

## Predict example
POST /predict
```json
{
  "age": 35,
  "employment_years": 6,
  "monthly_income": 5500,
  "credit_score": 720,
  "loan_amount": 35000,
  "loan_term": 60,
  "monthly_debt": 1200
}
```

## Decision rule
The model predicts **probability of default** (`prob_default`).
- Approve if `prob_default < DEFAULT_PROB_THRESHOLD` (default: 0.50)

You can override the threshold in Railway Variables:
- `DEFAULT_PROB_THRESHOLD=0.35` (stricter) or `0.60` (looser)

## Deploy on Railway
1. Push to GitHub
2. Railway -> New Project -> Deploy from GitHub
3. No extra config needed (Procfile included)
