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
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional QA engineer specializing in Siri testing. Generate clear, concise, and professional defect report descriptions. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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

    const content = apiResponse.choices[0].message.content;
    const result = JSON.parse(content);

    res.status(200).json(result);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate with AI'
    });
  }
};
