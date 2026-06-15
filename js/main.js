/* Golden Home Real Estate – main.js */

// ── Back to top ──
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => btt.classList.toggle('vis', window.scrollY > 400), { passive: true });

// ── Hamburger ──
const hamburger = document.getElementById('hamburger');
const siteNav   = document.getElementById('siteNav');
hamburger.addEventListener('click', () => siteNav.classList.toggle('open'));
siteNav.addEventListener('click', e => { if (e.target.tagName === 'A') siteNav.classList.remove('open'); });

// ── Hero tabs ──
document.querySelectorAll('.sh-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sh-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentType = btn.dataset.type;
    applyFilters();
  });
});

let currentType = '';
let currentCats  = new Set();
let currentZones = new Set();

// ── Hero search ──
function doSearch() {
  const q     = document.getElementById('shSearch').value.trim().toLowerCase();
  const cat   = document.getElementById('shCat').value;
  const price = document.getElementById('shPrice').value;

  if (cat) { currentCats.clear(); currentCats.add(cat); }
  applyFilters({ query: q, priceMax: price ? parseInt(price) : Infinity });
  document.getElementById('listings').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function quickSearch(term) {
  document.getElementById('shSearch').value = term;
  doSearch();
}

// ── Sidebar filters ──
function sideFilter() {
  // radio for type
  const typeRadio = document.querySelector('input[name="stype"]:checked');
  currentType = typeRadio ? typeRadio.value : '';

  // checkboxes for cat
  currentCats.clear();
  document.querySelectorAll('.sf-check input[type=checkbox]:checked').forEach(cb => {
    if (['apartament','vile','dhome','zyre','toke'].includes(cb.value)) currentCats.add(cb.value);
  });

  // checkboxes for zone
  currentZones.clear();
  document.querySelectorAll('.sf-check input[type=checkbox]:checked').forEach(cb => {
    if (['tirane','durres','sarande','vlore','shkoder'].includes(cb.value)) currentZones.add(cb.value);
  });

  const prMin = parseInt(document.getElementById('sfPriceMin').value) || 0;
  const prMax = parseInt(document.getElementById('sfPriceMax').value) || Infinity;

  applyFilters({ priceMin: prMin, priceMax: prMax });
}

// ── Core filter ──
function applyFilters({ query = '', priceMin = 0, priceMax = Infinity } = {}) {
  const cards   = document.querySelectorAll('.prop-card');
  let   visible = 0;

  cards.forEach(c => {
    let show = true;
    if (currentType && c.dataset.type !== currentType) show = false;
    if (currentCats.size  && !currentCats.has(c.dataset.cat))   show = false;
    if (currentZones.size && !currentZones.has(c.dataset.zone)) show = false;

    const p = parseInt(c.dataset.price, 10);
    if (p < priceMin || p > priceMax) show = false;
    if (query && !c.innerText.toLowerCase().includes(query)) show = false;

    c.classList.toggle('hidden', !show);
    if (show) visible++;
  });

  const rc = document.getElementById('resultsCount');
  rc.textContent = visible === 1 ? '1 pronë e gjetur' : `${visible} prona të gjetura`;

  document.getElementById('noResults').style.display  = visible === 0 ? 'block' : 'none';
  document.getElementById('propList').style.display   = visible === 0 ? 'none'  : '';
}

function resetAll() {
  currentType = ''; currentCats.clear(); currentZones.clear();
  document.querySelectorAll('input[name="stype"]').forEach((r, i) => r.checked = i === 0);
  document.querySelectorAll('.sf-check input').forEach(cb => cb.checked = false);
  document.getElementById('sfPriceMin').value = '';
  document.getElementById('sfPriceMax').value = '';
  document.getElementById('sfAreaMin').value  = '';
  document.getElementById('sfAreaMax').value  = '';
  document.getElementById('shSearch').value   = '';
  document.querySelectorAll('.sh-tab').forEach((b, i) => b.classList.toggle('active', i === 0));
  applyFilters();
}

// ── Sort ──
function sortListings() {
  const val  = document.getElementById('sortSelect').value;
  const list = document.getElementById('propList');
  const cards = [...list.querySelectorAll('.prop-card:not(.hidden)')];

  cards.sort((a, b) => {
    const pa = parseInt(a.dataset.price, 10);
    const pb = parseInt(b.dataset.price, 10);
    if (val === 'price-asc')  return pa - pb;
    if (val === 'price-desc') return pb - pa;
    return 0;
  });
  cards.forEach(c => list.appendChild(c));
}

// ── View toggle ──
function setView(v) {
  document.getElementById('propList').classList.toggle('grid-view', v === 'grid');
  document.getElementById('vbtnList').classList.toggle('active', v === 'list');
  document.getElementById('vbtnGrid').classList.toggle('active', v === 'grid');
}

// ── Save / heart ──
document.querySelectorAll('.btn-save').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    btn.classList.toggle('saved');
    const svg = btn.querySelector('svg');
    if (btn.classList.contains('saved')) {
      svg.setAttribute('fill', '#dc2626');
      svg.setAttribute('stroke', '#dc2626');
    } else {
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
    }
  });
});

// ── Contact form ──
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;

  const rules = [
    { id:'cname',  err:'cnameErr',  check: v => v.trim().length >= 2,   msg:'Shkruani emrin.' },
    { id:'cphone', err:'cphoneErr', check: v => /^\+?[\d\s\-]{7,}$/.test(v.trim()), msg:'Numër jo i vlefshëm.' },
    { id:'cemail', err:null,        check: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg:'' },
    { id:'cmsg',   err:'cmsgErr',   check: v => v.trim().length >= 10,  msg:'Minimum 10 karaktere.' },
  ];

  rules.forEach(r => {
    const el = document.getElementById(r.id);
    if (!el) return;
    el.classList.remove('err');
    if (r.err) document.getElementById(r.err).textContent = '';
    if (!r.check(el.value)) {
      el.classList.add('err');
      if (r.err) document.getElementById(r.err).textContent = r.msg;
      ok = false;
    }
  });

  if (!ok) return;

  const btn = document.getElementById('csubmit');
  btn.disabled = true;
  btn.textContent = 'Duke dërguar…';
  setTimeout(() => {
    document.getElementById('contactForm').reset();
    btn.disabled = false;
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Dërgo Mesazhin';
    const s = document.getElementById('cfSuccess');
    s.style.display = 'block';
    setTimeout(() => s.style.display = 'none', 5000);
  }, 1200);
});

// ── Init ──
applyFilters();
