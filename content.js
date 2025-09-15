let hoverButton = null;

// Create hover button when text is selected
document.addEventListener('mouseup', function() {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  if (selectedText.length > 0 && !selection.isCollapsed) {
    showHoverButton(selectedText);
  } else {
    removeHoverButton();
  }
});

// Hide button when clicking elsewhere (simplified)
document.addEventListener('mousedown', function(e) {
  console.log('Global mousedown event, target:', e.target?.className || e.target);
  if (hoverButton && e.target !== hoverButton && !hoverButton.contains(e.target)) {
    console.log('Removing hover button due to outside click');
    removeHoverButton();
  } else if (hoverButton && (e.target === hoverButton || hoverButton.contains(e.target))) {
    console.log('Click on hover button - allowing click event to proceed');
  }
});

function showHoverButton(text) {
  removeHoverButton();

  hoverButton = document.createElement('div');
  hoverButton.className = 'ai-rewrite-hover-button';
  hoverButton.innerHTML = '✨';
  
  document.body.appendChild(hoverButton);
  console.log('Button appended to DOM with class:', hoverButton.className);

  // Add event listeners AFTER the button is in the DOM
  hoverButton.addEventListener('mousedown', function(e) {
    console.log('Button mousedown event');
    e.stopPropagation();
  });

  hoverButton.addEventListener('click', function(e) {
    console.log('AI rewrite button clicked - event triggered');
    e.preventDefault();
    e.stopPropagation();
    console.log('Calling showFloatingWindow with text:', text);
    showFloatingWindow(text);
    return false;
  });
  
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  const buttonWidth = 100;
  const buttonHeight = 30;
  let topPos = rect.top - 35;
  let leftPos = rect.left + (rect.width / 2) - (buttonWidth / 2);
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  if (topPos < 10) topPos = 10;
  if (topPos + buttonHeight > viewportHeight - 10) topPos = viewportHeight - buttonHeight - 10;
  if (leftPos < 10) leftPos = 10;
  if (leftPos + buttonWidth > viewportWidth - 10) leftPos = viewportWidth - buttonWidth - 10;
  
  hoverButton.style.top = topPos + 'px';
  hoverButton.style.left = leftPos + 'px';
  
  hoverButton.style.display = 'block';
  hoverButton.style.visibility = 'visible';
  console.log('Hover button created and positioned');
}

function removeHoverButton() {
  if (hoverButton) {
    hoverButton.remove();
    hoverButton = null;
  }
}

// Global variable for floating window
let floatingWindow = null;
let originalText = '';
let lastSelectionRange = null;

