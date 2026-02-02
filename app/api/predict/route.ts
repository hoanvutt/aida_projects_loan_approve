import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://aida-sos-loan-prediction-api.up.railway.app";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const upstream = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // no caching for demo
      cache: "no-store",
    });

    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Proxy error", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}
