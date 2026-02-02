
'use client'
import { useState } from 'react'

export default function Home() {
  const [form, setForm] = useState({
    age: 35,
    Marital_Status: 'Married',
    Residential_Status: 'Own',
    employment_years: 5,
    monthly_income: 5000,
    credit_score: 700,
    loan_amount: 25000,
    loan_term: 60,
    Interest_Rate: 8,
    monthly_debt: 0
  })
  const [result, setResult] = useState(null)

  function calcMonthlyDebt(loan_amount, loan_term, rate) {
    const r = rate / 100 / 12
    return Math.round((loan_amount * r) / (1 - Math.pow(1 + r, -loan_term)))
  }

  function randomize() {
    const loan_amount = Math.floor(Math.random() * 40000) + 10000
    const loan_term = [36, 48, 60, 72][Math.floor(Math.random()*4)]
    const rate = +(Math.random()*10 + 2).toFixed(2)
    const monthly_debt = calcMonthlyDebt(loan_amount, loan_term, rate)

    setForm({
      age: Math.floor(Math.random()*40)+25,
      Marital_Status: Math.random()>0.5?'Married':'Single',
      Residential_Status: Math.random()>0.5?'Own':'Rent',
      employment_years: Math.floor(Math.random()*20),
      monthly_income: Math.floor(Math.random()*7000)+3000,
      credit_score: Math.floor(Math.random()*300)+550,
      loan_amount,
      loan_term,
      Interest_Rate: rate,
      monthly_debt
    })
  }

  async function submit() {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/predict', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form)
    })
    setResult(await res.json())
  }

  return (
    <div style={{fontFamily:'Arial', padding:40, maxWidth:900, margin:'auto'}}>
      <h1 style={{fontSize:36, fontWeight:700}}>Loan Approval – Test UI</h1>
      <p>Random data + manual testing for Logistic Regression model</p>

      <button onClick={randomize} style={{margin:'10px 10px 20px 0'}}>🎲 Random data</button>
      <button onClick={submit}>🚀 Test model</button>

      <pre style={{background:'#f5f5f5', padding:20, marginTop:20}}>
        {JSON.stringify(form, null, 2)}
      </pre>

      {result && (
        <pre style={{background:'#e8f5e9', padding:20, marginTop:20}}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
