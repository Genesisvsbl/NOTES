import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const maxDuration = 60;

/* ============================================================
 * IA de NotesGene · una sola puerta, tres proveedores.
 * Orden: Gemini (gratis) → OpenAI → Anthropic. Si el primero está
 * saturado, pasa al siguiente que tenga llave. Con una basta.
 *
 *   GEMINI_API_KEY     aistudio.google.com/apikey     GRATIS, con imágenes
 *   OPENAI_API_KEY     platform.openai.com/api-keys   de pago (NO es ChatGPT Plus)
 *   ANTHROPIC_API_KEY  console.anthropic.com          de pago
 * ============================================================ */
const GEMINI = process.env.GEMINI_API_KEY;
const OPENAI = process.env.OPENAI_API_KEY;
const ANTHROPIC = process.env.ANTHROPIC_API_KEY;

const MODELO_OPENAI = process.env.OPENAI_MODEL || "gpt-4o-mini";
const MODELO_ANTHROPIC = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";
const BASE_G = "https://generativelanguage.googleapis.com/v1beta";

const bad = (code, message, status) => Response.json({ code, message }, { status: status || 400 });
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const saturado = (s) => s === 503 || s === 429;

/* ---------- qué modelos tiene REALMENTE la llave de Gemini ---------- */
let cacheModelos = null;
function prioridad(n) {
  if (/2\.5-flash-lite|flash-lite/.test(n)) return 1;
  if (/2\.5-flash/.test(n)) return 0;
  if (/flash-latest/.test(n)) return 2;
  if (/flash/.test(n)) return 3;
  if (/pro/.test(n)) return 5;
  return 7;
}
async function modelosGemini() {
  if (cacheModelos) return cacheModelos;
  const preferido = (process.env.GEMINI_MODEL || "").trim();
  try {
    const r = await fetch(BASE_G + "/models?pageSize=100", { headers: { "x-goog-api-key": GEMINI } });
    const b = await r.json().catch(() => ({}));
    const lista = (b.models || [])
      .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent"))
      .map((m) => String(m.name || "").replace(/^models\//, ""))
      .filter((n) => n && !/embedding|aqa|imagen|veo|tts|native-audio|live|image-generation/.test(n))
      .sort((a, b2) => prioridad(a) - prioridad(b2) || a.localeCompare(b2));
    if (lista.length) {
      cacheModelos = preferido && lista.includes(preferido)
        ? [preferido, ...lista.filter((n) => n !== preferido)]
        : lista;
      return cacheModelos.slice(0, 5);
    }
  } catch (e) { /* sin lista: seguimos con los de siempre */ }
  return [preferido, "gemini-flash-latest", "gemini-2.5-flash-lite", "gemini-2.0-flash"]
    .filter((m, i, a) => m && a.indexOf(m) === i);
}

/* ---------- proveedores: {text} si sale bien, {err} si no ---------- */
async function porGemini({ texto, image, mediaType, maxTokens }) {
  const parts = [];
  if (image) parts.push({ inline_data: { mime_type: mediaType || "image/jpeg", data: image } });
  parts.push({ text: texto });
  const cuerpo = JSON.stringify({
    contents: [{ role: "user", parts }],
    generationConfig: { maxOutputTokens: maxTokens, temperature: 0.4 },
  });

  let ultimo = null;
  for (const modelo of await modelosGemini()) {
    for (const espera of [0, 1500]) {
      if (espera) await dormir(espera);
      const r = await fetch(BASE_G + "/models/" + modelo + ":generateContent", {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": GEMINI },
        body: cuerpo,
      });
      const b = await r.json().catch(() => ({}));
      if (r.ok) {
        const cand = (b.candidates || [])[0];
        const text = ((cand?.content?.parts) || []).map((p) => p.text || "").join("");
        if (text.trim()) return { text, truncated: cand?.finishReason === "MAX_TOKENS" };
        ultimo = { status: 502, msg: "sin texto (" + (cand?.finishReason || "?") + ")", modelo };
        break;
      }
      ultimo = { status: r.status, msg: b?.error?.message || "error " + r.status, modelo };
      if (!saturado(r.status)) break;
    }
    if (ultimo && !saturado(ultimo.status) && ultimo.status !== 404) break;
  }
  return { err: ultimo || { status: 502, msg: "sin respuesta", modelo: "?" } };
}

async function porOpenAI({ texto, image, mediaType, maxTokens }) {
  const content = [{ type: "text", text: texto }];
  if (image)
    content.push({
      type: "image_url",
      image_url: { url: "data:" + (mediaType || "image/jpeg") + ";base64," + image },
    });
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer " + OPENAI },
    body: JSON.stringify({
      model: MODELO_OPENAI,
      max_tokens: maxTokens,
      messages: [{ role: "user", content }],
    }),
  });
  const b = await r.json().catch(() => ({}));
  if (!r.ok) return { err: { status: r.status, msg: b?.error?.message || "error " + r.status, modelo: MODELO_OPENAI } };
  const text = b?.choices?.[0]?.message?.content || "";
  if (!text.trim()) return { err: { status: 502, msg: "sin texto", modelo: MODELO_OPENAI } };
  return { text, truncated: b?.choices?.[0]?.finish_reason === "length" };
}

