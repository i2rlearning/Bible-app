    const v = localStorage.getItem("scrollSpeed");
let decree;
let content;
let scrolling = false;

// UI speed (what user sees): 0.50 â†’ 100.00
let uiSpeed = 5.00;

// Internal scroll speed (for animation): 0.05 â†’ 10.00
let scrollSpeed = uiSpeed / 10;

let accumulatedScroll = 0;
let scrollQueue = [];
let animationFrameId = null;
let lastTime = performance.now();

/* ===========================
   INIT (DOM READY)
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
  decree = document.querySelector('.decree-text');
  content = document.querySelector('.content');

  if (!decree) {
    console.warn("Element .decree not found");
    return;
  }

  // Load saved scroll speed
  const savedScrollSpeed = getScrollSpeed();
  if (savedScrollSpeed !== null) {
    scrollSpeed = savedScrollSpeed;
    uiSpeed = scrollSpeed * 10;
  }

  // Load saved font size
  const fontSizeSlider = document.getElementById("font-size-slider");
  const fontSizeDisplay = document.getElementById("fontSizeDisplay");

  if (fontSizeSlider && fontSizeDisplay) {
    const savedFontSize = getFontResizer();
    const defaultFontSize = 18; // Change this to your preferred default
    const initialFontSize = savedFontSize || defaultFontSize;

    // Apply saved (or default) font size
    decree.style.fontSize = `${initialFontSize}px`;
    fontSizeDisplay.textContent = initialFontSize;
    fontSizeSlider.value = initialFontSize;

    // Listen for changes
    fontSizeSlider.addEventListener("input", () => {
      const fontSize = fontSizeSlider.value;
      decree.style.fontSize = `${fontSize}px`;
      fontSizeDisplay.textContent = fontSize;
      saveFontResizer(fontSize); // Save every time it changes
    });
  }

  // Initialize scroll speed display
  updateSpeedDisplay();

  // Manual scroll detection â†’ update button text
  decree.addEventListener('scroll', () => {
    if (!scrolling) {
      const scrollPos = decree.scrollTop;
      const maxScroll = decree.scrollHeight - decree.clientHeight;
      const btn = document.getElementById('scrollToggle');
      if (!btn) return;

      if (scrollPos <= 2 || scrollPos >= maxScroll - 5) {
        btn.textContent = 'Start';
      } else {
        btn.textContent = 'Resume';
      }
    }
  });

  /* ===========================
     SPEED CONTROL BUTTONS & SLIDER
     =========================== */
  const speedSlider = document.getElementById('scrollSpeed');
  const incrementBtn = document.getElementById('incrementSpeed');
  const decrementBtn = document.getElementById('decrementSpeed');
  const toggleBtn = document.getElementById('scrollToggle');

  if (speedSlider) {
    speedSlider.addEventListener('input', () => {
      uiSpeed = parseFloat(speedSlider.value);
      updateSpeedDisplay();
    });
  }

  if (incrementBtn) {
    incrementBtn.addEventListener('click', () => {
      uiSpeed = Math.min(100, parseFloat((uiSpeed + 0.10).toFixed(2)));
      updateSpeedDisplay();
      flashButton(incrementBtn);
    });
  }

  if (decrementBtn) {
    decrementBtn.addEventListener('click', () => {
      uiSpeed = Math.max(0.50, parseFloat((uiSpeed - 0.10).toFixed(2)));
      updateSpeedDisplay();
      flashButton(decrementBtn);
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      toggleAutoScroll();
      flashButton(toggleBtn);
    });
  }
});

/* ===========================
   UPDATE SPEED DISPLAY
   =========================== */
function updateSpeedDisplay() {
  const speedValueSpan = document.getElementById('speedValue');
  const slider = document.getElementById('scrollSpeed');

  if (!speedValueSpan || !slider) return;

  uiSpeed = Math.max(0.50, Math.min(100, parseFloat(uiSpeed.toFixed(2))));
  scrollSpeed = uiSpeed / 10;

  speedValueSpan.textContent = uiSpeed.toFixed(2);
  slider.value = uiSpeed;

  saveScrollSpeed(scrollSpeed);
}

/* ===========================
   AUTO SCROLL LOGIC
   =========================== */
function toggleAutoScroll() {
  if (!decree) return;

  scrolling = !scrolling;
  const btn = document.getElementById('scrollToggle');

  if (scrolling) {
    const maxScrollTop = decree.scrollHeight - decree.clientHeight;
    if (decree.scrollTop >= maxScrollTop - 5) {
      decree.scrollTop = 0;
    }
    if (btn) btn.textContent = 'Pause';

    lastTime = performance.now();
    accumulatedScroll = 0;
    scrollQueue = [];
    animationFrameId = requestAnimationFrame(autoScroll);
  } else {
    stopAutoScroll();
    if (btn) btn.textContent = 'Continue';
  }
}

function stopAutoScroll() {
  scrolling = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function autoScroll(currentTime) {
  if (!scrolling || !decree) return;

  const dt = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  accumulatedScroll += scrollSpeed * dt * 60;
  scrollQueue.push(accumulatedScroll);
  if (scrollQueue.length > 3) scrollQueue.shift();

  const avg = scrollQueue.reduce((a, b) => a + b, 0) / scrollQueue.length;

  if (avg >= 0.2) {
    const amount = Math.floor(avg);
    const maxScrollTop = decree.scrollHeight - decree.clientHeight;

    decree.scrollTop = Math.min(maxScrollTop, decree.scrollTop + amount);
    accumulatedScroll -= amount;

    if (decree.scrollTop >= maxScrollTop - 1) {
      decree.scrollTop = maxScrollTop;
      stopAutoScroll();
      updateButtonStatus('Start');
      return;
    }
  }

  animationFrameId = requestAnimationFrame(autoScroll);
}

/* ===========================
   BUTTON FLASH & STATUS
   =========================== */
function flashButton(btn) {
  if (!btn) return;
  btn.classList.add('flashing');
  setTimeout(() => btn.classList.remove('flashing'), 300);
}

function updateButtonStatus(text) {
  const btn = document.getElementById('scrollToggle');
  if (btn) btn.textContent = text;
}

/* ===========================
   LOCAL STORAGE FUNCTIONS
   =========================== */
function saveScrollSpeed(s) {
  try { localStorage.setItem("scrollSpeed", String(s)); } catch {}
}

function getScrollSpeed() {
  try {
    const v = localStorage.getItem("scrollSpeed");
    return v ? parseFloat(v) : null;
  } catch { return null; }
}

function saveFontResizer(s) {
  try { localStorage.setItem("fontSizeDisplay", String(s)); } catch {}
}

function getFontResizer() {
  try {
    const v = localStorage.getItem("fontSizeDisplay");
    return v ? parseFloat(v) : null;
  } catch { return null; }
}
