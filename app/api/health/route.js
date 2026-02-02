const DEFAULT_BACKEND = "https://aida-sos-loan-prediction-api.up.railway.app";

export async function GET() {
  try {
    const backend = process.env.BACKEND_API_URL || DEFAULT_BACKEND;
    const url = backend.replace(/\/$/, "") + "/health";

    const resp = await fetch(url, { method: "GET" });
    const text = await resp.text();
    return new Response(text, {
      status: resp.status,
      headers: { "Content-Type": resp.headers.get("content-type") || "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", error: String(err?.message || err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
