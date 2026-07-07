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

-- ------------------------------------------------------------------
-- SEED: estructura actual (organigramas Junio 2026)
-- Correr una sola vez para poblar regionales/zonales/locales.
-- Despues de esto, se agregan/eliminan desde la app (no hace falta
-- volver a correr este bloque).
-- ------------------------------------------------------------------
insert into regionales (marca, nombre, cargo_extra, orden) values ('extremas', 'Facundo Aramburo', null, 0);
insert into zonales (marca, regional, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Adriana Ibarra', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Adriana Ibarra', 'Avellaneda', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Adriana Ibarra', 'Wilde', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Adriana Ibarra', 'Pompeya', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Adriana Ibarra', 'Rosario', 3);
insert into zonales (marca, regional, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Yamila Lugo', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Yamila Lugo', 'Monte Grande', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Yamila Lugo', 'Lanus', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Yamila Lugo', 'Adrogue', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Yamila Lugo', 'Banfield', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Yamila Lugo', 'La Plata', 4);
insert into zonales (marca, regional, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Marianela Mazzeo', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Marianela Mazzeo', 'Solano', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Marianela Mazzeo', 'Varela', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Marianela Mazzeo', 'Glew', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Marianela Mazzeo', 'Temperley', 3);
insert into zonales (marca, regional, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Mayra Agmatt', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Mayra Agmatt', 'Florida', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Mayra Agmatt', 'Tucuman', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Mayra Agmatt', 'Once', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Mayra Agmatt', 'Callao', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Mayra Agmatt', 'Pueyrredon', 4);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Facundo Aramburo', 'Mayra Agmatt', 'Pellegrini', 5);
insert into regionales (marca, nombre, cargo_extra, orden) values ('extremas', 'Federico Gomez', null, 1);
insert into zonales (marca, regional, nombre, orden) values ('extremas', 'Federico Gomez', 'Mariano Artigue', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Mariano Artigue', 'Castelar', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Mariano Artigue', 'Merlo', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Mariano Artigue', 'Ramos', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Mariano Artigue', 'Moreno', 3);
insert into zonales (marca, regional, nombre, orden) values ('extremas', 'Federico Gomez', 'Facundo Gimenez', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Facundo Gimenez', 'Laferrere', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Facundo Gimenez', 'Moron', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Facundo Gimenez', 'Crovara', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Facundo Gimenez', 'San Justo', 3);
insert into zonales (marca, regional, nombre, orden) values ('extremas', 'Federico Gomez', 'Fernando Buosi', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Fernando Buosi', 'Rodriguez', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Fernando Buosi', 'Lujan', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Fernando Buosi', 'Zarate', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Fernando Buosi', 'Garin', 3);
insert into zonales (marca, regional, nombre, orden) values ('extremas', 'Federico Gomez', 'Juan Pereyra', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Juan Pereyra', 'Polvorines', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Juan Pereyra', 'Tortuguitas', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Juan Pereyra', 'Pilar', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Juan Pereyra', 'Alberti', 3);
insert into zonales (marca, regional, nombre, orden) values ('extremas', 'Federico Gomez', 'Jaquelina Polo', 4);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Jaquelina Polo', 'Jose C. Paz', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Jaquelina Polo', 'San Miguel', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Jaquelina Polo', 'Grand Bourg', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Federico Gomez', 'Jaquelina Polo', 'Talar', 3);
insert into regionales (marca, nombre, cargo_extra, orden) values ('extremas', 'Gustavo Gomez', null, 2);
insert into zonales (marca, regional, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Monica Batista', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Monica Batista', 'Caballito', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Monica Batista', 'Liniers', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Monica Batista', 'Flores', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Monica Batista', 'Flores 2', 3);
insert into zonales (marca, regional, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Salome Rodriguez', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Salome Rodriguez', 'Loma Hermosa', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Salome Rodriguez', 'Hurlingham', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Salome Rodriguez', 'Caseros', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Salome Rodriguez', 'Munro', 3);
insert into zonales (marca, regional, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Roxana Gorosito', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Roxana Gorosito', 'Olivos', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Roxana Gorosito', 'San Isidro', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Roxana Gorosito', 'Boulogne', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Roxana Gorosito', 'Villa Adelina', 3);
insert into zonales (marca, regional, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Lautaro Tesi', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Lautaro Tesi', 'San Fernando', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Lautaro Tesi', 'Virreyes', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Lautaro Tesi', 'Pacheco', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('extremas', 'Gustavo Gomez', 'Lautaro Tesi', 'Vicente Lopez', 3);
insert into regionales (marca, nombre, cargo_extra, orden) values ('sabores', 'Ivo Pisaniello', 'GTE de Operaciones', 0);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Arianna Gomez', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Arianna Gomez', 'Corrientes 1', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Arianna Gomez', 'Corrientes 2', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Arianna Gomez', 'Corrientes 3', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Arianna Gomez', 'Corrientes 4', 3);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Greisnell Mejias', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Greisnell Mejias', 'Santa Fe 1', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Greisnell Mejias', 'Villa Urquiza', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Greisnell Mejias', 'Entre Rios', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Greisnell Mejias', 'Boedo', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Greisnell Mejias', 'Pellegrini', 4);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Emanuel Mazueco', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Emanuel Mazueco', 'Caballito 1', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Emanuel Mazueco', 'Chilavert', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Emanuel Mazueco', 'Lomas de Zamora 3', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Emanuel Mazueco', 'Lomas de Zamora 4', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Emanuel Mazueco', 'Lomas de Zamora 5', 4);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Ezequiel Acosta', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Ezequiel Acosta', 'Caballito 2', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Ezequiel Acosta', 'Flores', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Ezequiel Acosta', 'Pueyrredon 1', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Ezequiel Acosta', 'Pueyrredon 2', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Ezequiel Acosta', 'Constitucion', 4);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Tomas Moreno', 4);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Tomas Moreno', 'Liniers 1', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Tomas Moreno', 'Liniers 2', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Tomas Moreno', 'Ciudadela', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Tomas Moreno', 'Pompeya', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Tomas Moreno', 'Barracas', 4);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Douglas Seprum', 5);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Douglas Seprum', 'Belgrano', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Douglas Seprum', 'Lavalle 1', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Douglas Seprum', 'Lavalle 2', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Douglas Seprum', 'Tucuman', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Douglas Seprum', 'Florida', 4);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Ivo Pisaniello', 'Douglas Seprum', 'Retiro', 5);
insert into regionales (marca, nombre, cargo_extra, orden) values ('sabores', 'Gustavo Cabrera', 'GTE de Operaciones', 1);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Marianella Yñiguez', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Marianella Yñiguez', 'Jose C Paz 1', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Marianella Yñiguez', 'Jose C Paz 2', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Marianella Yñiguez', 'Del Viso', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Marianella Yñiguez', 'Grand Bourg', 3);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Camila Fredes', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Camila Fredes', 'Don Tor Cuato', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Camila Fredes', 'Bella Vista', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Camila Fredes', 'William Morris', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Camila Fredes', 'Cruce Castelar', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Camila Fredes', 'Loma Hermosa', 4);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Pamela Maidana', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Pamela Maidana', 'Hurlingham 1', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Pamela Maidana', 'Hurlingham 2', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Pamela Maidana', 'Caseros 1', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Pamela Maidana', 'Caseros 2', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Pamela Maidana', 'El Palomar', 4);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Melanie Pueblas', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Melanie Pueblas', 'Manuel Alberti', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Melanie Pueblas', 'Sourdeaux', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Melanie Pueblas', 'Tortuguitas', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Melanie Pueblas', 'Los Polvorines', 3);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Agustina Sussi', 4);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Agustina Sussi', 'San Justo 1', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Agustina Sussi', 'San Justo 2', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Agustina Sussi', 'San Justo 3', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Agustina Sussi', 'Lomas del Mirador', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Agustina Sussi', 'Santos Lugares', 4);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Tamara Migoya', 5);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Tamara Migoya', 'Crovara', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Tamara Migoya', 'Tapiales', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Tamara Migoya', 'Laferrere 1', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Tamara Migoya', 'Laferrere 2', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Tamara Migoya', 'Gonzalez Catan', 4);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Cecilia Montoya', 6);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Cecilia Montoya', 'San Miguel 1', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Cecilia Montoya', 'San Miguel 2', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Cecilia Montoya', 'San Miguel 3', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Cecilia Montoya', 'Pilar 1', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Gustavo Cabrera', 'Cecilia Montoya', 'Pilar 2', 4);
insert into regionales (marca, nombre, cargo_extra, orden) values ('sabores', 'Agustin Sbampato', 'GTE de Operaciones', 2);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Franco Pedrazza', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Franco Pedrazza', 'La Plata 1', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Franco Pedrazza', 'La Plata 2', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Franco Pedrazza', 'La Plata 3', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Franco Pedrazza', 'La Plata 4', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Franco Pedrazza', 'Lezama', 4);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Magali Sandoval', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Magali Sandoval', 'Berazategui 1', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Magali Sandoval', 'Berazategui 2', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Magali Sandoval', 'Solano', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Magali Sandoval', 'Varela', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Magali Sandoval', 'Cruce Varela', 4);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Magali Sandoval', 'Varela 2', 5);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Lujan Brandan', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Lujan Brandan', 'Mar del Plata 1', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Lujan Brandan', 'Mar del Plata 2', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Lujan Brandan', 'Mar del Plata 3', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Lujan Brandan', 'Mar del Plata 4', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Lujan Brandan', 'Mar del Plata 5', 4);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Adriana Alvarez', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Adriana Alvarez', 'Adrogue', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Adriana Alvarez', 'Banfield', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Adriana Alvarez', 'Temperley 1', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Adriana Alvarez', 'Temperley 2', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Adriana Alvarez', 'Lanus 2', 4);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Adriana Alvarez', 'Lanus 3', 5);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Camila Carranza', 4);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Camila Carranza', 'Claypole', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Camila Carranza', 'Quilmes 1', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Camila Carranza', 'Quilmes 2', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Camila Carranza', 'Quilmes 3', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Camila Carranza', 'Wilde', 4);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Camila Carranza', 'Gerli', 5);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Michelle Alvarez', 5);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Michelle Alvarez', 'El Jaguel', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Michelle Alvarez', 'Monte Grande 1', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Michelle Alvarez', 'Monte Grande 2', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Michelle Alvarez', 'Tristan Suarez', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Michelle Alvarez', 'Glew', 4);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Agustin Sbampato', 'Michelle Alvarez', 'Ezeiza', 5);
insert into regionales (marca, nombre, cargo_extra, orden) values ('sabores', 'Marcelo Biurra', 'GTE de Operaciones', 3);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Ronaldo Arguello', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Ronaldo Arguello', 'Zarate', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Ronaldo Arguello', 'Escobar 1', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Ronaldo Arguello', 'Maschwitz', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Ronaldo Arguello', 'Boulogne', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Ronaldo Arguello', 'Benavidez', 4);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Ronaldo Arguello', 'Escobar 2', 5);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Camila Almeida', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Camila Almeida', 'San Fernando', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Camila Almeida', 'San Isidro 1', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Camila Almeida', 'San Isidro 2', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Camila Almeida', 'Virreyes', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Camila Almeida', 'Tigre', 4);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Camila Almeida', 'Pacheco 2', 5);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Veronica Gonzalez', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Veronica Gonzalez', 'Pte Saavedra', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Veronica Gonzalez', 'Vicente Lopez', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Veronica Gonzalez', 'Munro', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Veronica Gonzalez', 'Villa Adelina', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Veronica Gonzalez', 'Jose Leon Suarez', 4);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Veronica Gonzalez', 'Martinez', 5);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Aylen Ponce', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Aylen Ponce', 'Pacheco 1', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Aylen Ponce', 'El Talar', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Aylen Ponce', 'Olivos', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Aylen Ponce', 'Garin', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Aylen Ponce', 'Savio', 4);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Micaela Ponce', 4);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Micaela Ponce', 'San Martin 1', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Micaela Ponce', 'San Martin 2', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Micaela Ponce', 'Villa Ballester 1', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Micaela Ponce', 'Villa Ballester 2', 3);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Giovanna Solerez', 5);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Giovanna Solerez', 'Rosario 1', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Giovanna Solerez', 'Rosario 2', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Giovanna Solerez', 'Rosario 3', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Marcelo Biurra', 'Giovanna Solerez', 'San Nicolas', 3);
insert into regionales (marca, nombre, cargo_extra, orden) values ('sabores', 'Lucia Velez', 'GTE de Operaciones', 4);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Lucia Velez', 'Renata Fedullo', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Renata Fedullo', 'Ramos Mejia 1', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Renata Fedullo', 'Ramos Mejia 2', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Renata Fedullo', 'Ramos Mejia 3', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Renata Fedullo', 'Haedo', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Renata Fedullo', 'Ituzaingo', 4);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Lucia Velez', 'Pablo Muga', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Pablo Muga', 'Moron 1', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Pablo Muga', 'Moron 2', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Pablo Muga', 'Moron 3', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Pablo Muga', 'Moron 4', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Pablo Muga', 'Moron 5', 4);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Lucia Velez', 'Nahuel Sanchez', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Nahuel Sanchez', 'Lujan', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Nahuel Sanchez', 'General Rodriguez', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Nahuel Sanchez', 'Moreno 1', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Nahuel Sanchez', 'Moreno 2', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Nahuel Sanchez', 'Paso del Rey', 4);
insert into zonales (marca, regional, nombre, orden) values ('sabores', 'Lucia Velez', 'Malena Aguera', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Malena Aguera', 'Merlo 1', 0);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Malena Aguera', 'Merlo 2', 1);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Malena Aguera', 'Merlo 3', 2);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Malena Aguera', 'Rafael Castillo', 3);
insert into locales (marca, regional, zonal, nombre, orden) values ('sabores', 'Lucia Velez', 'Malena Aguera', 'Padua', 4);
