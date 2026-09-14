/* NotesGene — motor de la hoja (canvas, herramientas, paneles). */
import { encItem, decItem } from "./codec.js";

const MARKUP = `

<!-- ============================ PORTADA ============================ -->
<section id="home">
  <div class="hero">
    <span class="brand">
      <svg viewBox="0 0 120 120" role="img" aria-label="NotesGene">
        <rect class="plate" x="0" y="0" width="120" height="120" rx="27"/>
        <path class="gg" d="M86.05 38.14A34 34 0 1 0 94 60"/>
        <path class="gg" d="M62 60H94"/>
      </svg>
    </span>
    <span class="mark">Notes<span class="g">Gene</span></span>
    <svg class="underline" viewBox="0 0 600 26" aria-hidden="true"><path d="M4 18C90 8 180 22 268 13S446 4 596 15"/></svg>
    <p class="tagline"><b>Escribe a mano. Habla.</b> <span>Y la nota se arma sola: tablas, cuadros comparativos, mapas mentales y mapas de proceso.</span></p>
    <div class="hero-cta">
      <button class="btn primary" id="newNb">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        Nuevo cuaderno
      </button>
      <button class="btn" id="verCuadernos">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3" y="4" width="11" height="16" rx="1.5"/><path d="M17 6v14M21 8v10"/></svg>
        Mis cuadernos <em class="cnt mono" id="homeCount"></em>
      </button>
      <button class="btn icon" id="libTheme" title="Cambiar tema">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
      </button>
    </div>
    <div class="caps">
      <span><i>·</i> Presión de lápiz</span><span><i>·</i> Dictado por voz</span>
      <span><i>·</i> Instructivos paso a paso con foto</span>
      <span><i>·</i> Transcribe tu letra</span><span><i>·</i> Tablas y comparativos</span>
      <span><i>·</i> Mapas mentales</span><span><i>·</i> Mapas de proceso</span>
      <span><i>·</i> PDF e imágenes de fondo</span><span><i>·</i> Tus tipos de letra</span>
    </div>
  </div>
</section>

<!-- ========================== TUS CUADERNOS ========================== -->
<section id="library" class="hide">
  <div class="bar">
    <button class="btn icon" id="homeBack" title="Volver a la portada">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>
    </button>
    <div class="libtitle">Tus cuadernos <em class="mono" id="nbCount"></em></div>
    <div class="grow"></div>
    <button class="btn primary" id="newNb2">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
      <span class="lbl-md">Nuevo</span>
    </button>
  </div>
  <div class="lib-body">
    <div class="lib-inner">
      <div class="grid" id="nbGrid"></div>
      <div class="storage-note" id="storeNote"><span class="dot"></span><span>Conectando…</span></div>
    </div>
  </div>
</section>

<!-- ============================ EDITOR ============================ -->
<section id="editor" class="hide">
  <div class="bar">
    <button class="btn icon" id="back" title="Volver">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>
    </button>
    <input class="nbname" id="nbName" aria-label="Nombre del cuaderno">
    <div class="pager">
      <button id="prevPg" title="Página anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg></button>
      <span id="pgLabel">1 / 1</span>
      <button id="nextPg" title="Página siguiente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></svg></button>
    </div>
    <div class="grow"></div>
    <button class="btn primary" id="studioBtn" title="Crear con voz o IA">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M18.5 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/></svg>
      <span class="lbl-md">Crear</span>
    </button>
    <button class="btn" id="instrBtn" title="Armar instructivo paso a paso">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h4M4 12h4M4 18h4"/><path d="M11 5h9M11 11h9M11 17h9"/></svg>
      <span class="lbl-md">Instructivo</span>
    </button>
    <button class="btn icon save" id="saveBtn" hidden></button>
    <button class="btn icon" id="undo" title="Deshacer (Ctrl+Z)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h10a5 5 0 0 1 0 10h-4"/><path d="M8 4L4 8l4 4"/></svg>
    </button>
    <button class="btn icon" id="redo" title="Rehacer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 8H10a5 5 0 0 0 0 10h4"/><path d="M16 4l4 4-4 4"/></svg>
    </button>
    <div class="pager">
      <button id="zoomOut" title="Alejar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6 12h12"/></svg></button>
      <span id="zoomLabel">100%</span>
      <button id="zoomIn" title="Acercar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M12 6v12M6 12h12"/></svg></button>
    </div>
    <button class="btn icon" id="stylus" title="Solo lápiz (rechazo de palma)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3l5 5L9 20l-6 1 1-6z"/><path d="M14 5l5 5"/></svg>
    </button>
    <button class="btn icon" id="moreBtn" title="Más">
      <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>
    </button>
    <button class="btn icon" id="drawerBtn" title="Páginas">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3" y="4" width="11" height="16" rx="1.5"/><path d="M17 6v14M21 8v10"/></svg>
    </button>
  </div>

  <div class="work">
    <div class="rail" id="rail">
      <button class="tool" data-tool="pen" aria-pressed="true" title="Pluma (1)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 2.5l5 5L8 21l-5.5 1.5L4 17z"/><path d="M14 5l5 5"/></svg></button>
      <button class="tool" data-tool="hl" title="Resaltador (2)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h6"/><path d="M13.5 3.5l7 7-7 7-5-5z"/></svg></button>
      <button class="tool" data-tool="eraser" title="Borrador (3)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20H4l-1.5-4L13 5.5l6 6L11 20z"/><path d="M9.5 9.5l6 6"/></svg></button>
      <button class="tool" data-tool="text" title="Texto (4)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M5 6h14M12 6v13M9 19h6"/></svg></button>
      <button class="tool" data-tool="lista" title="Lista de tareas (5)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="7" height="7" rx="1.6"/><path d="M4.6 7.4l1.6 1.6 2.6-3"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><path d="M13 7h8M13 18h8"/></svg></button>
      <button class="tool" data-tool="move" title="Mover objetos (6)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/></svg></button>
      <hr>
      <select class="fontsel hide" id="fontSel" title="Tipo de letra"></select>
      <div class="swatches" id="swatches"></div>
      <hr>
      <div class="sizes" id="sizes"></div>
    </div>

    <div class="scroll" id="scroll">
      <div class="sheet" id="sheet"><canvas id="pad"></canvas></div>
    </div>

    <aside class="drawer hide" id="drawer">
      <header><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/></svg> Páginas</header>
      <div class="thumbs" id="thumbs"></div>
      <footer><button class="btn" id="addPage">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg> Añadir</button></footer>
    </aside>

    <!-- ---------- panel Crear ---------- -->
    <aside class="studio hide" id="studio">
      <header>
        <h3>Crear</h3><div class="grow"></div>
        <button class="btn icon" id="studioClose" title="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </header>
      <div class="body">
        <div>
          <label class="lbl">1 · Dicta o escribe</label>
          <div class="microw" style="margin-top:8px">
            <button class="mic" id="mic" title="Hablar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5"/></svg>
            </button>
            <div class="mic-help" id="micHelp">Toca el micrófono y habla. Se escribe aquí en vivo.</div>
          </div>
          <textarea class="ta" id="transcript" style="margin-top:9px" placeholder="Ej: hazme un cuadro comparativo de los depósitos Ag22, Ag18, Ag17 y Ag16 con qué se maneja en cada uno…"></textarea>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button class="btn" id="readInk" style="flex:1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h12M3 18h15"/></svg>
              Leer mi letra
            </button>
            <button class="btn icon" id="clearT" title="Limpiar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>
        </div>

        <div>
          <label class="lbl">2 · Qué quieres que arme</label>
          <div class="chips" id="kinds" style="margin-top:8px"></div>
        </div>

        <div>
          <label class="lbl">3 · Estructura (editable)</label>
          <textarea class="ta code" id="struct" style="margin-top:8px" spellcheck="false"></textarea>
          <div class="syntax" id="syntax"></div>
          <div class="status" id="status"></div>
        </div>
      </div>
      <footer>
        <button class="btn primary" id="genBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/></svg>
          Generar con IA
        </button>
        <button class="btn" id="insBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
          <span id="insLbl">Insertar</span>
        </button>
      </footer>
    </aside>

    <!-- ---------- panel Instructivo ---------- -->
    <aside class="studio hide" id="instr">
      <header>
        <h3>Instructivo</h3>
        <span class="pill mono" id="stepCount">0 pasos</span>
        <div class="grow"></div>
        <button class="btn icon" id="instrClose" title="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </header>
      <div class="body">
        <div>
          <label class="lbl">Paso nuevo · di la descripción</label>
          <div class="microw" style="margin-top:8px">
            <button class="mic" id="imic" title="Dictar el paso">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5"/></svg>
            </button>
            <div class="mic-help" id="imicHelp">Dicta qué se hace en este paso. Se transcribe abajo.</div>
          </div>
          <input class="fld" id="stepTitle" style="margin-top:9px" placeholder="Título del paso (ej: ZMEB — crear pedido)">
          <textarea class="ta" id="stepText" style="margin-top:8px" placeholder="Descripción del paso…"></textarea>
        </div>
        <div>
          <label class="lbl">Foto o pantallazo</label>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button class="btn" id="stepPhoto" style="flex:1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 8.5A2 2 0 0 1 5 6.5h2l1.2-2h7.6L19 6.5h0a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.4"/></svg>
              Adjuntar
            </button>
            <button class="btn icon" id="stepPhotoX" title="Quitar foto">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>
          <div id="stepPrev" class="prev hide"><img alt="Vista previa de la foto del paso"></div>
        </div>
        <div>
          <div style="display:flex;gap:8px">
            <button class="btn" id="polish" style="flex:1" title="Corrige y redacta con las reglas de tu bodega: instantáneo y sin IA">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l7-7 3 3-7 7H4zM14 7l3-3 3 3-3 3z"/></svg>
              Redactar
            </button>
            <button class="btn" id="polishAI" style="flex:1" title="Reescritura con IA (más elaborada, tarda unos segundos)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/></svg>
              Con IA
            </button>
          </div>
          <div class="status" id="istatus" style="margin-top:8px"></div>
        </div>
        <div>
          <label class="lbl">Pasos de este cuaderno</label>
          <div id="steplist" class="steplist"></div>
        </div>
      </div>
      <footer>
        <button class="btn primary" id="addStep">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
          <span id="addStepLbl">Agregar paso</span>
        </button>
      </footer>
    </aside>
  </div>
</section>

`;

export function mountNotesGene(root, opts){
  root.innerHTML = MARKUP;


/* =================================================================== *
 *  Constantes
 * =================================================================== */
/* tamaño de hoja a 150 dpi: A4 y Carta, vertical y horizontal */
const HOJAS = {
  "a4-v":    [1240, 1754], "a4-h":    [1754, 1240],
  "carta-v": [1275, 1650], "carta-h": [1650, 1275]
};
const HOJA_PT = {
  "a4-v":    [595.28, 841.89], "a4-h":    [841.89, 595.28],
  "carta-v": [612, 792],       "carta-h": [792, 612]
};
const HOJA_NOMBRE = {"a4-v":"A4 vertical", "a4-h":"A4 horizontal",
  "carta-v":"Carta vertical", "carta-h":"Carta horizontal"};
let PW = 1240, PH = 1754;
function aplicarHoja(pg){
  const h = HOJAS[(pg && pg.hoja) || "a4-v"] || HOJAS["a4-v"];
  PW = h[0]; PH = h[1];
}
function zoomQueQuepa(){
  const anchoOk = ($("#scroll").clientWidth - 34) / PW;
  const altoOk  = ($("#scroll").clientHeight - 34) / PH;
  return Math.max(.18, Math.min(1, Math.min(anchoOk, altoOk * 1.35)));
}
const CHUNK = 24;
const LS_KEY = "notesgene.v1";
const COLORS = ["#14171B","#1F4E79","#B3261E","#1F7A4C","#8A5A00","#6B3FA0","#0F7B8A","#D4577A"];
const HL_COLORS = ["#F7E14A","#8BE58B","#7FD7F5","#FFAD6B","#F79FD6","#C9F24A","#14171B","#B3261E"];
const SIZES = [1.6, 3, 5.5, 9], HL_SIZES = [12, 20, 30, 44];
const TPLS = [["blank","Blanco"],["ruled","Rayado"],["grid","Cuadrícula"],["dots","Puntos"],["mm","Milimetrado"],["cornell","Cornell"]];
const FONTS = [
  ["IBM Plex Sans","Sans"], ["Caveat","Cursiva"], ["Kalam","Apunte"],
  ["Patrick Hand","Mano"], ["Indie Flower","Suelta"], ["Architects Daughter","Plano"],
  ["Shadows Into Light","Fina"], ["Permanent Marker","Marcador"],
  ["Lora","Serif"], ["IBM Plex Mono","Mono"]
];
const KINDS = [
  ["auto","Auto"], ["texto","Texto"], ["lista","Lista"], ["tabla","Tabla"],
  ["comparativo","Comparativo"], ["mapa","Mapa mental"], ["proceso","Proceso"]
];
const SYNTAX = {
  auto: "La IA elige el formato y escribe aquí la estructura.",
  texto: "Una línea por idea.\nSe inserta como bloque de texto.",
  lista: "# Título de la lista\nRevisar los sellos del carro\nx Ya hecho: con una x al inicio queda marcado\nLlamar a facturación",
  tabla: "Encabezado A | Encabezado B | Encabezado C\nfila 1 col A | fila 1 col B | fila 1 col C\nfila 2 col A | fila 2 col B | fila 2 col C",
  comparativo: "Criterio | Opción 1 | Opción 2\nCosto | alto | bajo\nTiempo | 2 h | 30 min",
  mapa: "Tema central\n  Rama 1\n    hoja\n    hoja\n  Rama 2\n    hoja",
  proceso: "Paso 1 :: nota corta\nPaso 2 :: nota corta\nPaso 3"
};

/* =================================================================== *
 *  Utilidades
 * =================================================================== */
const $ = s => root.querySelector(s);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
function toast(m, ms){ const t = document.createElement("div"); t.className = "toast"; t.textContent = m;
  document.body.appendChild(t); setTimeout(() => t.remove(), ms || 2800); }

/* diálogos propios, sin las ventanas del navegador */
function dialog(o){
  return new Promise(res => {
    const back = document.createElement("div");
    back.className = "modal-back";
    back.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true">' +
        '<h4></h4>' + (o.text ? '<p></p>' : '') +
        (o.input != null ? '<input class="fld" spellcheck="false">' : '') +
        '<div class="modal-btns">' +
          '<button class="btn" data-x></button>' +
          '<button class="btn ' + (o.danger ? 'danger' : 'primary') + '" data-ok></button>' +
        '</div></div>';
    back.querySelector("h4").textContent = o.title || "";
    if (o.text) back.querySelector("p").textContent = o.text;
    back.querySelector("[data-x]").textContent = o.cancel || "Cancelar";
    back.querySelector("[data-ok]").textContent = o.ok || "Aceptar";
    const inp = back.querySelector("input");
    if (inp) inp.value = o.input;
    document.body.appendChild(back);
    setTimeout(() => { if (inp){ inp.focus(); inp.select(); } else back.querySelector("[data-ok]").focus(); }, 20);
    const cerrar = v => { document.removeEventListener("keydown", tecla, true); back.remove(); res(v); };
    const tecla = e => {
      if (e.key === "Escape"){ e.preventDefault(); e.stopPropagation(); cerrar(null); }
      else if (e.key === "Enter"){ e.preventDefault(); e.stopPropagation(); cerrar(inp ? inp.value : true); }
    };
    document.addEventListener("keydown", tecla, true);
    back.querySelector("[data-x]").addEventListener("click", () => cerrar(null));
    back.querySelector("[data-ok]").addEventListener("click", () => cerrar(inp ? inp.value : true));
    back.addEventListener("pointerdown", e => { if (e.target === back) cerrar(null); });
  });
}
/* traduce un fallo de almacenamiento a algo que se pueda actuar */
function storeErr(e){
  const m = (e && (e.message || e.code || e.error_description)) || "error";
  if (/permission denied|42501/i.test(m))
    return "Falta dar permisos a las tablas en Supabase: corre otra vez supabase/setup.sql (trae los GRANT).";
  if (/does not exist|42P01|Could not find the table|schema cache/i.test(m))
    return "Faltan las tablas: corre supabase/setup.sql en el SQL Editor de Supabase.";
  if (/JWT|Invalid API key|apikey|401|403/i.test(m))
    return "Las llaves de Supabase no coinciden. Revísalas en Vercel → Environment Variables.";
  if (/Failed to fetch|NetworkError|ENOTFOUND|fetch/i.test(m))
    return "Sin conexión con Supabase. Revisa que la URL del proyecto esté bien (sin /rest/v1).";
  if (/row-level security|policy/i.test(m))
    return "Las políticas de seguridad rechazaron la consulta: vuelve a correr setup.sql.";
  return "No pude leer tus cuadernos: " + m;
}
const pedir = (title, value, ok) => dialog({title:title, input:value == null ? "" : value, ok:ok || "Guardar"});
const confirmar = (title, text, ok) =>
  dialog({title:title, text:text, ok:ok || "Eliminar", danger:true}).then(v => v === true);
function fmtDate(ts){ try{ return new Date(ts).toLocaleDateString("es-CO",{day:"2-digit",month:"short",year:"numeric"}); }catch(e){ return ""; } }

/* =================================================================== *
 *  Almacenamiento
 * =================================================================== */
const Store = opts.store;

/* =================================================================== *
 *  Estado
 * =================================================================== */
const S = {
  notebooks:[], nb:null, pages:[], pi:0, items:[],
  tool:"pen", color:COLORS[0], hlColor:HL_COLORS[0], size:1, font:"IBM Plex Sans",
  zoom:1, stylusOnly:false, undo:[], redo:[], dirty:false, saving:false, kind:"auto", sel:null
};
const pad = $("#pad"), ctx = pad.getContext("2d");
let bgImg = null, sampleFn = null, sampleImages = false, editTarget = null, avisoColor = false, avisoMarca = false;

/* =================================================================== *
 *  Dibujo de la página
 * =================================================================== */
function dpr(){ return Math.min(2, window.devicePixelRatio || 1); }
function sizeCanvas(){
  const k = S.zoom * dpr();
  pad.width = Math.round(PW*k); pad.height = Math.round(PH*k);
  pad.style.width = Math.round(PW*S.zoom)+"px"; pad.style.height = Math.round(PH*S.zoom)+"px";
  ctx.setTransform(k,0,0,k,0,0);
}
function drawTemplate(c, tpl, bg){
  c.save();
  c.fillStyle = "#FFFFFF"; c.fillRect(0,0,PW,PH);
  if (bg){
    const r = Math.min(PW/bg.width, PH/bg.height), w = bg.width*r, h = bg.height*r;
    c.drawImage(bg, (PW-w)/2, (PH-h)/2, w, h);
  }
  c.lineWidth = 1;
  if (tpl === "ruled" || tpl === "cornell"){
    const left = tpl === "cornell" ? 300 : 96, top = tpl === "cornell" ? 120 : 92;
    c.strokeStyle = "#F2CFDE";
    for (let y = top; y < PH-60; y += 44){ c.beginPath(); c.moveTo(60, y); c.lineTo(PW-70, y); c.stroke(); }
    c.strokeStyle = "#F09CBC";
    c.beginPath(); c.moveTo(left, 40); c.lineTo(left, PH-40); c.stroke();
    if (tpl === "cornell"){ c.strokeStyle = "#F2CFDE"; c.beginPath(); c.moveTo(60, PH-300); c.lineTo(PW-70, PH-300); c.stroke(); }
  } else if (tpl === "grid"){
    c.strokeStyle = "#F0D3E0";
    for (let x = 40; x <= PW-40; x += 44){ c.beginPath(); c.moveTo(x,40); c.lineTo(x,PH-40); c.stroke(); }
    for (let y = 40; y <= PH-40; y += 44){ c.beginPath(); c.moveTo(40,y); c.lineTo(PW-40,y); c.stroke(); }
  } else if (tpl === "mm"){
    for (let s = 0; s < 2; s++){
      const step = s ? 59 : 11.8;
      c.strokeStyle = s ? "#EBC6D7" : "#F9E6EE"; c.lineWidth = s ? 1 : .7;
      for (let x = 40; x <= PW-40; x += step){ c.beginPath(); c.moveTo(x,40); c.lineTo(x,PH-40); c.stroke(); }
      for (let y = 40; y <= PH-40; y += step){ c.beginPath(); c.moveTo(40,y); c.lineTo(PW-40,y); c.stroke(); }
    }
  } else if (tpl === "dots"){
    c.fillStyle = "#E7C2D3";
    for (let x = 48; x <= PW-40; x += 44) for (let y = 48; y <= PH-40; y += 44){ c.beginPath(); c.arc(x,y,1.7,0,6.284); c.fill(); }
  }
  c.restore();
}

/* ---------- tipografía y cajas ---------- */
function fontOf(size, weight, fam){ return (weight||500)+" "+size+"px '"+(fam||"IBM Plex Sans")+"', system-ui, sans-serif"; }
function wrap(c, text, maxW){
  const words = String(text).split(/\s+/), lines = []; let ln = "";
  for (const w of words){
    const t = ln ? ln+" "+w : w;
    if (c.measureText(t).width > maxW && ln){ lines.push(ln); ln = w; } else ln = t;
  }
  if (ln) lines.push(ln);
  return lines.length ? lines : [""];
}
function rrect(c, x, y, w, h, r){
  c.beginPath();
  c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r);
  c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath();
}
function tint(hex, a){
  const n = parseInt(hex.slice(1), 16);
  return "rgba("+((n>>16)&255)+","+((n>>8)&255)+","+(n&255)+","+a+")";
}

