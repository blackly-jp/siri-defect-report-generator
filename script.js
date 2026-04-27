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
    autoGenerateBtn.addEventListener('click', function() {
        autoGenerateFields(true);
        showSuccessMessage('Fields auto-generated successfully!');
    });
    
    // Auto-fill when Issue Description changes (blur event)
    titleDescriptionField.addEventListener('blur', function() {
        autoGenerateFields(false);
    });
    
    function autoGenerateFields(forceOverwrite = false) {
        const issueDesc = titleDescriptionField.value.trim();
        if (!issueDesc) {
            alert('Please enter an Issue Description first.');
            return;
        }
        
        // Auto-fill Summary
        if (!summaryField.value.trim() || forceOverwrite) {
            summaryField.value = issueDesc + '.';
        }
        
        // Auto-fill Actual Results
        if (!actualResultsField.value.trim() || forceOverwrite) {
            actualResultsField.value = issueDesc + '.';
        }
        
        // Auto-fill Expected Results
        if (!expectedResultsField.value.trim() || forceOverwrite) {
            const domain = domainField.value.trim();
            const utterance = utteranceField.value.trim();
            
            if (domain && utterance) {
                expectedResultsField.value = `Siri should successfully process the request "${utterance}" and provide the expected ${domain} response.`;
            } else if (domain) {
                expectedResultsField.value = `Siri should successfully process the ${domain} request and provide the expected response.`;
            } else {
                expectedResultsField.value = `Siri should successfully process the request and provide the expected response.`;
            }
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
