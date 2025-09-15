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

function showHoverButton(text) {
  removeHoverButton();
  
  hoverButton = document.createElement('div');
  hoverButton.innerHTML = '✨ AI Rewrite';
  hoverButton.style.cssText = `
    position: fixed;
    background: #ff4444;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    z-index: 2147483647;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    user-select: none;
    border: 2px solid white;
    pointer-events: auto;
  `;
  
  hoverButton.addEventListener('mousedown', function(e) {
    e.stopPropagation();
  });
  
  hoverButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    showFloatingWindow(text);
    return false;
  });
  
  document.body.appendChild(hoverButton);
  
  const range = window.getSelection().getRangeAt(0);
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

  // 移除任何已存在的浮动窗口
  const existingWindow = document.querySelector('.ai-rewrite-floating-window');
  if (existingWindow) {
    console.log('Removed existing floating window');
    existingWindow.remove();
  }

  // 存储原始文本供后续使用
  originalText = text;

  // 保存当前选区范围
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    lastSelectionRange = selection.getRangeAt(0).cloneRange();
  }
  
  // 创建浮动窗口
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
      <textarea id="custom-prompt-input" name="custom-prompt" placeholder="Enter your custom instructions..." style="width: 100%; min-height: 60px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; font-family: inherit; resize: vertical; box-sizing: border-box;"></textarea>
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

  // --- 开始：新的窗口定位逻辑 ---
  const selection = window.getSelection();
  let topPos, leftPos;
  
  const windowWidth = 350;
  const windowHeight = floatingWindow.offsetHeight || 280; // 使用实际高度或备用值
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (selection && selection.rangeCount > 0 && selection.toString().trim().length > 0) {
    // 如果选区存在，则相对于它定位
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    topPos = rect.bottom + 10;
    leftPos = rect.left;

    // 如果窗口会超出屏幕，则调整位置
    if (topPos + windowHeight > viewportHeight) {
      topPos = rect.top - windowHeight - 10;
    }
    if (leftPos + windowWidth > viewportWidth) {
      leftPos = viewportWidth - windowWidth - 10;
    }
  } else {
    // 备用方案：将窗口定位在屏幕中央
    topPos = (viewportHeight - windowHeight) / 2;
    leftPos = (viewportWidth - windowWidth) / 2;
  }

  // 最后的边界检查，防止窗口紧贴边缘
  if (leftPos < 10) leftPos = 10;
  if (topPos < 10) topPos = 10;

  floatingWindow.style.top = topPos + 'px';
  floatingWindow.style.left = leftPos + 'px';
  // --- 结束：新的窗口定位逻辑 ---
  
  // 让输入框自动获得焦点
  setTimeout(() => {
    const textarea = floatingWindow.querySelector('#custom-prompt-input');
    if (textarea) {
      textarea.focus();
    }
  }, 100);
  
  // 添加事件监听器
  const templateButtons = floatingWindow.querySelectorAll('button[data-prompt]');
  templateButtons.forEach(button => {
    button.addEventListener('click', function() {
      const prompt = this.getAttribute('data-prompt');
      const textarea = floatingWindow.querySelector('#custom-prompt-input');
      textarea.value = prompt;
      textarea.focus();
    });
  });
  
  // 关闭按钮
  const closeBtn = floatingWindow.querySelector('#close-float');
  closeBtn.addEventListener('click', function() {
    floatingWindow.remove();
    removeHoverButton();
  });
  
  // 取消按钮
  const cancelBtn = floatingWindow.querySelector('#cancel-prompt');
  cancelBtn.addEventListener('click', function() {
    floatingWindow.remove();
    removeHoverButton();
  });
  
  // 提交按钮
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
  
  // 点击外部区域关闭窗口
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
  chrome.runtime.sendMessage({
    type: "PROCESS_WITH_CUSTOM_PROMPT",
    text: text,
    prompt: customPrompt
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
  const activeElement = document.activeElement;

  // Try to use saved selection range first
  if (lastSelectionRange) {
    try {
      selection.removeAllRanges();
      selection.addRange(lastSelectionRange);

      const range = selection.getRangeAt(0);

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
          console.error('Error replacing text:', error);
          showNotification('Failed to replace text in this editor', true);
          return false;
        }
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
      showNotification('Failed to replace text in this editor', true);
      return false;
    }
  }

  showNotification('Please select text in an editable area', true);
  return false;
}