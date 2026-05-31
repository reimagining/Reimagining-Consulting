/* ============================================================
   Reimagining Consulting — script.js
   ============================================================ */

'use strict';

/* ── FOOTER: AUTO YEAR ───────────────────────────────────── */
(function () {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ── NAV: HAMBURGER TOGGLE ───────────────────────────────── */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  function closeMenu() {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    const bars = toggle.querySelectorAll('span');
    bars[0].style.transform = '';
    bars[1].style.opacity   = '';
    bars[2].style.transform = '';
  }

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    const bars = toggle.querySelectorAll('span');
    if (open) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      closeMenu();
    }
  });

  // Close on nav link click
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') closeMenu();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) closeMenu();
  });
})();


/* ── NAV: SHRINK ON SCROLL ───────────────────────────────── */
(function () {
  const nav = document.querySelector('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.padding   = '0.75rem 3rem';
      nav.style.boxShadow = '0 2px 20px rgba(13,31,53,0.08)';
    } else {
      nav.style.padding   = '';
      nav.style.boxShadow = '';
    }
  }, { passive: true });
})();


/* ── NAV: ACTIVE LINK ON SCROLL ──────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach((sec) => observer.observe(sec));
})();


/* ── SCROLL-TRIGGERED FADE-IN ────────────────────────────── */
(function () {
  const targets = document.querySelectorAll(
    '.story-col, .expertise-item, .industry-card, .step, .stat-item, .cta-inner'
  );
  if (!targets.length) return;

  targets.forEach((el) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(28px)';
    el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      entry.target.style.transitionDelay = (i % 3) * 0.1 + 's';
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  targets.forEach((el) => observer.observe(el));
})();


/* ── ANIMATED STAT COUNTERS ──────────────────────────────── */
(function () {
  const statNums = document.querySelectorAll('.stat-num');
  if (!statNums.length) return;

  function getLeadingNumber(el) {
    const text = el.childNodes[0]?.textContent?.trim() ?? '';
    const match = text.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  function animateCount(el, target, duration = 1400) {
    const span  = el.querySelector('span');
    const start = performance.now();

    (function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.childNodes[0].textContent = Math.round(eased * target);
      if (span) el.appendChild(span);
      if (progress < 1) requestAnimationFrame(tick);
    })(start);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = getLeadingNumber(entry.target);
      if (target !== null && target > 0) animateCount(entry.target, target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  statNums.forEach((el) => {
    if (getLeadingNumber(el) !== null) observer.observe(el);
  });
})();


/* ── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────── */
(function () {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = document.querySelector('nav')?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();


/* ── KEYBOARD ACCESSIBILITY: CARDS & ITEMS ───────────────── */
(function () {
  const interactiveEls = document.querySelectorAll('.industry-card, .expertise-item');
  interactiveEls.forEach((el) => {
    el.setAttribute('tabindex', '0');
    el.addEventListener('focus', () => {
      if (el.classList.contains('industry-card')) {
        el.style.borderLeftColor = 'var(--gold)';
      } else {
        el.style.background = 'rgba(201,168,76,0.06)';
      }
    });
    el.addEventListener('blur', () => {
      el.style.borderLeftColor = '';
      el.style.background = '';
    });
  });
})();
