const fs = require('fs');

const DEFAULT_AI_URL = 'http://localhost:5001/analyze';

function getAiServiceUrl() {
  return process.env.AI_SERVICE_URL || DEFAULT_AI_URL;
}

/**
 * Send image file to Flask AI service (expects imageBase64 in JSON body).
 */
async function analyzeBloodImage(filePath) {
  const aiServiceUrl = getAiServiceUrl();
  const imageBuffer = fs.readFileSync(filePath);
  const imageBase64 = imageBuffer.toString('base64');

  const fetch = (await import('node-fetch')).default;
  const aiRes = await fetch(aiServiceUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64 }),
  });

  const aiData = await aiRes.json().catch(() => ({}));

  if (!aiRes.ok) {
    const detail = aiData.error || aiRes.statusText;
    throw new Error(`AI service error (${aiRes.status}): ${detail}`);
  }

  if (!aiData.result) {
    throw new Error(aiData.error || 'AI service returned an invalid response');
  }

  return {
    result: aiData.result,
    confidence: aiData.confidence,
  };
}

module.exports = { analyzeBloodImage, getAiServiceUrl };
