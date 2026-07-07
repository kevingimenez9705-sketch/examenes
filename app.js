// app.js
// Campus de Ascensos: navegacion Marca > Regional > Zonal > Local
// + carga y resumen de examenes de ascenso (Supabase)

// ------------------------------------------------------------------
// CONFIG SUPABASE - reemplazar con las credenciales del proyecto
// ------------------------------------------------------------------
const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
const SUPABASE_ANON_KEY = "TU-ANON-KEY";
const TABLE = "examenes_ascenso";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ------------------------------------------------------------------
// ESTADO
// ------------------------------------------------------------------
const state = {
  view: "marcas",       // marcas | regionales | zonales | locales | local
  marca: null,           // key: "extremas" | "sabores"
  regional: null,        // nombre
  zonal: null,           // nombre
  local: null,           // nombre
  records: [],           // cache de examenes_ascenso
  loading: true
};

const root = document.getElementById("app");
const brandPill = document.getElementById("brandPill");

// ------------------------------------------------------------------
// CARGA DE DATOS
// ------------------------------------------------------------------
async function fetchAllRecords() {
  state.loading = true;
  render();
  try {
    const { data, error } = await supabaseClient
      .from(TABLE)
      .select("*")
      .order("fecha_examen", { ascending: false });
    if (error) throw error;
    state.records = data || [];
  } catch (err) {
    console.error("Error cargando examenes:", err);
    state.records = [];
    showToast("No se pudieron cargar los datos. Revisá la configuracion de Supabase.");
  }
  state.loading = false;
  render();
}

async function insertRecord(payload) {
  const { error } = await supabaseClient.from(TABLE).insert(payload);
  if (error) {
    console.error(error);
    showToast("Error al guardar el examen.");
    return false;
  }
  await fetchAllRecords();
  showToast("Examen cargado correctamente.");
  return true;
}

// ------------------------------------------------------------------
// RESUMEN (aprobados / asistencia) segun filtro parcial
// ------------------------------------------------------------------
function filterRecords({ marca, regional, zonal, local } = {}) {
  return state.records.filter(r =>
    (!marca || r.marca === marca) &&
    (!regional || r.regional === regional) &&
    (!zonal || r.zonal === zonal) &&
    (!local || r.local === local)
  );
}

function computeResumen(filter) {
  const rows = filterRecords(filter);
  const total = rows.length;
  const aprobados = rows.filter(r => r.resultado === "Aprobado").length;
  const presentes = rows.filter(r => r.se_presento).length;
  const asistenciaPct = total ? Math.round((presentes / total) * 100) : null;
  return { total, aprobados, presentes, asistenciaPct };
}

function summaryChipsHtml(filter) {
  const { total, aprobados, asistenciaPct } = computeResumen(filter);
  return `
    <div class="summary-bar">
      <div class="summary-chip"><div class="num">${total}</div><div class="lbl">Examenes cargados</div></div>
      <div class="summary-chip"><div class="num">${aprobados}</div><div class="lbl">Aprobados</div></div>
      <div class="summary-chip"><div class="num">${asistenciaPct === null ? "S/D" : asistenciaPct + "%"}</div><div class="lbl">Asistencia</div></div>
    </div>`;
}

function miniStatsHtml(filter) {
  const { total, aprobados, asistenciaPct } = computeResumen(filter);
  return `<div class="mini-stats">
      <span><b>${total}</b> exámenes</span>
      <span><b>${aprobados}</b> aprobados</span>
      <span><b>${asistenciaPct === null ? "S/D" : asistenciaPct + "%"}</b> asist.</span>
    </div>`;
}

// ------------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------------
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function setBrandTheme(marcaKey) {
  const marca = marcaKey ? ORG_DATA[marcaKey] : null;
  const accent = marca ? marca.color : "#333";
  const accentLight = marca ? marca.colorClaro : "#eee";
  document.documentElement.style.setProperty("--accent", accent);
  document.documentElement.style.setProperty("--accent-light", accentLight);
  if (marca) {
    brandPill.style.display = "flex";
    brandPill.textContent = marca.nombre;
  } else {
    brandPill.style.display = "none";
  }
}

function showToast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function goTo(view, params = {}) {
  state.view = view;
  Object.assign(state, params);
  render();
}

