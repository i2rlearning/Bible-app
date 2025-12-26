let decree;
let content;
let scrolling = false;
let scrollSpeed = 0.05;
let accumulatedScroll = 0;
let scrollQueue = [];
let animationFrameId = null;
let lastTime = performance.now();

/* ===========================
   INIT (DOM READY)
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  decree = document.querySelector('.decree');
  content = document.querySelector('.content');

  const savedScrollSpeed = getScrollSpeed();
  if (savedScrollSpeed !== null) scrollSpeed = savedScrollSpeed;

  updateSpeedDisplay();

  // Manual scroll detection
  decree.addEventListener('scroll', () => {
    if (!scrolling) {
      const scrollPos = decree.scrollTop;
      const maxScroll = decree.scrollHeight - decree.clientHeight;
      const btn = document.getElementById('scrollToggle');
      if (!btn) return;

      if (scrollPos <= 2) btn.textContent = 'Start';
      else if (scrollPos >= maxScroll - 5) btn.textContent = 'Start';
      else btn.textContent = 'Resume';
    }
  });

  /* ===========================
     FONT RESIZER
     =========================== */
  const fontSizeSlider = document.getElementById("font-size-slider");
  const fontSizeDisplay = document.getElementById("fontSizeDisplay");

  fontSizeSlider.addEventListener("input", () => {
    const fontSize = fontSizeSlider.value;
    decree.style.fontSize = `${fontSize}px`;
    fontSizeDisplay.textContent = fontSize;
  });
});

const fontSizeSlider = document.getElementById("font-size-slider");
const displayText = document.getElementById("decree-text");

fontSizeSlider?.addEventListener("input", () => {
  const fontSize = fontSizeSlider.value;
  displayText.style.fontSize = `${fontSize}px`;
});

/* ===========================
   SPEED DISPLAY (UPDATED)
   UI scale: 1 → 100
   Internal scale: 0.01 → 10
   =========================== */

function updateSpeedDisplay(){
  const speedValue = document.getElementById('speedValue');
  const slider = document.getElementById('scrollSpeed');
  if (!speedValue || !slider) return;

  const uiValue = scrollSpeed * 10; // convert internal → UI

  speedValue.textContent = uiValue.toFixed(2);
  slider.value = uiValue;

  saveScrollSpeed(scrollSpeed);
}

/* ===========================
   START / STOP
   =========================== */

function stopAutoScroll(){
  scrolling = false;

  if (animationFrameId){
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function toggleAutoScroll() {
  if (!decree) return;

  scrolling = !scrolling;
  const btn = document.getElementById('scrollToggle');

  if (scrolling) {
    const maxScrollTop = decree.scrollHeight - decree.clientHeight;
    const isAtBottom = decree.scrollTop >= maxScrollTop - 5;

    if (isAtBottom) decree.scrollTop = 0;

    if (btn) btn.textContent = 'Pause';
    lastTime = performance.now();
    accumulatedScroll = 0;
    scrollQueue = [];
    animationFrameId = requestAnimationFrame(autoScroll);
  } else {
    stopAutoScroll();
    updateButtonStatus('Continue');
  }
}

/* ===========================
   TELEPROMPTER LOOP
   =========================== */

function autoScroll(t){
  if (!scrolling || !decree) return;

  const dt = (t - lastTime) / 1000;
  lastTime = t;

  accumulatedScroll += scrollSpeed * dt * 60;
  scrollQueue.push(accumulatedScroll);
  if (scrollQueue.length > 3) scrollQueue.shift();

  const avg = scrollQueue.reduce((a,b)=>a+b,0) / scrollQueue.length;

  if (avg >= 0.2){
    const amt = Math.floor(avg);

    const maxScrollTop = decree.scrollHeight - decree.clientHeight;

    decree.scrollTop = Math.min(maxScrollTop, decree.scrollTop + amt);

    accumulatedScroll -= amt;

    if (decree.scrollTop >= maxScrollTop - 1){
      decree.scrollTop = maxScrollTop;
      stopAutoScroll();
      updateButtonStatus('Start');
      return;
    }
  }

  animationFrameId = requestAnimationFrame(autoScroll);
}

/* ===========================
   SPEED CONTROLS (UPDATED)
   Buttons now modify UI scale
   =========================== */

document.addEventListener('click', (e)=>{
  if (e.target.id === 'incrementSpeed'){
    let uiValue = scrollSpeed * 10;
    uiValue = Math.min(100, uiValue + 1);
    scrollSpeed = uiValue / 10; // convert UI → internal
    updateSpeedDisplay();
    flashButton(e.target);
  }

  if (e.target.id === 'decrementSpeed'){
    let uiValue = scrollSpeed * 10;
    uiValue = Math.max(1, uiValue - 1);
    scrollSpeed = uiValue / 10; // convert UI → internal
    updateSpeedDisplay();
    flashButton(e.target);
  }
});

/* ===========================
   SLIDER INPUT (UPDATED)
   Slider uses UI scale
   =========================== */

document.addEventListener('input', (e)=>{
  if (e.target.id === 'scrollSpeed'){
    const uiValue = parseFloat(e.target.value);
    scrollSpeed = uiValue / 10; // convert UI → internal
    updateSpeedDisplay();
  }
});

/* ===========================
   BUTTON HANDLING
   =========================== */

document.getElementById('scrollToggle')?.addEventListener('click', () => {
  toggleAutoScroll();
  flashButton(document.getElementById('scrollToggle'));
});

function flashButton(btn) {
  if (!btn) return;
  btn.classList.add('flashing');
  
  setTimeout(() => {
    btn.classList.remove('flashing');
  }, 300);
}

function updateButtonStatus(status) {
  const btn = document.getElementById('scrollToggle');
  if (btn) btn.textContent = status;
}

/* ===========================
   STORAGE
   =========================== */

function saveScrollSpeed(s){
  try { localStorage.setItem("scrollSpeed", String(s)); } catch {}
}

function getScrollSpeed(){
  try {
    const v = localStorage.getItem("scrollSpeed");
    return v ? parseFloat(v) : null;
  } catch {
    return null;
  }
}
