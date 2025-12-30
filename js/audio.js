const playlist = [
  "v=LclMLZ5jc0Y",  
  //"VIDEO_ID_2",
  // "VIDEO_ID_3",
  // Add as many as you want — will loop
];

let player;
let currentIndex = 0;

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

function onYouTubeIframeAPIReady() {
  player = new YT.Player('yt-player', {
    height: '0',
    width: '0',
    videoId: playlist[0],
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady() {
  player.setVolume(70);
  updateTrackInfo();
  updateProgress();
}

function onPlayerStateChange(event) {
  const btn = document.getElementById('play-pause-btn');
  
  if (event.data === YT.PlayerState.PLAYING) {
    btn.textContent = "⏸";
    updateProgressLoop();
  } else if (event.data === YT.PlayerState.PAUSED) {
    btn.textContent = "▶";
  } else if (event.data === YT.PlayerState.ENDED) {
    nextTrack();
  }
}

function updateTrackInfo() {
  const data = player.getVideoData();
  document.getElementById('song-title').textContent = data.title || "Unknown";
  document.getElementById('song-author').textContent = data.author || "Unknown Channel";
}

function nextTrack() {
  currentIndex = (currentIndex + 1) % playlist.length;
  player.loadVideoById(playlist[currentIndex]);
  updateTrackInfo();
}

// Controls
document.getElementById('play-pause-btn').addEventListener('click', () => {
  if (player.getPlayerState() === YT.PlayerState.PLAYING) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
});

document.getElementById('volume-slider').addEventListener('input', (e) => {
  player.setVolume(e.target.value);
});

// Progress bar
function updateProgress() {
  if (!player || !player.getDuration) return;
  
  const current = player.getCurrentTime();
  const duration = player.getDuration();
  const progress = (current / duration) * 100 || 0;

  document.getElementById('progress-bar').style.width = progress + '%';
  document.getElementById('current-time').textContent = formatTime(current);
  document.getElementById('duration').textContent = formatTime(duration);
}

function updateProgressLoop() {
  updateProgress();
  if (player.getPlayerState() === YT.PlayerState.PLAYING) {
    requestAnimationFrame(updateProgressLoop);
  }
}

function formatTime(seconds) {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

document.getElementById('progress-container').addEventListener('click', (e) => {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const width = rect.width;
  const percentage = x / width;
  const duration = player.getDuration();
  player.seekTo(duration * percentage);
});
