# NotesGene

Cuaderno de escritura a mano para iPad y computador: lápiz con presión, resaltador,
plantillas, dictado por voz, y generación de **tablas, cuadros comparativos, mapas
mentales, mapas de proceso** e **instructivos paso a paso con foto**.

Stack: **Next.js 14** (App Router) · **Supabase** (Postgres + Auth) · **Vercel** · PWA instalable.

---

## 1. Qué es cada cosa

```
app/
  layout.jsx          shell, fuentes, PWA, carga de jsPDF y pdf.js
  page.jsx            entrada
  globals.css         todo el diseño (rosa y blanco, claro y oscuro)
  api/ia/route.js     única puerta a la IA — la API key vive aquí, en el servidor
components/
  NotesGeneApp.jsx    acceso por correo + monta el motor
lib/
  engine.js           el motor: canvas, herramientas, paneles Crear e Instructivo
  codec.js            cómo se guardan trazos/objetos (compacto)
  store-supabase.js   guardado: cuadernos, páginas, fotos
  ai-client.js        cliente que habla con /api/ia
  supabase-client.js  cliente de Supabase en el navegador
supabase/schema.sql   tablas + RLS (cada usuario ve solo lo suyo)
public/               manifest, iconos, service worker
```

El motor (`lib/engine.js`) no depende de React: se monta en un `<div>` y recibe
dos cosas — `store` (dónde se guarda) y `ai` (a quién se le pregunta). Si algún día
cambias Supabase por otra base, solo reescribes `store-supabase.js`.

## 2. Montarlo (10 minutos)

```bash
npm install
cp .env.example .env.local     # y llena los 3 valores
npm run dev                    # http://localhost:3000
```

**Supabase**

1. Crea el proyecto en supabase.com.
2. SQL Editor → pega `supabase/schema.sql` → Run.
3. Project Settings → API → copia `Project URL` y `anon public` a `.env.local`.
4. Authentication → URL Configuration → agrega `http://localhost:3000` y tu dominio de
   Vercel en *Site URL* y *Redirect URLs* (el acceso es por enlace al correo).

**IA** (tablas, mapas, pulir pasos, leer tu letra)

1. console.anthropic.com → API keys → crea una.
2. Ponla en `ANTHROPIC_API_KEY`. **Nunca** con prefijo `NEXT_PUBLIC_`: el navegador no debe verla.
3. `/api/ia` exige sesión de Supabase, así que nadie de fuera puede gastar tu key.

Si no pones la key, la app funciona igual — los botones de IA avisan que no está disponible
y el resto (escribir, tablas a mano, instructivos, exportar) sigue funcionando.

## 3. Subirlo a Vercel

```bash
npm i -g vercel
vercel            # primera vez: crea el proyecto
vercel --prod
```

En Vercel → Settings → Environment Variables mete las mismas 3 (o 4) variables del
`.env.local`. Después, en Supabase → Authentication → Redirect URLs, agrega el dominio final.

## 4. Instalarla en el iPad

Abre el dominio en Safari → botón Compartir → **Añadir a pantalla de inicio**.
Queda como app: pantalla completa, ícono propio y abre sin señal (lo último visto).

Para escribir cómodo con el Apple Pencil: el botón del lápiz (arriba a la derecha) activa
**solo lápiz**, así los dedos desplazan la hoja y la palma no raya. Se activa solo la primera
vez que detecta el Pencil.

## 5. Cómo se usa

- **Herramientas** (columna izquierda): pluma · resaltador · borrador · texto · mover. Atajos `1`–`5`, `Ctrl+Z`.
- **Crear**: dictas o escribes, eliges *Auto / Texto / Tabla / Comparativo / Mapa mental / Proceso*
  y "Generar con IA" te arma la estructura; también puedes escribirla a mano con la sintaxis
  que aparece debajo y darle "Insertar". "Leer mi letra" transcribe la página escrita a mano.
- **Instructivo**: dictas el paso, adjuntas la foto, "Pulir con IA" lo deja en imperativo y
  "Agregar paso" lo dibuja numerado; cuando no cabe, crea la página siguiente sola.
- **Menú ⋮**: plantilla de la página, imagen de fondo, importar PDF como páginas,
  exportar la página en PNG o el cuaderno en PDF.

## 6. Notas técnicas

- **Dictado**: Web Speech API del navegador (Safari y Chrome). En tu propio dominio pide
  permiso de micrófono una vez y queda. No hay transcripción de audios ya grabados: eso
  necesita un servicio de audio a texto (se puede agregar después en `/api/ia`).
- **Fotos**: se comprimen a ~150 KB y se guardan en la tabla `images`. Si el volumen crece
  mucho, muévelas a Supabase Storage y guarda la URL en vez del data URL (hay que poner
  `crossOrigin="anonymous"` al cargarlas para que el exportar a PDF siga funcionando).
- **Hoja**: A4 a 150 dpi (1240 × 1754 px). Los trazos se guardan como vectores, así que el
  zoom y el PDF salen nítidos.

## 7. Git

```bash
git init
git add -A
git commit -m "NotesGene: cuaderno con dictado, estructuras e instructivos"
git branch -M main
gh repo create notesgene --private --source=. --remote=origin
git push -u origin main
```

Si ya tienes el repo creado en GitHub:

```bash
git remote add origin git@github.com:TU-USUARIO/notesgene.git
git push -u origin main
```
