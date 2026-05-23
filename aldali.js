/* ============================================================
   AL DALI — SRMG-STYLE INTERACTIVITY LAYER
   Scroll reveals · counters · cursor · tilt · sticky nav ·
   smooth scroll · parallax · mega-menu · marquee · page fade
   ============================================================ */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none)').matches;

  /* ---------- 1. SCROLL REVEAL ---------- */
  const revealSelectors = [
    '.eyebrow', 'h1', 'h2', 'h3', '.lead', '.hero-desc', '.hero-cta',
    '.about-grid > *', '.about-stats .stat',
    '.news-card', '.news-header > *', '.partners-header > *',
    '.partner-cell', '.service-row', '.split-content > *', '.split-grid > img',
    '.stat', '.contact-info-row', '.contact-form > *',
    '.gallery-grid img', '.gallery-head > *',
    '.cta-strip-bottom > *', '.footer-col',
    '.crumbs', '.page-banner h1', '.page-banner .lead',
    '.article-inner > *', '.domain-card'
  ];

  function applyRevealAttrs() {
    revealSelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '');
      });
    });
    // staggered children
    document.querySelectorAll('.news-grid, .partners-grid, .about-stats, .stat-row-inner, .gallery-grid, .service-list-inner').forEach((parent) => {
      [...parent.children].forEach((child, i) => {
        child.style.setProperty('--reveal-delay', (i * 80) + 'ms');
      });
    });
  }

  function initReveal() {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
  }

  /* ---------- 2. ANIMATED COUNTERS ---------- */
  function animateCount(el, target, duration) {
    const start = performance.now();
    const isFloat = target % 1 !== 0;
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = isFloat ? val.toFixed(1) : Math.floor(val).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }
  function initCounters() {
    const nums = document.querySelectorAll('.stat .num, .stat-num, [data-count]');
    if (!nums.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const raw = el.dataset.count || el.textContent;
        const m = raw.match(/[\d.]+/);
        if (m) {
          const target = parseFloat(m[0]);
          const suffix = raw.replace(m[0], '');
          // preserve any <em> suffix already inside
          const em = el.querySelector('em');
          const emHtml = em ? em.outerHTML : '';
          el.dataset.suffix = emHtml || suffix;
          const numSpan = document.createElement('span');
          el.textContent = '';
          el.appendChild(numSpan);
          if (emHtml) el.insertAdjacentHTML('beforeend', emHtml);
          animateCount(numSpan, target, prefersReduced ? 0 : 1600);
        }
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach((n) => io.observe(n));
  }

  /* ---------- 3. SMOOTH SCROLL ---------- */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 4. STICKY NAV: HIDE ON SCROLL DOWN ---------- */
  function initStickyNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    let lastY = window.scrollY;
    let ticking = false;
    function onScroll() {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 40);
      if (y > 200 && y > lastY + 5) nav.classList.add('nav-hide');
      else if (y < lastY - 5) nav.classList.remove('nav-hide');
      lastY = y;
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
  }

  /* ---------- 5. MOBILE NAV ---------- */
  function initMobileNav() {
    const btn = document.getElementById('navToggle');
    const drawer = document.getElementById('mobileNav');
    if (!btn || !drawer) return;
    btn.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      btn.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      drawer.classList.remove('open'); btn.classList.remove('open'); document.body.style.overflow = '';
    }));
  }

  /* ---------- 5b. SRMG NAVIGATION TOGGLE ---------- */
  function initSRMGNav() {
    const menuButton = document.querySelector('.n--menu-button');
    const brgrWrapper = document.querySelector('.brgr-wrapper');
    const navContainer = document.querySelector('.nav-container');

    if (menuButton && navContainer) {
      menuButton.addEventListener('click', () => {
        brgrWrapper.classList.toggle('active');
        navContainer.classList.toggle('open');
        document.body.style.overflow = navContainer.classList.contains('open') ? 'hidden' : '';
      });

      // Close menu when clicking on navigation links
      const navLinks = document.querySelectorAll('.links-nav');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          brgrWrapper.classList.remove('active');
          navContainer.classList.remove('open');
          document.body.style.overflow = '';
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navContainer.contains(e.target) && !menuButton.contains(e.target)) {
          brgrWrapper.classList.remove('active');
          navContainer.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }
  }

  /* ---------- 6. CUSTOM CURSOR ---------- */
  function initCursor() {
    if (isTouch || prefersReduced) return;
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.documentElement.classList.add('has-cursor');

    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    }
    loop();

    const hoverSel = 'a, button, .news-card, .partner-cell, .service-row, .domain-card, input, textarea, select, label';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverSel)) document.documentElement.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverSel)) document.documentElement.classList.remove('cursor-hover');
    });
  }

  /* ---------- 7. HOVER TILT ON CARDS ---------- */
  function initTilt() {
    if (isTouch || prefersReduced) return;
    const cards = document.querySelectorAll('.news-card, .domain-card, .partner-cell');
    cards.forEach((card) => {
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'transform 0.4s cubic-bezier(.2,.8,.2,1)';
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${py * -4}deg) rotateY(${px * 4}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- 8. MAGNETIC BUTTONS ---------- */
  function initMagnetic() {
    if (isTouch || prefersReduced) return;
    document.querySelectorAll('.btn, .nav-cta, .cta-strip-bottom a').forEach((b) => {
      b.addEventListener('mousemove', (e) => {
        const r = b.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        b.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
      });
      b.addEventListener('mouseleave', () => { b.style.transform = ''; });
    });
  }

  /* ---------- 9. PARALLAX HERO ---------- */
  function initParallax() {
    if (prefersReduced) return;
    const layers = document.querySelectorAll('[data-parallax], .hero-video-wrap, .hero-collage img, .hero-collage video');
    if (!layers.length) return;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      layers.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        if (y < window.innerHeight * 1.5) el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
    }, { passive: true });
  }

  /* ---------- 10. MARQUEE: DUPLICATE CONTENT FOR SEAMLESS LOOP ---------- */
  function initMarquee() {
    document.querySelectorAll('.cta-strip-marquee').forEach((m) => {
      const span = m.querySelector('span');
      if (!span) return;
      m.innerHTML = '';
      const wrap = document.createElement('div');
      wrap.className = 'marquee-track';
      for (let i = 0; i < 4; i++) wrap.appendChild(span.cloneNode(true));
      m.appendChild(wrap);
    });
  }

  /* ---------- 10b. HERO ROTATOR (SRMG-style) ---------- */
  function initRotator() {
    const rot = document.getElementById('heroRotator');
    if (!rot) return;
    const words = rot.querySelectorAll('.word');
    if (words.length < 2) return;
    let idx = 0;
    setInterval(() => {
      const cur = words[idx];
      cur.classList.remove('active');
      cur.classList.add('exit');
      idx = (idx + 1) % words.length;
      const next = words[idx];
      next.classList.remove('exit');
      // small delay then activate next
      requestAnimationFrame(() => {
        next.classList.add('active');
      });
      // clear exit class after transition
      setTimeout(() => cur.classList.remove('exit'), 900);
    }, 3200);
  }
/* ---------- 10. HERO VIDEO SLIDESHOW (if exists) ---------- */
function initHeroSwiper() {
  // Initialize Swiper carousel for hero section
  const heroSwiper = new Swiper('.hero-swiper', {
    observe: true,
    observer: true,
    observeParents: true,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    // Optional: enable keyboard navigation
    keyboard: {
      enabled: true,
    },
    // Optional: add fade effect for smoother transitions
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
  });
}
// initHeroSlides function removed – Swiper handles hero carousel
  /* ---------- 12. ABOUT PAGE — BANNER SLIDER ---------- */
  function initBannerSlider() {
    const slides = document.querySelectorAll('#bannerSlider .banner-slide');
    const dots = document.querySelectorAll('#bannerDots button');
    const prevBtn = document.getElementById('bannerPrev');
    const nextBtn = document.getElementById('bannerNext');
    if (!slides.length) return;

    let cur = 0;
    let timer;
    let hovered = false;

    function show(i) {
      slides[cur].classList.remove('active');
      if (dots[cur]) dots[cur].classList.remove('active');
      cur = (i + slides.length) % slides.length;
      slides[cur].classList.add('active');
      if (dots[cur]) dots[cur].classList.add('active');
    }

    function next() { show(cur + 1); }
    function prev() { show(cur - 1); }
    function startTimer() { stopTimer(); timer = setInterval(() => { if (!hovered) next(); }, 5000); }
    function stopTimer() { if (timer) clearInterval(timer); }

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startTimer(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { show(i); startTimer(); }));

    const banner = document.querySelector('.about-banner');
    if (banner) {
      banner.addEventListener('mouseenter', () => { hovered = true; });
      banner.addEventListener('mouseleave', () => { hovered = false; });
    }

    // touch swipe
    let touchX = 0;
    if (banner) {
      banner.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
      banner.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 50) { dx > 0 ? prev() : next(); startTimer(); }
      });
    }

    startTimer();
  }

  /* ---------- 13. ACCORDION (Vision/Mission/Values) ---------- */
  function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    if (!headers.length) return;

    headers.forEach(header => {
      header.addEventListener('click', () => {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        const content = header.nextElementSibling;
        
        // Close all other accordions
        headers.forEach(otherHeader => {
          if (otherHeader !== header) {
            otherHeader.setAttribute('aria-expanded', 'false');
            const otherContent = otherHeader.nextElementSibling;
            otherContent.style.maxHeight = '0';
          }
        });

        // Toggle current accordion
        header.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = '0';
        }
      });
    });
  }

  /* ---------- 14. ABOUT PAGE — GALLERY SLIDER ---------- */
  function initGallerySlider() {
    const slider = document.getElementById('gallerySlider');
    const dotsContainer = document.getElementById('galleryDots');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    if (!slider || !dotsContainer) return;

    const slides = slider.querySelectorAll('.gallery-slide');
    if (!slides.length) return;

    let cur = 0;
    let timer;

    // create dots
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', 'Slide ' + (i + 1));
      if (i === 0) btn.classList.add('active');
      btn.addEventListener('click', () => { show(i); startTimer(); });
      dotsContainer.appendChild(btn);
    });
    const dots = dotsContainer.querySelectorAll('button');

    function show(i) {
      cur = (i + slides.length) % slides.length;
      slider.style.transform = 'translateX(-' + (cur * 100) + '%)';
      dots.forEach((d, j) => d.classList.toggle('active', j === cur));
    }

    function next() { show(cur + 1); }
    function prev() { show(cur - 1); }
    function startTimer() { stopTimer(); timer = setInterval(next, 4500); }
    function stopTimer() { if (timer) clearInterval(timer); }

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startTimer(); });

    const wrap = slider.parentElement;
    wrap.addEventListener('mouseenter', stopTimer);
    wrap.addEventListener('mouseleave', startTimer);

    // touch swipe
    let touchX = 0;
    wrap.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) { dx > 0 ? prev() : next(); startTimer(); }
    });

    startTimer();
  }

  /* ---------- 14. PAGE LOAD FADE ---------- */
  function initPageFade() {
    document.documentElement.classList.add('page-loading');
    window.addEventListener('load', () => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('page-loading');
        document.documentElement.classList.add('page-loaded');
      });
    });
  }

  /* ---------- INIT ---------- */
  function init() {
    initPageFade();
    applyRevealAttrs();
    initReveal();
    initCounters();
    initSmoothScroll();
    initStickyNav();
    initMobileNav();
    initSRMGNav();
    initMarquee();
    initRotator();
    initHeroSwiper();
    // initHeroSlides(); // removed to avoid conflict
    initParallax();
    initTilt();
    initMagnetic();
    initCursor();
    initBannerSlider();
    initAccordion();
    initGallerySlider();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
