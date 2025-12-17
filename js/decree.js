let scrolling = false;
let scrollSpeed = 0.06;
let accumulatedScroll = 0;
let scrollQueue = [];
let animationFrameId = null;
let lastTime = performance.now();

const savedScrollSpeed = getScrollSpeed();
if (savedScrollSpeed !== null) scrollSpeed = savedScrollSpeed;

function speedToPercentage(val){
  if (typeof val !== 'number' || isNaN(val)) return '1.00';
  const min = 0.01, max = 10, steps = (max - min)/0.01, idx = (val - min)/0.01;
  const pct = 1 + (idx/steps)*99;
  return (Math.round(pct*10)/10).toFixed(2);
}

function updateSpeedDisplay(){
  document.getElementById('speedValue').textContent = speedToPercentage(scrollSpeed);
  document.getElementById('scrollSpeed').value = scrollSpeed;
  saveScrollSpeed(scrollSpeed);
}

function toggleAutoScroll(){
  scrolling = !scrolling;
  const btn = document.getElementById('scrollToggle');
  btn.textContent = scrolling ? 'Stop' : 'Start';

  if (scrolling){
    lastTime = performance.now();
    scrollQueue = [];
    accumulatedScroll = 0;
    autoScroll(lastTime);
  } else {
    if (animationFrameId){ cancelAnimationFrame(animationFrameId); animationFrameId = null; }
    accumulatedScroll = 0;
    scrollQueue = [];
  }
}

const isIOSWebKit = /AppleWebKit/.test(navigator.userAgent) && /Mobile/.test(navigator.userAgent);

function autoScroll(t){
  if (!scrolling) return;

  const dt = (t - lastTime)/1000;
  lastTime = t;

  accumulatedScroll += scrollSpeed * dt * 60;
  scrollQueue.push(accumulatedScroll);
  if (scrollQueue.length > 3) scrollQueue.shift();

  const avg = scrollQueue.reduce((a,b)=>a+b,0)/scrollQueue.length;

  if (avg >= 0.2){
    const amt = Math.floor(avg);
    if (isIOSWebKit) window.scrollTo(0, window.scrollY + amt);
    else {
      try { window.scrollBy({ top: amt, behavior: 'smooth' }); }
      catch { window.scrollTo(0, window.scrollY + amt); }
    }
    accumulatedScroll -= amt;
  }

  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
  if (atBottom){
    scrolling = false;
    document.getElementById('scrollToggle').textContent = 'Start';
    if (animationFrameId){ cancelAnimationFrame(animationFrameId); animationFrameId = null; }
    accumulatedScroll = 0;
    scrollQueue = [];
    return;
  }

  animationFrameId = requestAnimationFrame(autoScroll);
}

function saveScrollSpeed(s){ try{ localStorage.setItem("scrollSpeed", String(s)); }catch{} }
function getScrollSpeed(){ try{ const v = localStorage.getItem("scrollSpeed"); return v ? parseFloat(v) : null; }catch{ return null; } }

function handleButtonStyle(btn){
  btn.style.backgroundColor = '#0066ff';
  setTimeout(()=>{ btn.style.backgroundColor = '#333'; }, 300);
}

document.getElementById('scrollToggle').addEventListener('click', () => {
  toggleAutoScroll();
  handleButtonStyle(document.getElementById('scrollToggle'));
});

document.addEventListener('click', (e)=>{
  if (e.target.id === 'incrementSpeed'){
    scrollSpeed = Math.min(10, scrollSpeed + 0.01);
    updateSpeedDisplay();
    handleButtonStyle(e.target);
  } else if (e.target.id === 'decrementSpeed'){
    scrollSpeed = Math.max(0.01, scrollSpeed - 0.01);
    updateSpeedDisplay();
    handleButtonStyle(e.target);
  }
});

document.addEventListener('input', (e)=>{
  if (e.target.id === 'scrollSpeed'){
    scrollSpeed = parseFloat(e.target.value);
    updateSpeedDisplay();
  }
});

document.addEventListener('DOMContentLoaded', updateSpeedDisplay);
