/* =========================================================
   MMLAB - script.js
   Funciones:
   1. Carga examenes.json
   2. Buscador
   3. Índice alfanumérico A-Z
   4. Filtro por área
   5. Menú móvil
   6. Enlaces de WhatsApp
   ========================================================= */

const CONFIG = {
  // EDITAR: WhatsApp de MMLAB. Escribir solo números con código de país.
  whatsapp: "51946309246",
  // EDITAR: texto automático de WhatsApp
  whatsappText: "Hola MMLAB, quisiera información sobre sus análisis y la toma de muestras a domicilio."
};

let exams = [];
let activeLetter = "Todos";
let activeArea = "";

const searchInput = document.getElementById("searchInput");
const areaFilter = document.getElementById("areaFilter");
const alphabet = document.getElementById("alphabet");
const examGrid = document.getElementById("examGrid");
const resultCount = document.getElementById("resultCount");
const activeFilters = document.getElementById("activeFilters");
const emptyState = document.getElementById("emptyState");

function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getExamName(exam) {
  return exam.nombre || "";
}

function getArea(exam) {
  return exam.area || "";
}

function getDescription(exam) {
  return exam.descripcion || exam.descripcion_corta || "";
}

function getSample(exam) {
  return exam.muestra || exam.tipo_muestra || "Consultar";
}

function getTime(exam) {
  return exam.tiempo || exam.tiempo_entrega || "Consultar";
}

function getPrice(exam) {
  const value = exam.precio ?? exam.precio_desde;
  if (value === undefined || value === null || value === "") return "Consultar";
  return `S/${Number(value).toFixed(0)}`;
}

function getWhatsAppUrl(message = CONFIG.whatsappText) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}

function setupContactLinks() {
  const url = getWhatsAppUrl();
  ["heroWhatsapp", "contactWhatsapp", "footerWhatsapp"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = url;
  });

  const call = document.getElementById("callButton");
  if (call) call.href = `tel:+${CONFIG.whatsapp}`;
}

async function loadExams() {
  try {
    const response = await fetch("./examenes.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    exams = await response.json();

    if (!Array.isArray(exams)) {
      throw new Error("examenes.json debe contener un arreglo.");
    }

    buildAreaFilter();
    buildAlphabet();
    renderExams();
  } catch (error) {
    console.error(error);
    resultCount.textContent = "No se pudo cargar el catálogo";
    activeFilters.textContent = "Abre el sitio con VS Code + Live Server o desde GitHub.";
    emptyState.hidden = false;
    emptyState.innerHTML = `
      <strong>No se pudo cargar examenes.json.</strong>
      <p>Si abriste index.html directamente, usa <b>Live Server</b> en VS Code.</p>
    `;
  }
}

function buildAreaFilter() {
  const areas = [...new Set(exams.map(getArea).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es"));

  areaFilter.innerHTML = `<option value="">Todas las áreas</option>`;
  areas.forEach(area => {
    const option = document.createElement("option");
    option.value = area;
    option.textContent = area;
    areaFilter.appendChild(option);
  });
}

function buildAlphabet() {
  // IMPORTANTE: solo "Todos" + A-Z. Se eliminaron los botones numéricos.
  const letters = ["Todos", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

  alphabet.innerHTML = "";
  letters.forEach(letter => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "letter-btn" + (letter === activeLetter ? " active" : "");
    button.textContent = letter;
    button.dataset.letter = letter;
    button.addEventListener("click", () => {
      activeLetter = letter;
      document.querySelectorAll(".letter-btn").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      renderExams();
    });
    alphabet.appendChild(button);
  });
}

function matchesSearch(exam, query) {
  if (!query) return true;

  const haystack = [
    exam.nombre,
    exam.area,
    exam.descripcion,
    exam.descripcion_corta,
    exam.para_que_sirve,
    exam.tipo_muestra,
    exam.muestra,
    exam.categoria
  ].map(normalizeText).join(" ");

  return haystack.includes(normalizeText(query));
}

function matchesLetter(exam) {
  if (activeLetter === "Todos") return true;
  return getExamName(exam).trim().toUpperCase().startsWith(activeLetter);
}

function matchesArea(exam) {
  return !activeArea || getArea(exam) === activeArea;
}

function filteredExams() {
  const query = searchInput.value.trim();
  return exams.filter(exam =>
    matchesSearch(exam, query) &&
    matchesLetter(exam) &&
    matchesArea(exam)
  );
}

function renderExams() {
  const results = filteredExams();

  resultCount.textContent = `${results.length} ${results.length === 1 ? "análisis" : "análisis"}`;

  const filters = [];
  if (activeLetter !== "Todos") filters.push(`Letra: ${activeLetter}`);
  if (activeArea) filters.push(`Área: ${activeArea}`);
  if (searchInput.value.trim()) filters.push(`Búsqueda: "${searchInput.value.trim()}"`);
  activeFilters.textContent = filters.length ? filters.join(" • ") : "Mostrando todo el catálogo";

  examGrid.innerHTML = "";
  emptyState.hidden = results.length !== 0;

  results.forEach(exam => {
    const card = document.createElement("article");
    card.className = "exam-card";

    const category = exam.categoria ? ` • ${exam.categoria}` : "";

    card.innerHTML = `
      <div class="exam-area">${escapeHtml(getArea(exam))}${escapeHtml(category)}</div>
      <h3>${escapeHtml(getExamName(exam))}</h3>
      <p>${escapeHtml(getDescription(exam))}</p>
      <div class="exam-meta">
        <span>🧪 ${escapeHtml(getSample(exam))}</span>
        <span>⏱ ${escapeHtml(getTime(exam))}</span>
      </div>
      <div class="exam-price">${escapeHtml(getPrice(exam))}</div>
    `;

    examGrid.appendChild(card);
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

searchInput.addEventListener("input", renderExams);
areaFilter.addEventListener("change", () => {
  activeArea = areaFilter.value;
  renderExams();
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  mainNav.classList.toggle("open");
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => mainNav.classList.remove("open"));
});

setupContactLinks();
loadExams();
