# 🚀 Full-Stack Deployment Guide

## Overview
This is a **full-stack application** with:
- **Frontend**: React-like calendar app (deployed on Vercel)
- **Backend**: Node.js server with Claude AI integration (deployed on Render)
- **Database**: Local storage (events stored in browser)

## 🏗️ Architecture

```
Frontend (Vercel) ←→ Backend (Render) ←→ Claude AI API
     ↓                    ↓
  Calendar UI         Event Processing
  Event Display       AI Analysis
  User Interface      Data Storage
```

## 📋 Prerequisites

### 1. Claude API Key
- Get your API key from [Anthropic Console](https://console.anthropic.com/)
- You'll need this for the backend deployment

### 2. Render Account
- Sign up at [render.com](https://render.com)
- Free tier available for testing

### 3. Vercel Account
- Already set up ✅

## 🚀 Deployment Steps

### Step 1: Deploy Backend to Render

1. **Push to GitHub** (if not already done):
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin master
   ```

2. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**:
   - **Name**: `smart-calendar`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Port**: `10000`

4. **Set Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `CLAUDE_API_KEY`: `your_actual_claude_api_key_here`

5. **Deploy**: Click "Create Web Service"

### Step 2: Update Frontend API URL

The frontend is already configured to use:
- **Localhost**: `/api/claude` (for development)
- **Production**: `https://smart-calendar.onrender.com/api/claude`

### Step 3: Deploy Frontend to Vercel

1. **Push changes**:
   ```bash
   git push origin master
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

## 🔧 Configuration Files

### `render.yaml`
```yaml
services:
  - type: web
    name: smart-calendar
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: CLAUDE_API_KEY
        sync: false  # Set manually in Render dashboard
    healthCheckPath: /health
```

### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    },
    {
      "src": "*.css",
      "use": "@vercel/static"
    },
    {
      "src": "*.js",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/styles.css",
      "dest": "/styles.css"
    },
    {
      "src": "/script.js",
      "dest": "/script.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🧪 Testing

### Backend Health Check
```bash
curl https://smart-calendar.onrender.com/health
```

### Frontend Test
1. Visit your Vercel URL
2. Try adding an event: "내일 오후 2시에 회의가 있어"
3. Check if it appears on the calendar

## 🐛 Troubleshooting

### Backend Issues
- **Check Render logs** for errors
- **Verify environment variables** are set correctly
- **Check Claude API key** is valid

### Frontend Issues
- **Check browser console** for API errors
- **Verify backend URL** is correct
- **Check CORS** settings

### Common Errors
- **405 Method Not Allowed**: Backend not deployed or wrong URL
- **API request failed**: Backend down or API key invalid
- **CORS errors**: Backend CORS configuration

## 🔄 Development Workflow

1. **Local Development**:
   ```bash
   npm install
   npm run dev
   # Frontend: http://localhost:3000
   # Backend: http://localhost:3000/api/claude
   ```

2. **Deploy Backend**:
   ```bash
   git push origin master
   # Render auto-deploys
   ```

3. **Deploy Frontend**:
   ```bash
   vercel --prod
   ```

## 📱 Features

- ✅ **Korean Calendar Interface**
- ✅ **AI-Powered Event Creation**
- ✅ **Real-time Claude AI Integration**
- ✅ **Responsive Mobile Design**
- ✅ **Event Management**
- ✅ **Todo Recommendations**

## 🌐 URLs

- **Frontend**: `https://smart-planner2.vercel.app`
- **Backend**: `https://smart-calendar.onrender.com`
- **API Endpoint**: `https://smart-calendar.onrender.com/api/claude`

## 🔐 Security Notes

- **Claude API Key**: Never commit to git
- **Environment Variables**: Set in Render dashboard
- **CORS**: Configured for production domains
- **Health Check**: Available at `/health` endpoint

---

**Need Help?** Check the Render logs and Vercel deployment status for debugging information. 