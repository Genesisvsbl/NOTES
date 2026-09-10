"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { createStore } from "@/lib/store-supabase";
import { createAI } from "@/lib/ai-client";

/* Entras con tu correo (o con un usuario corto, si configuras un dominio propio)
 * y una contraseña. La primera vez la cuenta se crea sola.
 *
 * Supabase exige que el dominio del correo exista de verdad, así que un
 * "gene@inventado.app" lo rechaza. Si tienes dominio propio, ponlo en
 * NEXT_PUBLIC_AUTH_DOMAIN y entonces sí puedes entrar escribiendo solo "gene".  */
const DOMINIO = (process.env.NEXT_PUBLIC_AUTH_DOMAIN || "").trim();

function aCorreo(u) {
  const s = u.trim().toLowerCase();
  if (s.includes("@")) return s;
  if (DOMINIO) return s.replace(/[^a-z0-9._-]/g, "") + "@" + DOMINIO;
  return "";
}

function Logo() {
  return (
    <span className="brand">
      <svg viewBox="0 0 120 120" role="img" aria-label="NotesGene">
        <rect className="plate" x="0" y="0" width="120" height="120" rx="27" />
        <path className="gg" d="M86.05 38.14A34 34 0 1 0 94 60" />
        <path className="gg" d="M62 60H94" />
      </svg>
    </span>
  );
}

export default function NotesGeneApp() {
  const host = useRef(null);
  const mounted = useRef(false);
  const [session, setSession] = useState(undefined); // undefined = cargando
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session || !host.current || mounted.current) return;
    mounted.current = true;
    import("@/lib/engine.js").then(({ mountNotesGene }) => {
      mountNotesGene(host.current, {
        store: createStore(supabase, session.user.id),
        ai: createAI(supabase),
      });
    });
  }, [session]);

  async function entrar(e) {
    e.preventDefault();
    setErr(""); setMsg(""); setBusy(true);
    const email = aCorreo(user);
    if (!user.trim()) { setErr("Escribe tu usuario."); setBusy(false); return; }
    if (!email) {
      setErr("Escribe tu correo completo (ej: tucorreo@gmail.com). Supabase exige un dominio real.");
      setBusy(false); return;
    }
    if (pass.length < 6) { setErr("La contraseña necesita al menos 6 caracteres."); setBusy(false); return; }

    let { error } = await supabase.auth.signInWithPassword({ email, password: pass });

    if (error) {
      /* usuario nuevo: se crea y entra de una */
      const up = await supabase.auth.signUp({ email, password: pass });
      if (up.error) {
        setErr(
          /already|registered/i.test(up.error.message)
            ? "Ese usuario existe pero la contraseña no coincide."
            : up.error.message
        );
      } else if (!up.data.session) {
        setMsg(
          "Cuenta creada, pero Supabase está pidiendo confirmación por correo. " +
            "Entra a Supabase → Authentication → Providers → Email y desactiva «Confirm email»."
        );
      }
    }
    setBusy(false);
  }

  if (session === undefined)
    return <div className="gate"><div className="gate-card"><Logo /></div></div>;

  if (!session)
    return (
      <div className="gate">
        <div className="gate-card">
          <Logo />
          <span className="gate-mark">Notes<em>Gene</em></span>
          <p className="gate-quiet">
            Entra con tu correo y una contraseña. La primera vez queda creada la cuenta,
            y en este dispositivo no te la vuelve a pedir.
          </p>
          <form onSubmit={entrar} className="gate-form">
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="tu correo"
              autoCapitalize="none"
              autoCorrect="off"
              aria-label="Usuario o correo"
            />
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="contraseña"
              aria-label="Contraseña"
            />
            <button type="submit" disabled={busy}>{busy ? "Entrando…" : "Entrar"}</button>
          </form>
          {err && <p className="gate-err">{err}</p>}
          {msg && <p className="gate-ok">{msg}</p>}
        </div>
      </div>
    );

  return <div ref={host} className="ng-host" />;
}
