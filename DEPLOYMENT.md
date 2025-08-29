# 🚀 Deployment Guide

## Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm start
```

### 3. Access the application
```
http://localhost:3000
```

**⚠️ Important**: Always access through `http://localhost:3000`, NOT by opening the HTML file directly!

## 🌐 Render Deployment

### 1. Prepare your repository
- Push your code to GitHub/GitLab
- Ensure all files are committed

### 2. Deploy to Render
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your repository
4. Configure the service:
   - **Name**: `smart-calendar`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Port**: `10000`

### 3. Set Environment Variables
In Render dashboard, add these environment variables:
- `CLAUDE_API_KEY`: Your Claude API key
- `NODE_ENV`: `production`
- `PORT`: `10000`

### 4. Deploy
Click "Create Web Service" and wait for deployment to complete.

## 🔧 Environment Variables

### Required
- `CLAUDE_API_KEY`: Your Anthropic Claude API key

### Optional
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3000 for local, 10000 for Render)

## 📁 Files for Deployment

- ✅ `index.html` - Frontend HTML
- ✅ `styles.css` - CSS styles
- ✅ `script.js` - Frontend JavaScript
- ✅ `server.js` - Backend server
- ✅ `package.json` - Dependencies
- ✅ `render.yaml` - Render configuration
- ✅ `env.example` - Environment variables template

## 🚨 Common Issues

### CORS Error
- **Problem**: Frontend can't access backend API
- **Solution**: Access through HTTP server, not file:// protocol

### API Key Error
- **Problem**: Claude API returns 401/403
- **Solution**: Check API key in environment variables

### Port Already in Use
- **Problem**: Server won't start
- **Solution**: Change PORT in environment variables

## 🔒 Security Notes

- Never commit API keys to version control
- Use environment variables for sensitive data
- Consider rate limiting for production use
- Monitor API usage and costs

## 📊 Monitoring

After deployment, monitor:
- Application logs in Render dashboard
- Claude API usage and costs
- Application performance and uptime

## 🆘 Support

If you encounter issues:
1. Check Render deployment logs
2. Verify environment variables
3. Test API endpoints with curl
4. Check browser console for errors 