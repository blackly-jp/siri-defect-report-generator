// Defect Report Generator Script

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('defectForm');
    const outputSection = document.getElementById('outputSection');
    const reportOutput = document.getElementById('reportOutput');
    const generateTimestampBtn = document.getElementById('generateTimestamp');
    const copyReportBtn = document.getElementById('copyReport');
    const downloadReportBtn = document.getElementById('downloadReport');
    const createAnotherBtn = document.getElementById('createAnother');
    const resetFormBtn = document.getElementById('resetForm');
    
    // Auto-generate fields based on Issue Description
    const titleDescriptionField = document.getElementById('titleDescription');
    const summaryField = document.getElementById('summary');
    const actualResultsField = document.getElementById('actualResults');
    const expectedResultsField = document.getElementById('expectedResults');
    const domainField = document.getElementById('domain');
    const utteranceField = document.getElementById('utterance');
    const autoGenerateBtn = document.getElementById('autoGenerateBtn');
    const apiKeyField = document.getElementById('apiKey');
    const testApiKeyBtn = document.getElementById('testApiKey');
    const apiKeyStatus = document.getElementById('apiKeyStatus');
    
    // Load API key from localStorage
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
        apiKeyField.value = savedApiKey;
        showApiKeyStatus('✓ API Key loaded from storage', 'success');
    }
    
    // Save API key when it changes
    apiKeyField.addEventListener('blur', function() {
        if (apiKeyField.value.trim()) {
            localStorage.setItem('openai_api_key', apiKeyField.value.trim());
        }
    });
    
    // Test API Key button
    testApiKeyBtn.addEventListener('click', async function() {
        const apiKey = apiKeyField.value.trim();
        
        if (!apiKey) {
            showApiKeyStatus('⚠️ Please enter an API key first', 'error');
            return;
        }
        
        testApiKeyBtn.disabled = true;
        testApiKeyBtn.textContent = 'Testing...';
        showApiKeyStatus('🔄 Testing API key...', 'info');
        
        try {
            const isValid = await testOpenAIKey(apiKey);
            if (isValid) {
                localStorage.setItem('openai_api_key', apiKey);
                showApiKeyStatus('✅ API Key is valid and working!', 'success');
            } else {
                showApiKeyStatus('❌ API Key is invalid or expired', 'error');
            }
        } catch (error) {
            showApiKeyStatus('❌ Error: ' + error.message, 'error');
        } finally {
            testApiKeyBtn.disabled = false;
            testApiKeyBtn.textContent = 'Test API Key';
        }
    });
    
    // Show API key status message
    function showApiKeyStatus(message, type) {
        apiKeyStatus.style.display = 'block';
        apiKeyStatus.textContent = message;
        apiKeyStatus.style.padding = '10px';
        apiKeyStatus.style.borderRadius = '6px';
        apiKeyStatus.style.fontWeight = '600';
        
        if (type === 'success') {
            apiKeyStatus.style.background = '#d4edda';
            apiKeyStatus.style.color = '#155724';
            apiKeyStatus.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            apiKeyStatus.style.background = '#f8d7da';
            apiKeyStatus.style.color = '#721c24';
            apiKeyStatus.style.border = '1px solid #f5c6cb';
        } else {
            apiKeyStatus.style.background = '#d1ecf1';
            apiKeyStatus.style.color = '#0c5460';
            apiKeyStatus.style.border = '1px solid #bee5eb';
        }
    }
    
    // Test OpenAI API Key
    async function testOpenAIKey(apiKey) {
        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            
            return response.ok;
        } catch (error) {
            throw new Error('Network error: ' + error.message);
        }
    }
    
    // Auto-generate button click
    autoGenerateBtn.addEventListener('click', async function() {
        const apiKey = apiKeyField.value.trim();
        
        autoGenerateBtn.disabled = true;
        
        if (apiKey) {
            // Use AI generation if API key is provided
            autoGenerateBtn.textContent = 'Generating with AI...';
            try {
                await autoGenerateFields(true, apiKey);
                showSuccessMessage('Fields auto-generated successfully with AI!');
            } catch (error) {
                console.error('AI generation failed:', error);
                showSuccessMessage('AI failed, using simple generation instead.');
                await autoGenerateFields(true, null);
            }
        } else {
            // Use simple generation if no API key
            autoGenerateBtn.textContent = 'Generating...';
            await autoGenerateFields(true, null);
            showSuccessMessage('Fields auto-generated successfully!');
        }
        
        autoGenerateBtn.disabled = false;
        autoGenerateBtn.textContent = 'Auto-Generate Summary & Results';
    });
    
    // Auto-fill when Issue Description changes (blur event)
    titleDescriptionField.addEventListener('blur', function() {
        autoGenerateFields(false);
    });
    
    async function autoGenerateFields(forceOverwrite = false, apiKey = null) {
        const issueDesc = titleDescriptionField.value.trim();
        if (!issueDesc) {
            alert('Please enter an Issue Description first.');
            return;
        }
        
        const domain = domainField.value.trim();
        const utterance = utteranceField.value.trim();
        
        // If API key is provided, use ChatGPT to generate natural language
        if (apiKey && forceOverwrite) {
            try {
                const results = await generateWithChatGPT(issueDesc, domain, utterance, apiKey);
                
                summaryField.value = results.summary;
                actualResultsField.value = results.actualResults;
                expectedResultsField.value = results.expectedResults;
                
                return;
            } catch (error) {
                console.error('ChatGPT generation failed:', error);
                // Fall back to simple generation
            }
        }
        
        // Simple auto-fill (fallback or when no API key)
        if (!summaryField.value.trim() || forceOverwrite) {
            summaryField.value = issueDesc + '.';
        }
        
        if (!actualResultsField.value.trim() || forceOverwrite) {
            actualResultsField.value = issueDesc + '.';
        }
        
        if (!expectedResultsField.value.trim() || forceOverwrite) {
            if (domain && utterance) {
                expectedResultsField.value = `Siri should successfully process the request "${utterance}" and provide the expected ${domain} response.`;
            } else if (domain) {
                expectedResultsField.value = `Siri should successfully process the ${domain} request and provide the expected response.`;
            } else {
                expectedResultsField.value = `Siri should successfully process the request and provide the expected response.`;
            }
        }
    }
    
    // Generate natural language descriptions using ChatGPT API via Vercel backend
    async function generateWithChatGPT(issueDesc, domain, utterance, apiKey) {
        console.log('Calling AI API with:', { issueDesc, domain, utterance });
        
        // Determine API endpoint based on environment
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
        const apiEndpoint = isLocal
            ? 'http://localhost:3000/api/generate'  // For local development
            : '/api/generate';  // For Vercel deployment
        
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                issueDesc,
                domain,
                utterance,
                apiKey
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('API Error:', error);
            throw new Error(error.error || 'API request failed');
        }

        const result = await response.json();
        console.log('AI Response:', result);
        
        return result;
    }

    // Generate timestamp in the required format
    generateTimestampBtn.addEventListener('click', function() {
        const now = new Date();
        
        // Format: YYYY-MM-DD HH:MM:SS.microseconds+timezone
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
        const microseconds = milliseconds + '000'; // Simulate microseconds
        
        // Get timezone offset
        const offset = -now.getTimezoneOffset();
        const offsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
        const offsetMinutes = String(Math.abs(offset) % 60).padStart(2, '0');
        const offsetSign = offset >= 0 ? '+' : '-';
        const timezone = `${offsetSign}${offsetHours}${offsetMinutes}`;
        
        const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}${timezone}`;
        document.getElementById('timestamp').value = timestamp;
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generateReport();
    });

    // Reset form
    resetFormBtn.addEventListener('click', function() {
        form.reset();
        outputSection.style.display = 'none';
    });

    // Copy report to clipboard
    copyReportBtn.addEventListener('click', function() {
        const reportText = reportOutput.textContent;
        navigator.clipboard.writeText(reportText).then(function() {
            showSuccessMessage('Report copied to clipboard!');
        }).catch(function(err) {
            alert('Failed to copy: ' + err);
        });
    });

    // Download report as markdown file
    downloadReportBtn.addEventListener('click', function() {
        const reportText = reportOutput.textContent;
        const domain = document.getElementById('domain').value.toLowerCase().replace(/\s+/g, '_');
        const filename = `siri_${domain}_bug_radar.md`;
        
        const blob = new Blob([reportText], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showSuccessMessage('Report downloaded as ' + filename);
    });

    // Create another report
    createAnotherBtn.addEventListener('click', function() {
        outputSection.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Generate the report
    function generateReport() {
        // Get all form values
        const locale = document.getElementById('locale').value;
        const feature = document.getElementById('feature').value;
        const platform = document.getElementById('platform').value;
        const build = document.getElementById('build').value;
        const domain = document.getElementById('domain').value;
        const titleDescription = document.getElementById('titleDescription').value;
        
        const masterTestCase = document.getElementById('masterTestCase').value || '[Master Test Case ID]';
        const testCase = document.getElementById('testCase').value || '[Test Case ID]';
        const serenityId = document.getElementById('serenityId').value;
        
        const summary = document.getElementById('summary').value;
        const prerequisite = document.getElementById('prerequisite').value;
        const utterance = document.getElementById('utterance').value;
        const timestamp = document.getElementById('timestamp').value;
        
        const actualResults = document.getElementById('actualResults').value;
        const expectedResults = document.getElementById('expectedResults').value;
        
        const deviceModel = document.getElementById('deviceModel').value;
        const clientBuild = document.getElementById('clientBuild').value;
        const server = document.getElementById('server').value;
        const deviceLanguage = document.getElementById('deviceLanguage').value;
        const region = document.getElementById('region').value;
        const actualLocation = document.getElementById('actualLocation').value;
        const simulatedLocation = document.getElementById('simulatedLocation').value;

        // Generate the report
        const report = `[${locale}][${feature}][${platform}][${build}][${domain}] ${titleDescription}
* Scope of the Task
┈┈┈┈┈┈┈┈┈┈┈┈┈
Master Test Case: ${masterTestCase}
Test Case: ${testCase}

[Serenity_ID: ${serenityId}]

* Summary
┈┈┈┈┈┈┈┈┈┈┈┈┈
${summary}

* Locales Affected
┈┈┈┈┈┈┈┈┈┈┈┈┈
${locale}

* Expected Domain
┈┈┈┈┈┈┈┈┈┈┈┈┈
${domain}

* Steps to Reproduce
┈┈┈┈┈┈┈┈┈┈┈┈┈
Prerequisite Instruction & Context: ${prerequisite}

Step:
1. Invoke Siri in Display-driven Mode:
2. Utterance: "${utterance}"
Timestamp: ${timestamp}

* Actual Results
┈┈┈┈┈┈┈┈┈┈┈┈┈
${actualResults}

* Expected Results
┈┈┈┈┈┈┈┈┈┈┈┈┈
${expectedResults}

* Configuration and Setup
┈┈┈┈┈┈┈┈┈┈┈┈┈
SSH root
ffctl IntelligenceFlow/Linwood=on
ffctl IntelligenceFlow/Campo=on
ffctl IntelligenceFlow/PCCAsDefault=on

login -f mobile defaults write com.apple.intelligenceflow Coupled_Server_FullPlannerModelBundleIdentifier "com.apple.fm.language.instruct_server_v2.lw_planner_v4"
login -f mobile defaults write com.apple.intelligenceflow skimmerActive -bool false
login -f mobile defaults write com.apple.intelligenceflow pccAgentErrorHandOffEnabled -bool false
reboot

Confirm planner_v4 is returned 

Locale: ${locale}
Device Language: ${deviceLanguage}
Region: ${region}
Device Model: ${deviceModel}
Client Build: ${clientBuild}
Server: ${server}
Actual Location: ${actualLocation}
Simulated Location: ${simulatedLocation}`;

        // Display the report
        reportOutput.textContent = report;
        outputSection.style.display = 'block';
        
        // Scroll to output
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Show success message
    function showSuccessMessage(message) {
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `<span>✓</span> ${message}`;
        
        outputSection.insertBefore(successDiv, outputSection.firstChild);
        
        setTimeout(function() {
            successDiv.style.opacity = '0';
            setTimeout(function() {
                successDiv.remove();
            }, 300);
        }, 3000);
    }

    // Auto-generate timestamp on page load
    const timestampField = document.getElementById('timestamp');
    if (!timestampField.value) {
        generateTimestampBtn.click();
    }
});
