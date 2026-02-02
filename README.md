# Loan Decision UI (Next.js + Tailwind)

Single-page UI inspired by your SPAM/HAM checker layout.

## Important fix: "Failed to fetch"
Browsers often block cross-origin API calls (CORS).  
This UI calls a local Next.js proxy route: **POST /api/predict** → forwards to your API.

## Setup
```bash
npm install
npm run dev
```

## Configure upstream API
Create `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=https://aida-sos-loan-prediction-api.up.railway.app
# optional (server-side)
API_BASE_URL=https://aida-sos-loan-prediction-api.up.railway.app
```

## Deploy on Railway
1) Push repo to GitHub
2) Railway -> New Project -> Deploy from GitHub
3) Set Variables (optional):
- `NEXT_PUBLIC_API_BASE_URL` (for docs link)
- `API_BASE_URL` (for the proxy route)
