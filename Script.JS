/* ============================================================
   Reimagining Consulting — script.js
   ============================================================ */

'use strict';

/* ── NAV: HAMBURGER TOGGLE ───────────────────────────────── */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);

    // Animate the three bars into an X
    const bars = toggle.querySelectorAll('span');
    if (open) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity   = '';
      bars[2].style.transform = '';
    }
  });

  // Close menu when a nav link is clicked
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      const bars = toggle.querySelectorAll('span');
      bars[0].style.transform = '';
      bars[1].style.opacity   = '';
      bars[2].style.transform = '';
    }
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      const bars = toggle.querySelectorAll('span');
      bars[0].style.transform = '';
      bars[1].style.opacity   = '';
      bars[2].style.transform = '';
    }
  });
})();


/* ── NAV: SHRINK ON SCROLL ───────────────────────────────── */
(function () {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const THRESHOLD = 60;

  window.addEventListener('scroll', () => {
    if (window.scrollY > THRESHOLD) {
      nav.style.padding        = '0.75rem 3rem';
      nav.style.boxShadow      = '0 2px 20px rgba(13,31,53,0.08)';
    } else {
      nav.style.padding        = '';
      nav.style.boxShadow      = '';
    }
  }, { passive: true });
})();


/* ── NAV: ACTIVE LINK ON SCROLL ──────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((sec) => observer.observe(sec));
})();


/* ── SCROLL-TRIGGERED FADE-IN ────────────────────────────── */
/*
   Elements that start with opacity:0 / translateY via CSS animation
   are re-triggered when they enter the viewport so off-screen content
   doesn't animate before the user sees it.
*/
(function () {
  // Elements to watch — add more selectors as needed
  const selectors = [
    '.story-col',
    '.expertise-item',
    '.industry-card',
    '.step',
    '.stat-item',
    '.cta-inner',
  ];

  const targets = document.querySelectorAll(selectors.join(', '));
  if (!targets.length) return;

  // Prepare each element — hide until it enters the viewport
  targets.forEach((el) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        // Stagger siblings inside the same grid/list
        const delay = (i % 3) * 0.1;
        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
})();


/* ── ANIMATED STAT COUNTERS ──────────────────────────────── */
(function () {
  const statNums = document.querySelectorAll('.stat-num');
  if (!statNums.length) return;

  // Extract the leading number from a stat element's text content
  function parseLeadingNumber(el) {
    const text = el.childNodes[0]?.textContent?.trim() ?? '';
    const match = text.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  function animateCount(el, target, duration = 1400) {
    const span     = el.querySelector('span');
    const suffix   = span ? span.textContent : '';
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);

      el.childNodes[0].textContent = current;
      if (span) el.appendChild(span); // keep the suffix <span>

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = parseLeadingNumber(entry.target);
        if (target !== null && target > 0) {
          animateCount(entry.target, target);
        }
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach((el) => {
    if (parseLeadingNumber(el) !== null) observer.observe(el);
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
    const nav    = document.querySelector('nav');
    const offset = nav ? nav.offsetHeight : 0;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();


/* ── INDUSTRY CARD: KEYBOARD FOCUS BORDER ────────────────── */
(function () {
  const cards = document.querySelectorAll('.industry-card');
  cards.forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('focus', () => {
      card.style.borderLeftColor = 'var(--gold)';
    });
    card.addEventListener('blur', () => {
      card.style.borderLeftColor = '';
    });
  });
})();


/* ── EXPERTISE ITEM: KEYBOARD FOCUS HIGHLIGHT ────────────── */
(function () {
  const items = document.querySelectorAll('.expertise-item');
  items.forEach((item) => {
    item.setAttribute('tabindex', '0');
    item.addEventListener('focus', () => {
      item.style.background = 'rgba(201,168,76,0.06)';
    });
    item.addEventListener('blur', () => {
      item.style.background = '';
    });
  });
})();


/* ── CURRENT YEAR IN FOOTER ──────────────────────────────── */
(function () {
  const copy = document.querySelector('.footer-copy');
  if (!copy) return;
  copy.textContent = copy.textContent.replace(
    /\d{4}/,
    new Date().getFullYear()
  );
})();
