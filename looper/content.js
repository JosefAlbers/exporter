// YT Looper - content script
(function () {
  let looping = false;
  let btn = null;

  function getVideo() {
    return document.querySelector('video');
  }

  function onVideoEnd() {
    if (looping) {
      const video = getVideo();
      if (video) {
        video.currentTime = 0;
        video.play();
      }
    }
  }

  function attachEndedListener() {
    const video = getVideo();
    if (video && !video._ytLooperAttached) {
      video.addEventListener('ended', onVideoEnd);
      video._ytLooperAttached = true;
    }
  }

  function createButton() {
    if (document.getElementById('yt-looper-btn')) return;

    btn = document.createElement('button');
    btn.id = 'yt-looper-btn';
    btn.title = 'Toggle loop';
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 2L21 6L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 11V9C3 7.89543 3.89543 7 5 7H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M7 22L3 18L7 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M21 13V15C21 16.1046 20.1046 17 19 17H3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;

    btn.addEventListener('click', () => {
      looping = !looping;
      btn.classList.toggle('active', looping);
      btn.title = looping ? 'Loop: ON — click to disable' : 'Loop: OFF — click to enable';
      attachEndedListener();
    });

    // Insert into YouTube's right-side controls
    const rightControls = document.querySelector('.ytp-right-controls');
    if (rightControls) {
      rightControls.insertBefore(btn, rightControls.firstChild);
    }
  }

  // YouTube is a SPA — watch for player to appear
  const observer = new MutationObserver(() => {
    const rightControls = document.querySelector('.ytp-right-controls');
    if (rightControls && !document.getElementById('yt-looper-btn')) {
      createButton();
      attachEndedListener();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Also try immediately in case player already exists
  createButton();
  attachEndedListener();
})();
