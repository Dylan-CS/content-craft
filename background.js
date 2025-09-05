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

    console.log("Selected text:", selectedText);
    
    chrome.storage.local.get(['usageCount'], (result) => {
      const usageCount = result.usageCount || 0;
      
      if (usageCount >= 10) {
        chrome.tabs.sendMessage(tab.id, {
          type: "ERROR",
          message: "Free usage limit reached. Please upgrade to Pro version"
        });
        return;
      }

      chrome.tabs.sendMessage(tab.id, {
        type: "PROCESSING",
        message: "Processing..."
      });

      // Use simulate for now, replace with callDeepSeekAPI when server is ready
      simulateAIProcessing(selectedText, tab.id);
      
      // When server is ready, use this instead:
      // callDeepSeekAPI(selectedText)
      //   .then(rewrittenText => {
      //     // Count usage on success
      //     chrome.storage.local.get(['usageCount'], (result) => {
      //       const newCount = (result.usageCount || 0) + 1;
      //       chrome.storage.local.set({ usageCount: newCount });
      //     });
      //     
      //     chrome.tabs.sendMessage(tab.id, {
      //       type: "RESULT",
      //       text: rewrittenText
      //     });
      //   })
      //   .catch(error => {
      //     chrome.tabs.sendMessage(tab.id, {
      //       type: "ERROR",
      //       message: `API Error: ${error.message}`
      //     });
      //   });
    });
  }
});

async function callDeepSeekAPI(text) {
  // IMPORTANT: This should call your serverless function, not directly call DeepSeek API
  // Replace this URL with your actual serverless function endpoint
  const API_URL = 'https://your-serverless-function.vercel.app/api/rewrite';
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text })
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
    console.error('DeepSeek API Error:', error);
    throw error;
  }
}

function simulateAIProcessing(text, tabId) {
  // For now, using simulation. Replace with callDeepSeekAPI(text) when ready
  setTimeout(() => {
    const rewrittenText = `AI Rewritten: ${text} (Simulated - add DeepSeek API)`;
    
    // Count usage now since AI processing was successful
    chrome.storage.local.get(['usageCount'], (result) => {
      const newCount = (result.usageCount || 0) + 1;
      chrome.storage.local.set({ usageCount: newCount });
    });
    
    chrome.tabs.sendMessage(tabId, {
      type: "RESULT",
      text: rewrittenText
    });
  }, 1000);
}