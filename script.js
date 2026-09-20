const CONFIG_URL = 'config.json';
let CONFIG = {};
let exams = [];
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

async function loadConfig() {
  try {
    const r = await fetch(CONFIG_URL);
    CONFIG = await r.json();
    applyConfig();
  } catch (e) {
    console.warn('No se pudo cargar config.json', e);
  }
}

function wa(message) {
  return `https://wa.me/${CONFIG.negocio?.whatsapp || '51999999999'}?text=${encodeURIComponent(message)}`;
}

function applyConfig() {
  $$('[data-whatsapp-general]').forEach((a) => {
    a.href = wa(CONFIG.mensajes?.general || 'Hola MMLAB, quisiera información.');
  });

  const email = $('#emailLink');
  if (email) email.href = `mailto:${CONFIG.negocio.email}`;

  const footerContact = $('#footerContact');
  if (footerContact) {
    footerContact.innerHTML = `WhatsApp: ${CONFIG.negocio.whatsapp_visible}<br>${CONFIG.negocio.email}`;
  }
}

// ==============================
// CARRUSEL PRINCIPAL
// ==============================
const slides = $$('.slide');
let current = 1; // Inicia en 2/4
let carouselTimer;

function setupCarousel() {
  const dots = $('#slideDots');
  if (!dots || !slides.length) return;

  dots.innerHTML = '';

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.className = 'dot';
    d.setAttribute('aria-label', `Mostrar imagen ${i + 1}`);
    d.addEventListener('click', () => showSlide(i));
    dots.appendChild(d);
  });

  showSlide(current);
  startCarousel();

  const carousel = $('#heroCarousel');
  carousel?.addEventListener('mouseenter', stopCarousel);
  carousel?.addEventListener('mouseleave', startCarousel);
}

function startCarousel() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => {
    showSlide((current + 1) % slides.length);
  }, 4500);
}

function stopCarousel() {
  clearInterval(carouselTimer);
}

function showSlide(i) {
  if (!slides.length) return;
  current = i;

  slides.forEach((s, n) => s.classList.toggle('active', n === i));
  $('#slideCounter').textContent = `${i + 1}/${slides.length}`;
  $$('.dot').forEach((d, n) => d.classList.toggle('active', n === i));
  $('#carouselLabel').textContent = i === 3
    ? 'Atención en clínicas y hospitales'
    : 'Toma de muestra a domicilio';
}

// ==============================
// BUSCADOR Y FILTROS DEL CATÁLOGO
// ==============================
const ALPHABET = [
  'Todos',
  '1', '2', '3', '4', '5', '6', '7', '8', '9',
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
];

let alpha = 'Todos';
let area = 'Todos';
let search = '';

function normalize(s) {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

function setupFilters() {
  const alphaFilter = $('#alphaFilter');
  const alphaSlider = $('#alphaSlider');
  const alphaSliderValue = $('#alphaSliderValue');
  const searchInput = $('#searchInput');

  if (!alphaFilter || !alphaSlider) return;

  alphaFilter.innerHTML = ALPHABET.map((item, index) => `
    <button
      type="button"
      class="filter-btn alpha-btn ${item === 'Todos' ? 'active' : ''}"
      data-alpha="${item}"
      data-alpha-index="${index}"
      aria-label="Filtrar por ${item}"
    >${item}</button>
  `).join('');

  alphaFilter.addEventListener('click', (event) => {
    const button = event.target.closest('.alpha-btn');
    if (!button) return;

    setAlpha(button.dataset.alpha);
    renderExams();
  });

  alphaSlider.addEventListener('input', () => {
    const index = Number(alphaSlider.value);
    setAlpha(ALPHABET[index], false);
    renderExams();
  });

  searchInput?.addEventListener('input', (event) => {
    search = event.target.value;
    renderExams();
  });

  updateAlphaControls();
}

function setAlpha(value, updateSlider = true) {
  alpha = value;

  if (updateSlider) {
    const index = ALPHABET.indexOf(value);
    if (index >= 0) $('#alphaSlider').value = index;
  }

  updateAlphaControls();
}

function updateAlphaControls() {
  const index = ALPHABET.indexOf(alpha);
  const slider = $('#alphaSlider');
  const value = $('#alphaSliderValue');

  if (slider && index >= 0) slider.value = index;
  if (value) value.textContent = alpha === 'Todos' ? 'TODO' : alpha;

  $$('.alpha-btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.alpha === alpha);
  });
}

