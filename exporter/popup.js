document.getElementById('exportBtn').addEventListener('click', async () => {
  const button = document.getElementById('exportBtn');
  const originalText = button.textContent;
  try {
    button.textContent = 'Exporting...';
    button.disabled = true;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.url.includes('chatgpt.com')) {
      throw new Error("Wrong url");
    }
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        if (typeof window.exportChat === 'function') {
          window.exportChat();
          return true;
        }
        return false;
      }
    });
    if (results[0].result === true) {
      setTimeout(() => window.close(), 800);
    } else {
      throw new Error("No fn");
    }

  } catch (err) {
    console.error(err);
    alert("Fail");
  } finally {
    button.textContent = originalText;
    button.disabled = false;
  }
});
