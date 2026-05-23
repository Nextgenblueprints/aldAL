
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

  // Initialize Swiper for Hero
  const heroSwiper = new Swiper('.hero-swiper', {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    speed: 1000,
  });
});
