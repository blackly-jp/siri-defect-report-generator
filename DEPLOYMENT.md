# 🚀 Deploying to Vercel

This guide will help you deploy the Siri Defect Report Generator to Vercel with AI functionality.

## Prerequisites

1. A GitHub account
2. A Vercel account (free) - sign up at https://vercel.com
3. Your code pushed to GitHub

## Step-by-Step Deployment

### Step 1: Push Code to GitHub

```bash
cd /Users/yenlychu/defect-report-generator

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Add Vercel backend for AI integration"

# Add remote (replace YOUR_USERNAME with blackly-jp)
git remote add origin https://github.com/blackly-jp/siri-defect-report-generator.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Website (Easiest)

1. Go to https://vercel.com
2. Click "Sign Up" or "Log In"
3. Sign in with GitHub
4. Click "Add New..." → "Project"
5. Import your repository: `blackly-jp/siri-defect-report-generator`
6. Click "Deploy"
7. Wait 1-2 minutes
8. Done! Your app is live at: `https://siri-defect-report-generator.vercel.app`

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd /Users/yenlychu/defect-report-generator
vercel --prod
```

### Step 3: Test Your Deployment

1. Visit your deployed URL: `https://your-app.vercel.app`
2. Enter your OpenAI API key
3. Click "Test API Key" - should show green success
4. Fill in the form and click "Auto-Generate Summary & Results"
5. AI should now work! 🎉

## How It Works

### Architecture

```
Browser (User)
    ↓
Frontend (HTML/CSS/JS)
    ↓
Vercel Serverless Function (/api/generate.js)
    ↓
OpenAI API
    ↓
Response back to user
```

### Files Structure

```
defect-report-generator/
├── api/
│   └── generate.js          # Serverless function (handles AI calls)
├── index.html               # Frontend
├── script.js                # Frontend logic
├── styles.css               # Styling
├── vercel.json              # Vercel configuration
├── package.json             # Project metadata
└── README.md                # Documentation
```

## Features After Deployment

✅ **No CORS Issues** - Backend handles all API calls
✅ **Works for Everyone** - Anyone can use the deployed URL
✅ **Secure** - Each user enters their own API key
✅ **Fast** - Vercel's global CDN
✅ **Free** - Vercel free tier is generous
✅ **Auto-Deploy** - Push to GitHub = auto-deploy

## Sharing with Your Team

Once deployed, share this URL with your team:
```
https://siri-defect-report-generator.vercel.app
```

Each team member:
1. Opens the URL
2. Enters their own OpenAI API key
3. Uses AI-powered generation

## Updating the App

To update after deployment:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push

# Vercel automatically redeploys!
```

## Troubleshooting

### Issue: API calls fail
- Check browser console for errors
- Verify API key is valid
- Check Vercel function logs at https://vercel.com/dashboard

### Issue: Deployment fails
- Ensure all files are committed to GitHub
- Check vercel.json is present
- Verify api/generate.js exists

### Issue: CORS errors
- Should not happen with Vercel backend
- If it does, check the API endpoint in script.js

## Cost

- **Vercel**: Free (100GB bandwidth, unlimited requests)
- **OpenAI API**: Pay per use (each user pays for their own usage)

## Support

For issues:
1. Check Vercel deployment logs
2. Check browser console
3. Verify API key is correct

---

**Your app will be live at:**
`https://siri-defect-report-generator.vercel.app`

(or whatever custom domain Vercel assigns)
