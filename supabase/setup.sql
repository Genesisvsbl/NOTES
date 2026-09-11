-- ============================================================
-- NotesGene · montaje completo
-- Pégalo en Supabase → SQL Editor → New query → Run.
-- Se puede correr varias veces sin daño.
--
-- Crea: tablas + seguridad por usuario + el usuario que entra con clave 3026.
-- Si cambias la clave aquí, cámbiala también en components/NotesGeneApp.jsx.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------------- cuadernos ----------------
create table if not exists public.notebooks (
  id          text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null default 'Sin título',
  updated_at  bigint not null default 0,
  pages       int  not null default 1,
  step_n      int  not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------- páginas (con su contenido) ----------------
create table if not exists public.pages (
  id           text primary key,
  notebook_id  text not null references public.notebooks(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  idx          int  not null default 0,
  tpl          text not null default 'ruled',
  bg           text default '',
  items        jsonb not null default '[]'::jsonb,
  updated_at   timestamptz not null default now()
);
create index if not exists pages_nb_idx on public.pages (notebook_id, idx);

-- tamaño y orientación de cada página: a4-v, a4-h, carta-v, carta-h
alter table public.pages add column if not exists hoja text not null default 'a4-v';

-- ---------------- fotos de los pasos del instructivo ----------------
create table if not exists public.images (
  id           text primary key,
  notebook_id  text not null references public.notebooks(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  data         text not null,
  created_at   timestamptz not null default now()
);
create index if not exists images_nb on public.images (notebook_id);

-- ---------------- permisos del rol que usa la app ----------------
-- Sin esto Postgres responde 42501 "permission denied", aunque las tablas existan.
-- Quién ve QUÉ filas lo sigue decidiendo la seguridad por usuario de más abajo.
grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on public.notebooks to authenticated;
grant select, insert, update, delete on public.pages     to authenticated;
grant select, insert, update, delete on public.images    to authenticated;

alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;

-- ---------------- cada quien ve solo lo suyo ----------------
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

-- ============================================================
-- Usuarios que entran con clave. Cada uno ve solo SUS cuadernos.
--   clave 3026 → gene@notesgene.app
--   clave 2630 → cristian@notesgene.app
-- La app manda 'NG-<clave>-notesgene' como contraseña real.
-- Para agregar a alguien: una fila más en la lista de abajo
-- y una línea en components/NotesGeneApp.jsx (CUENTAS).
-- ============================================================
do $$
declare
  cuenta record;
  uid uuid;
begin
  for cuenta in
    select * from (values
      ('gene@notesgene.app',     'NG-3026-notesgene', 'Gene'),
      ('cristian@notesgene.app', 'NG-2630-notesgene', 'Cristian')
    ) as t(correo, pass, nombre)
  loop
    select id into uid from auth.users where email = cuenta.correo;

    if uid is null then
      uid := gen_random_uuid();

      insert into auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, created_at, updated_at,
        raw_app_meta_data, raw_user_meta_data,
        confirmation_token, recovery_token, email_change_token_new, email_change
      ) values (
        '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
        cuenta.correo, crypt(cuenta.pass, gen_salt('bf')),
        now(), now(), now(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object('nombre', cuenta.nombre),
        '', '', '', ''
      );

      begin
        insert into auth.identities (
          id, user_id, provider_id, identity_data, provider,
          last_sign_in_at, created_at, updated_at
        ) values (
          gen_random_uuid(), uid, uid::text,
          jsonb_build_object('sub', uid::text, 'email', cuenta.correo), 'email',
          now(), now(), now()
        );
      exception when others then
        insert into auth.identities (
          user_id, provider_id, identity_data, provider,
          last_sign_in_at, created_at, updated_at
        ) values (
          uid, uid::text,
          jsonb_build_object('sub', uid::text, 'email', cuenta.correo), 'email',
          now(), now(), now()
        );
      end;

      raise notice 'Usuario creado: %', cuenta.correo;
    else
      update auth.users
         set encrypted_password = crypt(cuenta.pass, gen_salt('bf')),
             email_confirmed_at = coalesce(email_confirmed_at, now()),
             updated_at = now()
       where id = uid;
      raise notice 'Clave actualizada: %', cuenta.correo;
    end if;
  end loop;
end $$;
