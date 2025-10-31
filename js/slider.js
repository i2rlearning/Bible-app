      let currentIndex = 0;
      let images = [];
      let intervalId = null;
      let isPaused = false;
      const slideInterval = 10000;
      let startX;
      let isSwiping = false;
      const slider = document.querySelector('.slider-container');
  
      async function loadImages(category) {
        try {
          const response = await fetch(`api/images.php?category=${category}`);
          const data = await response.json();
          images = data;
          currentIndex = 0;
          renderSlides();
          startSlideshow();
        } catch (error) {
          console.error('Error loading images:', error);
        }
      }
  
      function renderSlides() {
        const slidesContainer = document.getElementById('slides');
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
        updateCurrentImageUrl();
      }
  
      function updateSlides() {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
          slide.className = `slide ${index === currentIndex ? 'active' : ''}`;
        });
        updateCurrentImageUrl();
      }
  
      function updateCurrentImageUrl() {
        const currentImageUrl = getCurrentImageUrl();
        const imageLink = document.getElementById('image-link');
        imageLink.href = currentImageUrl;
        const parts = imageLink.href.split('/');
        const currentImageUrlSpan = document.getElementById('current-image-url');
        currentImageUrlSpan.textContent = 'Current Image: ' + parts[parts.length - 1];
      }
  
      function getCurrentImageUrl() {
        if (images.length > 0 && currentIndex < images.length) return images[currentIndex];
        return '';
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
  
      function startSlideshow() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(() => { if (!isPaused) nextSlide(); }, slideInterval);
      }
  
      function resetTimer() { clearInterval(intervalId); startSlideshow(); }
      function pauseSlideshow() { isPaused = true; }
      function resumeSlideshow() { isPaused = false; }
      function categoryChanged() { const sel = document.getElementById('category-select'); loadImages(sel.value); }
  
      slider.addEventListener('mouseover', pauseSlideshow);
      slider.addEventListener('mouseout', () => { if (!isSwiping) resumeSlideshow(); });
      slider.addEventListener('mousedown', (e) => { startX = e.clientX; isSwiping = true; pauseSlideshow(); });
      slider.addEventListener('mousemove', () => { if (!isSwiping) return; });
      slider.addEventListener('mouseup', (e) => {
        if (!isSwiping) return;
        isSwiping = false; resumeSlideshow();
        const diffX = startX - e.clientX;
        const swipeThreshold = 50;
        if (Math.abs(diffX) > swipeThreshold) handleSwipe(diffX > 0 ? 'left' : 'right');
      });
  
      window.addEventListener('resize', resetTimer);
  
      document.getElementById('category-select').addEventListener('change', (e) => {
        currentIndex = 0;
        loadImages(e.target.value);
      });
  
      loadImages('butterflies');
      document.getElementById('category-select').value = 'butterflies';
  
      function myMenu() {
        const x = document.getElementById('myTopnav');
        const icon = x.querySelector('.icon');
        if (x.className === 'navbar') {
          x.className += ' responsive';
          icon.innerHTML = '&#x2715;';
          icon.style.fontSize = '20px';
        } else {
          x.className = 'navbar';
          icon.innerHTML = '&#9776;';
          icon.style.fontSize = '15px';
        }
      }
  
      function isTouchDevice() { return 'ontouchstart' in window || navigator.maxTouchPoints > 0; }
      function handleSwipe(direction) { if (direction === 'left') nextSlide(); else if (direction === 'right') prevSlide(); }
  
      if (isTouchDevice()) {
        const imageViewer = document.getElementById('slides');
        let touchStartX;
        imageViewer.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
        imageViewer.addEventListener('touchend', (e) => {
          const diffX = touchStartX - e.changedTouches[0].clientX;
          const swipeThreshold = 50;
          if (Math.abs(diffX) > swipeThreshold) handleSwipe(diffX > 0 ? 'left' : 'right');
        });
      }