function showFloatingWindow(text) {
  console.log('showFloatingWindow called with text:', text);

  if (!text || text.length === 0) {
    console.log('No text provided to showFloatingWindow');
    return;
  }

  // Remove any existing floating window
  const existingWindow = document.querySelector('.ai-rewrite-floating-window');
  if (existingWindow) {
    console.log('Removed existing floating window');
    existingWindow.remove();
  }

  // Store original text for later use
  originalText = text;

  // Save current selection range
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    lastSelectionRange = selection.getRangeAt(0).cloneRange();
  }
  
  // Create floating window
  floatingWindow = document.createElement('div');
  floatingWindow.className = 'ai-rewrite-floating-window';
  floatingWindow.innerHTML = `
    <div class="floating-window-header">
      <span>AI Rewrite</span>
      <button id="close-float" class="close-button">×</button>
    </div>
    <div style="margin-bottom: 12px;">
      <div class="section-title">Selected Text:</div>
      <div id="selected-text-display" class="selected-text-display">
        ${text.length > 150 ? text.substring(0, 150) + '...' : text}
      </div>
    </div>
    <div style="margin-bottom: 12px;">
      <div class="section-title">Custom Prompt:</div>
      <textarea id="custom-prompt-input" name="custom-prompt" placeholder="Enter your custom instructions..." class="custom-prompt-input"></textarea>
    </div>
    <div style="margin-bottom: 12px;">
      <div class="section-title">Quick Templates:</div>
      <div class="template-buttons-container">
        <button class="template-button professional" data-prompt="Make this more professional and business-appropriate">Professional</button>
        <button class="template-button casual" data-prompt="Make this more casual and friendly">Casual</button>
        <button class="template-button concise" data-prompt="Make this more concise and clear">Concise</button>
        <button class="template-button creative" data-prompt="Make this more creative and engaging">Creative</button>
      </div>
    </div>
    <div class="action-buttons-container">
      <button id="cancel-prompt" class="action-button cancel-button">Cancel</button>
      <button id="submit-prompt" class="action-button submit-button">Rewrite</button>
    </div>
  `;
  
  document.body.appendChild(floatingWindow);
  console.log('Floating window appended to body');

  // --- Start: New window positioning logic ---
  let topPos, leftPos;

  const windowWidth = 350;
  const windowHeight = floatingWindow.offsetHeight || 280; // Use actual height or fallback
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const selectedText = selection ? selection.toString().trim() : '';
  if (selection && selection.rangeCount > 0 && selectedText.length > 0) {
    // If selection exists, position relative to it
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    topPos = rect.bottom + 10;
    leftPos = rect.left;

    // Adjust position if window would go off-screen
    if (topPos + windowHeight > viewportHeight) {
      topPos = rect.top - windowHeight - 10;
    }
    if (leftPos + windowWidth > viewportWidth) {
      leftPos = viewportWidth - windowWidth - 10;
    }
  } else {
    // Fallback: center the window on screen
    topPos = (viewportHeight - windowHeight) / 2;
    leftPos = (viewportWidth - windowWidth) / 2;
  }

  // Final boundary check to prevent window from touching edges
  if (leftPos < 10) leftPos = 10;
  if (topPos < 10) topPos = 10;

  floatingWindow.style.top = topPos + 'px';
  floatingWindow.style.left = leftPos + 'px';
  // --- End: New window positioning logic ---
  
  // Auto-focus the input field
  setTimeout(() => {
    const textarea = floatingWindow.querySelector('#custom-prompt-input');
    if (textarea) {
      textarea.focus();
    }
  }, 100);
  
  // Add event listeners
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
    removeHoverButton();
  });
  
  // Cancel button
  const cancelBtn = floatingWindow.querySelector('#cancel-prompt');
  cancelBtn.addEventListener('click', function() {
    floatingWindow.remove();
    removeHoverButton();
  });
  
  // Submit button
  const submitBtn = floatingWindow.querySelector('#submit-prompt');
  submitBtn.addEventListener('click', function() {
    const promptInput = floatingWindow.querySelector('#custom-prompt-input');
    const customPrompt = promptInput.value.trim();
    
    if (customPrompt) {
      processTextWithCustomPrompt(originalText, customPrompt);
      floatingWindow.remove();
      removeHoverButton();
    } else {
      promptInput.style.borderColor = '#e74c3c';
      setTimeout(() => {
        promptInput.style.borderColor = '#ddd';
      }, 1000);
    }
  });
  
  // Close window when clicking outside
  const closeOnClickOutside = function(e) {
    if (floatingWindow && !floatingWindow.contains(e.target) && e.target !== hoverButton) {
      floatingWindow.remove();
      document.removeEventListener('mousedown', closeOnClickOutside);
    }
  };
  
  setTimeout(() => {
    document.addEventListener('mousedown', closeOnClickOutside);
  }, 100);
}

function processTextWithCustomPrompt(text, customPrompt) {
  console.log('Sending message to background script');
  chrome.runtime.sendMessage({
    type: "PROCESS_WITH_CUSTOM_PROMPT",
    text: text,
    prompt: customPrompt
  }).catch(error => {
    console.error('Error sending message to background:', error);
    showNotification('Extension communication error', true);
  });
}

chrome.runtime.onMessage.addListener((request) => {
  switch (request.type) {
    case "SHOW_STYLE_SELECTION":
      showFloatingWindow(request.text);
      break;

    case "PROCESSING":
      showNotification(request.message);
      break;
      
    case "RESULT":
      // Show result in floating window instead of automatically replacing
      showResultWindow(originalText, request.text);
      break;
      
    case "ERROR":
      showNotification(request.message, true);
      break;
  }
});

