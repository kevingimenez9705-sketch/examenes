# Campus de Ascensos

Navegación Marca → Regional → Zonal → Local, con carga de exámenes de ascenso y resumen de aprobados/asistencia en cada nivel.

## Cómo está armado (importante)

El organigrama base (regionales, zonales, locales de Junio 2026) vive **hardcodeado en `data.js`**. Siempre se muestra, no depende de Supabase ni de ningún seed.

Las tablas `regionales`, `zonales` y `locales` en Supabase son una capa opcional para lo que agregues **a futuro** desde la app (botón "+ Agregar..."). Se combinan con la base de `data.js` al mostrar cada pantalla. Los ítems de la base no tienen botón de eliminar (son fijos); los que agregues desde la app sí.

## Setup

1. En Supabase, correr `supabase-schema.sql` en el SQL editor (crea `regionales`, `zonales`, `locales` y `examenes_ascenso`, con policies abiertas). Una sola vez, no lleva seed.
2. En `app.js`, reemplazar:
   ```js
   const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
   const SUPABASE_ANON_KEY = "TU-ANON-KEY";
   ```
   por tus credenciales reales.
3. Deploy en Vercel/GitHub Pages (sin build step — son archivos estáticos).

## Estructura

- `data.js` — organigrama completo y fijo (Marca > Regional > Zonal > Local).
- `app.js` — navegación, combina base fija + agregados dinámicos, cálculo de resumen, modal de carga de examen y conexión a Supabase.
- `index.html` — shell de la app.
- `styles.css` — estilos (paleta tomada del dashboard de RRHH).
- `supabase-schema.sql` — tablas y policies.

## Agregar / eliminar (a futuro)

Cada pantalla tiene una tarjeta punteada "+ Agregar..." — inserta en Supabase y aparece sumado a la lista fija. Solo esos ítems agregados muestran "×" para eliminar. Si Supabase todavía no está configurado o esas tablas fallan, la app igual funciona mostrando la base fija (no se rompe nada).

## Cómo funciona el resumen

Se trae toda la tabla `examenes_ascenso` al iniciar y se recalcula en el cliente filtrando por marca/regional/zonal/local en cada vista.

## Campos del formulario de examen

Empleado, puesto evaluado, fecha, si se presentó (checkbox), resultado (Aprobado / No aprobado / Pendiente), nota (texto libre, admite "S/D") y observaciones opcionales.

## Pendiente / a definir con vos

- Roles de acceso (¿todos pueden cargar/agregar, o solo selectores?)
- Si querés export a Excel del detalle por zonal/regional, se puede agregar con SheetJS.
