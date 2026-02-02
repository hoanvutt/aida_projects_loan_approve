# Loan Approval Frontend UI (Proxy Fix)

This UI calls your backend through **Next.js API routes** to avoid CORS issues.

## Backend API (default)
This repo is preconfigured to use:
https://aida-sos-loan-prediction-api.up.railway.app

If you want to change it, set Railway Variable:
- `BACKEND_API_URL` = `https://your-backend-domain`

## Why this fixes "Failed to fetch"
Browser → calls **same-origin** `/api/predict`  
Server → calls backend `https://aida-sos-loan-prediction-api.up.railway.app/predict`

So CORS is no longer a problem.

## Deploy to Railway
1. Push to GitHub
2. Railway → Deploy from repo
3. (Optional) set `BACKEND_API_URL`
4. Done

## Test
- UI calls: `/api/predict`
- Health proxy: `/api/health`
