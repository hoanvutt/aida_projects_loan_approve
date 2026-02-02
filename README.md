# Loan Decision UI (Next.js + Tailwind)

Single-page UI inspired by your SPAM/HAM checker layout.

## Features
- Hero layout + right-side form card
- Calls deployed API: POST /predict
- Shows prob_default + decision badge (APPROVE / REJECT)
- Dark / Light toggle
- Random demo data button
- API Docs button

## Setup
```bash
npm install
npm run dev
```

Open http://localhost:3000

## Configure API base
Create `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=https://aida-sos-loan-prediction-api.up.railway.app
```

## Deploy on Railway
1) Push this repo to GitHub
2) Railway -> New Project -> Deploy from GitHub
3) Add Variable (optional):
- `NEXT_PUBLIC_API_BASE_URL`

Railway will run:
- build: `npm run build`
- start: `npm run start` (uses PORT)
