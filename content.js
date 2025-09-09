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
    z-index: 999998;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    user-select: none;
  `;
  
  hoverButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const selectedText = window.getSelection().toString().trim();
    showPromptInputModal(selectedText);
    return false;
  });
  
  document.body.appendChild(hoverButton);
  
  // Position near the selection - get selection bounds
  const range = window.getSelection().getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  // Position button just above the selection, centered horizontally
  // Use fixed positioning to avoid scroll offset issues
  const buttonWidth = 100; // Approximate button width
  const topPos = rect.top - 35; // Relative to viewport
  const leftPos = rect.left + (rect.width / 2) - (buttonWidth / 2); // Relative to viewport
  
  hoverButton.style.position = 'fixed';
  hoverButton.style.top = topPos + 'px';
  hoverButton.style.left = leftPos + 'px';
}

function removeHoverButton() {
  if (hoverButton) {
    hoverButton.remove();
    hoverButton = null;
  }
}


function showPromptInputModal(text) {
  // Save the selected text globally since selection might be lost when modal shows
  selectedText = text;
  
  // Get selection position for floating window
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  // Create floating window instead of modal
  const floatingWindow = document.createElement('div');
  floatingWindow.innerHTML = `
    <div style="position: fixed; background: white; padding: 16px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); width: 350px; max-width: 90vw; z-index: 999999; border: 1px solid #e0e0e0;">
      <div style="font-weight: 600; margin-bottom: 12px; color: #2c3e50; font-size: 14px; display: flex; justify-content: space-between; align-items: center;">
        <span>AI Rewrite</span>
        <button id="close-float" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #95a5a6;">×</button>
      </div>
      
      <div style="margin-bottom: 12px;">
        <div style="font-weight: 500; margin-bottom: 6px; color: #34495e; font-size: 12px;">Selected Text:</div>
        <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; border: 1px solid #e9ecef; font-size: 12px; color: #495057; max-height: 60px; overflow-y: auto;">
          ${text.length > 150 ? text.substring(0, 150) + '...' : text}
        </div>
      </div>
      
      <div style="margin-bottom: 12px;">
        <div style="font-weight: 500; margin-bottom: 6px; color: #34495e; font-size: 12px;">Custom Prompt:</div>
        <textarea 
          id="custom-prompt-input" 
          placeholder="Enter your custom instructions..."
          style="width: 100%; min-height: 60px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; font-family: inherit; resize: vertical; box-sizing: border-box;"
        ></textarea>
      </div>
      
      <div style="margin-bottom: 12px;">
        <div style="font-weight: 500; margin-bottom: 6px; color: #34495e; font-size: 12px;">Quick Templates:</div>
        <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 6px;">
          <button style="padding: 4px 8px; background: #e3f2fd; border: 1px solid #bbdefb; border-radius: 3px; cursor: pointer; font-size: 10px; color: #1976d2;" data-prompt="Make this more professional and business-appropriate">Professional</button>
          <button style="padding: 4px 8px; background: #f3e5f5; border: 1px solid #e1bee7; border-radius: 3px; cursor: pointer; font-size: 10px; color: #7b1fa2;" data-prompt="Make this more casual and friendly">Casual</button>
          <button style="padding: 4px 8px; background: #e8f5e8; border: 1px solid #c8e6c9; border-radius: 3px; cursor: pointer; font-size: 10px; color: #388e3c;" data-prompt="Make this more concise and clear">Concise</button>
          <button style="padding: 4px 8px; background: #fff3e0; border: 1px solid #ffe0b2; border-radius: 3px; cursor: pointer; font-size: 10px; color: #f57c00;" data-prompt="Make this more creative and engaging">Creative</button>
        </div>
      </div>
      
      <div style="display: flex; gap: 6px; justify-content: flex-end;">
        <button id="cancel-prompt" style="padding: 8px 12px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Cancel</button>
        <button id="submit-prompt" style="padding: 8px 12px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500;">Rewrite</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(floatingWindow);
  
  // Position floating window near selection
  const windowWidth = 350;
  const windowHeight = 300;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  let topPos = rect.bottom + 10;
  let leftPos = rect.left;
  
  // Adjust position if it would go off screen
  if (topPos + windowHeight > viewportHeight) {
    topPos = rect.top - windowHeight - 10;
  }
  if (leftPos + windowWidth > viewportWidth) {
    leftPos = viewportWidth - windowWidth - 10;
  }
  if (leftPos < 10) {
    leftPos = 10;
  }
  
  floatingWindow.querySelector('div:first-child').style.top = topPos + 'px';
  floatingWindow.querySelector('div:first-child').style.left = leftPos + 'px';
  
  // Focus on textarea
  setTimeout(() => {
    const textarea = floatingWindow.querySelector('#custom-prompt-input');
    if (textarea) {
      textarea.focus();
    }
  }, 100);
  
  // Add event listeners for template buttons
  const templateButtons = floatingWindow.querySelectorAll('button[data-prompt]');
  templateButtons.forEach(button => {
    button.addEventListener('click', function() {
      const prompt = this.getAttribute('data-prompt');
      const textarea = floatingWindow.querySelector('#custom-prompt-input');
      textarea.value = prompt;
      textarea.focus();
    });
  });
  
  // Close button
  const closeBtn = floatingWindow.querySelector('#close-float');
  closeBtn.addEventListener('click', function() {
    floatingWindow.remove();
  });
  
  // Cancel button
  const cancelBtn = floatingWindow.querySelector('#cancel-prompt');
  cancelBtn.addEventListener('click', function() {
    floatingWindow.remove();
  });
  
  // Submit button
  const submitBtn = floatingWindow.querySelector('#submit-prompt');
  submitBtn.addEventListener('click', function() {
    const promptInput = floatingWindow.querySelector('#custom-prompt-input');
    const customPrompt = promptInput.value.trim();
    
    if (customPrompt) {
      processTextWithCustomPrompt(selectedText, customPrompt);
      floatingWindow.remove();
      removeHoverButton();
    } else {
      // Show validation error
      promptInput.style.borderColor = '#e74c3c';
      setTimeout(() => {
        promptInput.style.borderColor = '#ddd';
      }, 1000);
    }
  });
  
  // Close floating window when clicking outside
  const closeFloating = function(e) {
    if (!floatingWindow.contains(e.target) && e.target !== hoverButton) {
      floatingWindow.remove();
      document.removeEventListener('mousedown', closeFloating);
    }
  };
  
  setTimeout(() => {
    document.addEventListener('mousedown', closeFloating);
  }, 100);
}


function processTextWithCustomPrompt(text, customPrompt) {
  // Send to background for processing with custom prompt
  chrome.runtime.sendMessage({
    type: "PROCESS_WITH_CUSTOM_PROMPT",
    text: text,
    prompt: customPrompt
  });
}

chrome.runtime.onMessage.addListener((request) => {
  switch (request.type) {
    case "PROCESSING":
      showNotification(request.message);
      break;
      
    case "RESULT":
      // Send result to popup if it's open
      chrome.runtime.sendMessage({
        type: "SHOW_RESULT_IN_POPUP",
        text: request.text,
        originalText: window.getSelection().toString().trim()
      });
      
      // Also try to replace text on page
      const success = replaceSelectedText(request.text);
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