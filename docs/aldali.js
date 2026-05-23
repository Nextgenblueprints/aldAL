document.addEventListener('DOMContentLoaded', () => {
  const topNav = document.getElementById('topNav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Sticky navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      topNav.classList.add('scrolled');
    } else {
      topNav.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // GSAP + ScrollTrigger + Lenis
  gsap.registerPlugin(ScrollTrigger);

  // Initialize Lenis for Smooth Scrolling
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync ScrollTrigger with Lenis
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 1. HERO SCROLLYTELLING
  const heroSection = document.querySelector('.hero-scrolly');
  if (heroSection) {
    const textBlocks = gsap.utils.toArray('.hero-text-block');
    const videos = gsap.utils.toArray('.hero-bg-video');

    // Create a pinned timeline for the hero section
    let tlHero = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: `+=${textBlocks.length * 100}%`,
        pin: true,
        scrub: true,
      }
    });

    textBlocks.forEach((block, i) => {
      const inner = block.querySelector('.hero-text-inner');
      
      // Reveal the text block
      tlHero.to(inner, { opacity: 1, y: 0, duration: 1 }, i * 2);

      // Crossfade the videos
      if (i > 0) {
        tlHero.to(videos[i-1], { opacity: 0, duration: 0.5 }, i * 2 - 0.5);
        tlHero.to(videos[i], { opacity: 1, duration: 0.5 }, i * 2 - 0.5);
      }

      // Hide the text block (unless it's the last one)
      if (i !== textBlocks.length - 1) {
        tlHero.to(inner, { opacity: 0, y: -50, duration: 1 }, i * 2 + 1);
      }
    });
  }

  // 2. ABOUT US REVEAL
  const aboutText = document.querySelector('.reveal-text');
  if (aboutText) {
    gsap.to(aboutText, {
      backgroundPositionX: '0%',
      ease: "none",
      scrollTrigger: {
        trigger: '.about-text-reveal',
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: true,
      }
    });
  }

  // About Stats Parallax
  gsap.utils.toArray('.stat-box').forEach(box => {
    const speed = box.getAttribute('data-speed');
    gsap.to(box, {
      y: (i, target) => -ScrollTrigger.maxScroll(window) * (speed - 1),
      ease: "none",
      scrollTrigger: {
        trigger: box,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0,
      }
    });
  });

  // 3. SERVICES HORIZONTAL SCROLL
  const servicesSection = document.querySelector('.services-scrolly');
  const horizontalContainer = document.querySelector('.services-horizontal-container');
  
  if (servicesSection && horizontalContainer) {
    let getScrollAmount = () => -(horizontalContainer.scrollWidth - window.innerWidth + 200);

    gsap.to(horizontalContainer, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: servicesSection,
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`,
        pin: true,
        animation: gsap.to(horizontalContainer, { x: getScrollAmount, ease: "none" }),
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  }

  // 4. PARTNERS GRID REVEAL
  const partnersSection = document.querySelector('.partners-scrolly');
  if (partnersSection) {
    gsap.to('.partners-title-reveal', {
      opacity: 1,
      y: 0,
      duration: 1,
      scrollTrigger: {
        trigger: partnersSection,
        start: 'top 70%',
      }
    });

    gsap.to('.partner-item-reveal', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.partners-grid-reveal',
        start: 'top 80%',
      }
    });
  }
});
