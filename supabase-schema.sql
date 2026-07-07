-- Campus de Ascensos - schema Supabase
-- Ejecutar en el SQL editor de tu proyecto Supabase (una sola vez)

-- ------------------------------------------------------------------
-- ESTRUCTURA ORGANIZACIONAL (editable desde la app)
-- ------------------------------------------------------------------
create table if not exists regionales (
  id uuid primary key default gen_random_uuid(),
  marca text not null,             -- "extremas" | "sabores"
  nombre text not null,
  cargo_extra text,                -- ej: "GTE de Operaciones"
  orden int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists zonales (
  id uuid primary key default gen_random_uuid(),
  marca text not null,
  regional text not null,          -- nombre del regional padre
  nombre text not null,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists locales (
  id uuid primary key default gen_random_uuid(),
  marca text not null,
  regional text not null,
  zonal text not null,             -- nombre del zonal padre
  nombre text not null,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_regionales_marca on regionales (marca);
create index if not exists idx_zonales_lookup on zonales (marca, regional);
create index if not exists idx_locales_lookup on locales (marca, regional, zonal);

alter table regionales enable row level security;
alter table zonales enable row level security;
alter table locales enable row level security;

create policy "regionales acceso total" on regionales for all using (true) with check (true);
create policy "zonales acceso total" on zonales for all using (true) with check (true);
create policy "locales acceso total" on locales for all using (true) with check (true);

-- ------------------------------------------------------------------
-- EXAMENES DE ASCENSO
-- ------------------------------------------------------------------
create table if not exists examenes_ascenso (
  id uuid primary key default gen_random_uuid(),
  marca text not null,             -- "extremas" | "sabores"
  regional text not null,
  zonal text not null,
  local text not null,
  empleado text not null,          -- nombre de quien rinde el examen
  puesto_evaluado text not null,   -- puesto al que aspira / se evalua
  fecha_examen date not null,
  se_presento boolean not null default true,
  resultado text not null default 'Pendiente',  -- Aprobado | No aprobado | Pendiente
  nota text,                       -- nota/puntaje, texto libre (soporta "S/D")
  observaciones text,
  created_at timestamptz not null default now()
);

create index if not exists idx_examenes_marca on examenes_ascenso (marca);
create index if not exists idx_examenes_zonal on examenes_ascenso (marca, regional, zonal);
create index if not exists idx_examenes_local on examenes_ascenso (marca, regional, zonal, local);

alter table examenes_ascenso enable row level security;

create policy "examenes acceso total" on examenes_ascenso for all using (true) with check (true);


-- Nota: no hace falta seed. La estructura base (regionales/zonales/locales
-- de Junio 2026) vive en data.js y se muestra siempre, sin depender de estas
-- tablas. Estas tablas solo guardan lo que se agregue a futuro desde la app.
