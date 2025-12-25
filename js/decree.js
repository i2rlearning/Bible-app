let decree;
let content;
let scrolling = false;
let scrollSpeed = 0.06;
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

 // Listen for manual scrolling (mouse wheel, touch, or scrollbar dragging)
 decree.addEventListener('scroll', () => {
  // We only care about this if the auto-scroller is currently STOPPED
  if (!scrolling) {
    const scrollPos = decree.scrollTop;
    const maxScroll = decree.scrollHeight - decree.clientHeight;
    const btn = document.getElementById('scrollToggle');

    if (!btn) return;

    // User manually scrolls to the very top
    if (scrollPos <= 2) {
      btn.textContent = 'Start';
    } 
    // User manually scrolls to the very bottom
    else if (scrollPos >= maxScroll - 5) {
      btn.textContent = 'Start';
    } 
    // User is in the middle, keep it as Resume
    else {
      btn.textContent = 'Resume';
    }
  }
 });
   
  // Listen for changes on the font resizer
  const fontSizeSlider = document.getElementById("font-size-slider");
  const fontSizeDisplay = document.getElementById("fontSizeDisplay");
  
  fontSizeSlider.addEventListener("input", () => {
    const fontSize = fontSizeSlider.value;
    decree.style.fontSize = `${fontSize}px`;
    fontSizeDisplay.textContent = fontSize; // Update the displayed font size
  });
});

/* ===========================
   SPEED DISPLAY
   =========================== */

function speedToPercentage(val){
  if (typeof val !== 'number' || isNaN(val)) return '1.00';
  const min = 0.01, max = 10;
  const pct = 1 + ((val - min) / (max - min)) * 99;
  return (Math.round(pct * 10) / 10).toFixed(2);
}

function updateSpeedDisplay(){
  const speedValue = document.getElementById('speedValue');
  const slider = document.getElementById('scrollSpeed');
  if (!speedValue || !slider) return;

  speedValue.textContent = speedToPercentage(scrollSpeed);
  slider.value = scrollSpeed;
  saveScrollSpeed(scrollSpeed);
}

/* ===========================
   START / STOP
   =========================== */

function stopAutoScroll(){
  scrolling = false;
  const btn = document.getElementById('scrollToggle');
  //if (btn) btn.textContent = status;

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
    // 1. Check if we are at the bottom (or very close to it)
    const maxScrollTop = decree.scrollHeight - decree.clientHeight;
    const isAtBottom = decree.scrollTop >= maxScrollTop - 5;

    // 2. If we are at the bottom, reset to the top before starting
    if (isAtBottom) {
      decree.scrollTop = 0;
    }

    // 3. Update visuals and start loop
    if (btn) btn.textContent = 'Pause';
    lastTime = performance.now();
    accumulatedScroll = 0;
    scrollQueue = [];
    animationFrameId = requestAnimationFrame(autoScroll);
  } else {
    // If we just clicked 'Pause'
    stopAutoScroll();
    updateButtonStatus ('Continue');
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

    // Apply scroll and clamp
    decree.scrollTop = Math.min(maxScrollTop, decree.scrollTop + amt);

    accumulatedScroll -= amt;

    // Stop at the end (this is the missing part)
    if (decree.scrollTop >= maxScrollTop - 1){
      decree.scrollTop = maxScrollTop;
      stopAutoScroll();
      updateButtonStatus ('Start');
      return;
    }
  }

  animationFrameId = requestAnimationFrame(autoScroll);
}

/* ===========================
   SPEED CONTROLS
   =========================== */

document.addEventListener('click', (e)=>{
  if (e.target.id === 'incrementSpeed'){
    scrollSpeed = Math.min(10, scrollSpeed + 0.01);
    updateSpeedDisplay();
    flashButton(e.target);
  }

  if (e.target.id === 'decrementSpeed'){
    scrollSpeed = Math.max(0.01, scrollSpeed - 0.01);
    updateSpeedDisplay();
    flashButton(e.target);
  }
});

document.addEventListener('input', (e)=>{
  if (e.target.id === 'scrollSpeed'){
    scrollSpeed = parseFloat(e.target.value);
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

function flashButton(btn){
  if (!btn) return;
  btn.style.backgroundColor = '#0066ff';
  setTimeout(() => {
    btn.style.backgroundColor = '#333';
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
