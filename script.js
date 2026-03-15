// ═══════════════════════════════
// MAHALI SERVICES v4 — script.js
// ═══════════════════════════════

// ── Navbar ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 40);
}, { passive: true });

// ── Mobile nav ──
const toggle = document.getElementById('navToggle');
const drawer = document.getElementById('navDrawer');

toggle.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  const [s1, s2] = toggle.querySelectorAll('span');
  s1.style.transform = open ? 'translateY(7.5px) rotate(45deg)'  : '';
  s2.style.transform = open ? 'translateY(-7.5px) rotate(-45deg)' : '';
});

document.querySelectorAll('.drawer-link').forEach(l => {
  l.addEventListener('click', () => {
    drawer.classList.remove('open');
    toggle.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

// ── Scroll reveal with stagger ──
const reveals = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver((entries) => {
  // Group entries by parent for stagger
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const siblings = [...e.target.parentElement.querySelectorAll('.reveal:not(.in)')];
    const idx = siblings.indexOf(e.target);
    setTimeout(() => e.target.classList.add('in'), Math.max(0, idx) * 85);
    ro.unobserve(e.target);
  });
}, { threshold: 0.07, rootMargin: '0px 0px -50px 0px' });

reveals.forEach(el => ro.observe(el));

// ── Active nav highlight ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');
const so = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => {
      const active = a.getAttribute('href') === `#${e.target.id}`;
      a.style.color      = active ? 'var(--text)' : '';
      a.style.background = active ? 'var(--bg3)'  : '';
    });
  });
}, { threshold: 0.4 });
sections.forEach(s => so.observe(s));

// ── Contact form ──
const form = document.getElementById('contactForm');
if (form) {
  const isConfigured = (form.action || '').includes('formspree.io') && !form.action.includes('VOTRE_CODE');

  form.addEventListener('submit', async (e) => {
    if (!isConfigured) e.preventDefault();
    const btn    = form.querySelector('.cf-submit');
    const textEl = btn.querySelector('.cfs-text');
    const arrEl  = btn.querySelector('.cfs-arrow');
    const orig   = textEl.textContent;
    btn.disabled = true;
    textEl.textContent = 'Envoi en cours…';
    arrEl.textContent  = '⏳';
    if (!isConfigured) {
      await new Promise(r => setTimeout(r, 1200));
      textEl.textContent   = 'Message envoyé !';
      arrEl.textContent    = '✓';
      btn.style.background = '#2a7a56';
      setTimeout(() => {
        textEl.textContent   = orig;
        arrEl.textContent    = '→';
        btn.style.background = '';
        btn.disabled         = false;
        form.reset();
      }, 3500);
    }
  });
}

// ── Smooth scroll with nav offset ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav')) || 72;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 24, behavior: 'smooth' });
  });
});
