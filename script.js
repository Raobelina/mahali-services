// ═══════════════════════════════════════
// MAHALI SERVICES — script.js
// Ajoute .js-ok sur body EN PREMIER
// pour activer les animations reveal
// ═══════════════════════════════════════

// ① Activer les animations (doit être en premier)
document.body.classList.add('js-ok');

// ② Navbar sticky
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 40);
}, { passive: true });

// ③ Mobile nav toggle
const toggle = document.getElementById('navToggle');
const drawer = document.getElementById('navDrawer');

toggle.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  const [s1, s2] = toggle.querySelectorAll('span');
  s1.style.transform = open ? 'translateY(7.5px) rotate(45deg)'  : '';
  s2.style.transform = open ? 'translateY(-7.5px) rotate(-45deg)' : '';
});

document.querySelectorAll('.drawer-link').forEach(link => {
  link.addEventListener('click', () => {
    drawer.classList.remove('open');
    toggle.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

// ④ Scroll reveal avec stagger
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const parent   = entry.target.parentElement;
    const siblings = parent ? [...parent.querySelectorAll('.reveal:not(.in)')] : [];
    const idx      = Math.max(0, siblings.indexOf(entry.target));
    setTimeout(() => entry.target.classList.add('in'), idx * 80);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ⑤ Highlight nav actif au scroll
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-menu a');

sections.forEach(section => {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => {
        const active = a.getAttribute('href') === '#' + e.target.id;
        a.style.color      = active ? 'var(--text)' : '';
        a.style.background = active ? 'var(--bg3)'  : '';
      });
    });
  }, { threshold: 0.4 }).observe(section);
});

// ⑥ Formulaire de contact → /api/contact (Resend)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn  = form.querySelector('.cf-submit');
    const txt  = btn.querySelector('.cfs-text');
    const arr  = btn.querySelector('.cfs-arrow');
    const orig = txt.textContent;

    btn.disabled    = true;
    txt.textContent = 'Envoi en cours…';
    arr.textContent = '⏳';

    const data = {
      name:    form.querySelector('[name="name"]').value,
      email:   form.querySelector('[name="email"]').value,
      phone:   form.querySelector('[name="phone"]').value,
      service: form.querySelector('[name="service"]').value,
      budget:  form.querySelector('[name="budget"]').value,
      message: form.querySelector('[name="message"]').value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        txt.textContent      = 'Message envoyé ✓';
        arr.textContent      = '';
        btn.style.background = '#2a7a56';
        form.reset();
        setTimeout(() => {
          txt.textContent      = orig;
          arr.textContent      = '→';
          btn.style.background = '';
          btn.disabled         = false;
        }, 4000);
      } else {
        throw new Error('Erreur serveur');
      }
    } catch (err) {
      txt.textContent      = 'Erreur — réessayez';
      arr.textContent      = '✗';
      btn.style.background = '#8b2020';
      setTimeout(() => {
        txt.textContent      = orig;
        arr.textContent      = '→';
        btn.style.background = '';
        btn.disabled         = false;
      }, 3000);
    }
  });
}

// ⑦ Smooth scroll avec offset navbar
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav')) || 72;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - navH - 20,
      behavior: 'smooth'
    });
  });
});
