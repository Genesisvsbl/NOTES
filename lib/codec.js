/* Codificación compacta de los objetos de la hoja. */
export function encItem(s){
  if (s.t === "p" || s.t === "hl"){
    let d = "";
    for (let i = 0; i < s.pts.length; i += 3)
      d += (i ? ";" : "") + Math.round(s.pts[i]) + "," + Math.round(s.pts[i+1]) + "," + Math.round(s.pts[i+2]);
    return {t:s.t, c:s.c, w:s.w, d:d};
  }
  const o = {}; for (const k in s) if (k[0] !== "_") o[k] = s[k];
  o.x = Math.round(o.x || 0); o.y = Math.round(o.y || 0);
  /* la lista guarda solo texto y estado, no las coordenadas de la casilla */
  if (o.t === "chk" && Array.isArray(o.items))
    o.items = o.items.map(it => ({t:it.t, ok:!!it.ok}));
  return o;
}
export function decItem(o){
  if (o.t === "p" || o.t === "hl"){
    const pts = [];
    if (o.d) for (const p of o.d.split(";")){ const a = p.split(","); pts.push(+a[0], +a[1], +a[2]); }
    return {t:o.t, c:o.c, w:o.w, pts:pts};
  }
  const s = Object.assign({}, o);
  if (s.t === "t" && s.txt == null) s.txt = s.d || "";
  return s;
}

