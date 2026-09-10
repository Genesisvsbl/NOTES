import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const maxDuration = 60;

/* Funciona con cualquiera de las dos llaves. Si pones las dos, manda Gemini.
 *   GEMINI_API_KEY     → aistudio.google.com/apikey  (tiene capa GRATIS con imágenes)
 *   ANTHROPIC_API_KEY  → console.anthropic.com       (de pago, con saldo)                */
const GEMINI = process.env.GEMINI_API_KEY;
const ANTHROPIC = process.env.ANTHROPIC_API_KEY;
const MODELO_GEMINI = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const MODELO_ANTHROPIC = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";

function bad(code, message, status) {
  return Response.json({ code, message }, { status: status || 400 });
}

export async function POST(req) {
  if (!GEMINI && !ANTHROPIC)
    return bad("not_granted", "El servidor no tiene llave de IA: pon GEMINI_API_KEY (gratis) o ANTHROPIC_API_KEY", 500);

  /* solo con sesión: la llave es tuya, no la dejamos abierta a internet */
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return bad("session_expired", "Falta la sesión", 401);
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data: u, error } = await sb.auth.getUser(token);
  if (error || !u?.user) return bad("session_expired", "Sesión no válida", 401);

  const { prompt, image, mediaType, tier } = await req.json().catch(() => ({}));
  if (!prompt || typeof prompt !== "string") return bad("invalid_request", "Falta el prompt");
  const texto = prompt.slice(0, 60000);
  const maxTokens = tier === "quick" ? 1024 : 3000;

  try {
    if (GEMINI) {
      const parts = [];
      if (image) parts.push({ inline_data: { mime_type: mediaType || "image/jpeg", data: image } });
      parts.push({ text: texto });

      const r = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/" +
          MODELO_GEMINI + ":generateContent?key=" + GEMINI,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts }],
            generationConfig: { maxOutputTokens: maxTokens, temperature: 0.4 },
          }),
        }
      );
      const body = await r.json().catch(() => ({}));
      if (!r.ok) {
        const code =
          r.status === 429 ? "rate_limited" :
          r.status === 400 || r.status === 403 ? "not_granted" : "upstream_error";
        return bad(code, body?.error?.message || "Error de la IA", r.status);
      }
      const cand = (body.candidates || [])[0];
      const text = ((cand?.content?.parts) || []).map((p) => p.text || "").join("");
      if (!text.trim()) return bad("empty_completion", "La IA no devolvió texto", 502);
      return Response.json({ text, truncated: cand?.finishReason === "MAX_TOKENS" });
    }

    /* ---- Anthropic ---- */
    const content = [];
    if (image)
      content.push({
        type: "image",
        source: { type: "base64", media_type: mediaType || "image/jpeg", data: image },
      });
    content.push({ type: "text", text: texto });

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODELO_ANTHROPIC,
        max_tokens: maxTokens,
        messages: [{ role: "user", content }],
      }),
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) {
      const code = r.status === 429 ? "rate_limited" : r.status === 401 ? "not_granted" : "upstream_error";
      return bad(code, body?.error?.message || "Error de la IA", r.status);
    }
    const text = (body.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
    if (!text.trim()) return bad("empty_completion", "La IA no devolvió texto", 502);
    return Response.json({ text, truncated: body.stop_reason === "max_tokens" });
  } catch (e) {
    return bad("upstream_error", "No se pudo contactar la IA", 502);
  }
}
