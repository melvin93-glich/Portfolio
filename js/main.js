/* ============================================
   MELVIN JESSAN — PORTFOLIO 2026
   Animations: GSAP + ScrollTrigger + Lenis
   ============================================ */

(function () {
  'use strict';

  /* --- Reduced motion check --- */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Helpers --- */
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  /* ==========================================
     PRELOADER
     ========================================== */
  const preloader = $('#preloader');
  const counterEl = $('.preloader-counter');
  const curtain = $('.preloader-curtain');

  function runPreloader() {
    return new Promise(resolve => {
      let count = 0;
      const duration = 1800;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out expo for counter
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        count = Math.round(eased * 100);
        counterEl.textContent = count;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          // Curtain up
          gsap.to(curtain, { height: '100%', duration: .7, ease: 'power3.inOut', onComplete: resolve });
        }
      }
      requestAnimationFrame(tick);
    });
  }

  /* ==========================================
     LENIS SMOOTH SCROLL
     ========================================== */
  let lenis;
  function initLenis() {
    if (!window.Lenis || prefersReduced) return;
    lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(target) {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { offset: 0, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ==========================================
     CUSTOM CURSOR
     ========================================== */
  const dot = $('.cursor-dot');
  const ring = $('.cursor-ring');
  const label = $('.cursor-label');
  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;

  function initCursor() {
    if (prefersReduced || window.matchMedia('(pointer: coarse)').matches) return;
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
    }, { passive: true });

    // Magnetic elements
    const magnetics = $$('.magnetic');
    magnetics.forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '52px'; ring.style.height = '52px';
        ring.style.borderColor = '#F04E23';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width = ''; ring.style.height = '';
        ring.style.borderColor = '';
      });
    });

    // Cursor labels
    const labeled = $$('[data-cursor]');
    labeled.forEach(el => {
      el.addEventListener('mouseenter', () => {
        label.textContent = el.dataset.cursor.toUpperCase();
        label.classList.add('visible');
        ring.style.width = '0'; ring.style.height = '0';
        ring.style.opacity = '0';
      });
      el.addEventListener('mouseleave', () => {
        label.classList.remove('visible');
        ring.style.width = ''; ring.style.height = '';
        ring.style.opacity = '';
      });
    });

    function animateCursor() {
      dotX += (mouseX - dotX) * 0.9;
      dotY += (mouseY - dotY) * 0.9;
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      dot.style.left = dotX + 'px';
      dot.style.top = dotY + 'px';
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      label.style.left = mouseX + 'px';
      label.style.top = (mouseY - 30) + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  /* ==========================================
     NAVIGATION
     ========================================== */
  const menuToggle = $('.nav-toggle');
  const menuOverlay = $('.menu-overlay');

  function initNav() {
    // Menu toggle
    menuToggle.addEventListener('click', () => {
      const isOpen = menuOverlay.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuOverlay.setAttribute('aria-hidden', !isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
      document.documentElement.classList.toggle('menu-open', isOpen);
    });

    // Close menu on link click
    $$('[data-menu-link]').forEach(a => {
      a.addEventListener('click', () => {
        menuOverlay.classList.remove('open');
        document.body.classList.remove('no-scroll');
        document.documentElement.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuOverlay.setAttribute('aria-hidden', 'true');
      });
    });

    // Smooth scroll nav links
    $$('[data-nav-link], [href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          scrollToTarget(href);
        }
      });
    });

    // Active link via ScrollTrigger
    const sections = ['#hero', '#about', '#work', '#journey', '#stack', '#achievements', '#contact'];
    sections.forEach(id => {
      const section = $(id);
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveLink(id),
        onEnterBack: () => setActiveLink(id),
      });
    });
  }

  function setActiveLink(id) {
    $$('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === id);
    });
  }

  /* ==========================================
     SCROLL PROGRESS BAR
     ========================================== */
  function initScrollProgress() {
    const bar = $('.scroll-progress-bar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h * 100) : 0) + '%';
    }, { passive: true });
  }

  /* ==========================================
     REVEAL ANIMATIONS
     ========================================== */
  function initReveals() {
    if (prefersReduced) {
      $$('[data-reveal]').forEach(el => el.classList.add('visible'));
      return;
    }
    $$('[data-reveal]').filter(el => !el.closest('.section--hero')).forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: .8, ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }

  /* ==========================================
     HERO PARALLAX
     ========================================== */
  function initHeroParallax() {
    const artWrap = $('.hero-art-wrap');
    if (!artWrap || prefersReduced) return;
    const hero = $('#hero');
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      gsap.to(artWrap, { x, y, duration: .6, ease: 'power2.out', overwrite: true });
    }, { passive: true });
  }

  /* ==========================================
     COUNTERS
     ========================================== */
  function initCounters() {
    $$('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const numEl = el.querySelector('.stat-number, .big-stat-number');
      if (!numEl) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(numEl,
            { innerText: 0 },
            {
              innerText: target, duration: 2, ease: 'power2.out',
              snap: { innerText: 1 },
              onUpdate: () => { numEl.textContent = Math.round(numEl.innerText) + suffix; },
            }
          );
        },
        once: true,
      });
    });
  }

  /* ==========================================
     COPY EMAIL
     ========================================== */
  function initCopyEmail() {
    const btn = $('.copy-email');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const email = btn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = email; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
      }
      btn.classList.add('copied');
      showToast('Email copied to clipboard!');
      setTimeout(() => btn.classList.remove('copied'), 2000);
    });
  }

  function showToast(msg) {
    const toast = $('#toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  /* ==========================================
     LOCAL TIME
     ========================================== */
  function initLocalTime() {
    const el = $('#local-time');
    if (!el) return;
    function update() {
      const now = new Date();
      // IST is UTC+5:30
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const ist = new Date(utc + 5.5 * 3600000);
      el.textContent = ist.toLocaleTimeString('en-IN', { hour12: false });
    }
    update();
    setInterval(update, 1000);
  }

  /* ==========================================
     BACK TO TOP
     ========================================== */
  function initBackToTop() {
    const btn = $('.back-to-top');
    if (!btn) return;
    btn.addEventListener('click', e => {
      e.preventDefault();
      scrollToTarget('#hero');
    });
  }

  /* ==========================================
     INIT ALL
     ========================================== */
  async function init() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Run preloader
    await runPreloader();

    // Mark loaded
    document.documentElement.classList.add('is-loaded');
    document.documentElement.classList.remove('no-js');

    // Remove preloader
    gsap.to(preloader, { opacity: 0, duration: .4, onComplete: () => preloader.remove() });

    // Init features
    initLenis();
    initCursor();
    initNav();
    initScrollProgress();
    initReveals();
    initHeroParallax();
    initCounters();
    initCopyEmail();
    initLocalTime();
    initBackToTop();

    // Hero content stagger reveal
    if (!prefersReduced) {
      const heroItems = $$('.section--hero [data-reveal]');
      gsap.fromTo(heroItems,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: .7, ease: 'power3.out',
          stagger: .1, delay: .2,
        }
      );
    }
  }

  // Safety fallback: remove preloader after 4s even if JS errors
  setTimeout(() => {
    if (preloader && preloader.parentNode) {
      preloader.style.display = 'none';
      document.documentElement.classList.add('is-loaded');
    }
  }, 4000);

  // Start when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
