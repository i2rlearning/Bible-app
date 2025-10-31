<script>
document.addEventListener('DOMContentLoaded', () => {
  let currentIndex = 0;
  let intervalId = null;
  let isPaused = false;
  const slideInterval = 10000; // 10s

  // ✅ Static list of images (edit these paths)
  const images = [
    'img/Jaffagatewithsnow.jpg',
    'img/Jaffagate.jpg'
  ];

  const slidesContainer = document.getElementById('slides');
  const slider = document.querySelector('.slider-container');

  // ---- Render & update ----
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

  // ---- Controls ----
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

  // Make prev/next available to your arrow buttons
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;

  // ---- Autoplay ----
  function startSlideshow() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => { if (!isPaused) nextSlide(); }, slideInterval);
  }
  function resetTimer() { clearInterval(intervalId); startSlideshow(); }
  function pauseSlideshow() { isPaused = true; }
  function resumeSlideshow() { isPaused = false; }

  // ---- Hover pause (desktop) ----
  if (slider) {
    slider.addEventListener('mouseover', pauseSlideshow);
    slider.addEventListener('mouseout', resumeSlideshow);
  }

  // ---- Mouse swipe (drag) ----
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
      const swipeThreshold = 50;
      if (Math.abs(diffX) > swipeThreshold) {
        if (diffX > 0) nextSlide(); else prevSlide();
      }
    });
    slider.addEventListener('mousemove', () => { /* reserved if you want a drag shadow */ });
  }

  // ---- Touch swipe ----
  const imageViewer = document.getElementById('slides');
  function isTouchDevice() { return 'ontouchstart' in window || navigator.maxTouchPoints > 0; }
  if (isTouchDevice() && imageViewer) {
    let touchStartX = 0;
    imageViewer.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
    imageViewer.addEventListener('touchend', (e) => {
      const diffX = touchStartX - e.changedTouches[0].clientX;
      const swipeThreshold = 50;
      if (Math.abs(diffX) > swipeThreshold) {
        if (diffX > 0) nextSlide(); else prevSlide();
      }
    });
  }

  // ---- Optional: keyboard arrows ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft')  prevSlide();
  });

  // ---- Resize: keep autoplay alive ----
  window.addEventListener('resize', resetTimer);

  // ---- Init ----
  renderSlides();
  startSlideshow();

  // ---- (Optional) Preload images ----
  images.forEach(src => { const img = new Image(); img.src = src; });
});
</script>
