import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const maxDuration = 60;

/* Llaves. Si pones las dos, manda Gemini.
 *   GEMINI_API_KEY     → aistudio.google.com/apikey  (capa GRATIS, con imágenes)
 *   ANTHROPIC_API_KEY  → console.anthropic.com       (de pago, con saldo)          */
const GEMINI = process.env.GEMINI_API_KEY;
const ANTHROPIC = process.env.ANTHROPIC_API_KEY;
const MODELO_ANTHROPIC = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";
const BASE = "https://generativelanguage.googleapis.com/v1beta";

function bad(code, message, status) {
  return Response.json({ code, message }, { status: status || 400 });
}
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---- qué modelos tiene REALMENTE esta llave ---------------------------- */
let cacheModelos = null;

function prioridad(n) {
  if (/flash-lite/.test(n)) return 3;
  if (/2\.5-flash/.test(n)) return 0;
  if (/flash-latest/.test(n)) return 1;
  if (/flash/.test(n)) return 2;
  if (/pro/.test(n)) return 4;
  return 6;
}

async function modelosDisponibles() {
  if (cacheModelos) return cacheModelos;
  const preferido = (process.env.GEMINI_MODEL || "").trim();
  try {
    const r = await fetch(BASE + "/models?pageSize=100", { headers: { "x-goog-api-key": GEMINI } });
    const b = await r.json().catch(() => ({}));
    const lista = (b.models || [])
      .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent"))
      .map((m) => String(m.name || "").replace(/^models\//, ""))
      .filter((n) => n && !/embedding|aqa|imagen|veo|tts|native-audio|live|image-generation/.test(n))
      .sort((a, b2) => prioridad(a) - prioridad(b2) || a.localeCompare(b2));
    if (lista.length) {
      /* el que pusiste en Vercel va primero, si de verdad existe */
      cacheModelos = preferido && lista.includes(preferido)
        ? [preferido, ...lista.filter((n) => n !== preferido)]
        : lista;
      return cacheModelos.slice(0, 6);
    }
  } catch (e) { /* si no se puede listar, seguimos con los de siempre */ }
  return [preferido, "gemini-flash-latest", "gemini-2.5-flash", "gemini-2.0-flash"]
    .filter((m, i, a) => m && a.indexOf(m) === i);
}

export async function POST(req) {
  if (!GEMINI && !ANTHROPIC)
    return bad("not_granted", "El servidor no tiene llave de IA: pon GEMINI_API_KEY o ANTHROPIC_API_KEY", 500);

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
      const cuerpo = JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.4 },
      });

      const modelos = await modelosDisponibles();
      const esperas = [0, 1500, 4000];   // reintentos cuando está saturado
      let ultimo = null;

      for (const modelo of modelos) {
        for (let intento = 0; intento < esperas.length; intento++) {
          if (esperas[intento]) await dormir(esperas[intento]);

          const r = await fetch(BASE + "/models/" + modelo + ":generateContent", {
            method: "POST",
            headers: { "content-type": "application/json", "x-goog-api-key": GEMINI },
            body: cuerpo,
          });
          const body = await r.json().catch(() => ({}));

          if (r.ok) {
            const cand = (body.candidates || [])[0];
            const text = ((cand?.content?.parts) || []).map((p) => p.text || "").join("");
            if (!text.trim())
              return bad("empty_completion", "La IA no devolvió texto (" + (cand?.finishReason || "sin razón") + ")", 502);
            return Response.json({ text, truncated: cand?.finishReason === "MAX_TOKENS" });
          }

          ultimo = { status: r.status, msg: body?.error?.message || "error " + r.status, modelo };
          if (r.status === 503 || r.status === 429) continue;   // saturado: reintentar
          break;                                                // otro error: cambiar de modelo
        }
        if (ultimo && ultimo.status !== 503 && ultimo.status !== 429 && ultimo.status !== 404) break;
      }

      const s = ultimo?.status;
      if (s === 503)
        return bad("overloaded", "Los modelos gratuitos están saturados ahora mismo. Espera medio minuto y vuelve a intentar.", 503);
      const code =
        s === 429 ? "rate_limited" :
        s === 401 || s === 403 ? "not_granted" :
        s === 400 ? "invalid_request" : "upstream_error";
      return bad(code, (ultimo?.msg || "Error de la IA") + " [modelo: " + (ultimo?.modelo || "?") + "]", s || 502);
    }

    /* ---- Anthropic ---- */
    const content = [];
    if (image)
      content.push({ type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: image } });
    content.push({ type: "text", text: texto });

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: MODELO_ANTHROPIC, max_tokens: maxTokens, messages: [{ role: "user", content }] }),
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
    return bad("upstream_error", "No se pudo contactar la IA: " + (e?.message || "error de red"), 502);
  }
}