/* ---------- objetos ---------- */
function drawItem(c, s){
  if (s.t === "p" || s.t === "hl"){
    const p = s.pts; if (!p || p.length < 3) return;
    c.save(); c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = s.c;
    if (s.t === "hl"){
      c.globalAlpha = .3; c.lineWidth = s.w; c.lineCap = "butt";
      c.beginPath(); c.moveTo(p[0],p[1]);
      for (let i = 3; i < p.length; i += 3) c.lineTo(p[i],p[i+1]);
      if (p.length === 3) c.lineTo(p[0]+.1, p[1]);
      c.stroke();
    } else {
      if (p.length === 3){ c.fillStyle = s.c; c.beginPath(); c.arc(p[0],p[1],s.w*.5,0,6.284); c.fill(); }
      for (let i = 3; i < p.length; i += 3){
        c.beginPath(); c.moveTo(p[i-3],p[i-2]); c.lineTo(p[i],p[i+1]);
        c.lineWidth = s.w*(0.45+0.55*(p[i+2]/100)); c.stroke();
      }
    }
    c.restore(); return;
  }
  if (s.t === "t") return drawText(c, s);
  if (s.t === "tbl") return drawTable(c, s);
  if (s.t === "map") return drawMap(c, s);
  if (s.t === "flow") return drawFlow(c, s);
  if (s.t === "stp") return drawStep(c, s);
  if (s.t === "chk") return drawChk(c, s);
}


function drawChk(c, s){
  const W = s.w || Math.min(PW - s.x - 60, 940), P = 16, fs = s.fs || 21, caja = 24, sep = 14;
  const col = s.c || "#E0457B";
  const items = s.items || [];
  c.save(); c.textBaseline = "top";

  /* medir para el marco */
  let alto = P;
  c.font = fontOf(fs+3, 600, s.f);
  if (s.title) alto += (fs+3)*1.5;
  items.forEach(it => {
    c.font = fontOf(fs, 400, s.f);
    const l = wrap(c, it.t || "", W - P*2 - caja - sep).length;
    alto += Math.max(caja + 10, l*fs*1.35 + 12);
  });
  alto += P - 8;

  /* tarjeta */
  c.fillStyle = "rgba(224,69,123,.03)"; rrect(c, s.x, s.y, W, alto, 12); c.fill();
  c.strokeStyle = tint(col,.4); c.lineWidth = 1.5; rrect(c, s.x, s.y, W, alto, 12); c.stroke();

  let y = s.y + P;
  if (s.title){
    c.font = fontOf(fs+3, 600, s.f); c.fillStyle = "#1A1216";
    c.fillText(s.title, s.x + P, y);
    const hechos = items.filter(i => i.ok).length;
    const et = hechos + " de " + items.length;
    c.font = fontOf(fs-5, 500, s.f); c.fillStyle = col;
    c.fillText(et, s.x + W - P - c.measureText(et).width, y + 5);
    y += (fs+3)*1.5;
  }

  items.forEach((it, i) => {
    c.font = fontOf(fs, 400, s.f);
    const lineas = wrap(c, it.t || "", W - P*2 - caja - sep);
    const h = Math.max(caja + 10, lineas.length*fs*1.35 + 12);
    const bx = s.x + P, by = y + 3;
    it._box = [bx, by, caja, caja];                 /* para poder tocarla */

    if (it.ok){
      c.fillStyle = col; rrect(c, bx, by, caja, caja, 6); c.fill();
      c.save(); c.strokeStyle = "#fff"; c.lineWidth = 2.6; c.lineCap = "round"; c.lineJoin = "round";
      c.beginPath(); c.moveTo(bx+6, by+12.5); c.lineTo(bx+10, by+17); c.lineTo(bx+18.5, by+7.5); c.stroke(); c.restore();
    } else {
      c.strokeStyle = tint(col,.75); c.lineWidth = 1.8; rrect(c, bx, by, caja, caja, 6); c.stroke();
    }

    const tx = bx + caja + sep;
    let ty = y + 5;
    lineas.forEach(ln => {
      c.fillStyle = it.ok ? "#9A8B91" : "#1B1F24";
      c.font = fontOf(fs, 400, s.f);
      c.fillText(ln, tx, ty);
      if (it.ok){
        const an = c.measureText(ln).width;
        c.strokeStyle = "#9A8B91"; c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(tx, ty + fs*0.60); c.lineTo(tx + an, ty + fs*0.60); c.stroke();
      }
      ty += fs*1.35;
    });

    y += h;
    if (i < items.length - 1){
      c.strokeStyle = "rgba(26,18,22,.09)"; c.lineWidth = 1;
      c.beginPath(); c.moveTo(s.x+P, y); c.lineTo(s.x+W-P, y); c.stroke();
    }
  });

  s._next = y + (items.length ? 6 : 0);          /* aquí va el próximo renglón */
  s._bb = [s.x-4, s.y-4, W+8, alto+8];
  c.restore();
}

/* ---------- pasos de instructivo ---------- */
const imgCache = {};
function ensureImg(id){
  if (!id || !S.nb || imgCache[id] !== undefined) return imgCache[id] || null;
  imgCache[id] = null;
  Store.getImg(S.nb.id, id).then(d => {
    if (!d) return;
    const im = new Image();
    im.onload = () => { imgCache[id] = im; redraw(); renderThumbs(); };
    im.src = d;
  }).catch(() => {});
  return null;
}
function drawStep(c, s){
  const W = s.w || (PW-156), P = 18, tfs = 23, bfs = 19;
  const col = s.c || "#E0457B";
  const bx = s.x, by = s.y;
  c.save(); c.textBaseline = "top";
  /* medir */
  c.font = fontOf(tfs, 600, s.f);
  const tl = s.title ? wrap(c, s.title, W-P*2-46) : [];
  c.font = fontOf(bfs, 400, s.f);
  const bl = s.text ? wrap(c, s.text, W-P*2) : [];
  let ih = 0, iw = 0;
  const im = s.img ? ensureImg(s.img) : null;
  if (im){
    iw = Math.min(W-P*2, im.width);
    ih = im.height*iw/im.width;
    if (ih > 470){ ih = 470; iw = im.width*ih/im.height; }
  } else if (s.img) ih = 90;
  const th = Math.max(34, tl.length*tfs*1.28);
  const h = P + th + (bl.length ? 8 + bl.length*bfs*1.4 : 0) + (ih ? 14 + ih : 0) + P;
  /* tarjeta */
  c.fillStyle = "rgba(224,69,123,.035)"; rrect(c, bx, by, W, h, 12); c.fill();
  c.strokeStyle = tint(col, .45); c.lineWidth = 1.5; rrect(c, bx, by, W, h, 12); c.stroke();
  /* número */
  c.fillStyle = col; c.beginPath(); c.arc(bx+P+16, by+P+15, 16, 0, 6.284); c.fill();
  c.fillStyle = "#fff"; c.font = fontOf(15, 600, s.f); c.textAlign = "center";
  c.fillText(String(s.n || 1), bx+P+16, by+P+7); c.textAlign = "left";
  /* título */
  let y = by+P;
  c.fillStyle = "#1A1216"; c.font = fontOf(tfs, 600, s.f);
  tl.forEach((ln, i) => c.fillText(ln, bx+P+46, y+i*tfs*1.28+3));
  y += th;
  /* descripción */
  if (bl.length){
    y += 8; c.fillStyle = "#3A2C32"; c.font = fontOf(bfs, 400, s.f);
    bl.forEach(ln => { c.fillText(ln, bx+P, y); y += bfs*1.4; });
  }
  /* foto */
  if (ih){
    y += 14;
    if (im){
      c.save(); rrect(c, bx+P, y, iw, ih, 8); c.clip();
      c.drawImage(im, bx+P, y, iw, ih); c.restore();
      c.strokeStyle = "rgba(26,18,22,.18)"; c.lineWidth = 1; rrect(c, bx+P, y, iw, ih, 8); c.stroke();
    } else {
      c.fillStyle = "rgba(26,18,22,.05)"; rrect(c, bx+P, y, W-P*2, ih, 8); c.fill();
      c.fillStyle = "#8A7179"; c.font = fontOf(15, 400, s.f);
      c.fillText("cargando foto…", bx+P+14, y+ih/2-8);
    }
  }
  s._bb = [bx-4, by-4, W+8, h+8];
  c.restore();
  return h;
}

/* separa el texto de las marcas ==resaltar==: devuelve el texto limpio y los tramos */
function partirResaltado(txt){
  let limpio = "", tramos = [], resto = String(txt || "");
  const re = /==([^=]+)==/g;
  let m, ult = 0;
  while ((m = re.exec(resto)) !== null){
    limpio += resto.slice(ult, m.index);
    const ini = limpio.length;
    limpio += m[1];
    tramos.push([ini, limpio.length]);
    ult = m.index + m[0].length;
  }
  limpio += resto.slice(ult);
  return {txt:limpio, tramos:tramos};
}
/* corta en líneas guardando desde qué letra empieza cada una */
function wrapConIndice(c, texto, maxW, desde){
  const palabras = texto.split(" ");
  const out = []; let ln = "", ini = desde, pos = desde;
  for (let i = 0; i < palabras.length; i++){
    const w = palabras[i];
    const t = ln ? ln + " " + w : w;
    if (c.measureText(t).width > maxW && ln){
      out.push({t:ln, i:ini});
      ini = pos; ln = w;
    } else ln = t;
    pos += w.length + 1;
  }
  if (ln) out.push({t:ln, i:ini});
  return out.length ? out : [{t:"", i:desde}];
}
function drawText(c, s){
  c.save();
  c.font = fontOf(s.w, 500, s.f); c.textBaseline = "top";
  const maxW = s.mw || (PW - s.x - 70);
  const {txt, tramos} = partirResaltado(s.txt);
  const marca = s.hc || "#F7E14A";
  let y = s.y, w = 0, base = 0;
  for (const raw of txt.split("\n")){
    const lineas = wrapConIndice(c, raw, maxW, base);
    for (const {t, i} of lineas){
      /* primero la marca de resaltado detrás */
      if (tramos.length){
        for (const [a2, b2] of tramos){
          const ini = Math.max(a2, i), fin = Math.min(b2, i + t.length);
          if (fin <= ini) continue;
          const x1 = s.x + c.measureText(t.slice(0, ini - i)).width;
          const x2 = s.x + c.measureText(t.slice(0, fin - i)).width;
          c.save(); c.globalAlpha = .38; c.fillStyle = marca;
          c.fillRect(x1 - 2, y + s.w*0.12, (x2 - x1) + 4, s.w*1.02);
          c.restore();
        }
      }
      c.fillStyle = s.c;
      c.fillText(t, s.x, y);
      w = Math.max(w, c.measureText(t).width);
      y += s.w*1.38;
    }
    base += raw.length + 1;
  }
  s._bb = [s.x-6, s.y-6, w+12, (y-s.y)+12];
  c.restore();
}

