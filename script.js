// ════════════════════════════════
// MAHALI SERVICES v2 — script.js
// ════════════════════════════════

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('elevated', y > 20);
  lastScroll = y;
}, { passive: true });

// ── Mobile burger ──
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

burger.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  const s = burger.querySelectorAll('span');
  if (open) {
    s[0].style.transform = 'translateY(7px) rotate(45deg)';
    s[1].style.opacity   = '0';
    s[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    s.forEach(el => { el.style.transform = ''; el.style.opacity = ''; });
  }
});

// Close mobile nav on link click
document.querySelectorAll('.mn-a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── Scroll reveal ──
const revealTargets = document.querySelectorAll(
  '.service-row, .ps-step, .val-card, .shop-card, .cd-item, ' +
  '.affiliation-strip, .app-showcase, .apps-coming, .contact-form, ' +
  '.sec-header-row > *, .aff-left, .contact-left, [data-reveal]'
);

revealTargets.forEach(el => {
  if (!el.classList.contains('reveal-up')) {
    el.classList.add('sr-anim');
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = parseFloat(e.target.dataset.delay || '0') * 1000;
      setTimeout(() => e.target.classList.add('vis'), delay);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealTargets.forEach(el => observer.observe(el));

// ── Active nav highlighting ──
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-a');

const secObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = '';
        a.style.fontWeight = '';
      });
      const active = document.querySelector(`.nav-a[href="#${e.target.id}"]`);
      if (active) {
        active.style.color = 'var(--c-brand)';
        active.style.fontWeight = '600';
      }
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => secObserver.observe(s));

// ── Contact form ──
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn     = form.querySelector('.btn-submit');
    const inner   = btn.querySelector('.btn-inner') || btn;
    const origTxt = inner.textContent;
    inner.textContent = '✅ Message envoyé ! Nous vous répondons sous 24h.';
    btn.style.background = '#2a7a56';
    btn.disabled = true;
    setTimeout(() => {
      inner.textContent = origTxt;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 4000);
  });
}

// ── Stagger service rows ──
document.querySelectorAll('.service-row').forEach((row, i) => {
  row.style.transitionDelay = `${i * 80}ms`;
});

// ── Stagger process steps ──
document.querySelectorAll('.ps-step').forEach((step, i) => {
  step.style.transitionDelay = `${i * 100}ms`;
});

// ── Stagger value cards ──
document.querySelectorAll('.val-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
});
