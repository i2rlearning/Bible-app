document.addEventListener('DOMContentLoaded', () => {
  let currentIndex = 0;
  let intervalId = null;
  let isPaused = false;
  const slideInterval = 10000; // 10s

  function setNavHeightVar() {
    const nav = document.querySelector('.w3-top');
    if (nav) {
      document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
    }
  }

  setNavHeightVar();
  setTimeout(setNavHeightVar, 200); // helps if fonts/layout shift after load

  // Static list of images (edit these paths)
  const images = [
    'img/Israel_tour.jpg',
    'img/hebraic prayers from the vine.jpg',
    'img/Father and son.jpeg'
  ];

  const slidesContainer = document.getElementById('slides');
  const slider = document.querySelector('.slider-container');

  // Mobile menu toggle (used by onclick="openNav()")
  window.openNav = function () {
    const menu = document.getElementById("mobileMenu");
    if (!menu) return;
    menu.classList.toggle("is-open");
  };

  // Optional: close menu when switching to desktop size
  window.addEventListener("resize", () => {
    if (window.innerWidth > 600) {
      const menu = document.getElementById("mobileMenu");
      if (menu) menu.classList.remove("is-open");
    }
  });
  
  function renderSlides() {
    slidesContainer.innerHTML = '';
    images.forEach((imagePath, index) => {
      const slide = document.createElement('div');
      slide.className = `slide ${index === currentIndex ? 'active' : ''}`;
      const img = document.createElement('img');
      img.src = imagePath;
      img.loading = 'lazy';
      slide.appendChild(img);
      slidesContainer.appendChild(slide);
    });
  }

  function updateSlides() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
      slide.className = `slide ${index === currentIndex ? 'active' : ''}`;
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    updateSlides();
    resetTimer();
  }
  function prevSlide() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateSlides();
    resetTimer();
  }

  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;

  function startSlideshow() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => { if (!isPaused) nextSlide(); }, slideInterval);
  }
  function resetTimer() { clearInterval(intervalId); startSlideshow(); }
  function pauseSlideshow() { isPaused = true; }
  function resumeSlideshow() { isPaused = false; }

  if (slider) {
    slider.addEventListener('mouseover', pauseSlideshow);
    slider.addEventListener('mouseout', resumeSlideshow);
  }

  let startX = 0;
  let isSwiping = false;
  if (slider) {
    slider.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      isSwiping = true;
      pauseSlideshow();
    });
    slider.addEventListener('mouseup', (e) => {
      if (!isSwiping) return;
      isSwiping = false;
      resumeSlideshow();
      const diffX = startX - e.clientX;
      if (Math.abs(diffX) > 50) (diffX > 0 ? nextSlide() : prevSlide());
    });
  }

  const imageViewer = document.getElementById('slides');
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch && imageViewer) {
    let touchStartX = 0;
    imageViewer.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
    imageViewer.addEventListener('touchend', (e) => {
      const diffX = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diffX) > 50) (diffX > 0 ? nextSlide() : prevSlide());
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  window.addEventListener('resize', () => {
    setNavHeightVar();
    resetTimer();
  });

  renderSlides();
  startSlideshow();

  images.forEach(src => { const i = new Image(); i.src = src; });
});
