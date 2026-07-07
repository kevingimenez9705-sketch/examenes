# Campus de Ascensos

Navegación Marca → Regional → Zonal → Local, con carga de exámenes de ascenso y resumen de aprobados/asistencia en cada nivel.

## Setup

1. En Supabase, correr `supabase-schema.sql` en el SQL editor (crea la tabla `examenes_ascenso` con RLS abierta a lectura/escritura — ajustar policies si querés restringir por rol).
2. En `app.js`, reemplazar:
   ```js
   const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
   const SUPABASE_ANON_KEY = "TU-ANON-KEY";
   ```
   por tus credenciales reales.
3. Deploy en Vercel (conectar el repo, sin build step — son archivos estáticos).

## Estructura

- `data.js` — organigrama completo (Marca > Regional > Zonal > Local), extraído de los PDFs de junio 2026.
- `app.js` — navegación, cálculo de resumen (aprobados/asistencia por nivel, agregado en el cliente), modal de carga y conexión a Supabase.
- `index.html` — shell de la app.
- `styles.css` — estilos (el color de marca se aplica dinámicamente al entrar a cada marca).
- `supabase-schema.sql` — tabla y policies.

## Cómo funciona el resumen

Se trae toda la tabla `examenes_ascenso` una sola vez (`fetchAllRecords`) y se recalcula en el cliente filtrando por marca/regional/zonal/local en cada vista. Después de cada carga se vuelve a pedir todo. Si el volumen de exámenes crece mucho (miles de filas), conviene mover el agregado a una vista de Postgres o RPC — hoy no hace falta.

## Campos del formulario

Empleado, puesto evaluado, fecha, si se presentó (checkbox), resultado (Aprobado / No aprobado / Pendiente), nota (texto libre, admite "S/D") y observaciones opcionales.

## Pendiente / a definir con vos

- Roles de acceso (¿todos pueden cargar, o solo selectores como en el Panel de Selección?)
- Si querés export a Excel del detalle por zonal/regional, se puede agregar con SheetJS.
