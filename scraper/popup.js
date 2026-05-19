chrome.storage.local.get({ newItems: [] }, (data) => {
  const savedItemsContainer = document.getElementById("savedItems");
  data.newItems.toReversed().forEach(item => {
    const div = document.createElement("div");
    div.classList.add("saved-item");
    const plainTextContent = item.content.replace(/<\/?[^>]+(>|$)/g, "");
    div.innerHTML = `
        <p><strong>${item.title}</strong></p>
        <div class="content">${plainTextContent}</div>
      `;
    savedItemsContainer.appendChild(div);
  });
});

// Original Download JSON logic (Clears Storage)
document.getElementById("downloadJson").addEventListener("click", function () {
  chrome.storage.local.get({ newItems: [] }, (data) => {
    const newItems = data.newItems;

    const jsonContent = JSON.stringify(newItems, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json' });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "saved_items.json"; // The filename for the downloaded file
    link.click();

    chrome.storage.local.clear(() => {
      console.log("Local storage cleared!");
      window.close();
    });
  });
});

// New Export to Clipboard logic (Does NOT Clear Storage)
document.getElementById("exportClipboard").addEventListener("click", function () {
  chrome.storage.local.get({ newItems: [] }, (data) => {
    const newItems = data.newItems;

    // Map items to minimal markdown format
    const markdownText = newItems.map(item => {
      return `# [${item.title}](${item.url})\n${item.content}`;
    }).join('\n\n');

    // Write to clipboard
    navigator.clipboard.writeText(markdownText).then(() => {
      // Provide visual feedback
      const btn = document.getElementById("exportClipboard");
      const originalText = btn.innerText;
      btn.innerText = "Copied!";
      setTimeout(() => {
        btn.innerText = originalText;
      }, 1500);
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  });
});
