# DeepSeek API Server Setup Guide

## 🚨 IMPORTANT SECURITY WARNING

**NEVER expose your DeepSeek API key in client-side code!** Your API key is visible in the browser and can be easily stolen.

## Option 1: Vercel Serverless Function (Recommended)

### 1. Create a Vercel account
- Go to [vercel.com](https://vercel.com) and sign up
- Install Vercel CLI: `npm i -g vercel`

### 2. Create API directory structure
```bash
mkdir -p api
```

### 3. Create `api/rewrite.js`
```javascript
// api/rewrite.js
import { OpenAI } from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com'
    });

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system', 
          content: 'You are a helpful writing assistant. Rewrite the user\'s text to be more professional, clear, and engaging.'
        },
        {
          role: 'user',
          content: `Please rewrite this text: ${text}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const rewrittenText = response.choices[0].message.content;
    
    res.status(200).json({ 
      success: true, 
      rewrittenText: rewrittenText,
      usage: response.usage
    });
    
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    res.status(500).json({ 
      error: 'Failed to process text',
      message: error.message 
    });
  }
}
```

### 4. Create `package.json` for API
```json
{
  "name": "contentcraft-api",
  "version": "1.0.0",
  "dependencies": {
    "openai": "^4.0.0"
  }
}
```

### 5. Deploy to Vercel
```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variable
vercel env add DEEPSEEK_API_KEY
```

### 6. Update Chrome Extension
In `background.js`, update the API_URL:
```javascript
const API_URL = 'https://your-vercel-app.vercel.app/api/rewrite';
```

## Option 2: Netlify Function

### 1. Create `netlify/functions/rewrite.js`
```javascript
// netlify/functions/rewrite.js
const { OpenAI } = require('openai');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const { text } = JSON.parse(event.body);
  
  if (!text) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Text is required' })
    };
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com'
    });

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system', 
          content: 'You are a helpful writing assistant.'
        },
        {
          role: 'user',
          content: `Rewrite this text: ${text}`
        }
      ],
      max_tokens: 1000
    });

    const rewrittenText = response.choices[0].message.content;
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        rewrittenText: rewrittenText,
        usage: response.usage
      })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process text',
        message: error.message
      })
    };
  }
};
```

## Environment Variables

Set these in your deployment platform:
- `DEEPSEEK_API_KEY`: Your DeepSeek API key (sk-...)

## Testing Your API

Use curl to test:
```bash
curl -X POST https://your-api.vercel.app/api/rewrite \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world"}'
```

## Security Notes

- Never commit your API key to version control
- Use environment variables
- Consider adding rate limiting
- Add CORS headers if needed
- Monitor your API usage