function setupAreas() {
  const configuredAreas = CONFIG.catalogo?.areas || [];
  const examAreas = exams.map((x) => x.area).filter(Boolean);

  // Respeta el orden editable de config.json y agrega automáticamente
  // cualquier área nueva que aparezca en examenes.json.
  const areas = [
    'Todos',
    ...configuredAreas.filter((x) => x && x !== 'Todos'),
    ...examAreas
  ].filter((value, index, self) => self.indexOf(value) === index);

  $('#areaFilter').innerHTML = areas.map((item) => `
    <button
      type="button"
      class="filter-btn area-btn ${item === 'Todos' ? 'active' : ''}"
      data-area="${item}"
    >${item}</button>
  `).join('');

  $('#areaFilter').addEventListener('click', (event) => {
    const button = event.target.closest('.area-btn');
    if (!button) return;

    area = button.dataset.area;
    $$('.area-btn').forEach((b) => b.classList.toggle('active', b === button));
    renderExams();
  });
}

function renderExams() {
  const q = normalize(search);

  const list = exams.filter((x) => {
    const name = normalize(x.nombre);
    const matchesSearch = !q || [
      x.nombre,
      x.area,
      x.descripcion,
      x.muestra
    ].some((value) => normalize(value).includes(q));

    const matchesAlpha =
      alpha === 'Todos' ||
      (alpha === '0-9' && /^\d/.test(name)) ||
      (alpha !== 'Todos' && alpha !== '0-9' && name.startsWith(alpha));

    const matchesArea = area === 'Todos' || x.area === area;

    return matchesSearch && matchesAlpha && matchesArea;
  });

  $('#resultCount').textContent = `${list.length} ${list.length === 1 ? 'resultado' : 'resultados'}`;
  $('#activeFilters').textContent = `${alpha === 'Todos' ? 'Todos' : alpha} · ${area === 'Todos' ? 'Todas las áreas' : area}`;

  $('#examGrid').innerHTML = list.length
    ? list.map(examCard).join('')
    : '<div class="empty">No encontramos análisis con esos filtros.</div>';
}

function examCard(x) {
  const msg = (CONFIG.mensajes?.cotizacion || 'Hola MMLAB, quiero cotizar el análisis: {EXAMEN}.')
    .replace('{EXAMEN}', x.nombre);

  return `
    <article class="exam-card">
      <div class="exam-top">
        <span class="exam-badge">${x.area}</span>
        <span class="exam-cat">${x.categoria || 'basico'}</span>
      </div>
      <h3>${x.nombre}</h3>
      <p>${x.descripcion || ''}</p>
      <div class="exam-meta">
        <span>◷ ${x.tiempo || '24 horas'}</span>
        <span>✎ ${x.muestra || 'Muestra'}</span>
      </div>
      <div class="exam-footer">
        <span class="price">Desde S/ ${x.precio}</span>
        <a class="quote-btn" href="${wa(msg)}" target="_blank" rel="noopener">Cotizar →</a>
      </div>
    </article>
  `;
}

async function loadExams() {
  try {
    const r = await fetch('examenes.json');
    exams = await r.json();
    setupAreas();
    renderExams();
  } catch (e) {
    $('#examGrid').innerHTML = '<div class="empty">No se pudo cargar examenes.json. Abre el proyecto con Live Server en VS Code.</div>';
  }
}

// ==============================
// MENÚ MÓVIL
// ==============================
$('#menuToggle')?.addEventListener('click', () => {
  $('#mainNav').classList.toggle('mobile-open');
});

$$('.nav-pill a').forEach((a) => {
  a.addEventListener('click', () => {
    $$('.nav-pill a').forEach((x) => x.classList.remove('active'));
    a.classList.add('active');
    $('#mainNav')?.classList.remove('mobile-open');
  });
});

loadConfig().then(() => {
  setupFilters();
  loadExams();
});

setupCarousel();
