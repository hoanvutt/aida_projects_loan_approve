'use client'
import { useMemo, useState } from 'react'

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)) }

function calcMonthlyPayment(P, annualRatePct, nMonths) {
  const r = (annualRatePct / 100) / 12
  if (nMonths <= 0) return 0
  if (r === 0) return P / nMonths
  return (P * r) / (1 - Math.pow(1 + r, -nMonths))
}

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randFloat(min, max, dp=2) { return Number((Math.random() * (max - min) + min).toFixed(dp)) }
function pick(arr){ return arr[Math.floor(Math.random() * arr.length)] }

export default function Page() {
  const [theme, setTheme] = useState('light') // light | dark
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const [form, setForm] = useState({
    age: 35,
    Marital_Status: 'Married',
    Residential_Status: 'Own',
    employment_years: 5,
    monthly_income: 5000, // monthly 3k-15k
    credit_score: 700,
    loan_amount: 25000,
    loan_term: 60,
    Interest_Rate: 8.0,
    monthly_debt: 0
  })

  const computedMonthlyDebt = useMemo(() => {
    const pmt = calcMonthlyPayment(Number(form.loan_amount), Number(form.Interest_Rate), Number(form.loan_term))
    return Math.round(pmt)
  }, [form.loan_amount, form.Interest_Rate, form.loan_term])

  const displayForm = useMemo(() => ({...form, monthly_debt: computedMonthlyDebt}), [form, computedMonthlyDebt])

  function updateField(k, v) {
    setForm(prev => ({ ...prev, [k]: v }))
    setResult(null); setError('')
  }

  function randomize() {
    const age = randInt(25, 65)
    const Marital_Status = pick(['Married', 'Single'])
    const Residential_Status = pick(['Own', 'Rent'])
    const employment_years = randInt(0, Math.min(40, age - 18))
    const monthly_income = randInt(3000, 15000)
    const credit_score = randInt(550, 850)
    const loan_amount = randInt(5000, 100000)
    const loan_term = pick([12, 24, 36, 48, 60, 72, 84])
    const Interest_Rate = randFloat(2, 12, 2)

    setForm({
      age,
      Marital_Status,
      Residential_Status,
      employment_years,
      monthly_income,
      credit_score,
      loan_amount,
      loan_term,
      Interest_Rate,
      monthly_debt: 0
    })
    setResult(null); setError('')
  }

  async function submit() {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(displayForm)
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || data?.detail || "Request failed")
      setResult(data)
    } catch (e) {
      setError(String(e?.message || e))
    } finally {
      setLoading(false)
    }
  }

  const isDark = theme === 'dark'
  const shell = isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
  const card = isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
  const input = isDark ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
  const btn = isDark ? "bg-indigo-500 hover:bg-indigo-400 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"
  const btn2 = isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-100" : "bg-slate-100 hover:bg-slate-200 text-slate-900"
  const badgeBad = isDark ? "bg-rose-500/15 text-rose-300 border-rose-500/30" : "bg-rose-50 text-rose-700 border-rose-200"
  const badgeGood  = isDark ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border-emerald-200"

  return (
    <div className={shell + " min-h-screen"}>
      <div className="border-b border-slate-200/60 dark:border-slate-800/80">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
            <div>
              <div className="font-semibold leading-tight">Loan Approval</div>
              <div className="text-sm opacity-70 -mt-0.5">Logistic Regression API Tester</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              className={"px-4 py-2 rounded-xl border text-sm " + (isDark ? "border-slate-800 hover:bg-slate-900" : "border-slate-200 hover:bg-slate-50")}
              href={"/api/health"}
              target="_blank"
              rel="noreferrer"
              title="Calls backend /health through proxy"
            >
              API Health
            </a>
            <button
              className={"px-4 py-2 rounded-xl border text-sm flex items-center gap-2 " + (isDark ? "border-slate-800 hover:bg-slate-900" : "border-slate-200 hover:bg-slate-50")}
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
            >
              {isDark ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="pt-4">
          <h1 className="text-5xl font-extrabold tracking-tight">Build. Test. Deploy.</h1>
          <p className="mt-5 text-lg opacity-80 max-w-xl">
            Enter a loan application, or generate random data, then run a quick <span className="font-semibold">approve / reject</span> check
            using your deployed Logistic Regression model.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className={"px-5 py-3 rounded-2xl " + btn2} onClick={randomize}>🎲 Random data</button>
            <button className={"px-5 py-3 rounded-2xl " + btn} onClick={submit} disabled={loading}>
              {loading ? "Running..." : "Check application"}
            </button>
          </div>

          {result && (
            <div className="mt-8 flex items-center gap-3">
              <span className={"px-3 py-1 rounded-full border text-sm font-semibold " + (result.approve ? badgeGood : badgeBad)}>
                {result.approve ? "APPROVE" : "REJECT"}
              </span>
              <span className="opacity-80">
                Default probability: <span className="font-semibold">{Number(result.default_probability).toFixed(4)}</span>
              </span>
            </div>
          )}

          {error && (
            <div className={"mt-6 px-4 py-3 rounded-2xl border " + badgeBad}>
              <div className="font-semibold">Error</div>
              <div className="text-sm mt-1 break-words">{error}</div>
              <div className="text-xs mt-2 opacity-80">
                Optional: set <code className="font-mono">BACKEND_API_URL</code> in Railway Variables (otherwise uses default).
              </div>
            </div>
          )}
        </div>

        <div className={"rounded-3xl border p-6 shadow-sm " + card}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Application input</div>
              <div className="text-sm opacity-70">All fields required</div>
            </div>
            {result && (
              <span className={"px-3 py-1 rounded-full border text-sm font-semibold " + (result.approve ? badgeGood : badgeBad)}>
                {result.approve ? "APPROVE" : "REJECT"}
              </span>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Age (25-65)">
              <input className={cls(input)} type="number" value={form.age}
                onChange={(e)=>updateField('age', clamp(Number(e.target.value||0), 25, 65))} />
            </Field>

            <Field label="Employment years">
              <input className={cls(input)} type="number" value={form.employment_years}
                onChange={(e)=>updateField('employment_years', clamp(Number(e.target.value||0), 0, 60))} />
            </Field>

            <Field label="Marital status">
              <select className={cls(input)} value={form.Marital_Status}
                onChange={(e)=>updateField('Marital_Status', e.target.value)}>
                <option>Married</option>
                <option>Single</option>
              </select>
            </Field>

            <Field label="Residential status">
              <select className={cls(input)} value={form.Residential_Status}
                onChange={(e)=>updateField('Residential_Status', e.target.value)}>
                <option>Own</option>
                <option>Rent</option>
              </select>
            </Field>

            <Field label="Monthly income (3k-15k)">
              <input className={cls(input)} type="number" value={form.monthly_income}
                onChange={(e)=>updateField('monthly_income', clamp(Number(e.target.value||0), 0, 100000))} />
            </Field>

            <Field label="Credit score">
              <input className={cls(input)} type="number" value={form.credit_score}
                onChange={(e)=>updateField('credit_score', clamp(Number(e.target.value||0), 300, 900))} />
            </Field>

            <Field label="Loan amount">
              <input className={cls(input)} type="number" value={form.loan_amount}
                onChange={(e)=>updateField('loan_amount', clamp(Number(e.target.value||0), 0, 100000000))} />
            </Field>

            <Field label="Loan term (months)">
              <input className={cls(input)} type="number" value={form.loan_term}
                onChange={(e)=>updateField('loan_term', clamp(Number(e.target.value||0), 1, 480))} />
            </Field>

            <Field label="Interest rate (2% - 12%)">
              <input className={cls(input)} type="number" step="0.01" value={form.Interest_Rate}
                onChange={(e)=>updateField('Interest_Rate', clamp(Number(e.target.value||0), 0, 100))} />
            </Field>

            <Field label="Monthly debt (auto)">
              <input className={cls(input)} type="number" value={computedMonthlyDebt} readOnly />
            </Field>
          </div>
        </div>
      </div>
    </div>
  )
}

function cls(base) {
  return base + " w-full px-4 py-3 rounded-2xl border outline-none focus:ring-2 focus:ring-indigo-500/40"
}

function Field({ label, children }) {
  return (
    <div>
      <div className="text-sm font-medium mb-2">{label}</div>
      {children}
    </div>
  )
}

function StatCard({ title, value, dark }) {
  return (
    <div className={(dark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200") + " rounded-2xl border p-4"}>
      <div className="text-xs opacity-70">{title}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  )
}
