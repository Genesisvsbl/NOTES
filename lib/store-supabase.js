/* Almacenamiento de NotesGene en Supabase.
 * Misma interfaz que espera lib/engine.js.
 *
 * Tablas: notebooks, pages, images  (ver supabase/schema.sql)
 * Los items de cada página van en pages.items (jsonb), así que no hace falta
 * partirlos en trozos como en la versión artifact.
 */
import { encItem, decItem } from "./codec.js";

export function createStore(sb, userId) {
  const own = { user_id: userId };

  return {
    mode: "db",

    async listNotebooks() {
      const { data, error } = await sb
        .from("notebooks")
        .select("id,name,updated_at,pages,step_n")
        .order("updated_at", { ascending: false })
        .limit(300);
      if (error) throw error;
      return (data || []).map((r) => ({
        id: r.id, name: r.name, updatedAt: Number(r.updated_at) || 0,
        pages: r.pages || 1, stepN: r.step_n || 0,
      }));
    },

    async putNotebook(nb) {
      const { error } = await sb.from("notebooks").upsert({
        id: nb.id, ...own, name: nb.name,
        updated_at: nb.updatedAt || Date.now(),
        pages: nb.pages || 1, step_n: nb.stepN || 0,
      });
      if (error) throw error;
    },

    async delNotebook(id) {
      const { error } = await sb.from("notebooks").delete().eq("id", id);
      if (error) throw error;
    },

    async listPages(nbId) {
      const { data, error } = await sb
        .from("pages")
        .select("id,idx,tpl,bg,hoja")
        .eq("notebook_id", nbId)
        .order("idx", { ascending: true })
        .limit(500);
      if (error) throw error;
      return (data || []).map((r) => ({ id: r.id, i: r.idx, tpl: r.tpl, nc: 1, bg: r.bg || "", hoja: r.hoja || "a4-v" }));
    },

    async putPage(nbId, pg) {
      /* no toca items: solo la metadata de la página */
      const { error } = await sb.from("pages").upsert({
        id: pg.id, notebook_id: nbId, ...own,
        idx: pg.i, tpl: pg.tpl, bg: pg.bg || "", hoja: pg.hoja || "a4-v",
      });
      if (error) throw error;
    },

    async delPage(nbId, pg) {
      const { error } = await sb.from("pages").delete().eq("id", pg.id);
      if (error) throw error;
    },

    async getItems(nbId, pg) {
      const { data, error } = await sb.from("pages").select("items").eq("id", pg.id).maybeSingle();
      if (error) throw error;
      return ((data && data.items) || []).map(decItem);
    },

    async putItems(nbId, pg, items) {
      const { error } = await sb.from("pages").upsert({
        id: pg.id, notebook_id: nbId, ...own,
        idx: pg.i, tpl: pg.tpl, bg: pg.bg || "", hoja: pg.hoja || "a4-v",
        items: items.map(encItem),
      });
      if (error) throw error;
      return 1;
    },

    async putImg(nbId, id, dataUrl) {
      const { error } = await sb.from("images").upsert({ id, notebook_id: nbId, ...own, data: dataUrl });
      if (error) throw error;
    },

    async getImg(nbId, id) {
      const { data, error } = await sb.from("images").select("data").eq("id", id).maybeSingle();
      if (error) throw error;
      return (data && data.data) || "";
    },

    async delImg(nbId, id) {
      await sb.from("images").delete().eq("id", id);
    },
  };
}
