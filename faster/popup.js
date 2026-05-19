const radios = document.querySelectorAll('input[name="speed"]');

// 1. When the popup opens, check storage to see what speed is currently saved
chrome.storage.local.get(['ytSpeed'], (data) => {
  const currentSpeed = data.ytSpeed || '1.0'; // Default to 1x
  const activeRadio = document.querySelector(`input[value="${currentSpeed}"]`);
  if (activeRadio) {
    activeRadio.checked = true;
  }
});

// 2. When you click a different radio button, save it to storage
radios.forEach(radio => {
  radio.addEventListener('change', (event) => {
    const newSpeed = event.target.value;
    chrome.storage.local.set({ ytSpeed: newSpeed });
  });
});
