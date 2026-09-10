import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";

function bad(code, message, status) {
  return Response.json({ code, message }, { status: status || 400 });
}

export async function POST(req) {
  if (!process.env.ANTHROPIC_API_KEY) return bad("not_granted", "Falta ANTHROPIC_API_KEY en el servidor", 500);

  /* solo usuarios con sesión: la API key es tuya, no la dejamos abierta */
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return bad("session_expired", "Falta la sesión", 401);
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data: u, error } = await sb.auth.getUser(token);
  if (error || !u?.user) return bad("session_expired", "Sesión no válida", 401);

  const { prompt, image, mediaType, tier } = await req.json().catch(() => ({}));
  if (!prompt || typeof prompt !== "string") return bad("invalid_request", "Falta el prompt");

  const content = [];
  if (image) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: mediaType || "image/jpeg", data: image },
    });
  }
  content.push({ type: "text", text: prompt.slice(0, 60000) });

  let r;
  try {
    r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: tier === "quick" ? 1024 : 3000,
        messages: [{ role: "user", content }],
      }),
    });
  } catch (e) {
    return bad("upstream_error", "No se pudo contactar la IA", 502);
  }

  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    const code = r.status === 429 ? "rate_limited" : r.status === 401 ? "not_granted" : "upstream_error";
    return bad(code, body?.error?.message || "Error de la IA", r.status);
  }

  const text = (body.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
  return Response.json({ text, truncated: body.stop_reason === "max_tokens" });
}