function drawTable(c, s){
  const pad = 12, fs = s.fs || 20, headH = 4;
  const cols = s.cols || [], rows = s.rows || [];
  const W = s.w || Math.min(PW - s.x - 60, 1000);
  const n = Math.max(1, cols.length);
  const weights = [];
  for (let i = 0; i < n; i++){
    let m = String(cols[i]||"").length;
    for (const r of rows) m = Math.max(m, String((r||[])[i]||"").length);
    weights.push(Math.max(6, Math.min(34, m)));
  }
  const tot = weights.reduce((a,b) => a+b, 0);
  const cw = weights.map(w => Math.max(90, W * w / tot));
  const scale = W / cw.reduce((a,b) => a+b, 0);
  for (let i = 0; i < cw.length; i++) cw[i] *= scale;

  c.save();
  c.textBaseline = "top";
  const all = [cols].concat(rows);
  const heights = all.map((r, ri) => {
    c.font = fontOf(fs, ri ? 400 : 600, s.f);
    let h = 0;
    for (let i = 0; i < n; i++) h = Math.max(h, wrap(c, (r||[])[i]||"", cw[i]-pad*2).length * fs*1.32);
    return h + pad*2;
  });
  let y = s.y;
  if (s.title){
    c.font = fontOf(fs+4, 600, s.f); c.fillStyle = s.c || "#14171B";
    c.fillText(s.title, s.x, y); y += (fs+4)*1.5;
  }
  const top = y;
  for (let ri = 0; ri < all.length; ri++){
    let x = s.x;
    const h = heights[ri];
    if (ri === 0){ c.fillStyle = tint(s.c || "#E0457B", .12); c.fillRect(s.x, y, W, h); }
    else if (ri % 2 === 0){ c.fillStyle = "rgba(20,23,27,.028)"; c.fillRect(s.x, y, W, h); }
    for (let i = 0; i < n; i++){
      c.font = fontOf(fs, ri ? 400 : 600, s.f);
      c.fillStyle = ri ? "#1B1F24" : (s.c || "#14171B");
      const lines = wrap(c, (all[ri]||[])[i]||"", cw[i]-pad*2);
      lines.forEach((ln, li) => c.fillText(ln, x+pad, y+pad+li*fs*1.32));
      x += cw[i];
    }
    y += h;
  }
  c.strokeStyle = "rgba(20,23,27,.22)"; c.lineWidth = 1;
  c.strokeRect(s.x, top, W, y-top);
  let yy = top;
  for (let ri = 0; ri < heights.length - 1; ri++){
    yy += heights[ri];
    c.beginPath(); c.moveTo(s.x, yy); c.lineTo(s.x+W, yy);
    c.lineWidth = ri === 0 ? 1.6 : 1; c.stroke();
  }
  let xx = s.x; c.lineWidth = 1;
  for (let i = 0; i < n-1; i++){ xx += cw[i]; c.beginPath(); c.moveTo(xx, top); c.lineTo(xx, y); c.stroke(); }
  s._bb = [s.x-4, s.y-4, W+8, (y-s.y)+8];
  c.restore();
}

function drawMap(c, s){
  const R = {w:210, ph:14, fs:21}, L1 = {w:200, fs:19}, L2 = {w:230, fs:17};
  const gap = 46, vgap = 14;
  const branches = s.branches || [];
  c.save(); c.textBaseline = "top";

  const bh = branches.map(b => {
    c.font = fontOf(L1.fs, 600, s.f);
    const h1 = wrap(c, b.label, L1.w-24).length * L1.fs*1.3 + R.ph*2;
    c.font = fontOf(L2.fs, 400, s.f);
    let hc = 0;
    (b.children||[]).forEach(ch => { hc += wrap(c, ch, L2.w-24).length * L2.fs*1.3 + 20 + vgap; });
    return {h:Math.max(h1, Math.max(0, hc - vgap)), h1:h1, hc:hc};
  });
  const totalH = bh.reduce((a,b) => a + b.h + vgap, 0) - vgap;
  const x0 = s.x, y0 = s.y;
  let rootH = 0;
  c.font = fontOf(R.fs, 700, s.f);
  const rootLines = wrap(c, s.root || "Tema", R.w-26);
  rootH = rootLines.length * R.fs*1.3 + R.ph*2;
  const rootY = y0 + Math.max(0, totalH/2 - rootH/2);
  const col = s.c || "#E0457B";

  /* raíz */
  c.fillStyle = col; rrect(c, x0, rootY, R.w, rootH, 12); c.fill();
  c.fillStyle = "#fff"; c.font = fontOf(R.fs, 700, s.f);
  rootLines.forEach((ln, i) => c.fillText(ln, x0+13, rootY+R.ph+i*R.fs*1.3));

  let y = y0;
  branches.forEach((b, bi) => {
    const h = bh[bi].h, cx = x0+R.w+gap, cy = y + h/2 - bh[bi].h1/2;
    /* conector raíz→rama */
    c.strokeStyle = tint(col, .55); c.lineWidth = 2.2;
    c.beginPath();
    c.moveTo(x0+R.w, rootY+rootH/2);
    c.bezierCurveTo(x0+R.w+gap*.6, rootY+rootH/2, cx-gap*.6, cy+bh[bi].h1/2, cx, cy+bh[bi].h1/2);
    c.stroke();
    /* rama */
    c.fillStyle = tint(col, .14); rrect(c, cx, cy, L1.w, bh[bi].h1, 10); c.fill();
    c.strokeStyle = tint(col, .5); c.lineWidth = 1.4; rrect(c, cx, cy, L1.w, bh[bi].h1, 10); c.stroke();
    c.fillStyle = "#14171B"; c.font = fontOf(L1.fs, 600, s.f);
    wrap(c, b.label, L1.w-24).forEach((ln, i) => c.fillText(ln, cx+12, cy+R.ph+i*L1.fs*1.3));
    /* hojas */
    const lx = cx+L1.w+gap*.7;
    let ly = y + Math.max(0, h/2 - Math.max(0, bh[bi].hc - vgap)/2);
    c.font = fontOf(L2.fs, 400, s.f);
    (b.children||[]).forEach(ch => {
      const lines = wrap(c, ch, L2.w-24), hh = lines.length*L2.fs*1.3 + 20;
      c.strokeStyle = tint(col, .4); c.lineWidth = 1.6;
      c.beginPath();
      c.moveTo(cx+L1.w, cy+bh[bi].h1/2);
      c.bezierCurveTo(cx+L1.w+18, cy+bh[bi].h1/2, lx-18, ly+hh/2, lx, ly+hh/2);
      c.stroke();
      c.fillStyle = "rgba(20,23,27,.045)"; rrect(c, lx, ly, L2.w, hh, 8); c.fill();
      c.fillStyle = "#1B1F24"; c.font = fontOf(L2.fs, 400, s.f);
      lines.forEach((ln, i) => c.fillText(ln, lx+12, ly+10+i*L2.fs*1.3));
      ly += hh + vgap;
    });
    y += h + vgap;
  });
  s._bb = [x0-6, y0-6, R.w+gap+L1.w+gap*.7+L2.w+12, Math.max(totalH, rootH)+12];
  c.restore();
}

function drawFlow(c, s){
  const W = s.w || 660, fs = 20, pad = 14, gapY = 34;
  const steps = s.steps || [];
  const col = s.c || "#E0457B";
  c.save(); c.textBaseline = "top";
  let y = s.y;
  if (s.title){ c.font = fontOf(fs+4, 600, s.f); c.fillStyle = "#14171B"; c.fillText(s.title, s.x, y); y += (fs+4)*1.6; }
  steps.forEach((st, i) => {
    c.font = fontOf(fs, 600, s.f);
    const lines = wrap(c, st.label || st, W-72);
    c.font = fontOf(fs-3, 400, s.f);
    const nlines = st.note ? wrap(c, st.note, W-72) : [];
    const h = pad*2 + lines.length*fs*1.32 + (nlines.length ? nlines.length*(fs-3)*1.3 + 6 : 0);
    c.fillStyle = "rgba(20,23,27,.035)"; rrect(c, s.x, y, W, h, 10); c.fill();
    c.strokeStyle = tint(col,.45); c.lineWidth = 1.5; rrect(c, s.x, y, W, h, 10); c.stroke();
    /* número */
    c.fillStyle = col; c.beginPath(); c.arc(s.x+26, y+h/2, 15, 0, 6.284); c.fill();
    c.fillStyle = "#fff"; c.font = fontOf(15, 600, s.f); c.textAlign = "center";
    c.fillText(String(i+1), s.x+26, y+h/2-9); c.textAlign = "left";
    let ty = y+pad;
    c.fillStyle = "#14171B"; c.font = fontOf(fs, 600, s.f);
    lines.forEach(ln => { c.fillText(ln, s.x+56, ty); ty += fs*1.32; });
    if (nlines.length){
      ty += 4; c.fillStyle = "#5A626B"; c.font = fontOf(fs-3, 400, s.f);
      nlines.forEach(ln => { c.fillText(ln, s.x+56, ty); ty += (fs-3)*1.3; });
    }
    y += h;
    if (i < steps.length-1){
      c.strokeStyle = tint(col,.6); c.lineWidth = 2;
      c.beginPath(); c.moveTo(s.x+26, y); c.lineTo(s.x+26, y+gapY-8); c.stroke();
      c.fillStyle = tint(col,.75);
      c.beginPath(); c.moveTo(s.x+26, y+gapY); c.lineTo(s.x+20, y+gapY-9); c.lineTo(s.x+32, y+gapY-9); c.fill();
      y += gapY;
    }
  });
  s._bb = [s.x-6, s.y-6, W+12, (y-s.y)+12];
  c.restore();
}

function redraw(){
  ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,pad.width,pad.height); ctx.restore();
  const pg = S.pages[S.pi];
  drawTemplate(ctx, pg ? pg.tpl : "blank", bgImg);
  for (const s of S.items) drawItem(ctx, s);
  if (S.sel && S.sel._bb){
    const b = S.sel._bb;
    ctx.save(); ctx.strokeStyle = "#E0457B"; ctx.setLineDash([7,5]); ctx.lineWidth = 2;
    ctx.strokeRect(b[0], b[1], b[2], b[3]); ctx.restore();
  }
  showSelUI();
}

/* =================================================================== *
 *  Entrada
 * =================================================================== */
let cur = null, drag = null, pointers = new Map(), pinch = null;
function pt(e){
  const r = pad.getBoundingClientRect();
  return {x:(e.clientX-r.left)/S.zoom, y:(e.clientY-r.top)/S.zoom,
    p:Math.round(Math.max(6, Math.min(100, (e.pressure > 0 ? e.pressure : .5)*100)))};
}
const curColor = () => S.tool === "hl" ? S.hlColor : S.color;
const curWidth = () => S.tool === "hl" ? HL_SIZES[S.size] : SIZES[S.size];
function pushUndo(){ S.undo.push(S.items.map(o => Object.assign({}, o))); if (S.undo.length > 50) S.undo.shift(); S.redo.length = 0; refreshUndo(); }
function refreshUndo(){ $("#undo").disabled = !S.undo.length; $("#redo").disabled = !S.redo.length; }
function hitObject(x, y){
  for (let i = S.items.length-1; i >= 0; i--){
    const s = S.items[i];
    if (s.t === "p" || s.t === "hl") continue;
    const b = s._bb; if (!b) continue;
    if (x >= b[0] && x <= b[0]+b[2] && y >= b[1] && y <= b[1]+b[3]) return s;
  }
  return null;
}

pad.addEventListener("pointerdown", e => {
  if (e.pointerType === "pen" && !S.stylusOnly) setStylus(true);
  pointers.set(e.pointerId, e);
  if (pointers.size > 1){ cur = null; drag = null; return; }
  const q = pt(e);
  /* tocar una casilla de lista: marcar o desmarcar */
  if (S.tool === "move" || (S.stylusOnly && e.pointerType === "touch")){
    for (let i = S.items.length-1; i >= 0; i--){
      const s2 = S.items[i];
      if (s2.t !== "chk") continue;
      const t = (s2.items || []).find(it => it._box &&
        q.x >= it._box[0]-6 && q.x <= it._box[0]+it._box[2]+6 &&
        q.y >= it._box[1]-6 && q.y <= it._box[1]+it._box[3]+6);
      if (t){
        e.preventDefault();
        pushUndo(); t.ok = !t.ok; redraw(); markDirty();
        return;
      }
    }
  }
  if (S.tool === "move"){
    const o = hitObject(q.x, q.y);
    S.sel = o; redraw();
    if (o){ e.preventDefault(); pad.setPointerCapture(e.pointerId); pushUndo(); drag = {o:o, dx:q.x-o.x, dy:q.y-o.y}; }
    return;
  }
  if (S.stylusOnly && e.pointerType !== "pen" && e.pointerType !== "mouse" && S.tool !== "hl") return;
  e.preventDefault();
  if (S.tool === "lista"){
    let lista = null;
    for (let i = S.items.length-1; i >= 0; i--){
      const o = S.items[i], b = o._bb;
      if (o.t === "chk" && b && q.x >= b[0] && q.x <= b[0]+b[2] && q.y >= b[1] && q.y <= b[1]+b[3]){ lista = o; break; }
    }
    if (!lista){
      lista = {t:"chk", x:Math.max(50, q.x), y:Math.max(40, q.y), w:Math.min(PW - Math.max(50,q.x) - 50, 900),
               c:S.color, f:S.font, title:"", items:[], fs:21};
      pushUndo(); S.items.push(lista); redraw();
    }
    agregarItem(lista);
    return;
  }
  if (S.tool === "text"){ openText(q.x, q.y); return; }
  pad.setPointerCapture(e.pointerId);
  if (S.tool === "eraser"){ pushUndo(); eraseAt(q.x, q.y); cur = "erase"; return; }
  cur = {t:S.tool, c:curColor(), w:curWidth(), pts:[q.x, q.y, q.p]};
}, {passive:false});

pad.addEventListener("pointermove", e => {
  if (drag){
    e.preventDefault(); const q = pt(e);
    drag.o.x = q.x - drag.dx; drag.o.y = q.y - drag.dy; redraw(); return;
  }
  if (!cur) return;
  e.preventDefault();
  const q = pt(e);
  if (cur === "erase"){ eraseAt(q.x, q.y); return; }
  const n = cur.pts.length, dx = q.x-cur.pts[n-3], dy = q.y-cur.pts[n-2];
  if (dx*dx + dy*dy < 1.4) return;
  cur.pts.push(q.x, q.y, q.p);
  if (cur.t === "hl"){
    /* vista previa ya derecha, como va a quedar */
    const x1 = cur.pts[0], y1 = cur.pts[1];
    const recto = Math.abs(q.y - y1) < 26 ? (y1 + q.y) / 2 : null;
    redraw();
    ctx.save(); ctx.globalAlpha = .3; ctx.strokeStyle = cur.c; ctx.lineWidth = cur.w; ctx.lineCap = "butt";
    ctx.beginPath(); ctx.moveTo(x1, recto != null ? recto : y1);
    ctx.lineTo(q.x, recto != null ? recto : q.y); ctx.stroke(); ctx.restore();
    return;
  }
  ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = cur.c;
  ctx.lineWidth = cur.w*(0.45+0.55*(q.p/100));
  ctx.beginPath(); ctx.moveTo(cur.pts[n-3], cur.pts[n-2]); ctx.lineTo(q.x, q.y); ctx.stroke(); ctx.restore();
}, {passive:false});

/* el resaltador se endereza: línea recta de principio a fin */
function enderezar(st){
  const p = st.pts;
  if (!p || p.length < 6) return st;
  const x1 = p[0], y1 = p[1], x2 = p[p.length-3], y2 = p[p.length-2];
  const recto = Math.abs(y2 - y1) < 26 ? (y1 + y2) / 2 : null;   /* casi horizontal → nivelado */
  st.pts = recto != null ? [x1, recto, 100, x2, recto, 100] : [x1, y1, 100, x2, y2, 100];
  return st;
}
function endStroke(e){
  pointers.delete(e.pointerId);
  if (drag){ drag = null; markDirty(); return; }
  if (!cur) return;
  if (cur !== "erase"){
    if (cur.t === "hl") enderezar(cur);
    pushUndo(); S.items.push(cur);
  }
  cur = null;
  if (S.tool === "hl") redraw();
  markDirty();
}
pad.addEventListener("dblclick", e => {
  if (S.tool === "eraser" || S.tool === "hl") return;
  const q = pt(e), o = hitObject(q.x, q.y);
  if (!o) return;
  e.preventDefault();
  setTool("move"); S.sel = o; redraw(); editItem(o);
});
pad.addEventListener("pointerup", endStroke);
pad.addEventListener("pointercancel", endStroke);
pad.addEventListener("pointerleave", e => { if (cur || drag) endStroke(e); });

function eraseAt(x, y){
  const r = 11 + SIZES[S.size]*2, r2 = r*r;
  let hit = false;
  const keep = S.items.filter(s => {
    if (s.t === "p" || s.t === "hl"){
      const p = s.pts;
      for (let i = 0; i < p.length; i += 3){
        const dx = p[i]-x, dy = p[i+1]-y;
        if (dx*dx + dy*dy < r2){ hit = true; return false; }
      }
      return true;
    }
    const b = s._bb;
    if (b && x >= b[0] && x <= b[0]+b[2] && y >= b[1] && y <= b[1]+b[3]){ hit = true; return false; }
    return true;
  });
  if (hit){ S.items = keep; S.sel = null; redraw(); markDirty(); }
}

