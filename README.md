# Loan Approval Frontend UI (Next.js + Tailwind)

This UI tests your FastAPI Loan Approval API.

## Why your build failed before
Next.js App Router requires `app/layout.*`. This project includes:
- `app/layout.jsx`
- `app/page.jsx`
- Tailwind configs

## Env var (Railway Variables)
Set:
- `NEXT_PUBLIC_API_URL` = `https://<your-loan-api-domain>`

Example:
`NEXT_PUBLIC_API_URL=https://loan-approval-api-production.up.railway.app`

## Local run
```bash
npm install
npm run dev
```

## Railway Deploy
- Deploy from GitHub
- Add env var
- Done
