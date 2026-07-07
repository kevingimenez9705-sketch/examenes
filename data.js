// data.js
// Estructura organizacional: Marca > Regional > Zonal > Local
// Fuente: Organigrama Sabores Express (Junio 2026) y Organigrama Extremas (Junio 2026)

const ORG_DATA = {
  extremas: {
    key: "extremas",
    nombre: "Hamburguesas Extremas",
    sigla: "EXT",
    color: "#E31E24",
    colorClaro: "#FDEBEC",
    comercial: { nombre: "Evangelina Rodriguez", cargo: "GTE Comercial" },
    regionales: [
      {
        nombre: "Facundo Aramburo",
        zonales: [
          { nombre: "Adriana Ibarra", locales: ["Avellaneda", "Wilde", "Pompeya", "Rosario"] },
          { nombre: "Yamila Lugo", locales: ["Monte Grande", "Lanus", "Adrogue", "Banfield", "La Plata"] },
          { nombre: "Marianela Mazzeo", locales: ["Solano", "Varela", "Glew", "Temperley"] },
          { nombre: "Mayra Agmatt", locales: ["Florida", "Tucuman", "Once", "Callao", "Pueyrredon", "Pellegrini"] }
        ]
      },
      {
        nombre: "Federico Gomez",
        zonales: [
          { nombre: "Mariano Artigue", locales: ["Castelar", "Merlo", "Ramos", "Moreno"] },
          { nombre: "Facundo Gimenez", locales: ["Laferrere", "Moron", "Crovara", "San Justo"] },
          { nombre: "Fernando Buosi", locales: ["Rodriguez", "Lujan", "Zarate", "Garin"] },
          { nombre: "Juan Pereyra", locales: ["Polvorines", "Tortuguitas", "Pilar", "Alberti"] },
          { nombre: "Jaquelina Polo", locales: ["Jose C. Paz", "San Miguel", "Grand Bourg", "Talar"] }
        ]
      },
      {
        nombre: "Gustavo Gomez",
        zonales: [
          { nombre: "Monica Batista", locales: ["Caballito", "Liniers", "Flores", "Flores 2"] },
          { nombre: "Salome Rodriguez", locales: ["Loma Hermosa", "Hurlingham", "Caseros", "Munro"] },
          { nombre: "Roxana Gorosito", locales: ["Olivos", "San Isidro", "Boulogne", "Villa Adelina"] },
          { nombre: "Lautaro Tesi", locales: ["San Fernando", "Virreyes", "Pacheco", "Vicente Lopez"] }
        ]
      }
    ]
  },

  sabores: {
    key: "sabores",
    nombre: "Sabores Express",
    sigla: "SE",
    color: "#0057B8",
    colorClaro: "#E8F1FC",
    comercial: { nombre: "Mauro Dalla Valle", cargo: "GTE Comercial" },
    regionales: [
      {
        nombre: "Ivo Pisaniello",
        cargoExtra: "GTE de Operaciones",
        zonales: [
          { nombre: "Arianna Gomez", locales: ["Corrientes 1", "Corrientes 2", "Corrientes 3", "Corrientes 4"] },
          { nombre: "Greisnell Mejias", locales: ["Santa Fe 1", "Villa Urquiza", "Entre Rios", "Boedo", "Pellegrini"] },
          { nombre: "Emanuel Mazueco", locales: ["Caballito 1", "Chilavert", "Lomas de Zamora 3", "Lomas de Zamora 4", "Lomas de Zamora 5"] },
          { nombre: "Ezequiel Acosta", locales: ["Caballito 2", "Flores", "Pueyrredon 1", "Pueyrredon 2", "Constitucion"] },
          { nombre: "Tomas Moreno", locales: ["Liniers 1", "Liniers 2", "Ciudadela", "Pompeya", "Barracas"] },
          { nombre: "Douglas Seprum", locales: ["Belgrano", "Lavalle 1", "Lavalle 2", "Tucuman", "Florida", "Retiro"] }
        ]
      },
      {
        nombre: "Gustavo Cabrera",
        cargoExtra: "GTE de Operaciones",
        zonales: [
          { nombre: "Marianella Yñiguez", locales: ["Jose C Paz 1", "Jose C Paz 2", "Del Viso", "Grand Bourg"] },
          { nombre: "Camila Fredes", locales: ["Don Tor Cuato", "Bella Vista", "William Morris", "Cruce Castelar", "Loma Hermosa"] },
          { nombre: "Pamela Maidana", locales: ["Hurlingham 1", "Hurlingham 2", "Caseros 1", "Caseros 2", "El Palomar"] },
          { nombre: "Melanie Pueblas", locales: ["Manuel Alberti", "Sourdeaux", "Tortuguitas", "Los Polvorines"] },
          { nombre: "Agustina Sussi", locales: ["San Justo 1", "San Justo 2", "San Justo 3", "Lomas del Mirador", "Santos Lugares"] },
          { nombre: "Tamara Migoya", locales: ["Crovara", "Tapiales", "Laferrere 1", "Laferrere 2", "Gonzalez Catan"] },
          { nombre: "Cecilia Montoya", locales: ["San Miguel 1", "San Miguel 2", "San Miguel 3", "Pilar 1", "Pilar 2"] }
        ]
      },
      {
        nombre: "Agustin Sbampato",
        cargoExtra: "GTE de Operaciones",
        zonales: [
          { nombre: "Franco Pedrazza", locales: ["La Plata 1", "La Plata 2", "La Plata 3", "La Plata 4", "Lezama"] },
          { nombre: "Magali Sandoval", locales: ["Berazategui 1", "Berazategui 2", "Solano", "Varela", "Cruce Varela", "Varela 2"] },
          { nombre: "Lujan Brandan", locales: ["Mar del Plata 1", "Mar del Plata 2", "Mar del Plata 3", "Mar del Plata 4", "Mar del Plata 5"] },
          { nombre: "Adriana Alvarez", locales: ["Adrogue", "Banfield", "Temperley 1", "Temperley 2", "Lanus 2", "Lanus 3"] },
          { nombre: "Camila Carranza", locales: ["Claypole", "Quilmes 1", "Quilmes 2", "Quilmes 3", "Wilde", "Gerli"] },
          { nombre: "Michelle Alvarez", locales: ["El Jaguel", "Monte Grande 1", "Monte Grande 2", "Tristan Suarez", "Glew", "Ezeiza"] }
        ]
      },
      {
        nombre: "Marcelo Biurra",
        cargoExtra: "GTE de Operaciones",
        zonales: [
          { nombre: "Ronaldo Arguello", locales: ["Zarate", "Escobar 1", "Maschwitz", "Boulogne", "Benavidez", "Escobar 2"] },
          { nombre: "Camila Almeida", locales: ["San Fernando", "San Isidro 1", "San Isidro 2", "Virreyes", "Tigre", "Pacheco 2"] },
          { nombre: "Veronica Gonzalez", locales: ["Pte Saavedra", "Vicente Lopez", "Munro", "Villa Adelina", "Jose Leon Suarez", "Martinez"] },
          { nombre: "Aylen Ponce", locales: ["Pacheco 1", "El Talar", "Olivos", "Garin", "Savio"] },
          { nombre: "Micaela Ponce", locales: ["San Martin 1", "San Martin 2", "Villa Ballester 1", "Villa Ballester 2"] },
          { nombre: "Giovanna Solerez", locales: ["Rosario 1", "Rosario 2", "Rosario 3", "San Nicolas"] }
        ]
      },
      {
        nombre: "Lucia Velez",
        cargoExtra: "GTE de Operaciones",
        zonales: [
          { nombre: "Renata Fedullo", locales: ["Ramos Mejia 1", "Ramos Mejia 2", "Ramos Mejia 3", "Haedo", "Ituzaingo"] },
          { nombre: "Pablo Muga", locales: ["Moron 1", "Moron 2", "Moron 3", "Moron 4", "Moron 5"] },
          { nombre: "Nahuel Sanchez", locales: ["Lujan", "General Rodriguez", "Moreno 1", "Moreno 2", "Paso del Rey"] },
          { nombre: "Malena Aguera", locales: ["Merlo 1", "Merlo 2", "Merlo 3", "Rafael Castillo", "Padua"] }
        ]
      }
    ]
  }
};

// Opciones fijas para el formulario de carga de examen
const RESULTADOS = ["Aprobado", "No aprobado", "Pendiente"];

// Evita romper si se carga en un entorno sin module system (uso directo <script>)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ORG_DATA, RESULTADOS };
}
