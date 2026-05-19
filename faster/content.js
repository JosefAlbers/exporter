let globalSpeed = 1.0;

// 1. Check the saved speed immediately when a YouTube page loads
chrome.storage.local.get(['ytSpeed'], (data) => {
  if (data.ytSpeed) {
    globalSpeed = parseFloat(data.ytSpeed);
    applySpeedToVideo();
  }
});

// 2. Listen for changes (if you click a new speed in the popup, update open tabs instantly)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.ytSpeed) {
    globalSpeed = parseFloat(changes.ytSpeed.newValue);
    applySpeedToVideo();
  }
});

// Helper function to find the video and change its speed
function applySpeedToVideo() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    video.playbackRate = globalSpeed;
  });
}

// 3. YouTube Trick: YouTube doesn't reload the page when you click a new video.
// This listener catches whenever ANY video starts playing and forces the global speed.
document.addEventListener('play', (event) => {
  if (event.target.tagName.toLowerCase() === 'video') {
    event.target.playbackRate = globalSpeed;
  }
}, true); // "true" ensures we intercept the event early