/* ---- texto: escribir y volver a editar ---- */
let tbox = null, tEdit = null;
function openText(x, y, edit){
  closeText();
  tEdit = edit || null;
  const size = edit ? edit.w : 20 + S.size*8;
  const fam = edit ? (edit.f || "IBM Plex Sans") : S.font;
  const col = edit ? edit.c : S.color;
  tbox = document.createElement("textarea");
  tbox.id = "txtbox"; tbox.rows = 1;
  tbox.style.left = (x*S.zoom)+"px"; tbox.style.top = (y*S.zoom)+"px";
  tbox.style.fontSize = (size*S.zoom)+"px"; tbox.style.color = col;
  tbox.style.fontFamily = "'"+fam+"', sans-serif";
  tbox.dataset.x = x; tbox.dataset.y = y; tbox.dataset.size = size; tbox.dataset.fam = fam;
  if (edit){ tbox.value = edit.txt || ""; tbox.style.minWidth = Math.max(200, (edit._bb ? edit._bb[2] : 260)*S.zoom)+"px"; }
  $("#sheet").appendChild(tbox);
  setTimeout(() => {
    if (!tbox) return;
    tbox.focus();
    tbox.style.height = "auto"; tbox.style.height = tbox.scrollHeight+"px";
    if (edit) tbox.setSelectionRange(tbox.value.length, tbox.value.length);
  }, 10);
  if (!avisoMarca){
    avisoMarca = true;
    toast("Para resaltar una parte, escríbela entre == ==  ·  ej: el ==sello== va sellado", 5200);
  }
  tbox.addEventListener("blur", closeText);
  tbox.addEventListener("input", () => { tbox.style.height = "auto"; tbox.style.height = tbox.scrollHeight+"px"; });
  tbox.addEventListener("keydown", ev => {
    if (ev.key === "Escape"){ tbox.dataset.cancel = "1"; tbox.blur(); }
  });
}
function closeText(){
  if (!tbox) return;
  const b = tbox, v = b.value.trim(), ed = tEdit;
  tbox = null; tEdit = null;
  if (b.dataset.cancel){ b.remove(); return; }
  if (ed){
    pushUndo();
    if (!v) S.items = S.items.filter(o => o !== ed);
    else ed.txt = v;
    S.sel = v ? ed : null;
    redraw(); markDirty();
  } else if (v){
    pushUndo();
    S.items.push({t:"t", c:b.style.color, w:+b.dataset.size, x:+b.dataset.x, y:+b.dataset.y, txt:v, f:b.dataset.fam});
    redraw(); markDirty();
  }
  b.remove();
}

/* ---- lista de tareas: escribir renglón tras renglón ---- */
let chkIn = null;
function cerrarItem(){
  if (!chkIn) return;
  const b = chkIn; chkIn = null; b.remove();
}
function agregarItem(lista){
  cerrarItem();
  const P = 16, caja = 24, sep = 14, fs = lista.fs || 21;
  const yy = (lista._next != null && lista.items.length) ? lista._next : lista.y + P + 3;
  chkIn = document.createElement("input");
  chkIn.id = "chkbox"; chkIn.type = "text"; chkIn.placeholder = "Escribe y Enter…";
  chkIn.style.left = ((lista.x + P + caja + sep) * S.zoom) + "px";
  chkIn.style.top = (yy * S.zoom) + "px";
  chkIn.style.fontSize = (fs * S.zoom) + "px";
  chkIn.style.width = (((lista.w || 900) - P*2 - caja - sep) * S.zoom) + "px";
  $("#sheet").appendChild(chkIn);
  setTimeout(() => chkIn && chkIn.focus(), 10);

  const meter = (seguir) => {
    const v = chkIn ? chkIn.value.trim() : "";
    cerrarItem();
    if (v){
      pushUndo(); lista.items.push({t:v, ok:false}); redraw(); markDirty();
      if (seguir) agregarItem(lista);
      return true;
    }
    /* sin texto: si la lista quedó vacía, se descarta */
    if (!lista.items.length){
      S.items = S.items.filter(o => o !== lista);
      if (S.sel === lista) S.sel = null;
      redraw();
    }
    return false;
  };
  chkIn.addEventListener("keydown", ev => {
    if (ev.key === "Enter"){ ev.preventDefault(); meter(true); }
    else if (ev.key === "Escape"){ ev.preventDefault(); chkIn.value = ""; meter(false); }
  });
  chkIn.addEventListener("blur", () => { if (chkIn) meter(false); });
}

/* ---- editar cualquier objeto ---- */
function itemToStruct(s){
  if (s.t === "tbl")
    return (s.title ? "# "+s.title+"\n" : "") + [s.cols||[]].concat(s.rows||[]).map(r => (r||[]).join(" | ")).join("\n");
  if (s.t === "map"){
    let out = (s.root || "")+"\n";
    (s.branches||[]).forEach(b => {
      out += "  "+b.label+"\n";
      (b.children||[]).forEach(c => { out += "    "+c+"\n"; });
    });
    return out.trim();
  }
  if (s.t === "flow")
    return (s.title ? "# "+s.title+"\n" : "") +
      (s.steps||[]).map(p => (p.label||"") + (p.note ? " :: "+p.note : "")).join("\n");
  if (s.t === "chk")
    return (s.title ? "# "+s.title+"\n" : "") +
      (s.items||[]).map(o => (o.ok ? "x " : "") + o.t).join("\n");
  return "";
}
async function editItem(o){
  if (!o) return;
  if (o.t === "t"){ openText(o.x, o.y, o); return; }
  if (o.t === "stp"){
    $("#studio").classList.add("hide");
    $("#instr").classList.remove("hide"); $("#instrBtn").classList.add("on");
    await renderSteps();
    await cargarPaso(S.pi, o);
    return;
  }
  if (o.t === "tbl" || o.t === "map" || o.t === "flow" || o.t === "chk"){
    S.kind = o.t === "map" ? "mapa" : (o.t === "flow" ? "proceso" : (o.t === "chk" ? "lista" : "tabla"));
    editTarget = o;
    buildKinds();
    $("#struct").value = itemToStruct(o);
    $("#instr").classList.add("hide"); $("#instrBtn").classList.remove("on");
    $("#studio").classList.remove("hide");
    $("#insLbl").textContent = "Guardar cambios";
    setStatus("Editando lo que ya está en la página. Cambia lo que quieras y toca Guardar cambios.");
    $("#struct").focus();
  }
}

function cambiarFoto(paso){
  const inp = document.createElement("input");
  inp.type = "file"; inp.accept = "image/*";
  inp.onchange = () => {
    const f = inp.files && inp.files[0]; if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      const im = new Image();
      im.onload = async () => {
        const data = shrink(im, 1300);
        const nuevo = uid();
        try{
          await Store.putImg(S.nb.id, nuevo, data);
          const viejo = paso.img;
          pushUndo();
          paso.img = nuevo;
          const cache = new Image(); cache.src = data; imgCache[nuevo] = cache;
          cache.onload = () => { redraw(); renderThumbs(); };
          redraw(); markDirty();
          if (viejo) Store.delImg(S.nb.id, viejo).catch(() => {});
          toast("Foto cambiada en el paso "+(paso.n||"")+".");
        }catch(e){ toast("No se pudo guardar la foto."); }
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(f);
  };
  inp.click();
}

/* barrita de Editar/Borrar sobre lo seleccionado */
function showSelUI(){
  const old = $("#selbar"); if (old) old.remove();
  if (!S.sel || !S.sel._bb || drag) return;
  const b = S.sel._bb;
  const bar = document.createElement("div");
  bar.id = "selbar";
  bar.innerHTML =
    '<button data-e><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3l5 5L8 21H3v-5z"/></svg>Editar</button>' +
    '<button data-d><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13"/></svg>Borrar</button>';
  bar.style.left = Math.max(0, b[0]*S.zoom)+"px";
  bar.style.top = Math.max(0, b[1]*S.zoom - 38)+"px";
  $("#sheet").appendChild(bar);
  if (S.sel.t === "stp"){
    const f = document.createElement("button");
    f.dataset.f = "1";
    f.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 8.5A2 2 0 0 1 5 6.5h2l1.2-2h7.6L19 6.5a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.4"/></svg>Foto';
    bar.insertBefore(f, bar.querySelector("[data-d]"));
    f.addEventListener("click", () => cambiarFoto(S.sel));
  }
  buildFonts();                                  /* refleja la fuente del objeto */
  if (!avisoColor){
    avisoColor = true;
    toast("Con algo seleccionado: toca un color o cambia la tipografía en el riel.", 4200);
  }
  bar.querySelector("[data-e]").addEventListener("click", () => editItem(S.sel));
  bar.querySelector("[data-d]").addEventListener("click", () => {
    pushUndo(); S.items = S.items.filter(o => o !== S.sel); S.sel = null;
    redraw(); markDirty();
  });
}

/* ---- pellizco ---- */
$("#scroll").addEventListener("touchmove", e => {
  if (e.touches.length !== 2) return;
  e.preventDefault();
  const d = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
  if (pinch == null){ pinch = {d:d, z:S.zoom}; return; }
  setZoom(pinch.z*(d/pinch.d));
}, {passive:false});
$("#scroll").addEventListener("touchend", () => { pinch = null; });

/* =================================================================== *
 *  Guardado / páginas
 * =================================================================== */
let saveTimer = null, saveHideT = null;
const ICONO_SAVE = {
  dirty:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M8 8l4-4 4 4"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
  saving:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4h-4"/></svg>',
  saved:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  err:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 8v6M12 17.5v.5"/><circle cx="12" cy="12" r="9"/></svg>'
};
const TITULO_SAVE = {
  dirty:"Hay cambios sin guardar · toca para guardar ahora",
  saving:"Guardando…", saved:"Guardado", err:"No se pudo guardar · toca para reintentar"
};
function setSave(st){
  const b = $("#saveBtn");
  clearTimeout(saveHideT);
  b.hidden = false;
  b.classList.remove("dirty","saving","saved","err");
  b.classList.add(st);
  b.innerHTML = ICONO_SAVE[st];
  b.title = TITULO_SAVE[st];
  if (st === "saved") saveHideT = setTimeout(() => { b.hidden = true; }, 1800);
}

function markDirty(){
  S.dirty = true;
  setSave("dirty");
  clearTimeout(saveTimer); saveTimer = setTimeout(save, 1100);
  scheduleThumb();
}
async function save(){
  if (!S.dirty || S.saving || !S.nb) return;
  S.saving = true; S.dirty = false;
  clearTimeout(saveTimer);
  setSave("saving");
  const pg = S.pages[S.pi];
  try{
    const nc = await Store.putItems(S.nb.id, pg, S.items);
    if (nc !== pg.nc){ pg.nc = nc; await Store.putPage(S.nb.id, pg); }
    S.nb.updatedAt = Date.now(); S.nb.pages = S.pages.length;
    await Store.putNotebook(S.nb);
    setSave("saved");
  }catch(err){
    S.dirty = true; setSave("err");
    toast("No se pudo guardar ("+((err&&err.code)||"error")+"). Toca el icono para reintentar.");
  }
  S.saving = false;
}
/* tocar el icono guarda de una */
$("#saveBtn").addEventListener("click", () => { if (S.dirty) save(); });
window.addEventListener("beforeunload", () => { if (S.dirty) save(); });
document.addEventListener("visibilitychange", () => { if (document.hidden) save(); });

async function loadPage(i){
  await save(); closeText(); cerrarItem();
  S.pi = Math.max(0, Math.min(S.pages.length-1, i));
  const pg = S.pages[S.pi];
  bgImg = null; S.sel = null; S.undo = []; S.redo = []; refreshUndo();
  aplicarHoja(pg);
  S.items = await Store.getItems(S.nb.id, pg);
  if (pg.bg){ const im = new Image(); im.onload = () => { bgImg = im; redraw(); }; im.src = pg.bg; }
  sizeCanvas(); redraw();
  $("#pgLabel").textContent = (S.pi+1)+" / "+S.pages.length;
  renderThumbs();
}
async function addPage(tpl){
  await save();
  const actual = S.pages[S.pi];
  const pg = {id:uid(), i:S.pages.length, tpl:tpl || (actual ? actual.tpl : "ruled"), nc:0, bg:"",
              hoja:(actual && actual.hoja) || "a4-v"};
  S.pages.push(pg); await Store.putPage(S.nb.id, pg);
  await loadPage(S.pages.length-1);
}
async function removePage(idx){
  if (S.pages.length === 1){ toast("El cuaderno necesita al menos una página."); return; }
  if (!await confirmar("Eliminar la página "+(idx+1), "Se borra todo lo que tenga escrito. No se puede deshacer.")) return;
  await Store.delPage(S.nb.id, S.pages[idx]);
  S.pages.splice(idx, 1);
  for (let i = 0; i < S.pages.length; i++)
    if (S.pages[i].i !== i){ S.pages[i].i = i; await Store.putPage(S.nb.id, S.pages[i]); }
  thumbCache = {};
  await loadPage(Math.min(idx, S.pages.length-1));
}

let thumbCache = {}, thumbTimer = null;
function scheduleThumb(){
  clearTimeout(thumbTimer);
  thumbTimer = setTimeout(() => { if (S.pages[S.pi]) delete thumbCache[S.pages[S.pi].id]; renderThumbs(); }, 900);
}
async function renderThumbs(){
  if ($("#drawer").classList.contains("hide")) return;
  const host = $("#thumbs"); host.textContent = "";
  for (let i = 0; i < S.pages.length; i++){
    const pg = S.pages[i];
    const b = document.createElement("button");
    b.className = "th"; b.setAttribute("aria-current", i === S.pi ? "true" : "false");
    aplicarHoja(pg);
    const cv = document.createElement("canvas");
    cv.width = 150; cv.height = Math.round(150*PH/PW); b.appendChild(cv);
    const tag = document.createElement("b"); tag.textContent = i+1; b.appendChild(tag);
    const x = document.createElement("span"); x.className = "x";
    x.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    x.addEventListener("click", ev => { ev.stopPropagation(); removePage(i); });
    b.appendChild(x);
    b.addEventListener("click", () => loadPage(i));
    host.appendChild(b);
    const c2 = cv.getContext("2d"); c2.scale(150/PW, 150/PW);
    const items = (i === S.pi) ? S.items : (thumbCache[pg.id] || (thumbCache[pg.id] = await Store.getItems(S.nb.id, pg)));
    c2.fillStyle = "#FFFFFF"; c2.fillRect(0,0,PW,PH);
    if (i === S.pi && bgImg){
      const r = Math.min(PW/bgImg.width, PH/bgImg.height);
      c2.drawImage(bgImg, (PW-bgImg.width*r)/2, (PH-bgImg.height*r)/2, bgImg.width*r, bgImg.height*r);
    }
    for (const s of items) drawItem(c2, s);
  }
  aplicarHoja(S.pages[S.pi]);          /* deja los tamaños como los de la página abierta */
}

/* =================================================================== *
 *  Herramientas
 * =================================================================== */
function buildSwatches(){
  const host = $("#swatches"); host.textContent = "";
  const list = S.tool === "hl" ? HL_COLORS : COLORS;
  const active = S.tool === "hl" ? S.hlColor : S.color;
  list.forEach(col => {
    const b = document.createElement("button");
    b.className = "sw"; b.style.background = col; b.title = col;
    b.setAttribute("aria-pressed", col === active ? "true" : "false");
    b.addEventListener("click", () => {
      if (S.tool === "hl") S.hlColor = col; else S.color = col;
      if (S.sel){                                  /* recolorea lo seleccionado */
        pushUndo(); S.sel.c = col; redraw(); markDirty();
        toast("Color cambiado.");
      }
      buildSwatches();
    });
    host.appendChild(b);
  });
  /* rueda de color: cualquier tono, no solo los ocho */
  const libre = document.createElement("button");
  libre.className = "sw libre"; libre.title = "Otro color";
  libre.setAttribute("aria-pressed", list.indexOf(active) < 0 ? "true" : "false");
  if (list.indexOf(active) < 0) libre.style.background = active;
  libre.addEventListener("click", () => {
    const inp = document.createElement("input");
    inp.type = "color"; inp.value = active;
    inp.style.position = "fixed"; inp.style.left = "-100px";
    document.body.appendChild(inp);
    inp.addEventListener("input", () => {
      if (S.tool === "hl") S.hlColor = inp.value; else S.color = inp.value;
      if (S.sel){ S.sel.c = inp.value; redraw(); }
      buildSwatches();
    });
    inp.addEventListener("change", () => {
      if (S.sel){ pushUndo(); S.sel.c = inp.value; redraw(); markDirty(); }
      inp.remove();
    });
    inp.click();
  });
  host.appendChild(libre);
}
function buildSizes(){
  const host = $("#sizes"); host.textContent = "";
  SIZES.forEach((_, i) => {
    const b = document.createElement("button");
    b.className = "sz"; b.setAttribute("aria-pressed", i === S.size ? "true" : "false");
    const bar = document.createElement("i");
    bar.style.width = "20px"; bar.style.height = (2+i*2.4)+"px";
    b.appendChild(bar);
    b.addEventListener("click", () => { S.size = i; buildSizes(); });
    host.appendChild(b);
  });
}
function buildFonts(){
  const sel = $("#fontSel"); sel.textContent = "";
  FONTS.forEach(([fam, label]) => {
    const o = document.createElement("option"); o.value = fam; o.textContent = label; sel.appendChild(o);
  });
  const imp = document.createElement("option"); imp.value = "__import"; imp.textContent = "+ Fuente"; sel.appendChild(imp);
  sel.value = (S.sel && S.sel.f) || S.font;
  sel.onchange = () => {
    if (sel.value === "__import"){ sel.value = S.font; importFont(); return; }
    S.font = sel.value;
    if (S.sel){                                  /* cambia la tipografía de lo seleccionado */
      pushUndo(); S.sel.f = sel.value; redraw(); markDirty();
      toast("Tipografía cambiada.");
    }
  };
}
function importFont(){
  const inp = document.createElement("input");
  inp.type = "file"; inp.accept = ".ttf,.otf,.woff,.woff2,font/*";
  inp.onchange = () => {
    const f = inp.files && inp.files[0]; if (!f) return;
    const fr = new FileReader();
    fr.onload = async () => {
      const name = f.name.replace(/\.[^.]+$/, "").slice(0, 28);
      try{
        const face = new FontFace(name, fr.result);
        await face.load(); document.fonts.add(face);
        FONTS.push([name, name]); S.font = name; buildFonts();
        toast('Fuente "'+name+'" lista (solo en esta sesión).');
      }catch(e){ toast("No pude cargar esa fuente."); }
    };
    fr.readAsArrayBuffer(f);
  };
  inp.click();
}
function setTool(t){
  S.tool = t;
  root.querySelectorAll(".tool").forEach(b => b.setAttribute("aria-pressed", b.dataset.tool === t ? "true" : "false"));
  pad.style.cursor = (t === "text" || t === "lista") ? "text" : (t === "move" ? "move" : "crosshair");
  if (t !== "lista") cerrarItem();
  $("#fontSel").classList.toggle("hide", t !== "text" && t !== "move");
  if (t !== "move"){ S.sel = null; redraw(); }
  buildSwatches();
}
root.querySelectorAll(".tool").forEach(b => b.addEventListener("click", () => setTool(b.dataset.tool)));
function setStylus(on){
  S.stylusOnly = on;
  $("#stylus").classList.toggle("on", on);
  $("#stylus").title = on ? "Solo lápiz activado (los dedos desplazan)" : "Solo lápiz desactivado";
}
$("#stylus").addEventListener("click", () => setStylus(!S.stylusOnly));
function setZoom(z){
  S.zoom = Math.max(.18, Math.min(3, z));
  $("#zoomLabel").textContent = Math.round(S.zoom*100)+"%";
  sizeCanvas(); redraw();
}
$("#zoomIn").addEventListener("click", () => setZoom(S.zoom*1.2));
$("#zoomOut").addEventListener("click", () => setZoom(S.zoom/1.2));
$("#undo").addEventListener("click", () => { if (!S.undo.length) return;
  S.redo.push(S.items.map(o => Object.assign({},o))); S.items = S.undo.pop(); S.sel = null; redraw(); refreshUndo(); markDirty(); });
$("#redo").addEventListener("click", () => { if (!S.redo.length) return;
  S.undo.push(S.items.map(o => Object.assign({},o))); S.items = S.redo.pop(); S.sel = null; redraw(); refreshUndo(); markDirty(); });
$("#prevPg").addEventListener("click", () => loadPage(S.pi-1));
$("#nextPg").addEventListener("click", () => { if (S.pi === S.pages.length-1) addPage(); else loadPage(S.pi+1); });
$("#addPage").addEventListener("click", () => addPage());
$("#drawerBtn").addEventListener("click", () => {
  const d = $("#drawer"); d.classList.toggle("hide");
  $("#drawerBtn").classList.toggle("on", !d.classList.contains("hide"));
  renderThumbs();
});
$("#nbName").addEventListener("change", () => { S.nb.name = $("#nbName").value.trim() || "Sin título"; S.dirty = true; save(); });
$("#back").addEventListener("click", async () => {
  await save(); stopRec();
  vista("library");
  await refreshLibrary();
});
document.addEventListener("keydown", e => {
  if ($("#editor").classList.contains("hide")) return;
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  const k = e.key.toLowerCase();
  if ((e.metaKey||e.ctrlKey) && k === "z"){ e.preventDefault(); (e.shiftKey ? $("#redo") : $("#undo")).click(); return; }
  if (e.key === "Delete" && S.sel){ pushUndo(); S.items = S.items.filter(o => o !== S.sel); S.sel = null; redraw(); markDirty(); return; }
  const map = {"1":"pen","2":"hl","3":"eraser","4":"text","5":"lista","6":"move"};
  if (map[k]) setTool(map[k]);
  if (k === "+" || k === "=") setZoom(S.zoom*1.2);
  if (k === "-") setZoom(S.zoom/1.2);
});

/* =================================================================== *
 *  Panel Crear: voz + IA + estructuras
 * =================================================================== */
function buildKinds(){
  const host = $("#kinds"); host.textContent = "";
  KINDS.forEach(([id, label]) => {
    const b = document.createElement("button");
    b.className = "chip"; b.textContent = label;
    b.setAttribute("aria-pressed", id === S.kind ? "true" : "false");
    b.addEventListener("click", () => { S.kind = id; buildKinds(); $("#syntax").textContent = SYNTAX[id]; });
    host.appendChild(b);
  });
  $("#syntax").textContent = SYNTAX[S.kind];
}
$("#studioBtn").addEventListener("click", () => {
  const p = $("#studio"); p.classList.toggle("hide");
  if (!p.classList.contains("hide")){
    $("#instr").classList.add("hide"); $("#instrBtn").classList.remove("on");
    $("#transcript").focus();
  }
});
$("#studioClose").addEventListener("click", () => {
  $("#studio").classList.add("hide"); stopRec(); editTarget = null;
  $("#insLbl").textContent = "Insertar";
});
$("#clearT").addEventListener("click", () => { $("#transcript").value = ""; });

/* ---- reconocimiento de voz ---- */
let rec = null, recOn = false, recBase = "", recT = null;
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const MICS = {
  studio: {ta:"#transcript", mic:"#mic", help:"#micHelp", idle:"Toca el micrófono y habla. Se escribe aquí en vivo."},
  step:   {ta:"#stepText",   mic:"#imic", help:"#imicHelp", idle:"Dicta qué se hace en este paso. Se transcribe abajo."}
};
function startRec(t){
  if (!SR){ toast("Este navegador no ofrece dictado. Escribe el texto a mano."); return; }
  stopRec();
  try{
    recT = t;
    rec = new SR();
    rec.lang = "es-CO"; rec.continuous = true; rec.interimResults = true;
    recBase = $(t.ta).value ? $(t.ta).value.trim()+" " : "";
    rec.onresult = ev => {
      let fin = "", int = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++){
        const x = ev.results[i][0].transcript;
        if (ev.results[i].isFinal) fin += x + " "; else int += x;
      }
      if (fin) recBase += fin;
      $(t.ta).value = recBase + int;
    };
    rec.onerror = ev => {
      const help = $(t.help);
      stopRec();
      help.textContent = ev.error === "not-allowed"
        ? "El micrófono está bloqueado en esta vista. Escribe el texto a mano."
        : "El dictado se cortó ("+ev.error+"). Intenta de nuevo.";
    };
    rec.onend = () => { if (recOn){ try{ rec.start(); }catch(e){ stopRec(); } } };
    rec.start(); recOn = true;
    $(t.mic).classList.add("rec");
    $(t.help).textContent = "Escuchando… habla normal y toca de nuevo para parar.";
  }catch(e){ toast("No se pudo abrir el micrófono aquí."); }
}
function stopRec(){
  recOn = false;
  try{ rec && rec.stop(); }catch(e){}
  rec = null;
  root.querySelectorAll(".mic").forEach(m => m.classList.remove("rec"));
  if (SR && recT) $(recT.help).textContent = recT.idle;
  recT = null;
}
$("#mic").addEventListener("click", () => (recOn && recT === MICS.studio) ? stopRec() : startRec(MICS.studio));
$("#imic").addEventListener("click", () => (recOn && recT === MICS.step) ? stopRec() : startRec(MICS.step));

