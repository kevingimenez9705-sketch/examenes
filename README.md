# Campus de Ascensos

Navegación Marca → Regional → Zonal → Local, con carga de exámenes de ascenso, resumen de aprobados/asistencia en cada nivel, y alta/baja de regionales, zonales y locales desde la propia app.

## Setup

1. En Supabase, correr **todo** `supabase-schema.sql` en el SQL editor (crea las tablas `regionales`, `zonales`, `locales`, `examenes_ascenso` y carga la estructura actual de ambas marcas — Junio 2026 — como punto de partida). Se corre una sola vez.
2. En `app.js`, reemplazar:
   ```js
   const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
   const SUPABASE_ANON_KEY = "TU-ANON-KEY";
   ```
   por tus credenciales reales.
3. Deploy en Vercel (conectar el repo, sin build step — son archivos estáticos).

## Estructura

- `data.js` — metadata fija de cada marca (nombre, color, comercial). Regionales/zonales/locales ya NO están acá, viven en Supabase.
- `app.js` — navegación, alta/baja de regionales/zonales/locales, cálculo de resumen (agregado en el cliente), modal de carga de examen y conexión a Supabase.
- `index.html` — shell de la app.
- `styles.css` — estilos (paleta tomada del dashboard de RRHH: fondo lavanda, hero con gradiente, tarjetas con borde superior de color).
- `supabase-schema.sql` — tablas, policies y seed inicial.

## Agregar / eliminar regionales, zonales, locales

Cada pantalla (Regionales, Zonales, Locales) tiene una tarjeta punteada "+ Agregar..." al final de la grilla, y cada tarjeta existente tiene una "×" arriba a la derecha para eliminar.

- Eliminar un **regional** borra también sus zonales y locales (con confirmación previa).
- Eliminar un **zonal** borra también sus locales (con confirmación previa).
- Eliminar un **local** NO borra los exámenes ya cargados para ese local — quedan en la tabla `examenes_ascenso` pero dejan de contarse en los resúmenes de arriba (marca/regional/zonal), porque el local ya no existe en el árbol.

## Cómo funciona el resumen

Se trae toda la tabla `examenes_ascenso` + `regionales` + `zonales` + `locales` al iniciar (`fetchAll`) y se recalcula todo en el cliente filtrando por marca/regional/zonal/local en cada vista. Después de cada carga, alta o baja se vuelve a pedir todo. Si el volumen de exámenes crece mucho (miles de filas), conviene mover el agregado a una vista de Postgres o RPC — hoy no hace falta.

## Campos del formulario de examen

Empleado, puesto evaluado, fecha, si se presentó (checkbox), resultado (Aprobado / No aprobado / Pendiente), nota (texto libre, admite "S/D") y observaciones opcionales.

## Pendiente / a definir con vos

- Roles de acceso (¿todos pueden cargar/editar estructura, o solo selectores como en el Panel de Selección?)
- Si querés export a Excel del detalle por zonal/regional, se puede agregar con SheetJS.
