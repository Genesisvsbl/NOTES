"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { createStore } from "@/lib/store-supabase";
import { createAI } from "@/lib/ai-client";

/* Entras con USUARIO (ej: gene) y contraseña.
 * Supabase por dentro trabaja con correos, así que el usuario se convierte en
 * "<usuario>@notesgene.app". Nunca lo escribes tú.
 * La primera vez que entras con un usuario nuevo, la cuenta se crea sola.       */
const DOMINIO = "notesgene.app";
const aCorreo = (u) =>
  u.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "") + "@" + DOMINIO;

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
            Entra con tu usuario. La primera vez queda creado con la contraseña que pongas,
            y en este dispositivo no te lo vuelve a pedir.
          </p>
          <form onSubmit={entrar} className="gate-form">
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="usuario"
              autoCapitalize="none"
              autoCorrect="off"
              aria-label="Usuario"
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
