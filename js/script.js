/* ==========================================
   CHILTO-WEB — Navegacion de presentacion
   Instituto Agrotecnico Obispo Colombres
   ========================================== */

(function () {
  'use strict';

  const TOTAL_SLIDES = 22;
  let currentSlide = 1;
  let isTransitioning = false;
  let touchStartX = 0;
  let touchEndX = 0;

  const slides = document.querySelectorAll('.slide');
  const counter = document.getElementById('slide-counter');
  const menuList = document.getElementById('menu-list');
  const sideMenu = document.getElementById('side-menu');
  const menuOverlay = document.getElementById('menu-overlay');
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');

  const slideTitles = [
    'Portada',
    'Video 01',
    'Reproduccion a traves de semillas',
    'Foto — Reproduccion a traves de semillas',
    'Reproduccion a traves de estaca',
    'Videos 02, 03, 04, 05 y 06',
    'Fruto: Colorimetria y madurez',
    'Video 07',
    'Marco de plantacion',
    'Video 08',
    'Cosecha',
    'Foto — Cosecha',
    'Videos 09 y 10',
    'Jugo de tomate de arbol',
    'Videos 11 y 12',
    'Chutney',
    'Videos 13 y 14',
    'Usos del Chilto',
    'Videos 15, 16 y 17',
    'Agradecimientos',
    'Autoridades y docentes',
    'Cierre'
  ];

  /* === INICIALIZAR === */
  function init() {
    showSlide(1, false);
    buildMenu();
    bindEvents();
  }

  /* === MOSTRAR DIAPOSITIVA === */
  function showSlide(num, animate) {
    if (num < 1 || num > TOTAL_SLIDES) return;
    if (isTransitioning) return;

    isTransitioning = true;
    currentSlide = num;

    slides.forEach(function (slide) {
      var n = parseInt(slide.getAttribute('data-slide'), 10);
      slide.classList.remove('active', 'prev', 'next');

      if (n === num) {
        slide.classList.add('active');
      } else if (n === num - 1) {
        slide.classList.add('prev');
      } else if (n === num + 1) {
        slide.classList.add('next');
      }
    });

    updateCounter();
    updateMenuActive();
    closeMenu();

    setTimeout(function () {
      isTransitioning = false;
    }, 600);
  }

  /* === ACTUALIZAR CONTADOR === */
  function updateCounter() {
    counter.textContent = 'Diapositiva ' + currentSlide + ' de ' + TOTAL_SLIDES;
  }

  /* === CONSTRUIR MENU === */
  function buildMenu() {
    var fragment = document.createDocumentFragment();

    slideTitles.forEach(function (title, index) {
      var li = document.createElement('li');
      li.textContent = (index + 1) + '. ' + title;
      li.setAttribute('data-menuitem', index + 1);
      li.addEventListener('click', function () {
        goToSlide(index + 1);
      });
      fragment.appendChild(li);
    });

    menuList.appendChild(fragment);
  }

  /* === ACTUALIZAR MENU ACTIVO === */
  function updateMenuActive() {
    var items = menuList.querySelectorAll('li');
    items.forEach(function (item) {
      item.classList.remove('active');
      if (parseInt(item.getAttribute('data-menuitem'), 10) === currentSlide) {
        item.classList.add('active');
      }
    });
  }

  /* === IR A DIAPOSITIVA (global) === */
  window.goToSlide = function (num) {
    showSlide(num, true);
  };

  /* === NAVEGAR === */
  function nextSlide() {
    if (currentSlide < TOTAL_SLIDES) {
      showSlide(currentSlide + 1, true);
    }
  }

  function prevSlide() {
    if (currentSlide > 1) {
      showSlide(currentSlide - 1, true);
    }
  }

  /* === MENU LATERAL === */
  function openMenu() {
    sideMenu.classList.add('open');
    menuOverlay.classList.remove('hidden');
  }

  function closeMenu() {
    sideMenu.classList.remove('open');
    menuOverlay.classList.add('hidden');
  }

  /* === EVENTOS === */
  function bindEvents() {
    /* Botones */
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    menuToggle.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    /* Teclado */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'Escape') {
        closeMenu();
      } else if (e.key === 'Home') {
        e.preventDefault();
        showSlide(1, true);
      } else if (e.key === 'End') {
        e.preventDefault();
        showSlide(TOTAL_SLIDES, true);
      }
    });

    /* Touch / gestos */
    document.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    /* Scroll con rueda */
    var scrollTimeout;
    document.addEventListener('wheel', function (e) {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(function () {
        scrollTimeout = null;
      }, 800);

      if (e.deltaY > 30) {
        nextSlide();
      } else if (e.deltaY < -30) {
        prevSlide();
      }
    }, { passive: true });
  }

  /* === DETECTAR SWIPE === */
  function handleSwipe() {
    var threshold = 60;
    var diff = touchStartX - touchEndX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  /* === INICIAR === */
  init();

})();