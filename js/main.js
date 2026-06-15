/* Golden Home Real Estate – main.js */

// ── Navbar scroll ──
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => {
  btt.classList.toggle('vis', window.scrollY > 400);
}, { passive: true });

// ── Hamburger ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.addEventListener('click', e => {
  if (e.target.tagName === 'A' || getComputedStyle(navLinks).position === 'fixed')
    navLinks.classList.remove('open');
});

// ── Search hero tabs ──
document.querySelectorAll('.stab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ── Search ──
function doSearch() {
  const type  = document.querySelector('.stab.active')?.dataset.type ?? '';
  const cat   = document.getElementById('sCat').value;
  const price = document.getElementById('sPrice').value;
  const query = document.getElementById('searchInput').value.toLowerCase();

  filterCards({ type, cat, price, query });
  document.getElementById('pronat').scrollIntoView({ behavior: 'smooth' });
}

// ── Quick filters ──
function qFilter(type) {
  document.querySelectorAll('.qf-btn').forEach(b => b.classList.remove('active'));
  event.currentTarget.classList.add('active');
  filterCards({ type });
}

function qFilterCat(cat) {
  document.querySelectorAll('.qf-btn').forEach(b => b.classList.remove('active'));
  event.currentTarget.classList.add('active');
  filterCards({ cat });
}

function qFilterZone(zone) {
  filterCards({ zone });
  document.getElementById('pronat').scrollIntoView({ behavior: 'smooth' });
}

function resetAll() {
  document.querySelectorAll('.qf-btn').forEach((b,i) => b.classList.toggle('active', i===0));
  filterCards({});
}

// ── Core filter ──
function filterCards({ type='', cat='', zone='', price='', query='' } = {}) {
  const cards = document.querySelectorAll('.pcard');
  let visible = 0;

  cards.forEach(c => {
    let show = true;
    if (type  && c.dataset.type !== type)  show = false;
    if (cat   && c.dataset.cat  !== cat)   show = false;
    if (zone  && c.dataset.zone !== zone)  show = false;
    if (query && !c.innerText.toLowerCase().includes(query)) show = false;
    if (price) {
      const p = parseInt(c.dataset.price, 10);
      const limit = parseInt(price, 10);
      if (p > limit) show = false;
    }
    c.classList.toggle('hidden', !show);
    if (show) visible++;
  });

  const rc = document.getElementById('resultsCount');
  rc.textContent = visible === 1 ? '1 pronë e gjetur' : `${visible} prona të gjetura`;

  const noR = document.getElementById('noResults');
  const grid = document.getElementById('propsGrid');
  noR.style.display  = visible === 0 ? 'block' : 'none';
  grid.style.display = visible === 0 ? 'none'  : '';
}

// ── View toggle ──
function setView(v) {
  const grid = document.getElementById('propsGrid');
  grid.classList.toggle('list-view', v === 'list');
  document.getElementById('btnGrid').classList.toggle('active', v === 'grid');
  document.getElementById('btnList').classList.toggle('active', v === 'list');
}

// ── Heart / save ──
document.querySelectorAll('.ph-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    btn.classList.toggle('saved');
  });
});

// ── Contact form ──
const form = document.getElementById('contactForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;

  const rules = [
    { id:'fname',  err:'fnameErr',  msg:'Shkruani emrin tuaj.',          check: v => v.trim().length >= 2 },
    { id:'fphone', err:'fphoneErr', msg:'Shkruani numrin e telefonit.',   check: v => /^\+?[\d\s\-]{7,}$/.test(v.trim()) },
    { id:'femail', err:'femailErr', msg:'Email jo i vlefshëm.',           check: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id:'fmsg',   err:'fmsgErr',   msg:'Mesazhi duhet të jetë 10+ char.', check: v => v.trim().length >= 10 },
  ];

  rules.forEach(r => {
    const el  = document.getElementById(r.id);
    const err = document.getElementById(r.err);
    el.classList.remove('err');
    err.textContent = '';
    if (!r.check(el.value)) {
      el.classList.add('err');
      err.textContent = r.msg;
      ok = false;
    }
  });

  if (!ok) return;

  const btn = document.getElementById('fsubmit');
  btn.disabled = true;
  btn.textContent = 'Duke dërguar...';

  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Dërgo Mesazhin';
    document.getElementById('fsuccess').style.display = 'block';
    setTimeout(() => document.getElementById('fsuccess').style.display = 'none', 5000);
  }, 1200);
});

// ── Scroll reveal ──
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.pcard,.srv-card,.zone-card,.why-checks li,.wstat').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});

// ── Init count ──
filterCards({});
