// This would be deployed as a serverless function (Vercel/Netlify/AWS Lambda)
// NEVER expose your API key in client-side code!

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, style, prompt } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  if (text.length > 1000) {
    return res.status(400).json({ error: 'Text exceeds 1000 character limit' });
  }

  try {
    // This would be the actual implementation using your DeepSeek API key
    // For now, we'll simulate the API response with style-specific rewriting
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    
    // Style-specific rewriting simulation
    const styleTransformations = {
      professional: (t) => `Professionally refined: ${t} (enhanced for business communication)`,
      casual: (t) => `Casual version: ${t} (more friendly and conversational)`,
      academic: (t) => `Academic revision: ${t} (formal and scholarly tone)`,
      creative: (t) => `Creative rewrite: ${t} (more engaging and imaginative)`,
      concise: (t) => `Concise version: ${t} (clear and to the point)`
    };
    
    const transform = styleTransformations[style] || styleTransformations.professional;
    const rewrittenText = transform(text);
    
    res.status(200).json({ 
      success: true, 
      rewrittenText: rewrittenText,
      usage: { 
        total_tokens: Math.floor(text.length / 4) + 20,
        style: style || 'professional'
      }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to process text',
      message: error.message 
    });
  }
}

// For local testing
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};