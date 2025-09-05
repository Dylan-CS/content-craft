let hoverButton = null;
let selectedText = '';

// Create hover button when text is selected
document.addEventListener('mouseup', function(e) {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  if (selectedText.length > 0 && !selection.isCollapsed) {
    showHoverButton(e);
  } else {
    removeHoverButton();
  }
});

// Hide button when clicking elsewhere
document.addEventListener('mousedown', function(e) {
  if (hoverButton && !hoverButton.contains(e.target)) {
    removeHoverButton();
  }
});

function showHoverButton(event) {
  removeHoverButton();
  
  hoverButton = document.createElement('div');
  hoverButton.innerHTML = '✨ AI Rewrite';
  hoverButton.style.cssText = `
    position: absolute;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    z-index: 10000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    user-select: none;
  `;
  
  hoverButton.addEventListener('click', function(e) {
    e.stopPropagation();
    showStyleSelection(event);
  });
  
  document.body.appendChild(hoverButton);
  
  // Position near the selection
  const rect = event.target.getBoundingClientRect();
  hoverButton.style.top = (rect.top - 35) + 'px';
  hoverButton.style.left = (rect.left + rect.width / 2 - 40) + 'px';
}

function removeHoverButton() {
  if (hoverButton) {
    hoverButton.remove();
    hoverButton = null;
  }
}

function showStyleSelection(event) {
  const selection = window.getSelection();
  selectedText = selection.toString().trim();
  
  if (selectedText.length === 0) return;
  
  // Create style selection popup
  const popup = document.createElement('div');
  popup.innerHTML = `
    <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 1px solid #ddd;">
      <div style="font-weight: 500; margin-bottom: 8px; color: #2c3e50;">Choose style:</div>
      <button style="margin: 4px; padding: 8px 12px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;" data-style="workplace">🏢 Workplace</button>
      <button style="margin: 4px; padding: 8px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;" data-style="casual">💬 Casual</button>
    </div>
  `;
  
  popup.style.cssText = `
    position: absolute;
    z-index: 10001;
    top: ${event.clientY + 10}px;
    left: ${event.clientX - 80}px;
  `;
  
  // Add event listeners to buttons
  const buttons = popup.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const style = this.getAttribute('data-style');
      processTextWithStyle(selectedText, style);
      popup.remove();
      removeHoverButton();
    });
  });
  
  // Close when clicking outside
  const closePopup = function(e) {
    if (!popup.contains(e.target)) {
      popup.remove();
      document.removeEventListener('mousedown', closePopup);
    }
  };
  
  document.addEventListener('mousedown', closePopup);
  document.body.appendChild(popup);
}

function processTextWithStyle(text, style) {
  const prompt = style === 'workplace' 
    ? 'Rewrite this text to be more professional, clear, and appropriate for workplace communication.'
    : 'Rewrite this text to be more casual, friendly, and suitable for informal conversations.';
  
  // Send to background for processing
  chrome.runtime.sendMessage({
    type: "PROCESS_WITH_STYLE",
    text: text,
    style: style,
    prompt: prompt
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "PROCESSING":
      showNotification(request.message);
      break;
      
    case "RESULT":
      const success = replaceSelectedText(request.text);
      // Send response back to background script
      if (!success) {
        chrome.runtime.sendMessage({
          type: "REPLACEMENT_FAILED"
        });
      }
      break;
      
    case "ERROR":
      showNotification(request.message, true);
      break;
  }
});

function showNotification(message, isError = false) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${isError ? '#ff4757' : '#2ed573'};
    color: white;
    border-radius: 8px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}

function replaceSelectedText(newText) {
  const selection = window.getSelection();
  
  if (!selection.rangeCount || selection.toString().trim() === '') {
    showNotification('Please select text to rewrite', true);
    return false;
  }
  
  const range = selection.getRangeAt(0);
  const activeElement = document.activeElement;
  
  // Handle regular input/textarea elements
  if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
    const start = activeElement.selectionStart;
    const end = activeElement.selectionEnd;
    
    const currentValue = activeElement.value;
    const newValue = currentValue.substring(0, start) + newText + currentValue.substring(end);
    
    activeElement.value = newValue;
    activeElement.selectionStart = start;
    activeElement.selectionEnd = start + newText.length;
    activeElement.focus();
    return true;
  }
  
  // Handle contenteditable elements and rich text editors
  if (range && !range.collapsed) {
    try {
      range.deleteContents();
      const textNode = document.createTextNode(newText);
      range.insertNode(textNode);
      
      // Move selection to the end of the inserted text
      const newRange = document.createRange();
      newRange.setStartAfter(textNode);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
      
      return true;
    } catch (error) {
      console.error('Error replacing text in contenteditable:', error);
      showNotification('Failed to replace text in this editor', true);
      return false;
    }
  }
  
  showNotification('Please select text in an editable area', true);
  return false;
}