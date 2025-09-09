let hoverButton = null;
let selectedText = '';

console.log('ContentCraft extension loaded successfully');

// Test basic functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded - extension should work now');
  
  // Test if we can create elements
  const testDiv = document.createElement('div');
  testDiv.textContent = 'Extension test';
  testDiv.style.position = 'fixed';
  testDiv.style.top = '10px';
  testDiv.style.right = '10px';
  testDiv.style.background = 'red';
  testDiv.style.color = 'white';
  testDiv.style.padding = '5px';
  testDiv.style.zIndex = '999999';
  document.body.appendChild(testDiv);
  
  setTimeout(() => {
    testDiv.remove();
    console.log('Extension test completed - element creation works');
  }, 2000);
});

// Create hover button when text is selected
document.addEventListener('mouseup', function(e) {
  console.log('Mouseup event detected');
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  console.log('Selection text:', selectedText, 'Length:', selectedText.length);
  
  if (selectedText.length > 0 && !selection.isCollapsed) {
    console.log('Showing hover button');
    showHoverButton();
  } else {
    console.log('Removing hover button - no selection');
    removeHoverButton();
  }
});

// Hide button when clicking elsewhere
document.addEventListener('mousedown', function(e) {
  if (hoverButton && !hoverButton.contains(e.target) && e.target.id !== 'close-float') {
    // Use longer timeout to ensure click events can process
    setTimeout(() => {
      if (hoverButton && !hoverButton.contains(e.target)) {
        removeHoverButton();
      }
    }, 300);
  }
});

function showHoverButton() {
  console.log('showHoverButton called');
  removeHoverButton();
  
  hoverButton = document.createElement('div');
  hoverButton.innerHTML = '✨ AI Rewrite';
  hoverButton.style.cssText = `
    position: fixed;
    background: #ff4444 !important; /* Bright red for visibility */
    color: white !important;
    padding: 8px 16px !important;
    border-radius: 20px !important;
    font-size: 14px !important;
    font-weight: bold !important;
    cursor: pointer !important;
    z-index: 2147483647 !important; /* Maximum z-index */
    box-shadow: 0 4px 16px rgba(0,0,0,0.3) !important;
    user-select: none !important;
    border: 2px solid white !important;
    pointer-events: auto !important;
  `;
  
  hoverButton.addEventListener('mousedown', function(e) {
    // Prevent the document mousedown from removing this button
    e.stopPropagation();
  });
  
  hoverButton.addEventListener('click', function(e) {
    console.log('Hover button clicked - event triggered');
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const selectedText = window.getSelection().toString().trim();
    console.log('Selected text for floating window:', selectedText);
    showFloatingWindow(selectedText);
    return false;
  });
  
  document.body.appendChild(hoverButton);
  
  // Position near the selection
  const range = window.getSelection().getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  console.log('Selection rect:', rect);
  
  const buttonWidth = 100;
  const buttonHeight = 30;
  let topPos = rect.top - 35;
  let leftPos = rect.left + (rect.width / 2) - (buttonWidth / 2);
  
  // Ensure button stays within viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  if (topPos < 10) topPos = 10;
  if (topPos + buttonHeight > viewportHeight - 10) topPos = viewportHeight - buttonHeight - 10;
  if (leftPos < 10) leftPos = 10;
  if (leftPos + buttonWidth > viewportWidth - 10) leftPos = viewportWidth - buttonWidth - 10;
  
  console.log('Button position - Top:', topPos, 'Left:', leftPos);
  console.log('Viewport - Width:', viewportWidth, 'Height:', viewportHeight);
  
  hoverButton.style.top = topPos + 'px';
  hoverButton.style.left = leftPos + 'px';
  
  // Make sure it's visible
  hoverButton.style.display = 'block';
  hoverButton.style.visibility = 'visible';
  
  console.log('Hover button created and positioned');
  
  // Debug: Add a temporary visible indicator
  const debugIndicator = document.createElement('div');
  debugIndicator.textContent = '🔴 BUTTON HERE - CLICK ME';
  debugIndicator.style.position = 'fixed';
  debugIndicator.style.top = (topPos - 25) + 'px';
  debugIndicator.style.left = leftPos + 'px';
  debugIndicator.style.background = 'yellow';
  debugIndicator.style.color = 'black';
  debugIndicator.style.padding = '2px 5px';
  debugIndicator.style.zIndex = '2147483646';
  debugIndicator.style.fontSize = '10px';
  debugIndicator.style.cursor = 'pointer';
  debugIndicator.addEventListener('click', function() {
    console.log('Debug indicator clicked - testing if clicks work');
    // Store reference to the current button
    const currentButton = hoverButton;
    if (currentButton) {
      currentButton.click(); // Programmatically click the button
    } else {
      console.log('Hover button is null - it was removed');
    }
  });
  document.body.appendChild(debugIndicator);
  
  setTimeout(() => {
    debugIndicator.remove();
  }, 5000);
}

function removeHoverButton() {
  if (hoverButton) {
    hoverButton.remove();
    hoverButton = null;
  }
}

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
  
  selectedText = text;
  
  // Get selection position
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  // Create floating window - SIMPLIFIED VERSION
  const floatingWindow = document.createElement('div');
  floatingWindow.className = 'ai-rewrite-floating-window';
  floatingWindow.style.cssText = `
    position: fixed;
    background: red !important;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    width: 300px;
    z-index: 2147483647;
    border: 3px solid yellow !important;
    font-family: Arial, sans-serif;
    color: white !important;
    font-weight: bold;
    top: 100px;
    left: 100px;
  `;
  floatingWindow.innerHTML = `
    <div style="margin-bottom: 15px; font-size: 16px;">
      <strong>TEST FLOATING WINDOW</strong>
    </div>
    <div style="margin-bottom: 10px; font-size: 12px;">
      Selected text: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}
    </div>
    <button id="test-close" style="padding: 8px 16px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">
      Close This Test Window
    </button>
  `;
  
  document.body.appendChild(floatingWindow);
  console.log('SIMPLE floating window appended to body');
  
  // Add click handler
  const closeBtn = floatingWindow.querySelector('#test-close');
  closeBtn.addEventListener('click', function() {
    floatingWindow.remove();
    console.log('Test window closed');
  });
}

function processTextWithCustomPrompt(text, customPrompt) {
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
      chrome.runtime.sendMessage({
        type: "SHOW_RESULT_IN_POPUP",
        text: request.text,
        originalText: window.getSelection().toString().trim()
      });
      
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
  
  if (range && !range.collapsed) {
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
      console.error('Error replacing text in contenteditable:', error);
      showNotification('Failed to replace text in this editor', true);
      return false;
    }
  }
  
  showNotification('Please select text in an editable area', true);
  return false;
}