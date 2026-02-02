'use client';

import { useMemo, useState } from "react";
import ThemeToggle from "./components/ThemeToggle";

type LoanInput = {
  age: number;
  employment_years: number;
  monthly_income: number;
  credit_score: number;
  loan_amount: number;
  loan_term: number;
  monthly_debt: number;
};

type PredictResponse = {
  approved: number;
  prob_default: number;
  default_prob_threshold?: number;
  derived?: { debt_to_income_ratio?: number };
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 0) {
  const val = Math.random() * (max - min) + min;
  const p = Math.pow(10, decimals);
  return Math.round(val * p) / p;
}

export default function Page() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://aida-sos-loan-prediction-api.up.railway.app";

  const [form, setForm] = useState<LoanInput>({
    age: 35,
    employment_years: 6,
    monthly_income: 5500,
    credit_score: 720,
    loan_amount: 35000,
    loan_term: 60,
    monthly_debt: 1200,
  });

  const dti = useMemo(() => {
    if (!form.monthly_income) return 0;
    return form.monthly_debt / form.monthly_income;
  }, [form.monthly_debt, form.monthly_income]);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onChange = (key: keyof LoanInput, value: number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const randomize = () => {
    const income = randomInt(2500, 12000);
    const debt = randomInt(0, Math.floor(income * 0.7));
    setResult(null);
    setError(null);
    setForm({
      age: randomInt(20, 70),
      employment_years: randomFloat(0, 25, 1),
      monthly_income: income,
      credit_score: randomInt(520, 860),
      loan_amount: randomInt(5000, 120000),
      loan_term: randomInt(12, 120),
      monthly_debt: debt,
    });
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    setResult(null);

    try {
      // IMPORTANT: call the local Next.js API route to avoid browser CORS issues.
      const res = await fetch(`/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }

      const data = (await res.json()) as PredictResponse;
      setResult(data);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  const approve = result?.approved === 1;
  const badge = approve ? "APPROVE" : "REJECT";
  const badgeStyles = approve
    ? "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:border-emerald-800"
    : "bg-rose-500/10 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:border-rose-900";

  const openDocs = () => window.open(`${API_BASE}/docs`, "_blank");

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
          <div>
            <div className="text-base font-bold">Loan Decision</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Single-page UI • Proxy API call (no CORS)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openDocs}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            API Docs
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 pb-16 pt-10 lg:grid-cols-2 lg:gap-16 lg:pt-16">
        {/* Left hero */}
        <section className="flex flex-col justify-center">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Build. Test. Deploy.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Enter customer data and run a quick loan decision check using your deployed model.
            Great for demos, QA, and building an API-driven workflow.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Checking..." : "Check loan"}
            </button>

            <button
              type="button"
              onClick={randomize}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Random demo data
            </button>
          </div>

          <div className="mt-8 space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Upstream API:</span>
              <span className="break-all">{API_BASE}</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
              The UI calls <span className="font-mono">/api/predict</span> (Next.js proxy) to avoid browser fetch issues.
            </div>
          </div>
        </section>

        {/* Right form card */}
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6">
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loan input</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">
              Customer profile
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Age" value={form.age} onChange={(v) => onChange("age", v)} step={1} min={18} max={100} />
            <Field label="Employment years" value={form.employment_years} onChange={(v) => onChange("employment_years", v)} step={0.1} min={0} max={60} />
            <Field label="Monthly income (CAD)" value={form.monthly_income} onChange={(v) => onChange("monthly_income", v)} step={50} min={0} />
            <Field label="Credit score" value={form.credit_score} onChange={(v) => onChange("credit_score", v)} step={1} min={300} max={900} />
            <Field label="Loan amount (CAD)" value={form.loan_amount} onChange={(v) => onChange("loan_amount", v)} step={100} min={0} />
            <Field label="Loan term (months)" value={form.loan_term} onChange={(v) => onChange("loan_term", v)} step={1} min={1} max={480} />
            <Field label="Monthly debt (CAD)" value={form.monthly_debt} onChange={(v) => onChange("monthly_debt", v)} step={50} min={0} />
            <ReadOnly label="Debt-to-income ratio" value={Number.isFinite(dti) ? dti.toFixed(2) : "0.00"} />
          </div>

          {/* Result */}
          <div className="mt-7">
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
                <div className="font-bold">Error</div>
                <div className="mt-1 break-words">{error}</div>
              </div>
            )}

            {result && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Prediction
                  </div>
                  <div className={`rounded-full border px-3 py-1 text-xs font-extrabold ${badgeStyles}`}>
                    {badge}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Metric label="prob_default" value={result.prob_default.toFixed(4)} />
                  <Metric label="DTI (derived)" value={String(result.derived?.debt_to_income_ratio ?? dti.toFixed(4))} />
                  <Metric
                    label="Decision"
                    value={approve ? "Approve (low risk)" : "Reject (high risk)"}
                  />
                </div>
              </div>
            )}

            {!error && !result && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
                Result will appear here after you run a prediction.
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-6 pb-10 text-xs text-slate-400">
        Tip: For demos, click <span className="font-semibold">Random demo data</span> then{" "}
        <span className="font-semibold">Check loan</span>.
      </footer>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  step,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step: number;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
      />
    </div>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <div className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100">
        {value}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 break-all text-sm font-extrabold text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}
