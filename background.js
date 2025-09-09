chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "ai-rewrite",
    title: "AI Rewrite",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "ai-rewrite" && info.selectionText) {
    const selectedText = info.selectionText.trim();
    
    if (selectedText.length === 0) {
      return;
    }

    // Show style selection for right-click menu too
    chrome.tabs.sendMessage(tab.id, {
      type: "SHOW_STYLE_SELECTION",
      text: selectedText
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "PROCESS_WITH_CUSTOM_PROMPT") {
    const { text, prompt } = request;
    
    chrome.storage.local.get(['usageCount'], (result) => {
      const usageCount = result.usageCount || 0;
      
      if (usageCount >= 10) {
        chrome.tabs.sendMessage(sender.tab.id, {
          type: "ERROR",
          message: "Free usage limit reached. Please upgrade to Pro version"
        });
        return;
      }

      chrome.tabs.sendMessage(sender.tab.id, {
        type: "PROCESSING",
        message: "Processing..."
      });

      // Use actual API call with custom prompt
      callDeepSeekAPI(text, 'custom', prompt)
        .then(rewrittenText => {
          // Count usage on success
          chrome.storage.local.get(['usageCount'], (result) => {
            const newCount = (result.usageCount || 0) + 1;
            chrome.storage.local.set({ usageCount: newCount });
          });
          
          chrome.tabs.sendMessage(sender.tab.id, {
            type: "RESULT",
            text: rewrittenText
          });
        })
        .catch(error => {
          chrome.tabs.sendMessage(sender.tab.id, {
            type: "ERROR",
            message: `API Error: ${error.message}`
          });
        });
    });
  }
});

async function callDeepSeekAPI(text, style, prompt) {
  const API_URL = 'https://content-craft-phi.vercel.app/api/rewrite';
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text: text,
        style: style,
        prompt: prompt
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      return data.rewrittenText;
    } else {
      throw new Error(data.error || 'API processing failed');
    }
    
  } catch (error) {
    throw error;
  }
}