// ------------------------------------------------------------------
// BREADCRUMB
// ------------------------------------------------------------------
function renderBreadcrumb() {
  const parts = [`<button onclick="goTo('marcas', {marca:null, regional:null, zonal:null, local:null})">Inicio</button>`];
  if (state.marca) {
    const marca = ORG_DATA[state.marca];
    parts.push(`<span class="sep">/</span><button onclick="goTo('regionales', {regional:null, zonal:null, local:null})">${escapeHtml(marca.nombre)}</button>`);
  }
  if (state.regional) {
    parts.push(`<span class="sep">/</span><button onclick="goTo('zonales', {zonal:null, local:null})">${escapeHtml(state.regional)}</button>`);
  }
  if (state.zonal) {
    parts.push(`<span class="sep">/</span><button onclick="goTo('locales', {local:null})">${escapeHtml(state.zonal)}</button>`);
  }
  if (state.local) {
    parts.push(`<span class="sep">/</span><span>${escapeHtml(state.local)}</span>`);
  }
  return `<div class="breadcrumb">${parts.join("")}</div>`;
}

// ------------------------------------------------------------------
// VISTAS
// ------------------------------------------------------------------
function renderMarcas() {
  setBrandTheme(null);
  const cards = Object.values(ORG_DATA).map(marca => {
    const filter = { marca: marca.key };
    return `
      <div class="card" style="border-left-color:${marca.color}" onclick="selectMarca('${marca.key}')">
        <h3>${escapeHtml(marca.nombre)}</h3>
        <div class="sub">${escapeHtml(marca.comercial.nombre)} · ${escapeHtml(marca.comercial.cargo)}</div>
        ${miniStatsHtml(filter)}
      </div>`;
  }).join("");

  root.innerHTML = `
    ${renderBreadcrumb()}
    <h2>Elegí una marca</h2>
    <div class="grid">${cards}</div>
  `;
}

function selectMarca(marcaKey) {
  goTo("regionales", { marca: marcaKey, regional: null, zonal: null, local: null });
}

function renderRegionales() {
  const marca = ORG_DATA[state.marca];
  setBrandTheme(state.marca);
  const cards = marca.regionales.map(reg => {
    const filter = { marca: marca.key, regional: reg.nombre };
    return `
      <div class="card" onclick="selectRegional('${escapeHtml(reg.nombre)}')">
        <h3>${escapeHtml(reg.nombre)}</h3>
        <div class="sub">GTE Regional${reg.cargoExtra ? " · " + escapeHtml(reg.cargoExtra) : ""}</div>
        ${miniStatsHtml(filter)}
      </div>`;
  }).join("");

  root.innerHTML = `
    ${renderBreadcrumb()}
    ${summaryChipsHtml({ marca: marca.key })}
    <h2>Regionales — ${escapeHtml(marca.nombre)}</h2>
    <div class="grid">${cards}</div>
  `;
}

function selectRegional(nombre) {
  goTo("zonales", { regional: nombre, zonal: null, local: null });
}

function renderZonales() {
  const marca = ORG_DATA[state.marca];
  const regional = marca.regionales.find(r => r.nombre === state.regional);
  const cards = regional.zonales.map(z => {
    const filter = { marca: marca.key, regional: regional.nombre, zonal: z.nombre };
    return `
      <div class="card" onclick="selectZonal('${escapeHtml(z.nombre)}')">
        <h3>${escapeHtml(z.nombre)}</h3>
        <div class="sub">${z.locales.length} locales</div>
        ${miniStatsHtml(filter)}
      </div>`;
  }).join("");

  root.innerHTML = `
    ${renderBreadcrumb()}
    ${summaryChipsHtml({ marca: marca.key, regional: regional.nombre })}
    <h2>Zonales — ${escapeHtml(regional.nombre)}</h2>
    <div class="grid">${cards}</div>
  `;
}

function selectZonal(nombre) {
  goTo("locales", { zonal: nombre, local: null });
}

function renderLocales() {
  const marca = ORG_DATA[state.marca];
  const regional = marca.regionales.find(r => r.nombre === state.regional);
  const zonal = regional.zonales.find(z => z.nombre === state.zonal);
  const cards = zonal.locales.map(local => {
    const filter = { marca: marca.key, regional: regional.nombre, zonal: zonal.nombre, local };
    return `
      <div class="card" onclick="selectLocal('${escapeHtml(local)}')">
        <h3>${escapeHtml(local)}</h3>
        ${miniStatsHtml(filter)}
      </div>`;
  }).join("");

  root.innerHTML = `
    ${renderBreadcrumb()}
    ${summaryChipsHtml({ marca: marca.key, regional: regional.nombre, zonal: zonal.nombre })}
    <h2>Locales — ${escapeHtml(zonal.nombre)}</h2>
    <div class="grid">${cards}</div>
  `;
}

function selectLocal(nombre) {
  goTo("local", { local: nombre });
}