async function porAnthropic({ texto, image, mediaType, maxTokens }) {
  const content = [];
  if (image)
    content.push({ type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: image } });
  content.push({ type: "text", text: texto });
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": ANTHROPIC, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: MODELO_ANTHROPIC, max_tokens: maxTokens, messages: [{ role: "user", content }] }),
  });
  const b = await r.json().catch(() => ({}));
  if (!r.ok) return { err: { status: r.status, msg: b?.error?.message || "error " + r.status, modelo: MODELO_ANTHROPIC } };
  const text = (b.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
  if (!text.trim()) return { err: { status: 502, msg: "sin texto", modelo: MODELO_ANTHROPIC } };
  return { text, truncated: b.stop_reason === "max_tokens" };
}

export async function POST(req) {
  const cadena = [];
  if (GEMINI) cadena.push(porGemini);
  if (OPENAI) cadena.push(porOpenAI);
  if (ANTHROPIC) cadena.push(porAnthropic);
  if (!cadena.length)
    return bad("not_granted", "El servidor no tiene llave de IA: pon GEMINI_API_KEY (gratis), OPENAI_API_KEY o ANTHROPIC_API_KEY", 500);

  /* solo con sesión: las llaves son tuyas, no las dejamos abiertas a internet */
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return bad("session_expired", "Falta la sesión", 401);
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data: u, error } = await sb.auth.getUser(token);
  if (error || !u?.user) return bad("session_expired", "Sesión no válida", 401);

  const { prompt, image, mediaType, tier } = await req.json().catch(() => ({}));
  if (!prompt || typeof prompt !== "string") return bad("invalid_request", "Falta el prompt");
  const args = {
    texto: prompt.slice(0, 60000),
    image, mediaType,
    maxTokens: tier === "quick" ? 1024 : 3000,
  };

  let ultimo = null;
  for (const proveedor of cadena) {
    try {
      const r = await proveedor(args);
      if (r.text) return Response.json({ text: r.text, truncated: !!r.truncated });
      ultimo = r.err;
      /* si fue por saturación o falta de saldo, probamos el siguiente proveedor */
      if (!saturado(ultimo?.status) && ultimo?.status !== 402 && ultimo?.status !== 404) break;
    } catch (e) {
      ultimo = { status: 502, msg: e?.message || "error de red", modelo: "?" };
    }
  }

  const s = ultimo?.status;
  if (saturado(s))
    return bad("overloaded",
      "La IA gratuita está saturada en este momento. Espera medio minuto y vuelve a intentar.", 503);
  const code =
    s === 401 || s === 403 ? "not_granted" :
    s === 402 ? "not_granted" :
    s === 400 ? "invalid_request" : "upstream_error";
  return bad(code, (ultimo?.msg || "Error de la IA") + " [" + (ultimo?.modelo || "?") + "]", s || 502);
}
