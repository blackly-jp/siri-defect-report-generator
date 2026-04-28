const https = require('https');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { issueDesc, domain, utterance, apiKey } = req.body;

    if (!apiKey) {
      res.status(400).json({ error: 'API key is required' });
      return;
    }

    if (!issueDesc) {
      res.status(400).json({ error: 'Issue description is required' });
      return;
    }

    const prompt = `You are a QA engineer writing a defect report for Siri testing. Based on the following information, generate professional, clear descriptions:

Issue: ${issueDesc}
Domain: ${domain || 'N/A'}
Utterance: ${utterance || 'N/A'}

Please provide:
1. Summary: A concise one-sentence summary of the issue (add period at the end)
2. Actual Results: A detailed, professional description of what actually happened (the bug/issue)
3. Expected Results: A detailed, professional description of what should have happened

Format your response ONLY as valid JSON with no additional text:
{
  "summary": "...",
  "actualResults": "...",
  "expectedResults": "..."
}`;

    const requestData = JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
      }
    };

    const apiResponse = await new Promise((resolve, reject) => {
      const apiReq = https.request(options, (apiRes) => {
        let data = '';

        apiRes.on('data', (chunk) => {
          data += chunk;
        });

        apiRes.on('end', () => {
          if (apiRes.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`API returned status ${apiRes.statusCode}: ${data}`));
          }
        });
      });

      apiReq.on('error', (error) => {
        reject(error);
      });

      apiReq.write(requestData);
      apiReq.end();
    });

    const content = apiResponse.candidates[0].content.parts[0].text;
    const result = JSON.parse(content);

    res.status(200).json(result);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate with AI'
    });
  }
};
