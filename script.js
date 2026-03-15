// ═══════════════════════════════
// MAHALI SERVICES v3 — script.js
// ═══════════════════════════════

// ── Navbar stuck state ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 40);
}, { passive: true });

// ── Mobile nav toggle ──
const toggle   = document.getElementById('navToggle');
const drawer   = document.getElementById('navDrawer');

toggle.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  const [s1, s2] = toggle.querySelectorAll('span');
  if (open) {
    s1.style.transform = 'translateY(7.5px) rotate(45deg)';
    s2.style.transform = 'translateY(-7.5px) rotate(-45deg)';
  } else {
    s1.style.transform = '';
    s2.style.transform = '';
  }
});

document.querySelectorAll('.drawer-link').forEach(l => {
  l.addEventListener('click', () => {
    drawer.classList.remove('open');
    toggle.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

// ── Scroll reveal ──
const revealEls = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // stagger siblings
      const siblings = [...e.target.parentElement.querySelectorAll('.reveal:not(.in)')];
      const idx = siblings.indexOf(e.target);
      setTimeout(() => e.target.classList.add('in'), idx * 80);
      ro.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => ro.observe(el));

// ── Active nav section highlighting ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

const so = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        const active = a.getAttribute('href') === `#${e.target.id}`;
        a.style.color = active ? 'var(--text)' : '';
        a.style.background = active ? 'var(--bg3)' : '';
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => so.observe(s));

// ── Contact form ──
const form = document.getElementById('contactForm');
if (form) {
  // Check if Formspree is configured
  const action = form.getAttribute('action') || '';
  const isFormspree = action.includes('formspree.io') && !action.includes('VOTRE_CODE');

  form.addEventListener('submit', async (e) => {
    if (!isFormspree) {
      // Demo mode — no real Formspree key yet
      e.preventDefault();
    }

    const btn      = form.querySelector('.cf-submit');
    const textEl   = btn.querySelector('.cfs-text');
    const arrowEl  = btn.querySelector('.cfs-arrow');
    const origText = textEl.textContent;

    btn.disabled = true;
    textEl.textContent = 'Envoi en cours…';
    arrowEl.textContent = '⏳';

    if (!isFormspree) {
      await new Promise(r => setTimeout(r, 1200));
      textEl.textContent = 'Message envoyé !';
      arrowEl.textContent = '✓';
      btn.style.background = '#2a7a56';
      setTimeout(() => {
        textEl.textContent = origText;
        arrowEl.textContent = '→';
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3500);
    }
  });
}

// ── Smooth scroll offset (accounts for fixed nav) ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav')) || 72;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 24;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
