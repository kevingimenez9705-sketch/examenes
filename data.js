// data.js
// Metadata estatica de cada marca (nombre, color, comercial a cargo).
// La estructura Regional > Zonal > Local ahora se administra desde Supabase
// (tablas regionales / zonales / locales) para poder agregar y eliminar
// desde la app. Ver supabase-schema.sql para la carga inicial.

const ORG_DATA = {
  extremas: {
    key: "extremas",
    nombre: "Hamburguesas Extremas",
    sigla: "EXT",
    color: "#E31E24",
    colorClaro: "#FDEBEC",
    comercial: { nombre: "Evangelina Rodriguez", cargo: "GTE Comercial" }
  },
  sabores: {
    key: "sabores",
    nombre: "Sabores Express",
    sigla: "SE",
    color: "#0057B8",
    colorClaro: "#E8F1FC",
    comercial: { nombre: "Mauro Dalla Valle", cargo: "GTE Comercial" }
  }
};

// Opciones fijas para el formulario de carga de examen
const RESULTADOS = ["Aprobado", "No aprobado", "Pendiente"];

// Evita romper si se carga en un entorno sin module system (uso directo <script>)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ORG_DATA, RESULTADOS };
}