function renderLocalDetail() {
  const marca = ORG_DATA[state.marca];
  const filter = { marca: marca.key, regional: state.regional, zonal: state.zonal, local: state.local };
  const rows = filterRecords(filter);

  const tableRows = rows.map(r => `
    <tr>
      <td>${escapeHtml(r.empleado)}</td>
      <td>${escapeHtml(r.puesto_evaluado)}</td>
      <td>${escapeHtml(r.fecha_examen)}</td>
      <td>${r.se_presento ? "Sí" : "No"}</td>
      <td>${resultadoPillHtml(r.resultado)}</td>
      <td>${escapeHtml(r.nota || "S/D")}</td>
    </tr>
  `).join("");

  const tableHtml = rows.length ? `
    <table class="exams">
      <thead>
        <tr><th>Empleado</th><th>Puesto evaluado</th><th>Fecha</th><th>Se presentó</th><th>Resultado</th><th>Nota</th></tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>` : `<div class="empty-state">Todavía no hay exámenes cargados para este local.</div>`;

  root.innerHTML = `
    ${renderBreadcrumb()}
    ${summaryChipsHtml(filter)}
    <div class="local-header">
      <h2 style="margin:0">${escapeHtml(state.local)}</h2>
      <button class="btn" onclick="openModal()">+ Cargar examen</button>
    </div>
    ${tableHtml}
  `;
}

function resultadoPillHtml(resultado) {
  const map = { "Aprobado": "green", "No aprobado": "red", "Pendiente": "yellow" };
  const cls = map[resultado] || "yellow";
  return `<span class="pill ${cls}">${escapeHtml(resultado)}</span>`;
}

// ------------------------------------------------------------------
// MODAL - carga de examen
// ------------------------------------------------------------------
function openModal() {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "modalOverlay";
  overlay.innerHTML = `
    <div class="modal">
      <h2>Cargar examen de ascenso</h2>
      <div class="sub" style="margin-bottom:14px;color:var(--text-muted);font-size:13px">
        ${escapeHtml(ORG_DATA[state.marca].nombre)} · ${escapeHtml(state.regional)} · ${escapeHtml(state.zonal)} · ${escapeHtml(state.local)}
      </div>
      <form id="examForm">
        <div class="field">
          <label>Empleado</label>
          <input type="text" name="empleado" required placeholder="Nombre y apellido">
        </div>
        <div class="field">
          <label>Puesto evaluado</label>
          <input type="text" name="puesto_evaluado" required placeholder="Ej: Encargado, GTE Zonal...">
        </div>
        <div class="field">
          <label>Fecha del examen</label>
          <input type="date" name="fecha_examen" required>
        </div>
        <div class="field checkbox">
          <input type="checkbox" name="se_presento" id="sePresento" checked>
          <label for="sePresento">Se presentó al examen</label>
        </div>
        <div class="field">
          <label>Resultado</label>
          <select name="resultado">
            ${RESULTADOS.map(r => `<option value="${r}">${r}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label>Nota / puntaje (opcional)</label>
          <input type="text" name="nota" placeholder="Ej: 8, Apto, S/D">
        </div>
        <div class="field">
          <label>Observaciones (opcional)</label>
          <textarea name="observaciones" rows="2"></textarea>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn secondary" onclick="closeModal()">Cancelar</button>
          <button type="submit" class="btn">Guardar</button>
        </div>
      </form>
    </div>`;
  document.body.appendChild(overlay);

  document.getElementById("examForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      marca: state.marca,
      regional: state.regional,
      zonal: state.zonal,
      local: state.local,
      empleado: fd.get("empleado"),
      puesto_evaluado: fd.get("puesto_evaluado"),
      fecha_examen: fd.get("fecha_examen"),
      se_presento: fd.get("se_presento") === "on",
      resultado: fd.get("resultado"),
      nota: fd.get("nota") || null,
      observaciones: fd.get("observaciones") || null
    };
    const ok = await insertRecord(payload);
    if (ok) closeModal();
  });
}

function closeModal() {
  const overlay = document.getElementById("modalOverlay");
  if (overlay) overlay.remove();
}

// ------------------------------------------------------------------
// RENDER DISPATCH
// ------------------------------------------------------------------
function render() {
  if (state.loading) {
    root.innerHTML = `<div class="loading">Cargando datos...</div>`;
    return;
  }
  switch (state.view) {
    case "marcas": renderMarcas(); break;
    case "regionales": renderRegionales(); break;
    case "zonales": renderZonales(); break;
    case "locales": renderLocales(); break;
    case "local": renderLocalDetail(); break;
    default: renderMarcas();
  }
}

// ------------------------------------------------------------------
// INIT
// ------------------------------------------------------------------
fetchAllRecords();