function showResultWindow(originalText, rewrittenText) {
  // Remove any existing result window
  const existingWindow = document.querySelector('.ai-rewrite-result-window');
  if (existingWindow) {
    existingWindow.remove();
  }

  const resultWindow = document.createElement('div');
  resultWindow.className = 'ai-rewrite-result-window';
  resultWindow.innerHTML = `
    <div class="floating-window-header">
      <span>AI Rewrite Result</span>
      <button id="close-result" class="close-button">×</button>
    </div>
    <div class="result-section">
      <div class="section-title">Original Text:</div>
      <div class="selected-text-display original-text">
        ${originalText}
      </div>
    </div>
    <div class="result-section">
      <div class="section-title">Rewritten Text:</div>
      <div class="selected-text-display rewritten-text">
        ${rewrittenText}
      </div>
    </div>
    <div class="result-section">
      <div class="section-title">Actions:</div>
      <div class="action-buttons-container">
        <button id="copy-result" class="action-button copy-button">Copy Result</button>
        <button id="replace-text" class="action-button submit-button">Replace on Page</button>
        <button id="close-result-btn" class="action-button cancel-button">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(resultWindow);

  // Position the result window
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const windowWidth = 400;
  const windowHeight = resultWindow.offsetHeight || 300;

  resultWindow.style.top = ((viewportHeight - windowHeight) / 2) + 'px';
  resultWindow.style.left = ((viewportWidth - windowWidth) / 2) + 'px';

  // Add event listeners
  resultWindow.querySelector('#close-result').addEventListener('click', () => {
    resultWindow.remove();
  });

  resultWindow.querySelector('#close-result-btn').addEventListener('click', () => {
    resultWindow.remove();
  });

  resultWindow.querySelector('#copy-result').addEventListener('click', () => {
    navigator.clipboard.writeText(rewrittenText).then(() => {
      showNotification('Text copied to clipboard!');
    });
  });

  resultWindow.querySelector('#replace-text').addEventListener('click', () => {
    const success = replaceSelectedText(rewrittenText);
    if (success) {
      resultWindow.remove();
      showNotification('Text replaced successfully!');
    }
  });

  // Close on outside click
  const closeOnClickOutside = function(e) {
    if (resultWindow && !resultWindow.contains(e.target)) {
      resultWindow.remove();
      document.removeEventListener('mousedown', closeOnClickOutside);
    }
  };

  setTimeout(() => {
    document.addEventListener('mousedown', closeOnClickOutside);
  }, 100);
}

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

// Helper function to replace text in input/textarea elements
function replaceInputText(activeElement, newText) {
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

// Helper function to replace text in contenteditable areas
function replaceContentEditableText(range, selection, newText) {
  try {
    range.deleteContents();
    const textNode = document.createTextNode(newText);
    range.insertNode(textNode);

    const newRange = document.createRange();
    newRange.setStartAfter(textNode);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);

    return true;
  } catch (error) {
    console.error('Error replacing text:', error);
    showNotification('Failed to replace text in this editor', true);
    return false;
  }
}

function replaceSelectedText(newText) {
  const selection = window.getSelection();
  const activeElement = document.activeElement;

  // Try to use saved selection range first
  if (lastSelectionRange) {
    try {
      selection.removeAllRanges();
      selection.addRange(lastSelectionRange);
      const range = selection.getRangeAt(0);

      if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
        return replaceInputText(activeElement, newText);
      }

      if (range && !range.collapsed) {
        return replaceContentEditableText(range, selection, newText);
      }
    } catch (error) {
      console.log('Saved selection invalid, trying current selection');
    }
  }

  // Fallback to current selection
  if (!selection.rangeCount || selection.toString().trim() === '') {
    showNotification('Please select text to rewrite', true);
    return false;
  }

  const range = selection.getRangeAt(0);

  if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
    return replaceInputText(activeElement, newText);
  }

  if (range && !range.collapsed) {
    return replaceContentEditableText(range, selection, newText);
  }

  showNotification('Please select text in an editable area', true);
  return false;
}