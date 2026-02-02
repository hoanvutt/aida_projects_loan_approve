const DEFAULT_BACKEND = "https://aida-sos-loan-prediction-api.up.railway.app";

export async function POST(request) {
  try {
    const backend = process.env.BACKEND_API_URL || DEFAULT_BACKEND;
    const payload = await request.json();
    const url = backend.replace(/\/$/, "") + "/predict";

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await resp.text();
    return new Response(text, {
      status: resp.status,
      headers: { "Content-Type": resp.headers.get("content-type") || "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err?.message || err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
