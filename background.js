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

      simulateAIProcessing(selectedText, tab.id);
    });
  }
});

function simulateAIProcessing(text, tabId) {
  setTimeout(() => {
    const rewrittenText = `AI Rewritten: ${text} (This is simulated AI processing)`;
    
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