/* ---- IA ---- */
function setStatus(msg, err){ const s = $("#status"); s.textContent = msg || ""; s.classList.toggle("err", !!err); }
const ERRS = {
  not_granted:"La IA no está disponible: falta la llave en Vercel (GEMINI_API_KEY) o no autorizaste el uso de Claude.",
  sampling_disabled:"Tu cuenta no tiene IA disponible aquí.",
  rate_limited:"Demasiadas peticiones seguidas. Espera un momento.",
  images_unavailable:"Esta vista no puede enviar imágenes.",
  refused:"Claude no procesó ese contenido.",
  prompt_too_large:"El texto es muy largo, recórtalo.",
  overloaded:"El modelo gratuito está saturado ahora mismo. Espera medio minuto y vuelve a intentar."
};
function errMsg(e){
  if (e && ERRS[e.code]) return ERRS[e.code];
  if (e && e.message) return "Falló la IA: " + e.message;
  return "No se pudo completar ("+((e&&e.code)||"error")+").";
}

$("#genBtn").addEventListener("click", async () => {
  const src = $("#transcript").value.trim();
  if (!src){ setStatus("Primero dicta o escribe de qué se trata.", true); return; }
  if (!sampleFn){ setStatus("La IA no está configurada; puedes escribir la estructura a mano abajo.", true); return; }
  const btn = $("#genBtn"); btn.disabled = true; setStatus("Pensando…");
  const want = S.kind === "auto"
    ? "Elige tú el formato entre: texto, lista, tabla, comparativo, mapa, proceso."
    : 'El formato debe ser "'+S.kind+'".';
  const prompt =
    "Convierte estas notas en una estructura para dibujar en una hoja de apuntes. Español de Colombia.\n" +
    want + "\nNo inventes datos que no estén en las notas.\n" +
    "Responde EXACTAMENTE así, sin explicar nada:\n" +
    "FORMATO: <texto|lista|tabla|comparativo|mapa|proceso>\n" +
    "TITULO: <título corto>\n" +
    "LINEAS:\n<las líneas, una por renglón>\n\n" +
    "Cómo son las líneas según el formato:\n" +
    "- texto: una idea por línea.\n" +
    "- lista: una tarea por línea; si ya está hecha, empieza la línea con \"x \".\n" +
    "- tabla y comparativo: celdas separadas por \" | \"; la primera línea son los encabezados; 2 a 5 columnas, máximo 10 filas.\n" +
    "- mapa: primera línea el tema central; ramas con 2 espacios de sangría; hojas con 4 espacios.\n" +
    "- proceso: un paso por línea, opcional \"Paso :: nota corta\"; máximo 8 pasos.\n\n" +
    "NOTAS:\n" + src.slice(0, 4000);
  try{
    const r = await sampleFn(prompt, {modelTier:"default", cache:false});
    const t = r.text || "";
    const fmt = (t.match(/FORMATO\s*:\s*(\w+)/i) || [,""])[1].toLowerCase();
    const tit = (t.match(/T[IÍ]TULO\s*:\s*(.+)/i) || [,""])[1].trim();
    let lineas = (t.match(/L[IÍ]NEAS\s*:\s*\n?([\s\S]+)/i) || [,""])[1];
    if (!lineas) lineas = t.replace(/^(FORMATO|T[IÍ]TULO).*$/gim, "").trim();
    if (!lineas.trim()){ setStatus("No devolvió una estructura utilizable.", true); btn.disabled = false; return; }
    if (fmt && SYNTAX[fmt]){ S.kind = fmt; buildKinds(); }
    $("#struct").value = (tit ? "# "+tit+"\n" : "") + lineas.trim();
    setStatus("Listo. Revísalo y toca Insertar.");
  }catch(e){ setStatus(errMsg(e), true); }
  btn.disabled = false;
});

$("#readInk").addEventListener("click", async () => {
  if (!sampleFn || !sampleImages){ setStatus("Leer la letra necesita IA con imágenes; no está disponible en esta vista.", true); return; }
  const btn = $("#readInk"); btn.disabled = true; setStatus("Leyendo la página…");
  try{
    const c = document.createElement("canvas");
    renderPageTo(c, S.pages[S.pi], S.items, bgImg, 1.1);
    const blob = await new Promise(res => c.toBlob(res, "image/jpeg", .85));
    const r = await sampleFn(
      "Esta imagen es una página de apuntes escrita a mano en español. Transcríbela tal cual, respetando líneas y viñetas. " +
      "Devuelve solo la transcripción, sin comentarios.", {images:blob, modelTier:"default", cache:false});
    const t = $("#transcript");
    t.value = (t.value ? t.value.trim()+"\n" : "") + r.text.trim();
    setStatus("Transcrito. Ahora elige el formato y genera.");
  }catch(e){ setStatus(errMsg(e), true); }
  btn.disabled = false;
});

/* ---- parseo de la estructura y armado del objeto ---- */
function parseStruct(kind, raw){
  let title = "", body = raw.replace(/\r/g, "");
  const m = body.match(/^#\s*(.+)\n?/);
  if (m){ title = m[1].trim(); body = body.slice(m[0].length); }
  const lines = body.split("\n").filter(l => l.trim() !== "");
  if (!lines.length) return null;
  const x = 78, y = 150, col = "#E0457B";
  if (kind === "tabla" || kind === "comparativo"){
    const rows = lines.map(l => l.split("|").map(s => s.trim()));
    return {t:"tbl", x:x, y:y, w:PW-x*2, c:col, title:title, cols:rows[0], rows:rows.slice(1), fs:20};
  }
  if (kind === "lista"){
    const tareas = lines.map(l => {
      const t = l.trim();
      const m = t.match(/^(x|X|\[x\]|\[X\]|✓|✔)\s+(.*)$/);
      return m ? {t:m[2].trim(), ok:true} : {t:t.replace(/^(\[ ?\]|-|•)\s*/, ""), ok:false};
    }).filter(o => o.t);
    return {t:"chk", x:x, y:y, w:PW-x*2, c:col, f:S.font, title:title, items:tareas, fs:21};
  }
  if (kind === "mapa"){
    const root = lines[0].trim(), branches = [];
    for (let i = 1; i < lines.length; i++){
      const ind = lines[i].match(/^\s*/)[0].length, txt = lines[i].trim();
      if (ind >= 4 && branches.length) branches[branches.length-1].children.push(txt);
      else branches.push({label:txt, children:[]});
    }
    return {t:"map", x:x, y:y, c:col, root:title || root, branches:branches};
  }
  if (kind === "proceso"){
    const steps = lines.map(l => {
      const p = l.trim().split("::");
      return {label:p[0].trim().replace(/^\d+[.)]\s*/, ""), note:(p[1]||"").trim()};
    });
    return {t:"flow", x:x, y:y, w:PW-x*2-160, c:col, title:title, steps:steps};
  }
  return {t:"t", x:x, y:y, w:26, c:S.color, f:S.font, mw:PW-x*2,
    txt:(title ? title+"\n" : "") + lines.map(l => l.trim()).join("\n")};
}
$("#insBtn").addEventListener("click", () => {
  const raw = $("#struct").value.trim();
  if (!raw){ setStatus("No hay estructura que insertar.", true); return; }
  const kind = S.kind === "auto" ? "texto" : S.kind;
  const obj = parseStruct(kind, raw);
  if (!obj){ setStatus("No entendí la estructura.", true); return; }
  pushUndo();
  if (editTarget){
    /* reemplaza lo que ya estaba, en el mismo sitio */
    obj.x = editTarget.x; obj.y = editTarget.y;
    const i = S.items.indexOf(editTarget);
    if (i >= 0) S.items[i] = obj; else S.items.push(obj);
    editTarget = null;
    $("#insLbl").textContent = "Insertar";
    setStatus("Actualizado en la página "+(S.pi+1)+".");
  } else {
    /* baja el objeto si ya hay algo en la mitad superior */
    const used = S.items.some(s => s._bb && s._bb[1] < 400);
    if (used) obj.y = 150 + Math.min(900, S.items.reduce((m,s) => s._bb ? Math.max(m, s._bb[1]+s._bb[3]) : m, 0));
    S.items.push(obj);
    setStatus("Insertado en la página "+(S.pi+1)+". Con Mover lo acomodas; doble clic para editarlo.");
  }
  redraw(); markDirty();
  setTool("move"); S.sel = obj; redraw();
});

/* =================================================================== *
 *  Módulo Instructivo: dicto el paso, adjunto foto, se va armando
 * =================================================================== */
let stepPhoto = null;                         // dataURL pendiente
let editStep = null, quitarFoto = false;      // paso que se está editando
function istatus(m, err){ const s = $("#istatus"); s.textContent = m || ""; s.classList.toggle("err", !!err); }

function resetPasoForm(){
  editStep = null; quitarFoto = false; stepPhoto = null;
  $("#stepTitle").value = ""; $("#stepText").value = "";
  $("#stepPrev").classList.add("hide");
  $("#addStepLbl").textContent = "Agregar paso";
}

/* carga un paso existente en el formulario para editarlo */
async function cargarPaso(pIdx, it){
  editStep = {p:pIdx, it:it}; quitarFoto = false; stepPhoto = null;
  $("#stepTitle").value = it.title || "";
  $("#stepText").value = it.text || "";
  const prev = $("#stepPrev");
  prev.classList.add("hide");
  if (it.img){
    let d = (imgCache[it.img] && imgCache[it.img].src) || "";
    if (!d) d = await Store.getImg(S.nb.id, it.img).catch(() => "");
    if (d){ prev.querySelector("img").src = d; prev.classList.remove("hide"); }
  }
  $("#addStepLbl").textContent = "Guardar cambios";
  istatus("Editando el paso "+(it.n||"")+": cambia el título, la descripción o la foto.");
  $("#stepTitle").focus();
}

