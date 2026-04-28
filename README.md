# 🐛 Siri Defect Report Generator

A web-based application for generating standardized radar reports for Siri issues. This tool helps QA engineers and testers quickly create consistent, well-formatted defect reports following the Apple Siri testing template.

## Features

✨ **Easy-to-use Interface** - Clean, intuitive form with all necessary fields
🤖 **AI-Powered Generation** - Uses ChatGPT to generate professional, natural language descriptions
📋 **Template-based Generation** - Follows the standard Siri defect report format
⏰ **Auto Timestamp** - Automatically generates timestamps in the correct format
📥 **Export Options** - Copy to clipboard or download as .md file
🎨 **Modern Design** - Beautiful gradient UI with responsive layout
♻️ **Reusable** - Create multiple reports in one session

## Getting Started

### Installation

No installation required! Simply open the `index.html` file in any modern web browser.

### Usage

1. **Open the Application**
   - Double-click `index.html` or open it in your browser
   - Alternatively, serve it with a local web server

2. **Fill in the Form**
   - **Report Title Section**: Enter locale, feature area, platform, build, domain, and issue description
   - **Scope of the Task**: Add test case references (optional)
   - **Summary**: Provide a detailed summary of the issue
   - **Steps to Reproduce**: Enter prerequisites, utterance, and timestamp
   - **Results**: Describe actual vs expected results
   - **Configuration**: Device and environment details

3. **Generate Report**
   - Click "Generate Report" button
   - Review the formatted output

4. **Export Report**
   - **Copy to Clipboard**: Click "Copy to Clipboard" to copy the entire report
   - **Download**: Click "Download as .md" to save as a markdown file
   - **Create Another**: Click "Create Another" to generate a new report

## Form Fields

### Required Fields
- **Locale**: Language/region code (e.g., en_US)
- **Feature Area**: Testing area (e.g., LW)
- **Platform**: Testing platform (e.g., CarPlay)
- **Build**: Build version (e.g., 24A333)
- **Domain**: Feature domain (e.g., Music, ChatGPT)
- **Issue Description**: Brief title description
- **Summary**: Detailed issue summary
- **Prerequisite**: Setup requirements
- **Utterance**: Siri command used
- **Actual Results**: What happened
- **Expected Results**: What should happen
- **Device Configuration**: All device/environment fields

### Optional Fields
- **Master Test Case**: Reference to master test case
- **Test Case**: Reference to specific test case
- **Serenity ID**: Serenity tracking ID

## Example Output

```markdown
[en_US][LW][CarPlay][24A333][ChatGPT] Siri's orb was revolving forever when asking ChatGPT to generate a poem of the day
* Scope of the Task
┈┈┈┈┈┈┈┈┈┈┈┈┈
Master Test Case: [Master Test Case ID]
Test Case: [Test Case ID]

[Serenity_ID: N/A]

* Summary
┈┈┈┈┈┈┈┈┈┈┈┈┈
Siri's orb was revolving forever when asking ChatGPT to generate a poem of the day.

...
```

## AI-Powered Generation

### How to Use ChatGPT Integration

1. **Get an OpenAI API Key**
   - Visit https://platform.openai.com/api-keys
   - Create a new API key
   - Copy the key (starts with `sk-`)

2. **Enter Your API Key**
   - Paste your API key in the "OpenAI API Key" field at the top of the form
   - The key is saved locally in your browser for future use

3. **Generate with AI**
   - Fill in the Issue Description, Domain, and Utterance fields
   - Click "Auto-Generate Summary & Results"
   - The AI will generate professional, natural language descriptions for:
     - Summary
     - Actual Results
     - Expected Results

### Benefits of AI Generation

- **Professional Language**: Generates clear, concise technical descriptions
- **Consistency**: Maintains consistent tone across all reports
- **Time-Saving**: Automatically rephrases your issue description into proper report format
- **Natural Flow**: Creates readable, well-structured sentences

### Privacy & Security

- Your API key is stored locally in your browser only
- No data is sent to any server except OpenAI's API
- You can clear your API key anytime by clearing browser data

## Tips

- Use the **Generate Current Timestamp** button to automatically create properly formatted timestamps
- Pre-filled fields contain common default values - modify as needed
- The form remembers your input until you click "Reset Form"
- Downloaded files are automatically named based on the domain (e.g., `siri_chatgpt_bug_radar.md`)
- **AI generation works best** when you provide detailed Issue Description, Domain, and Utterance

## Browser Compatibility

Works with all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## File Structure

```
defect-report-generator/
├── index.html      # Main HTML structure
├── styles.css      # Styling and layout
├── script.js       # Form logic and report generation
└── README.md       # This file
```

## Customization

To customize the template or add new fields:

1. **Add Form Fields**: Edit `index.html` to add new input fields
2. **Update Styling**: Modify `styles.css` for visual changes
3. **Change Template**: Edit the report template in `script.js` (in the `generateReport()` function)

## Support

For issues or questions about the Siri defect report format, refer to the internal testing documentation or contact your QA lead.

## License

Internal tool for Apple Siri QA testing.

---

**Version**: 1.0.0  
**Last Updated**: April 2026
