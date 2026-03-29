function extractMessages() {
  const messageNodes = document.querySelectorAll('div[data-message-author-role]');
  const messages = [];
  messageNodes.forEach(node => {
    const roleAttr = node.getAttribute('data-message-author-role');
    if (!roleAttr) return;
    const role = roleAttr === 'user' ? 'user' : 'assistant';
    let contentEl = node.querySelector('.markdown') || 
                     node.querySelector('[data-message-content]') ||
                     node.querySelector('div.relative') || node;
    let content = contentEl ? contentEl.innerText.trim() : '';
    if (!content) {
      content = Array.from(node.querySelectorAll('p, pre, code, div'))
        .map(el => el.innerText.trim())
        .filter(Boolean)
        .join('\n\n');
    }
    if (content) {
      messages.push({ role, content });
    }
  });
  return messages;
}

function createWrappedText(messages) {
  let text = '';
  messages.forEach(msg => {
    text += `{{{ ${msg.role}\n`;
    text += `---\n`;
    text += `${msg.content}\n`;
    text += `}}}\n\n`;
  });
  return text.trim();
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportChat() {
  const msgs = extractMessages();
  if (msgs.length === 0) {
    alert("No hx");
    return;
  }
  const timestamp = new Date().toISOString().slice(0,19).replace(/:/g, '-');
  const baseName = `${timestamp}-${document.title}`;
  const simpleLog = msgs.map(m => [m.role, m.content]);
  const exportData = {
    title: document.title || "gpt",
    exported_at: new Date().toISOString(),
    simple_log: simpleLog,
    full_messages: msgs,
    count: msgs.length
  };
  downloadFile(
    JSON.stringify(exportData, null, 2),
    `${baseName}.json`,
    'application/json'
  );
  const wrappedText = createWrappedText(msgs);
  downloadFile(
    wrappedText,
    `${baseName}.txt`,
    'text/plain'
  );
  const btn = document.getElementById('export-btn');
  if (btn) {
    const orig = btn.textContent;
    btn.textContent = '✓ Exported JSON + TXT!';
    setTimeout(() => { btn.textContent = orig; }, 2500);
  }
}

function addExportButton() {
  if (document.getElementById('export-btn')) return;
  const header = document.querySelector('#conversation-header-actions') || 
                 document.querySelector('div[data-testid="thread-header-right-actions"]');
  if (!header) {
    setTimeout(addExportButton, 800);
    return;
  }
  const btn = document.createElement('button');
  btn.id = 'export-btn';
  btn.innerHTML = '📥 JSON + TXT';
  btn.style.cssText = `
    background: #10a37f; color: white; border: none; padding: 6px 14px; 
    border-radius: 9999px; font-size: 13px; cursor: pointer; margin-left: 8px;
    display: flex; align-items: center; gap: 5px;
  `;
  btn.title = "Export current chat as JSON and wrapped TXT";
  btn.onclick = exportChat;
  header.appendChild(btn);
}

addExportButton();
const observer = new MutationObserver(() => {
  if (!document.getElementById('export-btn')) addExportButton();
});
observer.observe(document.body, { childList: true, subtree: true });

window.exportChat = exportChat;
