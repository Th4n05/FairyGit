/* ═══════════════════════════════════════════════════════
   FairyGit Imobiliare – Main JavaScript
═══════════════════════════════════════════════════════ */

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// ── Hamburger menu ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');

  if (navLinks.classList.contains('open') && !navLinks.querySelector('.close-menu')) {
    const close = document.createElement('span');
    close.className = 'close-menu';
    close.textContent = '✕';
    close.addEventListener('click', closeMenu);
    navLinks.prepend(close);
  }
});

function closeMenu() {
  navLinks.classList.remove('open');
}

navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// ── Hero tab filter (synced with property filter) ──
const tabBtns      = document.querySelectorAll('.tab-btn');
const filterTypeEl = document.getElementById('filterType');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const val = btn.dataset.filter;
    filterTypeEl.value = val === 'te-gjitha' ? '' : val;
    applyFilters();
  });
});

// ── Scroll to properties ──
function scrollToProperties() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  document.getElementById('pronat').scrollIntoView({ behavior: 'smooth' });

  if (query) {
    setTimeout(() => filterBySearch(query), 500);
  }
}

function filterBySearch(query) {
  const cards = document.querySelectorAll('.property-card');
  let visible = 0;

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    const match = text.includes(query);
    card.classList.toggle('hidden', !match);
    if (match) visible++;
  });

  updateResultsCount(visible);
  toggleNoResults(visible === 0);
}

// ── Main filter function ──
function applyFilters() {
  const type     = document.getElementById('filterType').value;
  const category = document.getElementById('filterCategory').value;
  const zone     = document.getElementById('filterZone').value;
  const priceRange = document.getElementById('filterPrice').value;

  const cards = document.querySelectorAll('.property-card');
  let visible = 0;

  cards.forEach(card => {
    const cardType     = card.dataset.type;
    const cardCategory = card.dataset.category;
    const cardZone     = card.dataset.zone;
    const cardPrice    = parseInt(card.dataset.price, 10);

    let show = true;

    if (type     && cardType     !== type)     show = false;
    if (category && cardCategory !== category) show = false;
    if (zone     && cardZone     !== zone)     show = false;

    if (priceRange && show) {
      if (priceRange === '500000+') {
        show = cardPrice >= 500000;
      } else {
        const [min, max] = priceRange.split('-').map(Number);
        if (!isNaN(max)) {
          show = cardPrice >= min && cardPrice <= max;
        } else {
          show = cardPrice >= min;
        }
      }
    }

    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });

  updateResultsCount(visible);
  toggleNoResults(visible === 0);

  // Sync hero tabs with filter
  tabBtns.forEach(btn => {
    const tabVal = btn.dataset.filter === 'te-gjitha' ? '' : btn.dataset.filter;
    btn.classList.toggle('active', tabVal === type);
  });
}

function resetFilters() {
  document.getElementById('filterType').value     = '';
  document.getElementById('filterCategory').value = '';
  document.getElementById('filterZone').value     = '';
  document.getElementById('filterPrice').value    = '';
  document.getElementById('searchInput').value    = '';

  tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === 'te-gjitha'));

  document.querySelectorAll('.property-card').forEach(c => c.classList.remove('hidden'));
  const total = document.querySelectorAll('.property-card').length;
  updateResultsCount(total);
  toggleNoResults(false);
}

function updateResultsCount(n) {
  const el = document.getElementById('resultsCount');
  el.textContent = n === 1 ? 'Duke shfaqur 1 pronë' : `Duke shfaqur ${n} prona`;
}

function toggleNoResults(show) {
  document.getElementById('noResults').style.display     = show ? 'block' : 'none';
  document.getElementById('propertiesGrid').style.display = show ? 'none' : 'grid';
}

// ── Wishlist / Heart toggle ──
document.querySelectorAll('.btn-heart').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
  });
});

// ── Contact form validation ──
const form = document.getElementById('contactForm');

form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  // Clear previous errors
  ['name', 'phone', 'email', 'message'].forEach(id => {
    document.getElementById(id).classList.remove('error');
    const err = document.getElementById(id + 'Error');
    if (err) err.textContent = '';
  });

  const name    = document.getElementById('name');
  const phone   = document.getElementById('phone');
  const email   = document.getElementById('email');
  const message = document.getElementById('message');

  if (!name.value.trim() || name.value.trim().length < 2) {
    showError('name', 'Ju lutem shkruani emrin dhe mbiemrin.');
    valid = false;
  }

  if (!phone.value.trim() || !/^\+?[\d\s\-]{7,}$/.test(phone.value.trim())) {
    showError('phone', 'Shkruani një numër telefoni të vlefshëm.');
    valid = false;
  }

  if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    showError('email', 'Shkruani një adresë email të vlefshme.');
    valid = false;
  }

  if (!message.value.trim() || message.value.trim().length < 10) {
    showError('message', 'Mesazhi duhet të ketë të paktën 10 karaktere.');
    valid = false;
  }

  if (valid) {
    submitForm();
  }
});

function showError(id, msg) {
  document.getElementById(id).classList.add('error');
  const errEl = document.getElementById(id + 'Error');
  if (errEl) errEl.textContent = msg;
}

function submitForm() {
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<span>Duke dërguar...</span>';

  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    btn.innerHTML = '<span>Dërgo Mesazhin</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    document.getElementById('formSuccess').style.display = 'block';

    setTimeout(() => {
      document.getElementById('formSuccess').style.display = 'none';
    }, 5000);
  }, 1200);
}

// ── Scroll reveal animation ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.property-card, .service-card, .why-list li').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});

// ── Initial count ──
updateResultsCount(document.querySelectorAll('.property-card').length);
