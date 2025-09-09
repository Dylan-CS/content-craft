// This is the new, corrected version of content.js
// It fixes the issue where the floating window does not appear on button click.

let hoverButton = null;
// Removed the global 'selectedText' variable to prevent scoping issues.

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
    // Pass the selected text directly to the function
    showHoverButton(selectedText);
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

// Now accepts selectedText as an argument
function showHoverButton(text) {
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
  
  // Use the 'text' argument instead of trying to get selection again
  hoverButton.addEventListener('click', function(e) {
    console.log('Hover button clicked - event triggered');
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log('Selected text for floating window:', text);
    showFloatingWindow(text);
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

// Global variable for floating window
let floatingWindow = null;
let originalText = '';

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
  
  // Store the original text to use later
  originalText = text;
  
  // Get selection position
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  // Create floating window
  floatingWindow = document.createElement('div');
  floatingWindow.className = 'ai-rewrite-floating-window';
  floatingWindow.style.cssText = `
    position: fixed;
    background: white;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    width: 350px;
    max-width: 90vw;
    z-index: 2147483647;
    border: 1px solid #e0e0e0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  floatingWindow.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 12px; color: #2c3e50; font-size: 14px; display: flex; justify-content: space-between; align-items: center;">
      <span>AI Rewrite</span>
      <button id="close-float" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #95a5a6;">×</button>
    </div>
    
    <div style="margin-bottom: 12px;">
      <div style="font-weight: 500; margin-bottom: 6px; color: #34495e; font-size: 12px;">Selected Text:</div>
      <div id="selected-text-display" style="background: #f8f9fa; padding: 8px; border-radius: 4px; border: 1px solid #e9ecef; font-size: 12px; color: #495057; max-height: 60px; overflow-y: auto;">
        ${text.length > 150 ? text.substring(0, 150) + '...' : text}
      </div>
    </div>
    
    <div style="margin-bottom: 12px;">
      <div style="font-weight: 500; margin-bottom: 6px; color: #34495e; font-size: 12px;">Custom Prompt:</div>
      <textarea 
        id="custom-prompt-input" 
        name="custom-prompt"
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
  `;
  
  document.body.appendChild(floatingWindow);
  console.log('Floating window appended to body');
  
  // Debug: Check if floating window is actually in DOM
  const checkWindow = document.querySelector('.ai-rewrite-floating-window');
  console.log('Floating window in DOM:', !!checkWindow);
  if (checkWindow) {
    console.log('Window dimensions:', checkWindow.offsetWidth, 'x', checkWindow.offsetHeight);
  }
  
  // Position near selection (fixed positioning)
  const windowWidth = 350;
  const windowHeight = floatingWindow.offsetHeight;
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
  
  floatingWindow.style.top = topPos + 'px';
  floatingWindow.style.left = leftPos + 'px';
  
  // Focus on textarea
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
  
  // Close when clicking outside
  const closeOnClickOutside = function(e) {
    if (!floatingWindow.contains(e.target) && e.target !== hoverButton) {
      floatingWindow.remove();
      document.removeEventListener('mousedown', closeOnClickOutside);
    }
  };
  
  setTimeout(() => {
    document.addEventListener('mousedown', closeOnClickOutside);
  }, 100);
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
        originalText: originalText
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