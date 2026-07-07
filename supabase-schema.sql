-- Campus de Ascensos - schema Supabase
-- Ejecutar en el SQL editor de tu proyecto Supabase

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

-- Indices para acelerar filtros por nivel
create index if not exists idx_examenes_marca on examenes_ascenso (marca);
create index if not exists idx_examenes_zonal on examenes_ascenso (marca, regional, zonal);
create index if not exists idx_examenes_local on examenes_ascenso (marca, regional, zonal, local);

-- RLS: ajustar segun tus necesidades de acceso (panel interno)
alter table examenes_ascenso enable row level security;

create policy "lectura publica" on examenes_ascenso
  for select using (true);

create policy "insercion publica" on examenes_ascenso
  for insert with check (true);

create policy "actualizacion publica" on examenes_ascenso
  for update using (true);

create policy "borrado publico" on examenes_ascenso
  for delete using (true);
