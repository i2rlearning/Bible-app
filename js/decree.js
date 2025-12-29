let decree;
let content;
let scrolling = false;

// UI speed (what the user sees): 0.50 → 100.00
let uiSpeed = 5.00;  // example initial value = 5.00 => scrollSpeed = 0.5
// internal scrollSpeed derived from uiSpeed: 0.05 → 10.00
let scrollSpeed = uiSpeed / 10;

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
  if (savedScrollSpeed !== null) {
    scrollSpeed = savedScrollSpeed;     // internal value from storage
    uiSpeed = scrollSpeed * 10;         // sync UI with stored internal
  }

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

  fontSizeSlider?.addEventListener("input", () => {
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
   SPEED DISPLAY
   UI scale: 0.50 → 100
   Internal scale: 0.05 → 10
   =========================== */

function updateSpeedDisplay(){
  const speedValue = document.getElementById('speedValue');
  const slider = document.getElementById('scrollSpeed');
  if (!speedValue || !slider) return;

  // keep uiSpeed within bounds and nicely rounded
  uiSpeed = parseFloat(uiSpeed.toFixed(2));
  if (uiSpeed < 0.50) uiSpeed = 0.50;
  if (uiSpeed > 100) uiSpeed = 100;

  // internal scrollSpeed derived from uiSpeed
  scrollSpeed = uiSpeed / 10;

  speedValue.textContent = uiSpeed.toFixed(2);
  slider.value = uiSpeed;
  alert (speedValue.textContent);
         
  saveScrollSpeed(scrollSpeed); // still store internal if you like
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
   SCROLLER LOOP
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
   SPEED CONTROLS
   Buttons modify UI scale
   =========================== */

document.addEventListener('click', (e)=>{
  if (e.target.id === 'incrementSpeed'){
    uiSpeed = parseFloat((uiSpeed + 0.10).toFixed(2));
    if (uiSpeed > 100) uiSpeed = 100;
    updateSpeedDisplay();
    flashButton(e.target);
  }

  if (e.target.id === 'decrementSpeed'){
    uiSpeed = parseFloat((uiSpeed - 0.10).toFixed(2));
    if (uiSpeed < 0.50) uiSpeed = 0.50;
    updateSpeedDisplay();
    flashButton(e.target);
  }
});

/* ===========================
   SLIDER INPUT
   Slider uses UI scale
   =========================== */

document.addEventListener('input', (e)=>{
  if (e.target.id === 'scrollSpeed'){
    let uiValue = parseFloat(e.target.value);
    uiValue = parseFloat(uiValue.toFixed(2));

    if (uiValue < 0.50) uiValue = 0.50;
    if (uiValue > 100) uiValue = 100;

    uiSpeed = uiValue;          // <- make UI state the source of truth
    updateSpeedDisplay();       // this will update scrollSpeed internally
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
