# ContentCraft AI - Chrome Extension

🚀 **AI-powered text rewriting and polishing Chrome extension using DeepSeek-V3**

## 📋 Project Status: Phase 1 Complete ✅

**Current Version:** 1.0.0 (MVP Ready)
**Last Updated:** September 5, 2025

## ✨ Features Implemented

### ✅ Phase 1 - MVP Complete
- **Right-click Context Menu**: "AI Rewrite" option appears when text is selected
- **Text Replacement**: Automatically replaces selected text in input/textarea fields
- **Usage Counter**: 10 free uses limit with chrome.storage.local tracking
- **Beautiful Popup UI**: Professional interface showing usage statistics
- **Visual Notifications**: Toast notifications for processing and errors
- **Freemium Model**: Ready for Pro upgrade integration

## 🛠️ Technical Stack

- **Frontend**: Chrome Extension (Manifest V3)
- **Core API**: DeepSeek-V3 (Simulated in MVP, ready for integration)
- **Storage**: chrome.storage.local for usage tracking
- **Styling**: Custom CSS with modern gradient design
- **Development**: Claude Code assisted development

## 📁 Project Structure

```
content-craft/
├── manifest.json          # Extension manifest (MV3)
├── background.js          # Service worker with context menu
├── content.js            # Content script for text replacement
├── popup.html            # Popup UI interface
├── popup.js              # Popup functionality & storage
├── styles.css            # Professional styling
├── package.json          # Project configuration
└── icons/                # Extension icons (placeholders)
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🚀 Installation & Testing

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked" and select the `content-craft` directory
4. The extension is now active and ready to use!

## 🎯 Usage

1. Navigate to any webpage with text inputs
2. Select text in any input or textarea field
3. Right-click and choose "AI Rewrite" from the context menu
4. Wait for the AI processing notification
5. Your selected text will be replaced with the AI-generated content

## 🗺️ Development Roadmap

### 📈 Phase 2: API Integration & Enhancement (Next)
- [ ] Integrate actual DeepSeek-V3 API
- [ ] Implement serverless function for API key protection
- [ ] Add multiple writing style options
- [ ] Enhance error handling and retry logic

### 🎨 Phase 3: Advanced Features
- [ ] Email integration (Gmail/Outlook smart replies)
- [ ] Custom prompt templates
- [ ] Batch processing capabilities
- [ ] Language detection and support

### 🔒 Phase 4: Security & Deployment
- [ ] Implement proper API key protection
- [ ] Create production icons and assets
- [ ] Write privacy policy and terms of service
- [ ] Prepare for Chrome Web Store submission

### 💰 Phase 5: Monetization
- [ ] Integrate payment processing (Stripe/LemonSqueezy)
- [ ] Implement subscription management
- [ ] Add user authentication
- [ ] Analytics and usage tracking

## 🎯 Quick Start Development

To continue development from the current MVP state:

### Next Steps for Phase 2:
1. **Replace simulated AI** with actual DeepSeek-V3 API calls
2. **Create serverless endpoint** for API key security
3. **Update background.js** to call your secure endpoint instead of simulation

### API Integration Example:
```javascript
// In background.js, replace simulateAIProcessing with:
async function callDeepSeekAPI(text) {
  const response = await fetch('https://your-serverless-endpoint/api/rewrite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text })
  });
  
  const result = await response.json();
  return result.rewrittenText;
}
```

## 📝 License

MIT License - Feel free to use and modify for your projects.

## 🤝 Contributing

This project is open for contributions! Feel free to submit issues and pull requests for new features and improvements.