'use strict';

/* Function 1: light / dark theme toggle (saved between visits) */
function initThemeToggle() {
  const btn = document.getElementById('themeBtn');
  const root = document.documentElement;
  const apply = (t) => { root.setAttribute('data-theme', t); btn.textContent = t === 'dark' ? '☀️' : '🌙'; };
  let saved = 'light';
  try { saved = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch (e) {}
  apply(saved);
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
}

/* Function 2: mobile menu */
function initMobileMenu() {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

/* Function 3: contact form validation with error messages */
function initFormValidation() {
  const form = document.getElementById('contactForm');
  const ok = document.getElementById('formOk');
  const rules = {
    name: (v) => (v.trim().length < 2 ? 'Enter your name (at least 2 characters).' : ''),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email, e.g. name@mail.com.'),
    msg: (v) => (v.trim().length < 10 ? 'Message must be at least 10 characters.' : ''),
  };
  const check = (id) => {
    const input = document.getElementById(id);
    const msg = rules[id](input.value);
    document.getElementById(id + 'Err').textContent = msg;
    input.closest('.field').classList.toggle('invalid', !!msg);
    input.setAttribute('aria-invalid', String(!!msg));
    return !msg;
  };
  Object.keys(rules).forEach((id) => document.getElementById(id).addEventListener('input', () => { ok.hidden = true; check(id); }));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = Object.keys(rules).map(check).every(Boolean);
    if (valid) { form.reset(); ok.hidden = false; }
    else form.querySelector('.invalid input, .invalid textarea').focus();
  });
}

/* Function 4: filter + search for project cards */
function initProjectFilter() {
  const cards = [...document.querySelectorAll('#grid .card')];
  const chips = document.querySelectorAll('.chip');
  const search = document.getElementById('search');
  const empty = document.getElementById('empty');
  let cat = 'all';
  const update = () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach((c) => {
      const match = (cat === 'all' || c.dataset.cat === cat) && c.textContent.toLowerCase().includes(q);
      c.hidden = !match;
      if (match) { shown++; c.classList.add('in'); }
    });
    empty.hidden = shown > 0;
  };
  chips.forEach((chip) => chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    cat = chip.dataset.filter;
    update();
  }));
  search.addEventListener('input', update);
}

/* Extras: reveal on scroll, hero blobs, active nav link */
function initExtras() {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  const hero = document.querySelector('.hero');
  const blobs = document.querySelectorAll('.blob');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      blobs.forEach((b, i) => { b.style.transform = `translate(${x * (i + 1) * 30}px, ${y * (i + 1) * 30}px)`; });
    });
  }

  const links = [...document.querySelectorAll('#menu a')];
  addEventListener('scroll', () => {
    const pos = scrollY + 120;
    links.forEach((l) => {
      const s = document.querySelector(l.getAttribute('href'));
      l.style.fontWeight = s && s.offsetTop <= pos && s.offsetTop + s.offsetHeight > pos ? '600' : '';
    });
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initFormValidation();
  initProjectFilter();
  initExtras();
});
