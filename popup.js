const MAX_FREE_USES = 10;

document.addEventListener('DOMContentLoaded', function() {
  const usageCountElement = document.getElementById('usageCount');
  const remainingCountElement = document.getElementById('remainingCount');
  const upgradeBtn = document.getElementById('upgradeBtn');
  const resetBtn = document.getElementById('resetBtn');

  function updateUsageDisplay() {
    chrome.storage.local.get(['usageCount'], function(result) {
      const usageCount = result.usageCount || 0;
      const remainingCount = Math.max(0, MAX_FREE_USES - usageCount);
      
      usageCountElement.textContent = usageCount;
      remainingCountElement.textContent = remainingCount;
      
      if (remainingCount === 0) {
        remainingCountElement.style.color = '#ff4757';
      } else {
        remainingCountElement.style.color = '#2ed573';
      }
    });
  }

  upgradeBtn.addEventListener('click', function() {
    alert('Redirecting to upgrade page...\n\nPro Features:\n✅ Unlimited usage\n✅ More writing styles\n✅ Priority processing\n✅ Dedicated support');
  });

  resetBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to reset the usage count?')) {
      chrome.storage.local.set({ usageCount: 0 }, function() {
        updateUsageDisplay();
        alert('Usage count has been reset!');
      });
    }
  });

  updateUsageDisplay();

  // Add quick rewrite functionality
  const quickPromptInput = document.getElementById('quickPromptInput');
  const quickRewriteBtn = document.getElementById('quickRewriteBtn');
  
  quickRewriteBtn.addEventListener('click', function() {
    const prompt = quickPromptInput.value.trim();
    
    if (!prompt) {
      alert('Please enter some text or instructions');
      return;
    }
    
    // Get the currently selected text from the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "GET_SELECTED_TEXT"
        }, function(response) {
          if (response && response.selectedText) {
            // Process with custom prompt
            chrome.runtime.sendMessage({
              type: "PROCESS_WITH_CUSTOM_PROMPT",
              text: response.selectedText,
              prompt: prompt
            });
            
            // Show processing message
            showNotification('Processing your text...');
            
          } else {
            alert('Please select some text on the page first');
          }
        });
      }
    });
  });

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'local' && changes.usageCount) {
      updateUsageDisplay();
    }
  });

  // Listen for result messages
  chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === "POPUP_RESULT") {
      showResultInPopup(request.originalText, request.rewrittenText);
    }
  });
});

function showNotification(message, isError = false) {
  // Create a simple notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    padding: 8px 16px;
    background: ${isError ? '#ff4757' : '#2ed573'};
    color: white;
    border-radius: 6px;
    z-index: 10000;
    font-size: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

function showResultInPopup(originalText, rewrittenText) {
  // Create result display section
  const resultSection = document.createElement('div');
  resultSection.className = 'result-section';
  resultSection.innerHTML = `
    <div style="margin-top: 20px; padding: 16px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
      <h3 style="margin: 0 0 12px 0; color: #2c3e50; font-size: 14px;">AI Rewrite Result</h3>
      
      <div style="margin-bottom: 12px;">
        <div style="font-weight: 500; margin-bottom: 4px; color: #6c757d; font-size: 12px;">Original:</div>
        <div style="background: white; padding: 8px; border-radius: 4px; border: 1px solid #dee2e6; font-size: 12px; color: #495057;">
          ${originalText.length > 100 ? originalText.substring(0, 100) + '...' : originalText}
        </div>
      </div>
      
      <div>
        <div style="font-weight: 500; margin-bottom: 4px; color: #28a745; font-size: 12px;">Rewritten:</div>
        <div style="background: white; padding: 8px; border-radius: 4px; border: 1px solid #d4edda; font-size: 12px; color: #155724;">
          ${rewrittenText.length > 150 ? rewrittenText.substring(0, 150) + '...' : rewrittenText}
        </div>
      </div>
      
      <button id="copyResultBtn" style="margin-top: 12px; padding: 6px 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
        📋 Copy Result
      </button>
    </div>
  `;
  
  // Remove any existing result section
  const existingResult = document.querySelector('.result-section');
  if (existingResult) {
    existingResult.remove();
  }
  
  // Add to container
  const container = document.querySelector('.container');
  container.appendChild(resultSection);
  
  // Add copy functionality
  const copyBtn = document.getElementById('copyResultBtn');
  copyBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(rewrittenText).then(function() {
      copyBtn.textContent = '✅ Copied!';
      setTimeout(() => {
        copyBtn.textContent = '📋 Copy Result';
      }, 2000);
    });
  });
}