$("#instrBtn").addEventListener("click", async () => {
  const p = $("#instr");
  p.classList.toggle("hide");
  $("#instrBtn").classList.toggle("on", !p.classList.contains("hide"));
  if (!p.classList.contains("hide")){
    $("#studio").classList.add("hide");
    await renderSteps();
    $("#stepTitle").focus();
  } else stopRec();
});
$("#instrClose").addEventListener("click", () => {
  $("#instr").classList.add("hide"); $("#instrBtn").classList.remove("on"); stopRec(); resetPasoForm();
});

$("#stepPhoto").addEventListener("click", () => {
  const inp = document.createElement("input");
  inp.type = "file"; inp.accept = "image/*";
  inp.onchange = () => {
    const f = inp.files && inp.files[0]; if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      const im = new Image();
      im.onload = () => {
        stepPhoto = shrink(im, 1300);
        const prev = $("#stepPrev");
        prev.querySelector("img").src = stepPhoto;
        prev.classList.remove("hide");
        istatus("Foto lista (" + Math.round(stepPhoto.length/1400) + " KB aprox).");
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(f);
  };
  inp.click();
});
$("#stepPhotoX").addEventListener("click", () => {
  stepPhoto = null;
  $("#stepPrev").classList.add("hide");
  if (editStep){ quitarFoto = true; istatus("La foto se quita al guardar."); } else istatus("");
});

/* ================= REDACTOR TÉCNICO (sin IA, instantáneo) =================
 * Reglas del vocabulario de bodega: normaliza términos, pasa el verbo a
 * imperativo formal, mete los artículos y arma el título. No inventa nada.   */
const GLOSARIO = [
  /* términos y siglas del área */
  ["\\bvh\\b","vehículo"], ["\\bvhs\\b","vehículos"], ["\\bdoc\\b","documento"],
  ["\\bdocs\\b","documentos"], ["\\bfact\\b","factura"], ["\\bpantallazo\\b","captura de pantalla"],
  ["\\bsap\\b","SAP"], ["\\bzmeb\\b","ZMEB"], ["\\bvl02n\\b","VL02N"], ["\\bvt02n\\b","VT02N"],
  ["\\bvf01\\b","VF01"], ["\\bag01\\b","Ag01"], ["\\bag22\\b","Ag22"], ["\\bag18\\b","Ag18"],
  ["\\bag17\\b","Ag17"], ["\\bag16\\b","Ag16"], ["\\bhonor\\b","Honor"], ["\\bkoops\\b","Koops"],
  ["\\bexcel\\b","Excel"], ["\\bwms\\b","WMS"], ["\\bqr\\b","QR"],
  /* coloquial → técnico */
  ["\\bconducto\\b","conductor"], ["\\bmeter\\b","registrar"], ["\\bmontar\\b","cargar"],
  ["\\btirar\\b","descargar"], ["\\bbajar\\b","descargar"], ["\\bmirar\\b","verificar"],
  ["\\bchequear\\b","verificar"], ["\\brevisar\\b","verificar"], ["\\bavisar\\b","notificar"],
  ["\\barreglar\\b","corregir"], ["\\bmandar\\b","enviar"], ["\\bcoger\\b","tomar"],
  ["\\bsacar\\b","retirar"], ["\\bponer\\b","registrar"], ["\\bdar salida\\b","autorizar la salida"],
  ["\\bdar ingreso\\b","autorizar el ingreso"], ["\\bdar entrada\\b","autorizar el ingreso"],
  ["\\bhablar con\\b","informar a"], ["\\bdejar listo\\b","dejar preparado"]
];
/* infinitivo → imperativo formal (usted) */
const IMPERATIVO = {
  entregar:"Entregue", registrar:"Registre", verificar:"Verifique", validar:"Valide",
  cargar:"Cargue", descargar:"Descargue", facturar:"Facture", notificar:"Notifique",
  imprimir:"Imprima", enviar:"Envíe", recibir:"Reciba", sellar:"Selle", pesar:"Pese",
  contar:"Cuente", tomar:"Tome", retirar:"Retire", autorizar:"Autorice", corregir:"Corrija",
  informar:"Informe", confirmar:"Confirme", ingresar:"Ingrese", digitar:"Digite",
  crear:"Cree", generar:"Genere", anular:"Anule", cerrar:"Cierre", abrir:"Abra",
  buscar:"Busque", revisar:"Revise", hacer:"Realice", poner:"Registre", tener:"Tenga",
  subir:"Cargue", bajar:"Descargue", pasar:"Traslade", trasladar:"Traslade",
  separar:"Separe", marcar:"Marque", firmar:"Firme", escanear:"Escanee",
  adjuntar:"Adjunte", guardar:"Guarde", exportar:"Exporte", importar:"Importe",
  comparar:"Compare", cruzar:"Cruce", cuadrar:"Cuadre", reportar:"Reporte",
  solicitar:"Solicite", devolver:"Devuelva", despachar:"Despache", programar:"Programe"
};
/* infinitivo → sustantivo para el título */
const SUSTANTIVO = {
  entregar:"ENTREGA", registrar:"REGISTRO", verificar:"VERIFICACIÓN", validar:"VALIDACIÓN",
  cargar:"CARGUE", descargar:"DESCARGUE", facturar:"FACTURACIÓN", notificar:"NOTIFICACIÓN",
  imprimir:"IMPRESIÓN", enviar:"ENVÍO", recibir:"RECIBO", sellar:"SELLADO", pesar:"PESAJE",
  contar:"CONTEO", tomar:"TOMA", retirar:"RETIRO", autorizar:"AUTORIZACIÓN",
  corregir:"CORRECCIÓN", informar:"INFORME", confirmar:"CONFIRMACIÓN", ingresar:"INGRESO",
  digitar:"DIGITACIÓN", crear:"CREACIÓN", generar:"GENERACIÓN", anular:"ANULACIÓN",
  cerrar:"CIERRE", abrir:"APERTURA", buscar:"BÚSQUEDA", revisar:"REVISIÓN",
  hacer:"EJECUCIÓN", trasladar:"TRASLADO", separar:"SEPARACIÓN", marcar:"MARCACIÓN",
  firmar:"FIRMA", escanear:"ESCANEO", adjuntar:"ADJUNTO", guardar:"GUARDADO",
  exportar:"EXPORTACIÓN", importar:"IMPORTACIÓN", comparar:"COMPARACIÓN",
  cruzar:"CRUCE", cuadrar:"CUADRE", reportar:"REPORTE", solicitar:"SOLICITUD",
  devolver:"DEVOLUCIÓN", despachar:"DESPACHO", programar:"PROGRAMACIÓN"
};
const SIN_ARTICULO = ["el","la","los","las","un","una","unos","unas","al","del","en","a","de",
  "con","por","para","que","su","sus","mi","mis","este","esta","estos","estas","ese","esa",
  "todo","toda","todos","todas","cada","dos","tres","y","o"];

const EXCEPCION_GENERO = {
  foto:"la", fotos:"las", moto:"la", mano:"la", acta:"el", actas:"las",
  dia:"el", "día":"el", mapa:"el", mapas:"los", problema:"el", sistema:"el",
  programa:"el", tema:"el", planilla:"la", guia:"la", "guía":"la", estiba:"la",
  canasta:"la", tarima:"la", factura:"la", remision:"la", "remisión":"la"
};
function articulo(pal){
  const w = pal.toLowerCase().replace(/[^a-záéíóúñ]/g, "");
  if (EXCEPCION_GENERO[w]) return EXCEPCION_GENERO[w];
  if (/(ciones|siones|dades|tades)$/.test(w)) return "las";
  if (/(ción|sión|dad|tad|tud|umbre|ez)$/.test(w)) return "la";
  if (/as$/.test(w)) return "las";
  if (/os$/.test(w) || /es$/.test(w)) return "los";
  if (/a$/.test(w)) return "la";
  return "el";
}
/* el título se corta en la primera preposición: queda limpio */
const CORTE_TITULO = ["a","al","ante","antes","con","contra","de","del","desde","en","entre",
  "hacia","hasta","para","por","segun","según","sin","sobre","tras","y","o","que","cuando","si"];
function redactarTecnico(txt){
  let t = pulirLocal(txt).replace(/[.]$/, "");
  /* patrones de frase primero: arman la redacción */
  for (const [re, val] of FRASES) t = t.replace(re, val);
  /* luego el glosario palabra por palabra */
  for (const [re, val] of GLOSARIO) t = t.replace(new RegExp(re, "gi"), val);
  t = t.trim();
  let pal = t.split(/\s+/).filter(Boolean);
  if (!pal.length) return {title:"", text:""};

  /* verbo al frente en infinitivo → imperativo formal, con artículo */
  const prim = pal[0].toLowerCase().replace(/[^a-záéíóúñ]/g, "");
  let verbo = "";
  if (IMPERATIVO[prim]){
    verbo = prim;
    pal[0] = IMPERATIVO[prim];
    if (pal[1] && SIN_ARTICULO.indexOf(pal[1].toLowerCase()) < 0)
      pal.splice(1, 0, articulo(pal[1]));
  } else if (/(ar|er|ir)$/.test(prim) && prim.length > 3){
    verbo = prim;
    pal[0] = prim.slice(0, -2) + (prim.endsWith("ar") ? "e" : "a");
    pal[0] = pal[0][0].toUpperCase() + pal[0].slice(1);
    if (pal[1] && SIN_ARTICULO.indexOf(pal[1].toLowerCase()) < 0)
      pal.splice(1, 0, articulo(pal[1]));
  }

  let frase = pal.join(" ");
  frase = frase[0].toUpperCase() + frase.slice(1);
  if (!/[.!?]$/.test(frase)) frase += ".";

  /* título: sustantivo del verbo + primer complemento */
  let titulo;
  const limpio = (arr) => {
    const out = [];
    for (const w of arr){
      const k = w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
      if (CORTE_TITULO.indexOf(k) >= 0) break;              /* corta en la preposición */
      if (SIN_ARTICULO.indexOf(k) >= 0) continue;           /* se salta artículos */
      out.push(w);
      if (out.length === 3) break;
    }
    return out;
  };
  if (verbo){
    const base = SUSTANTIVO[verbo] || pulirLocal(verbo).replace(/[.]$/, "").toUpperCase();
    const resto = limpio(pal.slice(1));
    titulo = (base + (resto.length ? " DE " + resto.join(" ") : "")).toUpperCase();
  } else {
    titulo = limpio(pal).join(" ").toUpperCase() || pal.slice(0, 4).join(" ").toUpperCase();
  }
  return {title:titulo.replace(/[.,;]$/, ""), text:frase};
}

/* ---- patrones de frase: redacción del proceso, no palabra por palabra ---- */
const FRASES = [
  /* muletillas y rodeos */
  [/\b(o sea|osea|pues|este|eh)\b\s*/gi, ""],
  [/\bpara poder\b/gi, "para"],
  [/\bpoder (entrar|ingresar|salir|cargar|descargar|facturar|pesar)\b/gi, "$1"],
  [/\bhay que\b/gi, "se debe"],
  [/\btiene que\b/gi, "debe"],
  [/\bya que\b/gi, "debido a que"],
  [/\bpa'?\b/gi, "para"],
  /* actores y sitios de la bodega */
  [/\b(al|el|a) de honor\b/gi, "$1 vigilante de Honor"],
  [/\bvigilante de honor\b/gi, "vigilante de Honor"],
  [/\bacercar\b/gi, "entregar"], [/\bacerca\b/gi, "entrega"], [/\bacercan\b/gi, "entregan"],
  [/\bmontacarga\b/gi, "montacargas"],
  /* movimiento del vehículo */
  [/\bentrar a(l)?\b/gi, "ingresar a$1"],
  [/\bingresar a descargue\b/gi, "ingresar al área de descargue"],
  [/\ba descargue\b/gi, "al área de descargue"],
  [/\ba cargue\b/gi, "al área de cargue"],
  [/\bdar salida\b/gi, "autorizar la salida"],
  [/\bdar (ingreso|entrada)\b/gi, "autorizar el ingreso"],
  /* la frase típica del recibo: descargue + bahías se unen */
  [/\bingresar al [áa]rea de descargue (y|e) ingresa(n|r)? a las bah[ií]as\b/gi,
   "ingresar a las bahías de descargue"],
  [/\bbah[ií]as de descargue\b/gi, "bahías de descargue"],
  /* concordancia: "y" pasa a "e" antes de i- */
  [/\by (i|hi)/gi, "e $1"],
  /* espacios y comas que quedan sueltos */
  [/\s{2,}/g, " "], [/\s+([,.;:])/g, "$1"]
];

/* ---- diccionario del área: corrige por cercanía (sin IA) ---- */
const DIC = ("entrar entra entran entrada ingresar ingresa ingresan ingreso salir sale salen salida " +
"entregar entrega entregan entregue acercar acerca acercan verificar verifica verifique registrar registra " +
"registre cargar carga cargue cargan descargar descarga descargue descargan facturar factura facture " +
"notificar notifica notifique imprimir imprime imprima enviar envía envían recibir recibe reciba sellar " +
"sella selle pesar pesa pese contar cuenta cuente tomar toma tome retirar retira retire autorizar autoriza " +
"autorice corregir corrige corrija informar informa informe confirmar confirma confirme digitar digita " +
"digite crear crea cree generar genera genere anular anula anule cerrar cierra cierre abrir abre abra " +
"buscar busca busque revisar revisa revise hacer hace haga poner pone ponga tener tiene tenga pasar pasa " +
"trasladar traslada separar separa marcar marca firmar firma escanear escanea adjuntar adjunta guardar " +
"guarda exportar exporta importar importa comparar compara cruzar cruza cuadrar cuadra reportar reporta " +
"solicitar solicita devolver devuelve despachar despacha programar programa validar valida poder puede " +
"pueden deber debe deben quedar queda llegar llega llegan llevar lleva llevan " +
"documento documentos documentación conductor conductores transportador transportadores vehículo vehículos " +
"camión camiones bahía bahías muelle muelles descargue cargue estiba estibas canasta canastas envase envases " +
"producto productos factura facturas guía guías planilla planillas remisión remisiones sello sellos foto " +
"fotos pantalla pantallazo captura inventario inventarios depósito depósitos almacén almacenes bodega bodegas " +
"vigilante vigilancia portería patio novedad novedades faltante faltantes sobrante sobrantes pedido pedidos " +
"orden órdenes transporte traslado consumo notificación reporte archivo archivos sistema código códigos " +
"número números cantidad cantidades peso fecha hora turno área proceso procesos paso pasos formato formatos " +
"firma firmas copia copias original originales maestro rango sección botón datos dato " +
"para poder antes después luego entonces cuando mientras según hasta desde sobre entre cada todos todas " +
"mismo misma siguiente anterior correcto correcta completo completa pendiente listo lista bien mal " +
/* formas de imperativo y subjuntivo que YA están bien: para no "corregirlas" */
"ingrese ingresen entregue entreguen verifique registre cargue descargue facture notifique imprima envíe " +
"reciba selle pese cuente tome retire autorice corrija informe confirme digite cree genere anule cierre " +
"abra busque revise haga ponga tenga traslade separe marque firme escanee adjunte guarde exporte importe " +
"compare cruce cuadre reporte solicite devuelva despache programe valide acerque acerquen quede queden " +
"llegue lleguen lleve lleven pueda puedan deba deban salga salgan " +
/* palabras comunes: si están en la lista, nadie las toca */
"esto esta este esos esas aquel aquella otro otra otros otras nuevo nueva viejo primera primero segundo " +
"tercero último última cual quien porque pero sino aunque solo sola también tampoco siempre nunca casi " +
"donde adonde así aquí allí allá ahora hoy ayer mañana tarde noche día días semana mes año años " +
"sin más menos mucho mucha poco poca bastante ninguno ninguna alguno alguna cualquier ambos " +
"nombre placa sello caja cajas bulto bultos unidad unidades kilo kilos tonelada litro litros " +
"parte partes lado final inicio inicial nivel tipo clase estado motivo causa razón valor total " +
"correo teléfono usuario clave firma físico digital manual" ).split(" ");
const sinTilde = (w) => w.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const DIC_PLANO = {};
DIC.forEach(w => { const k = sinTilde(w); if (!(k in DIC_PLANO)) DIC_PLANO[k] = w; });

/* distancia de edición con transposiciones (Damerau-Levenshtein), con tope */
function distancia(a, b, tope){
  if (Math.abs(a.length - b.length) > tope) return tope + 1;
  const m = [];
  for (let i = 0; i <= a.length; i++){ m[i] = [i]; }
  for (let j = 0; j <= b.length; j++){ m[0][j] = j; }
  for (let i = 1; i <= a.length; i++){
    let fila = tope + 1;
    for (let j = 1; j <= b.length; j++){
      const c = a[i-1] === b[j-1] ? 0 : 1;
      m[i][j] = Math.min(m[i-1][j] + 1, m[i][j-1] + 1, m[i-1][j-1] + c);
      if (i > 1 && j > 1 && a[i-1] === b[j-2] && a[i-2] === b[j-1])
        m[i][j] = Math.min(m[i][j], m[i-2][j-2] + 1);
      fila = Math.min(fila, m[i][j]);
    }
    if (fila > tope) return tope + 1;
  }
  return m[a.length][b.length];
}
function corregirDic(w){
  const bajo = w.toLowerCase(), plano = sinTilde(bajo);
  if (DIC_PLANO[plano]) return DIC_PLANO[plano];      /* solo le faltaban tildes */
  if (plano.length < 4) return null;
  const tope = plano.length >= 8 ? 2 : 1;
  let mejor = null, mejorD = tope + 1;
  for (const k in DIC_PLANO){
    const d = distancia(plano, k, tope);
    if (d < mejorD){ mejorD = d; mejor = DIC_PLANO[k]; if (d === 1 && k.length === plano.length) break; }
  }
  return mejorD <= tope ? mejor : null;
}

/* ---- ortografía y tildes, base del redactor ---- */
const TILDES = {
  documentacion:"documentación", informacion:"información", facturacion:"facturación",
  notificacion:"notificación", transaccion:"transacción", ubicacion:"ubicación",
  revision:"revisión", inspeccion:"inspección", devolucion:"devolución",
  autorizacion:"autorización", validacion:"validación", programacion:"programación",
  confirmacion:"confirmación", operacion:"operación", produccion:"producción",
  distribucion:"distribución", importacion:"importación", exportacion:"exportación",
  observacion:"observación", numeracion:"numeración", relacion:"relación",
  vehiculo:"vehículo", vehiculos:"vehículos", camion:"camión", remision:"remisión",
  deposito:"depósito", depositos:"depósitos", almacen:"almacén", almacenes:"almacenes",
  numero:"número", numeros:"números", codigo:"código", codigos:"códigos",
  articulo:"artículo", articulos:"artículos", pedido:"pedido", guia:"guía", guias:"guías",
  dia:"día", dias:"días", tambien:"también", despues:"después", segun:"según",
  ademas:"además", asi:"así", aqui:"aquí", alli:"allí", esta:"esta", rapido:"rápido",
  ultimo:"último", ultima:"última", proximo:"próximo", maximo:"máximo", minimo:"mínimo",
  automatico:"automático", automatica:"automática", logistica:"logística",
  practica:"práctica", tecnico:"técnico", fisico:"físico", electronico:"electrónico",
  electronica:"electrónica", impresion:"impresión", sesion:"sesión", conexion:"conexión",
  version:"versión", camara:"cámara", movil:"móvil", telefono:"teléfono",
  quien:"quién", cuantos:"cuántos", cuanto:"cuánto", donde:"donde",
  supervision:"supervisión", planificacion:"planificación", verificacion:"verificación"
};
function corregirPalabra(w){
  const bajo = w.toLowerCase();
  /* transposiciones típicas al escribir rápido */
  let base = bajo
    .replace(/cuemnt/g, "cument").replace(/aicon/g, "ación").replace(/cion\b/g, "cion")
    .replace(/nesecit/g, "necesit").replace(/haser/g, "hacer").replace(/aser\b/g, "hacer");
  if (TILDES[base]) base = TILDES[base];
  else {
    const dic = corregirDic(base);
    if (dic) base = dic;
  }
  if (base === bajo) return w;
  /* devuelve la palabra con la misma forma de mayúsculas */
  if (w === w.toUpperCase() && w.length > 2) return base.toUpperCase();
  if (w[0] === w[0].toUpperCase()) return base[0].toUpperCase() + base.slice(1);
  return base;
}
function pulirLocal(txt){
  let t = String(txt || "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  t = t.replace(/(^|\s)i(\s)/g, "$1y$2");            /* "i" suelta es "y" */
  t = t.replace(/(^|\s)q(ue)?(\s)/gi, "$1que$3");     /* "q" es "que" */
  t = t.split(" ").map(w => {
    const m = w.match(/^([¿¡("']*)([\wáéíóúñÁÉÍÓÚÑ]+)([.,;:!?)"']*)$/);
    if (!m) return w;
    return m[1] + corregirPalabra(m[2]) + m[3];
  }).join(" ");
  /* mayúscula al empezar y después de punto */
  t = t.replace(/(^|[.!?]\s+)([a-záéíóúñ])/g, (x, a, b) => a + b.toUpperCase());
  if (!/[.!?]$/.test(t)) t += ".";
  return t;
}
function tituloLocal(txt){
  const t = pulirLocal(txt).replace(/[.]$/, "");
  return t.split(" ").slice(0, 6).join(" ").toUpperCase();
}

function dataURLaBlob(d){
  const [cab, b64] = String(d).split(",");
  const tipo = (cab.match(/:(.*?);/) || [,"image/jpeg"])[1];
  const bin = atob(b64), a = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
  return new Blob([a], {type:tipo});
}

/* lee respuestas en líneas marcadas: más rápido y no se rompe como el JSON */
function leerMarcas(txt){
  const t = String(txt || "").replace(/```[a-z]*/gi, "").trim();
  const tit = (t.match(/T[IÍ]TULO\s*:\s*(.+)/i) || [,""])[1].trim();
  let cue = (t.match(/TEXTO\s*:\s*([\s\S]+)/i) || [,""])[1].trim();
  if (!cue){
    /* si no puso marcas, tomamos lo que escribió tal cual */
    cue = t.split("\n").filter(l => l.trim() && !/^T[IÍ]TULO/i.test(l)).join(" ").trim();
  }
  return {title:tit.replace(/^["']|["']$/g, ""), text:cue.replace(/^["']|["']$/g, "")};
}

$("#polish").addEventListener("click", () => {
  const raw = $("#stepText").value.trim(), tit = $("#stepTitle").value.trim();
  if (!raw && !tit){ istatus("Primero dicta o escribe el paso.", true); return; }
  const out = redactarTecnico(raw || tit);
  if (out.text) $("#stepText").value = out.text;
  /* si ya escribiste título, solo se le corrige la ortografía: no se reemplaza */
  $("#stepTitle").value = tit
    ? pulirLocal(tit).replace(/[.]$/, "").toUpperCase()
    : (out.title || "");
  istatus(tit ? "Descripción redactada y título corregido." : "Redactado. Revisa y ajusta lo que quieras.");
});

$("#polishAI").addEventListener("click", async () => {
  const raw = $("#stepText").value.trim(), tit = $("#stepTitle").value.trim();
  if (!raw && !tit){ istatus("Primero dicta o escribe el paso.", true); return; }
  if (!sampleFn){ istatus("La IA no está configurada; usa el botón Redactar.", true); return; }
  const b = $("#polishAI"); b.disabled = true; istatus("Reescribiendo con IA…");
  const prompt =
    "Reescribe este paso de un instructivo de bodega (español de Colombia) en lenguaje técnico y formal.\n" +
    "Corrige ortografía. Frase clara y completa. No inventes datos ni pasos nuevos. " +
    "Conserva igual los códigos (SAP, ZMEB, VL02N, VT02N, VF01, Ag01, Ag22) y los nombres propios.\n" +
    "Responde EXACTAMENTE en dos líneas, sin nada más:\n" +
    "TITULO: <3 a 6 palabras en mayúsculas>\nTEXTO: <1 o 2 frases>\n\n" +
    "Título actual: " + (tit || "(vacío)") + "\nPaso escrito: " + (raw || tit).slice(0, 1200);
  try{
    const r = await sampleFn(prompt, {modelTier:"quick", cache:false});
    const out = leerMarcas(r.text);
    if (out.text) $("#stepText").value = out.text;
    if (out.title && !tit) $("#stepTitle").value = out.title;
    istatus(out.text ? "Reescrito con IA." : "No entendí la respuesta. Usa el botón Redactar.", !out.text);
  }catch(e){ istatus(errMsg(e), true); }
  b.disabled = false;
});

/* recorre todas las páginas y devuelve los pasos existentes */
async function allSteps(){
  const out = [];
  for (let i = 0; i < S.pages.length; i++){
    const pg = S.pages[i];
    const items = (i === S.pi) ? S.items : (thumbCache[pg.id] || (thumbCache[pg.id] = await Store.getItems(S.nb.id, pg)));
    items.forEach(it => { if (it.t === "stp") out.push({p:i, it:it}); });
  }
  out.sort((a,b) => (a.it.n||0) - (b.it.n||0));
  return out;
}
async function renderSteps(){
  const list = await allSteps();
  $("#stepCount").textContent = list.length + (list.length === 1 ? " paso" : " pasos");
  const host = $("#steplist"); host.textContent = "";
  if (!list.length){
    const e = document.createElement("div");
    e.className = "mic-help"; e.textContent = "Todavía no hay pasos. Dicta el primero.";
    host.appendChild(e); return;
  }
  list.forEach(({p, it}) => {
    const row = document.createElement("div"); row.className = "stepit";
    const n = document.createElement("b"); n.textContent = it.n || "?";
    const tx = document.createElement("span"); tx.textContent = it.title || it.text || "(sin texto)";
    row.appendChild(n); row.appendChild(tx);
    if (it.img){
      const th = document.createElement("i");
      const im = imgCache[it.img]; if (im) th.style.backgroundImage = "url("+im.src+")";
      row.appendChild(th);
    }
    const ed = document.createElement("button"); ed.title = "Editar este paso";
    ed.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3l5 5L8 21H3v-5z"/></svg>';
    ed.addEventListener("click", () => cargarPaso(p, it));
    row.appendChild(ed);
    const go = document.createElement("button"); go.title = "Ir al paso";
    go.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></svg>';
    go.addEventListener("click", () => { $("#instr").classList.add("hide"); $("#instrBtn").classList.remove("on"); loadPage(p); });
    const del = document.createElement("button"); del.title = "Eliminar paso";
    del.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    del.addEventListener("click", () => delStep(p, it));
    row.appendChild(go); row.appendChild(del);
    host.appendChild(row);
  });
}
async function delStep(pIdx, it){
  if (!await confirmar("Eliminar el paso "+(it.n||""), "El paso y su foto se borran, y los demás se renumeran.")) return;
  const pg = S.pages[pIdx];
  if (pIdx === S.pi){
    pushUndo(); S.items = S.items.filter(o => o !== it); S.sel = null; redraw(); await save();
  } else {
    const items = (thumbCache[pg.id] || await Store.getItems(S.nb.id, pg)).filter(o => !(o.t === "stp" && o.n === it.n));
    thumbCache[pg.id] = items;
    const nc = await Store.putItems(S.nb.id, pg, items);
    if (nc !== pg.nc){ pg.nc = nc; await Store.putPage(S.nb.id, pg); }
  }
  if (it.img) Store.delImg(S.nb.id, it.img).catch(() => {});
  await renumberSteps();
  await renderSteps(); renderThumbs();
}
async function renumberSteps(){
  const list = await allSteps();
  let n = 1, touched = {};
  for (const {p, it} of list){
    if (it.n !== n){ it.n = n; touched[p] = true; }
    n++;
  }
  S.nb.stepN = list.length;
  for (const p of Object.keys(touched)){
    const i = +p, pg = S.pages[i];
    const items = (i === S.pi) ? S.items : thumbCache[pg.id];
    if (items) await Store.putItems(S.nb.id, pg, items);
  }
  if (S.pi in touched) redraw();
  await Store.putNotebook(S.nb);
}

$("#addStep").addEventListener("click", async () => {
  const title = $("#stepTitle").value.trim(), text = $("#stepText").value.trim();
  if (!title && !text && !stepPhoto){ istatus("Dicta el paso o adjunta la foto.", true); return; }
  const b = $("#addStep"); b.disabled = true;

  /* ---- editando un paso que ya existe ---- */
  if (editStep){
    istatus("Guardando…");
    try{
      const pIdx = editStep.p, it = editStep.it, viejo = it.img;
      let img = it.img;
      if (stepPhoto){
        img = uid();
        await Store.putImg(S.nb.id, img, stepPhoto);
        const im = new Image(); im.src = stepPhoto; imgCache[img] = im;
      } else if (quitarFoto) img = "";
      if (pIdx === S.pi) pushUndo();
      it.title = title; it.text = text; it.img = img;
      if (pIdx === S.pi){ redraw(); S.dirty = true; await save(); }
      else {
        const items = thumbCache[S.pages[pIdx].id];
        if (items) await Store.putItems(S.nb.id, S.pages[pIdx], items);
      }
      if (viejo && viejo !== img) Store.delImg(S.nb.id, viejo).catch(() => {});
      const num = it.n || "";
      resetPasoForm();
      await renderSteps(); renderThumbs();
      istatus("Paso "+num+" actualizado.");
    }catch(e){ istatus("No se pudo guardar ("+((e&&e.code)||"error")+").", true); }
    b.disabled = false;
    return;
  }

  istatus("Agregando…");
  try{
    const existing = await allSteps();
    const n = existing.length + 1;
    let imgId = "";
    if (stepPhoto){
      imgId = uid();
      await Store.putImg(S.nb.id, imgId, stepPhoto);
      const im = new Image(); im.src = stepPhoto; imgCache[imgId] = im;
    }
    const step = {t:"stp", x:78, y:0, w:PW-156, c:"#E0457B", n:n, title:title, text:text, img:imgId};
    /* buscar sitio: debajo de lo último de la página actual, o página nueva */
    let bottom = 110;
    for (const it of S.items) if (it._bb) bottom = Math.max(bottom, it._bb[1] + it._bb[3] + 26);
    const scratch = document.createElement("canvas").getContext("2d");
    step.y = bottom;
    const h = drawStep(scratch, step);
    if (bottom + h > PH - 70){
      await addPage(S.pages[S.pi].tpl === "blank" ? "blank" : "ruled");
      step.y = 110;
    }
    pushUndo(); S.items.push(step); redraw(); markDirty();
    S.nb.stepN = n; await save();
    resetPasoForm();
    await renderSteps();
    istatus("Paso "+n+" agregado en la página "+(S.pi+1)+".");
  }catch(e){ istatus("No se pudo agregar ("+((e&&e.code)||"error")+").", true); }
  b.disabled = false;
});

/* =================================================================== *
 *  Menú: plantillas, fondos, PDF, exportar
 * =================================================================== */
let openMenu = null;
function closeMenu(){ if (openMenu){ openMenu.remove(); openMenu = null; } }
document.addEventListener("click", e => { if (openMenu && !openMenu.contains(e.target) && !e.target.closest("#moreBtn")) closeMenu(); });
$("#moreBtn").addEventListener("click", e => {
  e.stopPropagation();
  if (openMenu){ closeMenu(); return; }
  const m = document.createElement("div"); m.className = "menu";
  m.innerHTML =
    '<button data-a="nueva"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M12 11v6M9 14h6"/></svg> Añadir página al cuaderno</button><hr>' +
    '<div class="lbl">Tamaño de esta página</div><div class="tpl-grid" id="hojaGrid"></div><hr>' +
    '<div class="lbl">Plantilla de esta página</div><div class="tpl-grid" id="tplGrid"></div><hr>' +
    '<button data-a="img"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 16l5-5 4 4 3-3 6 6"/></svg> Imagen de fondo</button>' +
    '<button data-a="pdf-in"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h4"/></svg> Importar PDF como páginas</button>' +
    '<button data-a="noimg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg> Quitar fondo</button>' +
    '<button data-a="clear"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13"/></svg> Vaciar la página</button><hr>' +
    '<button data-a="png"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M8 11l4 4 4-4M4 19h16"/></svg> Exportar página (PNG)</button>' +
    '<button data-a="pdf"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h4"/></svg> Exportar en PDF (eliges páginas)</button>' +
    '<button data-a="pdf1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h4"/><path d="M9 14h6" stroke-linecap="round"/></svg> PDF solo de esta página</button>';
  const r = $("#moreBtn").getBoundingClientRect();
  m.style.top = (r.bottom+6)+"px"; m.style.right = (window.innerWidth-r.right)+"px";
  document.body.appendChild(m); openMenu = m;
  const hg = m.querySelector("#hojaGrid");
  Object.keys(HOJAS).forEach(id => {
    const [w, h] = HOJAS[id];
    const b = document.createElement("button");
    b.className = "tpl"; b.setAttribute("aria-pressed", (S.pages[S.pi].hoja||"a4-v") === id ? "true" : "false");
    b.innerHTML = '<svg viewBox="0 0 60 40" style="width:100%;height:38px">' +
      '<rect x="' + (30 - (w>h?22:15)) + '" y="' + (19 - (w>h?15:22)/1.6) + '" width="' + (w>h?44:30) + '" height="' + (w>h?30:44)/1.6 + '" ' +
      'fill="none" stroke="#EFCFDE" stroke-width="1.6" rx="2"/></svg>' +
      '<em>' + HOJA_NOMBRE[id].replace(" vertical"," vert.").replace(" horizontal"," horiz.") + '</em>';
    b.addEventListener("click", async () => {
      S.pages[S.pi].hoja = id;
      await Store.putPage(S.nb.id, S.pages[S.pi]);
      aplicarHoja(S.pages[S.pi]);
      setZoom(zoomQueQuepa()); redraw();
      closeMenu(); thumbCache = {}; renderThumbs();
      toast("Hoja: " + HOJA_NOMBRE[id] + ".");
    });
    hg.appendChild(b);
  });
  const g = m.querySelector("#tplGrid");
  TPLS.forEach(([id, label]) => {
    const b = document.createElement("button");
    b.className = "tpl"; b.setAttribute("aria-pressed", S.pages[S.pi].tpl === id ? "true" : "false");
    b.innerHTML = tplPreview(id)+"<em>"+label+"</em>";
    b.addEventListener("click", async () => {
      S.pages[S.pi].tpl = id; await Store.putPage(S.nb.id, S.pages[S.pi]);
      redraw(); closeMenu(); thumbCache = {}; renderThumbs();
    });
    g.appendChild(b);
  });
  m.querySelectorAll("button[data-a]").forEach(b => b.addEventListener("click", () => menuAction(b.dataset.a)));
});
function tplPreview(id){
  const c = "#EFCFDE";
  if (id === "blank") return "";
  if (id === "ruled") return '<svg viewBox="0 0 60 40" style="width:100%;height:38px" stroke="'+c+'" stroke-width="1"><path d="M6 10h48M6 18h48M6 26h48"/><path d="M12 4v32" stroke="#F09CBC"/></svg>';
  if (id === "grid")  return '<svg viewBox="0 0 60 40" style="width:100%;height:38px" stroke="'+c+'" stroke-width="1"><path d="M6 10h48M6 18h48M6 26h48M14 4v32M26 4v32M38 4v32M50 4v32"/></svg>';
  if (id === "dots")  return '<svg viewBox="0 0 60 40" style="width:100%;height:38px" fill="'+c+'">'+[10,18,26].map(y=>[14,26,38,50].map(x=>'<circle cx="'+x+'" cy="'+y+'" r="1.3"/>').join("")).join("")+'</svg>';
  if (id === "mm")    return '<svg viewBox="0 0 60 40" style="width:100%;height:38px" stroke="'+c+'" stroke-width=".5"><path d="M6 8h48M6 12h48M6 16h48M6 20h48M6 24h48M6 28h48M10 4v32M18 4v32M26 4v32M34 4v32M42 4v32M50 4v32"/></svg>';
  return '<svg viewBox="0 0 60 40" style="width:100%;height:38px" stroke="'+c+'" stroke-width="1"><path d="M22 8h32M22 14h32M22 20h32"/><path d="M18 4v24" stroke="#F09CBC"/><path d="M6 28h48"/></svg>';
}
async function menuAction(a){
  closeMenu();
  const pg = S.pages[S.pi];
  if (a === "nueva"){ await addPage(); toast("Página "+(S.pi+1)+" creada."); }
  if (a === "clear"){
    if (!S.items.length) return;
    if (!await confirmar("Vaciar la página "+(S.pi+1), "Se borra todo lo escrito. Puedes recuperarlo con Ctrl+Z.", "Vaciar")) return;
    pushUndo(); S.items = []; S.sel = null; redraw(); markDirty();
  }
  if (a === "noimg"){ pg.bg = ""; bgImg = null; await Store.putPage(S.nb.id, pg); redraw(); }
  if (a === "img") pickImage();
  if (a === "pdf-in") importPDF();
  if (a === "png") exportPNG();
  if (a === "pdf") exportPDF();
  if (a === "pdf1"){ await save(); await pdfDeCuaderno(S.nb, false, [S.pi]); }
}

function shrink(img, maxW){
  let w = Math.min(maxW || 1400, img.width), data = "";
  for (const q of [.72,.55,.4,.28]){
    const c = document.createElement("canvas");
    c.width = w; c.height = Math.round(img.height*w/img.width);
    const cc = c.getContext("2d");
    cc.fillStyle = "#fff"; cc.fillRect(0,0,c.width,c.height);
    cc.drawImage(img, 0, 0, c.width, c.height);
    data = c.toDataURL("image/jpeg", q);
    if (data.length < 170000) return data;
    w = Math.round(w*.82);
  }
  return data;
}
function pickImage(){
  const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*";
  inp.onchange = () => {
    const f = inp.files && inp.files[0]; if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      const im = new Image();
      im.onload = async () => {
        const data = shrink(im, 1400);
        if (data.length > 230000){ toast("Imagen muy pesada; usa una más pequeña."); return; }
        S.pages[S.pi].bg = data; await Store.putPage(S.nb.id, S.pages[S.pi]);
        const im2 = new Image(); im2.onload = () => { bgImg = im2; redraw(); }; im2.src = data;
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(f);
  };
  inp.click();
}
async function importPDF(){
  if (!window.pdfjsLib){ toast("El lector de PDF no cargó. Recarga la página."); return; }
  try{ pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"; }catch(e){}
  const inp = document.createElement("input"); inp.type = "file"; inp.accept = "application/pdf";
  inp.onchange = async () => {
    const f = inp.files && inp.files[0]; if (!f) return;
    toast("Importando el PDF…", 5000);
    try{
      const buf = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({data:buf}).promise;
      const n = Math.min(doc.numPages, 40);
      await save();
      for (let i = 1; i <= n; i++){
        const page = await doc.getPage(i);
        const vp0 = page.getViewport({scale:1});
        const sc = 1240/vp0.width;
        const vp = page.getViewport({scale:sc});
        const cv = document.createElement("canvas");
        cv.width = vp.width; cv.height = vp.height;
        await page.render({canvasContext:cv.getContext("2d"), viewport:vp}).promise;
        const im = new Image();
        await new Promise(res => { im.onload = res; im.src = cv.toDataURL("image/jpeg", .8); });
        const data = shrink(im, 1240);
        const pg = {id:uid(), i:S.pages.length, tpl:"blank", nc:0, bg:data};
        S.pages.push(pg); await Store.putPage(S.nb.id, pg);
      }
      thumbCache = {};
      await loadPage(S.pages.length - n);
      toast(n+" páginas importadas. Ya puedes escribir encima.");
    }catch(e){ toast("No pude leer ese PDF aquí. Prueba exportándolo como imágenes."); }
  };
  inp.click();
}

function renderPageTo(canvas, pg, items, bg, scale){
  aplicarHoja(pg);
  canvas.width = Math.round(PW*scale); canvas.height = Math.round(PH*scale);
  const c = canvas.getContext("2d");
  c.setTransform(scale,0,0,scale,0,0);
  drawTemplate(c, pg.tpl, bg || null);
  for (const s of items) drawItem(c, s);
}
async function offer(filename, blob){
  try{
    const url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }catch(e){ toast("No se pudo descargar aquí."); }
}
const safeName = n => (n||"cuaderno").replace(/[^\wáéíóúñÁÉÍÓÚÑ \-]/g,"").trim().replace(/\s+/g,"-").slice(0,40) || "cuaderno";
async function exportPNG(){
  await save(); await preloadImgs(S.items);
  const c = document.createElement("canvas");
  renderPageTo(c, S.pages[S.pi], S.items, bgImg, 2);
  c.toBlob(b => offer(safeName(S.nb.name)+"-p"+(S.pi+1)+".png", b), "image/png");
  toast("Preparando el PNG…");
}
async function preloadImgs(items, nbId){
  const id = nbId || (S.nb && S.nb.id);
  if (!id) return;
  for (const it of items){
    if (it.t !== "stp" || !it.img || imgCache[it.img]) continue;
    const d = await Store.getImg(id, it.img).catch(() => "");
    if (!d) continue;
    imgCache[it.img] = await new Promise(res => {
      const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = d;
    });
  }
}
/* PDF de un cuaderno completo, exactamente como está: plantillas, tamaños,
 * fondos, trazos, tablas, mapas y los pasos con sus fotos.                */
/* "todas", "2", "1-3", "1,3,5"  →  lista de páginas */
function parsePaginas(txt, total){
  const t = String(txt || "").trim().toLowerCase();
  if (!t || t === "todas" || t === "todo" || t === "*") return Array.from({length:total}, (_, i) => i);
  const out = new Set();
  for (const parte of t.split(/[,;]+/)){
    const m = parte.trim().match(/^(\d+)\s*(?:-|a|hasta)\s*(\d+)$/);
    if (m){
      let a = +m[1], b = +m[2];
      if (a > b){ const x = a; a = b; b = x; }
      for (let i = a; i <= b; i++) if (i >= 1 && i <= total) out.add(i-1);
    } else {
      const nn = parseInt(parte, 10);
      if (nn >= 1 && nn <= total) out.add(nn-1);
    }
  }
  return Array.from(out).sort((x, y) => x - y);
}

async function pdfDeCuaderno(nb, preguntar, fijas){
  if (!window.jspdf){ toast("El generador de PDF no cargó. Recarga la página."); return; }
  const abierto = S.nb && S.nb.id === nb.id;
  const pages = abierto ? S.pages : await Store.listPages(nb.id);
  if (!pages.length){ toast("Ese cuaderno no tiene páginas."); return; }

  /* elegir qué páginas van al PDF */
  let idx = fijas && fijas.length ? fijas.slice() : Array.from({length:pages.length}, (_, i) => i);
  if (!fijas && preguntar !== false && pages.length > 1){
    const r = await dialog({
      title: "PDF de " + nb.name,
      text: 'Escribe "todas", o los números que quieras: 2 · 1-3 · 1,3,5   (son ' + pages.length + " páginas)",
      input: abierto ? "todas" : "todas",
      ok: "Generar PDF"
    });
    if (r == null) return;
    idx = parsePaginas(r, pages.length);
    if (!idx.length){ toast("No entendí esas páginas. Prueba con 1-3 o 1,3,5."); return; }
  }

  toast('Armando el PDF (' + idx.length + (idx.length === 1 ? " página" : " páginas") + ')…', 6000);
  const {jsPDF} = window.jspdf;
  const pt0 = HOJA_PT[pages[idx[0]].hoja || "a4-v"];
  const doc = new jsPDF({unit:"pt", format:[pt0[0], pt0[1]], compress:true});
  try{
    for (let k = 0; k < idx.length; k++){
      const i = idx[k], pg = pages[i];
      const items = (abierto && i === S.pi) ? S.items : await Store.getItems(nb.id, pg);
      await preloadImgs(items, nb.id);
      let bg = null;
      if (pg.bg) bg = await new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = pg.bg; });
      const c = document.createElement("canvas");
      renderPageTo(c, pg, items, bg, 1.7);
      const pt = HOJA_PT[pg.hoja || "a4-v"];
      if (k) doc.addPage([pt[0], pt[1]]);
      doc.addImage(c.toDataURL("image/jpeg", .88), "JPEG", 0, 0, pt[0], pt[1]);
    }
    const sufijo = idx.length === pages.length ? "" : "-p" + (idx[0]+1) + (idx.length > 1 ? "-" + (idx[idx.length-1]+1) : "");
    await offer(safeName(nb.name) + sufijo + ".pdf", doc.output("blob"));
  }catch(e){ toast("No se pudo armar el PDF: " + ((e && e.message) || "error")); }
  if (S.nb && S.pages[S.pi]){ aplicarHoja(S.pages[S.pi]); sizeCanvas(); redraw(); }
}
async function exportPDF(){
  await save();
  await pdfDeCuaderno(S.nb);
}

/* =================================================================== *
 *  Biblioteca
 * =================================================================== */
/* ---- navegación: portada · cuadernos · editor ---- */
function vista(v){
  ["home","library","editor"].forEach(id => {
    $("#"+id).classList.toggle("hide", id !== v);
  });
}

async function refreshLibrary(){
  try{ S.notebooks = await Store.listNotebooks(); }
  catch(e){
    const n = $("#storeNote");
    n.innerHTML = '<span class="dot warn"></span><span></span>';
    n.querySelector("span:last-child").textContent = storeErr(e);
    console.error("NotesGene · almacenamiento:", e);
    S.notebooks = [];
  }
  const txt = S.notebooks.length ? S.notebooks.length + (S.notebooks.length === 1 ? " cuaderno" : " cuadernos") : "";
  $("#nbCount").textContent = txt;
  $("#homeCount").textContent = S.notebooks.length ? "· " + S.notebooks.length : "";
  const g = $("#nbGrid"); g.textContent = "";
  S.notebooks.forEach(nb => {
    const card = document.createElement("div"); card.className = "nb";
    card.innerHTML =
      '<div class="nb-cover"></div><button class="nb-open"><strong></strong><span></span></button>' +
      '<div class="nb-tools">' +
      '<button data-a="ren" title="Renombrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3l5 5L8 21H3v-5z"/></svg></button>' +
      '<button data-a="pdf" title="Descargar este cuaderno en PDF"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v11M8 10l4 4 4-4"/><path d="M5 20h14"/></svg></button>' +
      '<button data-a="del" title="Eliminar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13"/></svg></button></div>';
    card.querySelector("strong").textContent = nb.name;
    card.querySelector("span").textContent = (nb.pages||1)+" pág · "+fmtDate(nb.updatedAt);
    card.querySelector(".nb-open").addEventListener("click", () => openNotebook(nb));
    card.querySelector('[data-a="ren"]').addEventListener("click", async () => {
      const n = await pedir("Renombrar cuaderno", nb.name); if (n == null) return;
      nb.name = n.trim() || nb.name; nb.updatedAt = Date.now();
      await Store.putNotebook(nb); refreshLibrary();
    });
    card.querySelector('[data-a="pdf"]').addEventListener("click", async (ev) => {
      const b = ev.currentTarget; b.disabled = true;
      await pdfDeCuaderno(nb);
      b.disabled = false;
    });
    card.querySelector('[data-a="del"]').addEventListener("click", async () => {
      if (!await confirmar("Eliminar cuaderno", '"'+nb.name+'" y todas sus páginas se borran. No se puede deshacer.')) return;
      await Store.delNotebook(nb.id); refreshLibrary();
    });
    g.appendChild(card);
  });
  const add = document.createElement("button"); add.className = "nb new";
  add.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg> Nuevo cuaderno';
  add.addEventListener("click", createNotebook);
  g.appendChild(add);
}
async function createNotebook(){
  const name = await pedir("Nuevo cuaderno", "Cuaderno "+(S.notebooks.length+1), "Crear");
  if (name == null) return;
  const nb = {id:uid(), name:name.trim()||"Sin título", updatedAt:Date.now(), pages:1};
  await Store.putNotebook(nb);
  await Store.putPage(nb.id, {id:uid(), i:0, tpl:"ruled", nc:0, bg:"", hoja:"a4-v"});
  await openNotebook(nb);
}
async function openNotebook(nb){
  S.nb = nb;
  S.pages = await Store.listPages(nb.id);
  if (!S.pages.length){
    const pg = {id:uid(), i:0, tpl:"ruled", nc:0, bg:"", hoja:"a4-v"};
    S.pages = [pg]; await Store.putPage(nb.id, pg);
  }
  thumbCache = {};
  $("#nbName").value = nb.name;
  vista("editor");
  setTool("pen"); buildSizes(); buildSwatches(); buildFonts(); buildKinds();
  await loadPage(0);
  setZoom(zoomQueQuepa());
}
$("#libTheme").addEventListener("click", () => {
  const c = document.documentElement.getAttribute("data-theme");
  const dark = c ? c === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute("data-theme", dark ? "light" : "dark");
});
$("#newNb").addEventListener("click", createNotebook);
$("#newNb2").addEventListener("click", createNotebook);
$("#verCuadernos").addEventListener("click", async () => { vista("library"); await refreshLibrary(); });
$("#homeBack").addEventListener("click", () => vista("home"));
window.addEventListener("resize", () => { if (!$("#editor").classList.contains("hide")){ sizeCanvas(); redraw(); } });

/* =================================================================== *
 *  Arranque
 * =================================================================== */
(async function start(){
  buildSizes(); buildSwatches(); buildFonts(); buildKinds(); refreshUndo();
  if (!SR) $("#micHelp").textContent = "Este navegador no ofrece dictado. Escribe abajo o usa «Leer mi letra».";
  try{
  await refreshLibrary();
  if ($("#storeNote").querySelector(".dot.warn") == null)
    $("#storeNote").innerHTML =
      '<span class="dot"></span><span>Guardado en tu cuenta: los cuadernos te siguen del celular al computador.</span>';
  if (!S.notebooks.length){
    const nb = {id:uid(), name:"Mi primer cuaderno", updatedAt:Date.now(), pages:1};
    await Store.putNotebook(nb);
    await Store.putPage(nb.id, {id:uid(), i:0, tpl:"ruled", nc:0, bg:""});
    await refreshLibrary();
  }
  }catch(e){
    $("#storeNote").innerHTML = '<span class="dot warn"></span><span></span>';
    $("#storeNote").querySelector("span:last-child").textContent = storeErr(e);
    console.error("NotesGene · almacenamiento:", e);
  }
  sampleFn = opts.ai || null;
  sampleImages = !!opts.ai;
  if (!sampleFn) $("#genBtn").title = "IA no disponible en esta vista";
  if (!sampleImages) $("#readInk").disabled = !sampleFn;
})();

}
