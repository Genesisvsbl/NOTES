-- NotesGene · esquema de base de datos
-- Pégalo en Supabase → SQL Editor → Run.

create extension if not exists pgcrypto;

-- ---------- cuadernos ----------
create table if not exists public.notebooks (
  id          text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null default 'Sin título',
  updated_at  bigint not null default 0,      -- ms desde epoch (lo pone la app)
  pages       int  not null default 1,
  step_n      int  not null default 0,         -- cuántos pasos de instructivo lleva
  created_at  timestamptz not null default now()
);

-- ---------- páginas (con su contenido) ----------
create table if not exists public.pages (
  id           text primary key,
  notebook_id  text not null references public.notebooks(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  idx          int  not null default 0,        -- orden dentro del cuaderno
  tpl          text not null default 'ruled',  -- blank|ruled|grid|dots|mm|cornell
  bg           text default '',                -- imagen de fondo (data URL) o ''
  items        jsonb not null default '[]'::jsonb, -- trazos, texto, tablas, mapas, pasos
  updated_at   timestamptz not null default now()
);
create index if not exists pages_nb_idx on public.pages (notebook_id, idx);

-- ---------- fotos de los pasos del instructivo ----------
create table if not exists public.images (
  id           text primary key,
  notebook_id  text not null references public.notebooks(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  data         text not null,                  -- data URL jpeg comprimido (~150 KB)
  created_at   timestamptz not null default now()
);
create index if not exists images_nb on public.images (notebook_id);

-- ---------- cada quien ve solo lo suyo ----------
alter table public.notebooks enable row level security;
alter table public.pages     enable row level security;
alter table public.images    enable row level security;

drop policy if exists "notebooks propios" on public.notebooks;
create policy "notebooks propios" on public.notebooks
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "pages propias" on public.pages;
create policy "pages propias" on public.pages
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "images propias" on public.images;
create policy "images propias" on public.images
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
