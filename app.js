// app.js
// Campus de Ascensos: navegacion Marca > Regional > Zonal > Local
// + carga y resumen de examenes de ascenso, + alta/baja de regionales/zonales/locales
// Todo (estructura + examenes) vive en Supabase; data.js solo tiene metadata de marca.

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
  regionales: [],        // cache tabla regionales
  zonales: [],           // cache tabla zonales
  locales: [],           // cache tabla locales
  loading: true
};

const root = document.getElementById("app");
const brandPill = document.getElementById("brandPill");

// ------------------------------------------------------------------
// CARGA DE DATOS
// ------------------------------------------------------------------
async function fetchAll() {
  state.loading = true;
  render();
  try {
    const [examenes, regionales, zonales, locales] = await Promise.all([
      supabaseClient.from(TABLE).select("*").order("fecha_examen", { ascending: false }),
      supabaseClient.from("regionales").select("*").order("orden", { ascending: true }),
      supabaseClient.from("zonales").select("*").order("orden", { ascending: true }),
      supabaseClient.from("locales").select("*").order("orden", { ascending: true })
    ]);
    if (examenes.error) throw examenes.error;
    if (regionales.error) throw regionales.error;
    if (zonales.error) throw zonales.error;
    if (locales.error) throw locales.error;
    state.records = examenes.data || [];
    state.regionales = regionales.data || [];
    state.zonales = zonales.data || [];
    state.locales = locales.data || [];
  } catch (err) {
    console.error("Error cargando datos:", err);
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
  await fetchAll();
  showToast("Examen cargado correctamente.");
  return true;
}

// ------------------------------------------------------------------
// ESTRUCTURA: getters ordenados
// ------------------------------------------------------------------
function getRegionales(marcaKey) {
  return state.regionales.filter(r => r.marca === marcaKey);
}
function getZonales(marcaKey, regionalNombre) {
  return state.zonales.filter(z => z.marca === marcaKey && z.regional === regionalNombre);
}
function getLocales(marcaKey, regionalNombre, zonalNombre) {
  return state.locales.filter(l => l.marca === marcaKey && l.regional === regionalNombre && l.zonal === zonalNombre);
}

// ------------------------------------------------------------------
// ESTRUCTURA: alta / baja
// ------------------------------------------------------------------
async function addRegional(marcaKey) {
  openNameModal({
    title: "Agregar regional",
    label: "Nombre del regional",
    placeholder: "Ej: Nuevo Nombre Apellido",
    onSubmit: async (nombre) => {
      const orden = getRegionales(marcaKey).length;
      const { error } = await supabaseClient.from("regionales").insert({ marca: marcaKey, nombre, orden });
      if (error) { console.error(error); showToast("Error al agregar el regional."); return false; }
      await fetchAll();
      showToast("Regional agregado.");
      return true;
    }
  });
}

async function deleteRegional(id, nombre, marcaKey) {
  const zonalesHijos = getZonales(marcaKey, nombre);
  const msg = zonalesHijos.length
    ? `"${nombre}" tiene ${zonalesHijos.length} zonal(es) con sus locales. Se van a eliminar también. ¿Continuar?`
    : `¿Eliminar el regional "${nombre}"?`;
  if (!confirm(msg)) return;

  try {
    const zonalNombres = zonalesHijos.map(z => z.nombre);
    if (zonalNombres.length) {
      await supabaseClient.from("locales").delete().eq("marca", marcaKey).eq("regional", nombre);
      await supabaseClient.from("zonales").delete().eq("marca", marcaKey).eq("regional", nombre);
    }
    await supabaseClient.from("regionales").delete().eq("id", id);
    await fetchAll();
    showToast("Regional eliminado.");
  } catch (err) {
    console.error(err);
    showToast("Error al eliminar el regional.");
  }
}

async function addZonal(marcaKey, regionalNombre) {
  openNameModal({
    title: "Agregar zonal",
    label: "Nombre del zonal",
    placeholder: "Ej: Nombre Apellido",
    onSubmit: async (nombre) => {
      const orden = getZonales(marcaKey, regionalNombre).length;
      const { error } = await supabaseClient.from("zonales").insert({ marca: marcaKey, regional: regionalNombre, nombre, orden });
      if (error) { console.error(error); showToast("Error al agregar el zonal."); return false; }
      await fetchAll();
      showToast("Zonal agregado.");
      return true;
    }
  });
}

async function deleteZonal(id, nombre, marcaKey, regionalNombre) {
  const localesHijos = getLocales(marcaKey, regionalNombre, nombre);
  const msg = localesHijos.length
    ? `"${nombre}" tiene ${localesHijos.length} local(es). Se van a eliminar también. ¿Continuar?`
    : `¿Eliminar el zonal "${nombre}"?`;
  if (!confirm(msg)) return;

  try {
    if (localesHijos.length) {
      await supabaseClient.from("locales").delete().eq("marca", marcaKey).eq("regional", regionalNombre).eq("zonal", nombre);
    }
    await supabaseClient.from("zonales").delete().eq("id", id);
    await fetchAll();
    showToast("Zonal eliminado.");
  } catch (err) {
    console.error(err);
    showToast("Error al eliminar el zonal.");
  }
}

async function addLocal(marcaKey, regionalNombre, zonalNombre) {
  openNameModal({
    title: "Agregar local",
    label: "Nombre del local",
    placeholder: "Ej: Barrio / Ciudad",
    onSubmit: async (nombre) => {
      const orden = getLocales(marcaKey, regionalNombre, zonalNombre).length;
      const { error } = await supabaseClient.from("locales").insert({ marca: marcaKey, regional: regionalNombre, zonal: zonalNombre, nombre, orden });
      if (error) { console.error(error); showToast("Error al agregar el local."); return false; }
      await fetchAll();
      showToast("Local agregado.");
      return true;
    }
  });
}

async function deleteLocal(id, nombre) {
  if (!confirm(`¿Eliminar el local "${nombre}"? Los exámenes ya cargados para este local no se borran, pero quedan sin local visible en el árbol.`)) return;
  try {
    await supabaseClient.from("locales").delete().eq("id", id);
    await fetchAll();
    showToast("Local eliminado.");
  } catch (err) {
    console.error(err);
    showToast("Error al eliminar el local.");
  }
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
  const accent = marca ? marca.color : "#5b6bd6";
  const accentLight = marca ? marca.colorClaro : "#e7e9fc";
  document.documentElement.style.setProperty("--accent", accent);
  document.documentElement.style.setProperty("--accent-light", accentLight);
  if (marca) {
    brandPill.style.display = "flex";
    brandPill.textContent = marca.nombre;
  } else {
    brandPill.style.display = "none";
  }
}

function updateNavCrumb() {
  const navCrumb = document.getElementById("navCrumb");
  const parts = ["<b>Campus</b>", "Ascensos"];
  if (state.marca) parts.push(ORG_DATA[state.marca].nombre);
  if (state.regional) parts.push(state.regional);
  if (state.zonal) parts.push(state.zonal);
  if (state.local) parts.push(state.local);
  navCrumb.innerHTML = parts.join(" &gt; ");
}

function heroHtml({ icon, title, sub, accentWord }) {
  const titleHtml = accentWord
    ? title.replace(accentWord, `<span class="accent-word">${accentWord}</span>`)
    : title;
  return `
    <div class="hero">
      <div class="hero-icon">${icon}</div>
      <div>
        <h2>${titleHtml}</h2>
        <div class="hero-sub">${sub}</div>
      </div>
    </div>`;
}

function cardIconHtml(text, accent, accentLight) {
  return `<div class="card-icon" style="background:${accentLight};color:${accent}">${text}</div>`;
}

function deleteBtnHtml(onclickExpr) {
  return `<button type="button" class="card-delete" title="Eliminar" onclick="event.stopPropagation(); ${onclickExpr}">×</button>`;
}

function addCardHtml(label, onclickExpr) {
  return `
    <div class="card add-card" onclick="${onclickExpr}">
      <div class="add-card-inner">
        <div class="add-icon">+</div>
        <div>${escapeHtml(label)}</div>
      </div>
    </div>`;
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
  updateNavCrumb();
  const cards = Object.values(ORG_DATA).map(marca => {
    const filter = { marca: marca.key };
    return `
      <div class="card" style="--card-accent:${marca.color};--card-accent-light:${marca.colorClaro}" onclick="selectMarca('${marca.key}')">
        ${cardIconHtml(marca.sigla, marca.color, marca.colorClaro)}
        <h3>${escapeHtml(marca.nombre)}</h3>
        <div class="sub">${escapeHtml(marca.comercial.nombre)} · ${escapeHtml(marca.comercial.cargo)}</div>
        ${miniStatsHtml(filter)}
        <div class="card-link">Ver regionales →</div>
      </div>`;
  }).join("");

  root.innerHTML = `
    ${heroHtml({
      icon: "🎓",
      title: "Campus de Ascensos",
      accentWord: "Ascensos",
      sub: "Elegí una marca para ver su organigrama y cargar exámenes de ascenso"
    })}
    <div class="section-label">Marcas</div>
    <div class="grid grid-center">${cards}</div>
  `;
}

function selectMarca(marcaKey) {
  goTo("regionales", { marca: marcaKey, regional: null, zonal: null, local: null });
}

function renderRegionales() {
  const marca = ORG_DATA[state.marca];
  setBrandTheme(state.marca);
  updateNavCrumb();
  const regionales = getRegionales(marca.key);
  const cards = regionales.map(reg => {
    const filter = { marca: marca.key, regional: reg.nombre };
    return `
      <div class="card" onclick="selectRegional('${escapeHtml(reg.nombre)}')">
        ${deleteBtnHtml(`deleteRegional('${reg.id}', '${escapeHtml(reg.nombre)}', '${marca.key}')`)}
        ${cardIconHtml("🧭", marca.color, marca.colorClaro)}
        <h3>${escapeHtml(reg.nombre)}</h3>
        <div class="sub">GTE Regional${reg.cargo_extra ? " · " + escapeHtml(reg.cargo_extra) : ""}</div>
        ${miniStatsHtml(filter)}
        <div class="card-link">Ver zonales →</div>
      </div>`;
  }).join("");
  const addCard = addCardHtml("Agregar regional", `addRegional('${marca.key}')`);

  root.innerHTML = `
    ${renderBreadcrumb()}
    ${heroHtml({
      icon: marca.sigla,
      title: `Organigrama ${marca.nombre}`,
      accentWord: marca.nombre,
      sub: `${escapeHtml(marca.comercial.nombre)} · ${escapeHtml(marca.comercial.cargo)} · ${regionales.length} regionales`
    })}
    ${summaryChipsHtml({ marca: marca.key })}
    <div class="section-label">Regionales</div>
    <div class="grid">${cards}${addCard}</div>
  `;
}

function selectRegional(nombre) {
  goTo("zonales", { regional: nombre, zonal: null, local: null });
}

function renderZonales() {
  const marca = ORG_DATA[state.marca];
  const zonales = getZonales(marca.key, state.regional);
  updateNavCrumb();
  const cards = zonales.map(z => {
    const filter = { marca: marca.key, regional: state.regional, zonal: z.nombre };
    const nLocales = getLocales(marca.key, state.regional, z.nombre).length;
    return `
      <div class="card" onclick="selectZonal('${escapeHtml(z.nombre)}')">
        ${deleteBtnHtml(`deleteZonal('${z.id}', '${escapeHtml(z.nombre)}', '${marca.key}', '${escapeHtml(state.regional)}')`)}
        ${cardIconHtml("📍", marca.color, marca.colorClaro)}
        <h3>${escapeHtml(z.nombre)}</h3>
        <div class="sub">${nLocales} local(es)</div>
        ${miniStatsHtml(filter)}
        <div class="card-link">Ver locales →</div>
      </div>`;
  }).join("");
  const addCard = addCardHtml("Agregar zonal", `addZonal('${marca.key}', '${escapeHtml(state.regional)}')`);

  root.innerHTML = `
    ${renderBreadcrumb()}
    ${heroHtml({
      icon: "🧭",
      title: state.regional,
      accentWord: state.regional,
      sub: `Regional · ${escapeHtml(marca.nombre)} · ${zonales.length} zonales`
    })}
    ${summaryChipsHtml({ marca: marca.key, regional: state.regional })}
    <div class="section-label">Zonales</div>
    <div class="grid">${cards}${addCard}</div>
  `;
}

function selectZonal(nombre) {
  goTo("locales", { zonal: nombre, local: null });
}

function renderLocales() {
  const marca = ORG_DATA[state.marca];
  const locales = getLocales(marca.key, state.regional, state.zonal);
  updateNavCrumb();
  const cards = locales.map(loc => {
    const filter = { marca: marca.key, regional: state.regional, zonal: state.zonal, local: loc.nombre };
    return `
      <div class="card" onclick="selectLocal('${escapeHtml(loc.nombre)}')">
        ${deleteBtnHtml(`deleteLocal('${loc.id}', '${escapeHtml(loc.nombre)}')`)}
        ${cardIconHtml("🏬", marca.color, marca.colorClaro)}
        <h3>${escapeHtml(loc.nombre)}</h3>
        ${miniStatsHtml(filter)}
        <div class="card-link">Cargar / ver exámenes →</div>
      </div>`;
  }).join("");
  const addCard = addCardHtml("Agregar local", `addLocal('${marca.key}', '${escapeHtml(state.regional)}', '${escapeHtml(state.zonal)}')`);

  root.innerHTML = `
    ${renderBreadcrumb()}
    ${heroHtml({
      icon: "📍",
      title: state.zonal,
      accentWord: state.zonal,
      sub: `Zonal · ${escapeHtml(state.regional)} · ${escapeHtml(marca.nombre)} · ${locales.length} locales`
    })}
    ${summaryChipsHtml({ marca: marca.key, regional: state.regional, zonal: state.zonal })}
    <div class="section-label">Locales</div>
    <div class="grid">${cards}${addCard}</div>
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

  updateNavCrumb();
  root.innerHTML = `
    ${renderBreadcrumb()}
    ${heroHtml({
      icon: "🏬",
      title: state.local,
      accentWord: state.local,
      sub: `${escapeHtml(state.zonal)} · ${escapeHtml(state.regional)} · ${escapeHtml(marca.nombre)}`
    })}
    ${summaryChipsHtml(filter)}
    <div class="local-header">
      <div class="section-label" style="margin:0">Exámenes cargados</div>
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
// MODAL GENERICO DE TEXTO - alta de regional / zonal / local
// ------------------------------------------------------------------
function openNameModal({ title, label, placeholder, onSubmit }) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "nameModalOverlay";
  overlay.innerHTML = `
    <div class="modal">
      <h2>${escapeHtml(title)}</h2>
      <form id="nameForm">
        <div class="field">
          <label>${escapeHtml(label)}</label>
          <input type="text" name="nombre" required placeholder="${escapeHtml(placeholder || "")}" autofocus>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn secondary" onclick="closeNameModal()">Cancelar</button>
          <button type="submit" class="btn">Guardar</button>
        </div>
      </form>
    </div>`;
  document.body.appendChild(overlay);
  const input = overlay.querySelector("input[name=nombre]");
  input.focus();

  document.getElementById("nameForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = new FormData(e.target).get("nombre").trim();
    if (!nombre) return;
    const ok = await onSubmit(nombre);
    if (ok) closeNameModal();
  });
}

function closeNameModal() {
  const overlay = document.getElementById("nameModalOverlay");
  if (overlay) overlay.remove();
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
fetchAll();
