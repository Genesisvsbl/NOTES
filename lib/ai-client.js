/* Cliente de IA de NotesGene.
 * Habla con /api/ia (el servidor guarda la API key; el navegador nunca la ve).
 * Expone la misma forma que usa el motor:
 *    ai(prompt, {images}) -> {text}
 *    ai.json(prompt)      -> objeto ya parseado
 */
function parseJSON(text) {
  const t = String(text || "").trim();
  try { return JSON.parse(t); } catch (e) {}
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) { try { return JSON.parse(fence[1]); } catch (e) {} }
  const a = t.search(/[[{]/), b = Math.max(t.lastIndexOf("}"), t.lastIndexOf("]"));
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e) {} }
  const err = new Error("La IA no devolvió JSON"); err.code = "invalid_json"; err.text = t;
  throw err;
}

function blobToBase64(blob) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(String(fr.result).split(",")[1]);
    fr.onerror = rej;
    fr.readAsDataURL(blob);
  });
}

export function createAI(sb) {
  async function ask(prompt, o = {}) {
    const { data } = await sb.auth.getSession();
    const token = data?.session?.access_token;
    if (!token) { const e = new Error("sin sesión"); e.code = "session_expired"; throw e; }

    let image = null, mediaType = null;
    const img = Array.isArray(o.images) ? o.images[0] : o.images;
    if (img) {
      image = await blobToBase64(img);
      mediaType = img.type || "image/jpeg";
    }

    const r = await fetch("/api/ia", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer " + token },
      body: JSON.stringify({ prompt, image, mediaType, tier: o.modelTier || "default" }),
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) {
      const e = new Error(
        body.message ||
          (r.status === 504 || r.status === 408
            ? "el servidor tardó demasiado (HTTP " + r.status + "). Vuelve a intentar."
            : "el servidor respondió HTTP " + r.status + " sin detalle")
      );
      e.code = body.code || (r.status === 429 ? "rate_limited" : "upstream_error");
      throw e;
    }
    return { text: body.text || "", truncated: !!body.truncated };
  }

  const ai = (prompt, o) => ask(prompt, o);
  ai.json = async (prompt, o) => parseJSON((await ask(prompt, o)).text);
  ai.limits = async () => ({ maxPromptBytes: 65536, images: { maxCount: 1, mediaTypes: ["image/jpeg", "image/png"] } });
  return ai;
}
