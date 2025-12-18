let decree;
let content;

let scrolling = false;
let scrollSpeed = 0.06;
let accumulatedScroll = 0;
let scrollQueue = [];
let animationFrameId = null;
let lastTime = performance.now();
let translateY = 0;

/* ===========================
   INIT (DOM READY)
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  decree = document.querySelector('.decree');
  content = document.querySelector('.content');

  const savedScrollSpeed = getScrollSpeed();
  if (savedScrollSpeed !== null) scrollSpeed = savedScrollSpeed;

  updateSpeedDisplay();
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

function toggleAutoScroll(){
  scrolling = !scrolling;
  const btn = document.getElementById('scrollToggle');
  btn.textContent = scrolling ? 'Stop' : 'Start';

  if (scrolling){
    lastTime = performance.now();
    accumulatedScroll = 0;
    scrollQueue = [];

    // Reset position on start
    translateY = 0;
    decree.style.transform = 'translateY(0px)';

    animationFrameId = requestAnimationFrame(autoScroll);
  } else {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

/* ===========================
   TELEPROMPTER LOOP
   =========================== */

function autoScroll(t){
  if (!scrolling) return;

  const dt = (t - lastTime) / 1000;
  lastTime = t;

  accumulatedScroll += scrollSpeed * dt * 60;
  scrollQueue.push(accumulatedScroll);
  if (scrollQueue.length > 3) scrollQueue.shift();

  const avg = scrollQueue.reduce((a,b)=>a+b,0) / scrollQueue.length;

  if (avg >= 0.2){
    const amt = Math.floor(avg);
    translateY -= amt;

    // Clamp to bottom
    const maxScroll = decree.scrollHeight - content.clientHeight;
    translateY = Math.max(-maxScroll, translateY);

    decree.style.transform = `translateY(${translateY}px)`;
    accumulatedScroll -= amt;
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
