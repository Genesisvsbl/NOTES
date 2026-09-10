"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { createStore } from "@/lib/store-supabase";
import { createAI } from "@/lib/ai-client";

/* ENTRADA CON CLAVE
 * Solo escribes la clave (ej: 3026). El correo va fijo aquí dentro y la clave
 * se convierte en una contraseña larga, porque Supabase exige 6+ caracteres.
 *
 * El usuario se crea corriendo supabase/setup.sql en el SQL Editor.
 * Si cambias la clave, cambia también la del SQL (van juntas).                  */
const CORREO = process.env.NEXT_PUBLIC_LOGIN_EMAIL || "gene@notesgene.app";
const aClave = (c) => "NG-" + c.trim() + "-notesgene";

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
  const [clave, setClave] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [instalar, setInstalar] = useState(null);   // evento de instalación (Android/Chrome)
  const [comoIOS, setComoIOS] = useState(false);    // iPhone/iPad: se instala a mano

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});

    /* ---- instalar como app ---- */
    const yaInstalada =
      window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    const esIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (!yaInstalada && esIOS) setComoIOS(true);
    const onPrompt = (e) => { e.preventDefault(); if (!yaInstalada) setInstalar(e); };
    window.addEventListener("beforeinstallprompt", onPrompt);

    return () => {
      data.subscription.unsubscribe();
      window.removeEventListener("beforeinstallprompt", onPrompt);
    };
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
    setErr(""); setBusy(true);
    if (!clave.trim()) { setErr("Escribe tu clave."); setBusy(false); return; }

    const { error } = await supabase.auth.signInWithPassword({
      email: CORREO,
      password: aClave(clave),
    });

    if (error) {
      setErr(
        /invalid/i.test(error.message)
          ? "Clave incorrecta."
          : "No se pudo entrar: " + error.message
      );
      setClave("");
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
          <p className="gate-quiet">Escribe tu clave para abrir tus cuadernos.</p>
          <form onSubmit={entrar} className="gate-form">
            <input
              type="password"
              inputMode="numeric"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="clave"
              autoFocus
              autoComplete="current-password"
              aria-label="Clave"
            />
            <button type="submit" disabled={busy}>{busy ? "Abriendo…" : "Entrar"}</button>
          </form>
          {err && <p className="gate-err">{err}</p>}

          {instalar && (
            <button
              className="gate-install"
              onClick={async () => { instalar.prompt(); setInstalar(null); }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3v12M8 11l4 4 4-4M4 20h16" />
              </svg>
              Instalar NotesGene en este teléfono
            </button>
          )}
          {comoIOS && !instalar && (
            <p className="gate-tip">
              Para tenerla como app en el iPhone o iPad: botón <b>Compartir</b> de Safari →
              <b> Añadir a pantalla de inicio</b>. Queda con su ícono y abre a pantalla completa.
            </p>
          )}
        </div>
      </div>
    );

  return <div ref={host} className="ng-host" />;
}
