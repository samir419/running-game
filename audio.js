const fileInput = document.getElementById('files');
const audio = document.getElementById('audio');
const nowPlaying = document.getElementById('nowPlaying');

let playlist = [];
let currentIndex = 0;
let shuffle = false;

// Load multiple files
fileInput.addEventListener('change', () => {
  playlist = Array.from(fileInput.files);
  currentIndex = 0;
  playCurrent();
});

// Play current track
function playCurrent() {
  if (!playlist.length) return;

  audio.src = URL.createObjectURL(playlist[currentIndex]);
  audio.play();
  nowPlaying.textContent = playlist[currentIndex].name;
}

// Next track
function nextTrack() {
  if (shuffle) {
    currentIndex = Math.floor(Math.random() * playlist.length);
  } else {
    currentIndex = (currentIndex + 1) % playlist.length;
  }
  playCurrent();
}

// Previous track
function prevTrack() {
  currentIndex =
    (currentIndex - 1 + playlist.length) % playlist.length;
  playCurrent();
}

// Auto play next when song ends
audio.addEventListener('ended', nextTrack);

// Controls
document.getElementById('play').onclick = () => {
  audio.paused ? audio.play() : audio.pause();
};

document.getElementById('next').onclick = nextTrack;
document.getElementById('prev').onclick = prevTrack;

document.getElementById('shuffle').onclick = (e) => {
  shuffle = !shuffle;
  e.target.textContent = shuffle ? 'Shuffle ON' : 'Shuffle OFF';
};

const muteBtn = document.getElementById('mute');

muteBtn.onclick = () => {
  audio.muted = !audio.muted;
  muteBtn.textContent = audio.muted ? '🔇' : '🔊';
};

