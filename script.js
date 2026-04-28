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
    
    // Auto-generate button click
    autoGenerateBtn.addEventListener('click', async function() {
        autoGenerateBtn.disabled = true;
        autoGenerateBtn.textContent = 'Generating...';
        
        try {
            await autoGenerateFields(true);
            showSuccessMessage('Fields auto-generated successfully!');
        } catch (error) {
            console.error('Generation error:', error);
            alert('Generation failed: ' + error.message);
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
        
        // Generate Summary
        if (!summaryField.value.trim() || forceOverwrite) {
            summaryField.value = issueDesc + '.';
        }
        
        // Generate Actual Results with varied templates
        if (!actualResultsField.value.trim() || forceOverwrite) {
            actualResultsField.value = generateActualResults(issueDesc, domain, utterance);
        }
        
        // Generate Expected Results
        if (!expectedResultsField.value.trim() || forceOverwrite) {
            expectedResultsField.value = generateExpectedResults(domain, utterance);
        }
    }
    
    // Generate varied Actual Results descriptions
    function generateActualResults(issueDesc, domain, utterance) {
        const templates = [
            `When the user invoked Siri${utterance ? ` with the utterance "${utterance}"` : ''}${domain ? ` in the ${domain} domain` : ''}, ${issueDesc.toLowerCase()}.`,
            `Upon ${utterance ? `requesting "${utterance}"` : 'invoking Siri'}${domain ? ` for ${domain} functionality` : ''}, the system exhibited the following behavior: ${issueDesc.toLowerCase()}.`,
            `The user attempted to ${utterance ? `use Siri to "${utterance}"` : 'interact with Siri'}${domain ? ` within the ${domain} context` : ''}, however ${issueDesc.toLowerCase()}.`,
            `During testing${domain ? ` of ${domain} functionality` : ''}, ${issueDesc.toLowerCase()} when ${utterance ? `the utterance "${utterance}" was used` : 'Siri was invoked'}.`,
            `${issueDesc.charAt(0).toUpperCase() + issueDesc.slice(1).toLowerCase()}${utterance ? ` after the user said "${utterance}"` : ' during the Siri interaction'}${domain ? ` in ${domain}` : ''}.`,
            `While testing${domain ? ` ${domain} features` : ' Siri functionality'}, the user ${utterance ? `spoke "${utterance}"` : 'invoked Siri'} and observed that ${issueDesc.toLowerCase()}.`,
            `The test scenario involved ${utterance ? `speaking "${utterance}"` : 'invoking Siri'}${domain ? ` to access ${domain}` : ''}, which resulted in ${issueDesc.toLowerCase()}.`,
            `In the course of ${domain ? `${domain} ` : ''}testing, ${utterance ? `the command "${utterance}" was issued` : 'Siri was activated'}, leading to ${issueDesc.toLowerCase()}.`,
            `${issueDesc.charAt(0).toUpperCase() + issueDesc.slice(1).toLowerCase()} when ${utterance ? `"${utterance}" was spoken` : 'the user interacted with Siri'}${domain ? ` in the ${domain} domain` : ''}.`,
            `After ${utterance ? `issuing the command "${utterance}"` : 'activating Siri'}${domain ? ` for ${domain}` : ''}, it was observed that ${issueDesc.toLowerCase()}.`,
            `The user ${utterance ? `requested "${utterance}"` : 'engaged with Siri'}${domain ? ` in ${domain}` : ''}, but ${issueDesc.toLowerCase()}.`,
            `Testing revealed that ${issueDesc.toLowerCase()} when ${utterance ? `the utterance "${utterance}" was provided` : 'Siri was invoked'}${domain ? ` in the ${domain} context` : ''}.`,
            `${utterance ? `The utterance "${utterance}" was spoken` : 'Siri was activated'}${domain ? ` to test ${domain} functionality` : ''}, resulting in ${issueDesc.toLowerCase()}.`,
            `During ${domain ? `${domain} ` : ''}interaction, ${utterance ? `saying "${utterance}"` : 'invoking Siri'} caused ${issueDesc.toLowerCase()}.`,
            `The system ${issueDesc.toLowerCase()} following ${utterance ? `the user's request "${utterance}"` : 'Siri invocation'}${domain ? ` in ${domain}` : ''}.`,
            `When attempting to ${utterance ? `"${utterance}"` : 'use Siri'}${domain ? ` for ${domain}` : ''}, the observed behavior was that ${issueDesc.toLowerCase()}.`,
            `${issueDesc.charAt(0).toUpperCase() + issueDesc.slice(1).toLowerCase()} upon ${utterance ? `speaking "${utterance}"` : 'Siri activation'}${domain ? ` within ${domain}` : ''}.`,
            `The defect manifested when ${utterance ? `the user said "${utterance}"` : 'Siri was invoked'}${domain ? ` in the ${domain} domain` : ''}, as ${issueDesc.toLowerCase()}.`,
            `${domain ? `${domain} functionality was tested by ` : 'The user '}${utterance ? `saying "${utterance}"` : 'invoking Siri'}, which led to ${issueDesc.toLowerCase()}.`,
            `Reproduction steps included ${utterance ? `speaking "${utterance}"` : 'activating Siri'}${domain ? ` in ${domain}` : ''}, after which ${issueDesc.toLowerCase()}.`,
            `${issueDesc.charAt(0).toUpperCase() + issueDesc.slice(1).toLowerCase()} was observed when ${utterance ? `"${utterance}" was the input` : 'Siri was engaged'}${domain ? ` for ${domain}` : ''}.`,
            `The issue occurred ${utterance ? `following the utterance "${utterance}"` : 'after Siri invocation'}${domain ? ` in the ${domain} context` : ''}, where ${issueDesc.toLowerCase()}.`,
            `${utterance ? `Speaking "${utterance}"` : 'Invoking Siri'}${domain ? ` to access ${domain}` : ''} resulted in the following: ${issueDesc.toLowerCase()}.`,
            `The user experience was that ${issueDesc.toLowerCase()} when ${utterance ? `requesting "${utterance}"` : 'using Siri'}${domain ? ` in ${domain}` : ''}.`,
            `${domain ? `In the ${domain} domain, ` : ''}${utterance ? `the command "${utterance}" triggered` : 'Siri invocation caused'} ${issueDesc.toLowerCase()}.`
        ];
        
        // Always return a random template regardless of available information
        return templates[Math.floor(Math.random() * templates.length)];
    }
    
    // Generate varied Expected Results descriptions
    function generateExpectedResults(domain, utterance) {
        const templates = [
            `Siri should successfully process the request${utterance ? ` "${utterance}"` : ''} and provide the appropriate${domain ? ` ${domain}` : ''} response without errors or delays.`,
            `The expected behavior is for Siri to correctly interpret${utterance ? ` "${utterance}"` : ' the request'} and deliver the requested${domain ? ` ${domain}` : ''} content promptly.`,
            `Siri should respond${utterance ? ` to "${utterance}"` : ''} by providing accurate${domain ? ` ${domain}` : ''} information in a timely manner.`,
            `Upon receiving${utterance ? ` the utterance "${utterance}"` : ' the request'}, Siri should successfully execute the${domain ? ` ${domain}` : ''} request and return the expected results.`,
            `The system should properly handle${utterance ? ` "${utterance}"` : ' the request'} and present the relevant${domain ? ` ${domain}` : ''} data to the user.`,
            `Siri is expected to recognize${utterance ? ` "${utterance}"` : ' the request'} and fulfill the${domain ? ` ${domain}` : ''} request without issues.`,
            `When the user${utterance ? ` says "${utterance}"` : ' makes a request'}, Siri should seamlessly provide the${domain ? ` ${domain}` : ''} functionality as designed.`,
            `The anticipated outcome is that${utterance ? ` "${utterance}"` : ' the request'} triggers the correct${domain ? ` ${domain}` : ''} response from Siri.`,
            `Siri should interpret${utterance ? ` "${utterance}"` : ' the request'} accurately and execute the corresponding${domain ? ` ${domain}` : ''} action successfully.`,
            `The expected result is for Siri to process${utterance ? ` "${utterance}"` : ' the request'} and deliver${domain ? ` ${domain}` : ''} content without errors.`,
            `Upon hearing${utterance ? ` "${utterance}"` : ' the request'}, Siri should respond with the appropriate${domain ? ` ${domain}` : ''} information immediately.`,
            `Siri should successfully understand${utterance ? ` "${utterance}"` : ' the request'} and provide the requested${domain ? ` ${domain}` : ''} functionality.`,
            `The system is expected to handle${utterance ? ` "${utterance}"` : ' the request'} correctly and return${domain ? ` ${domain}` : ''} results as intended.`,
            `When${utterance ? ` "${utterance}" is spoken` : ' the request is made'}, Siri should execute the${domain ? ` ${domain}` : ''} request and provide accurate results.`,
            `Siri should properly recognize and respond${utterance ? ` to "${utterance}"` : ''} with the correct${domain ? ` ${domain}` : ''} output.`,
            `The expected behavior includes Siri processing${utterance ? ` "${utterance}"` : ' the request'} and delivering${domain ? ` ${domain}` : ''} content efficiently.`,
            `Upon receiving${utterance ? ` "${utterance}"` : ' the request'}, the system should provide${domain ? ` ${domain}` : ''} functionality without delays or errors.`,
            `Siri is expected to successfully interpret${utterance ? ` "${utterance}"` : ' the request'} and present${domain ? ` ${domain}` : ''} information to the user.`,
            `The correct behavior is for Siri to handle${utterance ? ` "${utterance}"` : ' the request'} and execute the${domain ? ` ${domain}` : ''} request seamlessly.`,
            `When the user${utterance ? ` requests "${utterance}"` : ' makes a request'}, Siri should provide${domain ? ` ${domain}` : ''} results in a timely and accurate manner.`,
            `Siri should respond appropriately${utterance ? ` to "${utterance}"` : ''} by delivering the expected${domain ? ` ${domain}` : ''} functionality.`,
            `The system should correctly process${utterance ? ` "${utterance}"` : ' the request'} and return${domain ? ` ${domain}` : ''} content as per specifications.`,
            `Upon${utterance ? ` "${utterance}" being spoken` : ' receiving the request'}, Siri should successfully provide${domain ? ` ${domain}` : ''} information without issues.`,
            `Siri is expected to handle${utterance ? ` "${utterance}"` : ' the request'} efficiently and deliver the requested${domain ? ` ${domain}` : ''} content.`,
            `The anticipated result is that Siri processes${utterance ? ` "${utterance}"` : ' the request'} and provides${domain ? ` ${domain}` : ''} functionality correctly.`
        ];
        
        // Always return a random template regardless of available information
        return templates[Math.floor(Math.random() * templates.length)];
    }
    
    // Generate natural language descriptions using ChatGPT API via Vercel backend
    async function generateWithChatGPT(issueDesc, domain, utterance, apiKey) {
        console.log('=== Starting AI Generation ===');
        console.log('Issue:', issueDesc);
        console.log('Domain:', domain);
        console.log('Utterance:', utterance);
        console.log('API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
        
        // Determine API endpoint based on environment
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
        const apiEndpoint = isLocal
            ? 'http://localhost:3000/api/generate'  // For local development
            : '/api/generate';  // For Vercel deployment
        
        console.log('Using API endpoint:', apiEndpoint);
        console.log('Is local?', isLocal);
        console.log('Current location:', window.location.href);
        
        try {
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

            console.log('Response status:', response.status);
            console.log('Response ok?', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                let errorMessage;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.error || 'API request failed';
                } catch (e) {
                    errorMessage = errorText || 'API request failed';
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('=== AI Response Success ===');
            console.log('Result:', result);
            
            return result;
        } catch (error) {
            console.error('=== AI Generation Error ===');
            console.error('Error type:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            throw error;
        }
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
