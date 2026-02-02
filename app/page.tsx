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
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomMoney(min: number, max: number) {
  const val = Math.random() * (max - min) + min;
  return Math.round(val * 100) / 100;
}

export default function Page() {
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
    const income = randomMoney(2500, 12000);
    const debt = randomMoney(0, Math.floor(income * 0.7));
    setResult(null);
    setError(null);
    setForm({
      age: randomInt(20, 70),
      employment_years: randomInt(0, 25),
      monthly_income: income,
      credit_score: randomInt(520, 860),
      loan_amount: randomMoney(5000, 120000),
      loan_term: randomInt(12, 120),
      monthly_debt: debt,
    });
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setResult(await res.json());
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  const approve = result?.approved === 1;

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
          <div>
            <div className="text-base font-bold">Loan Decision</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Single-page UI • Next.js + Tailwind
            </div>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 pb-16 pt-10 lg:grid-cols-2 lg:gap-16 lg:pt-16">
        <section>
          <h1 className="text-5xl font-black tracking-tight">Build. Test. Deploy.</h1>
          <p className="mt-6 text-lg text-slate-600">
            Enter customer data and run a quick loan decision check.
          </p>
          <div className="mt-10 flex gap-3">
            <button onClick={submit} className="rounded-2xl bg-indigo-600 px-6 py-3 text-white font-bold">
              Check loan
            </button>
            <button onClick={randomize} className="rounded-2xl border px-6 py-3 font-bold">
              Random demo data
            </button>
          </div>
        </section>

        <section className="rounded-3xl border p-7">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Age" value={form.age} onChange={(v)=>onChange("age",v)} step={1} />
            <Field label="Employment years" value={form.employment_years} onChange={(v)=>onChange("employment_years",v)} step={1} />
            <Field label="Monthly income (CAD)" value={form.monthly_income} onChange={(v)=>onChange("monthly_income",v)} step={0.01} />
            <Field label="Credit score" value={form.credit_score} onChange={(v)=>onChange("credit_score",v)} step={1} />
            <Field label="Loan amount (CAD)" value={form.loan_amount} onChange={(v)=>onChange("loan_amount",v)} step={0.01} />
            <Field label="Loan term (months)" value={form.loan_term} onChange={(v)=>onChange("loan_term",v)} step={1} />
            <Field label="Monthly debt (CAD)" value={form.monthly_debt} onChange={(v)=>onChange("monthly_debt",v)} step={0.01} />
            <ReadOnly label="Debt-to-income ratio" value={dti.toFixed(2)} />
          </div>

          <div className="mt-6">
            {error && <div className="text-red-600">{error}</div>}
            {result && (
              <div className="rounded-xl border p-4 mt-4">
                <div className="font-bold">Decision</div>
                <div className={approve ? "text-green-600" : "text-red-600"}>
                  {approve ? "APPROVE (low risk)" : "REJECT (high risk)"}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, step }: any) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <input type="number" value={value} step={step} onChange={(e)=>onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-xl border px-3 py-2"/>
    </div>
  );
}

function ReadOnly({ label, value }: any) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <div className="mt-1 rounded-xl border px-3 py-2 bg-slate-50">{value}</div>
    </div>
  );
}
