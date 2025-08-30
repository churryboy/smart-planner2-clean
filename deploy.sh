#!/bin/bash

# Smart Calendar Deployment Script
# This script handles ALL deployments automatically

echo "🚀 Starting Smart Calendar Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project directory!"
    exit 1
fi

# Step 1: Ensure we're on production-clean branch
echo "📌 Step 1: Checking branch..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "production-clean" ]; then
    echo "⚠️  Not on production-clean branch. Switching..."
    git checkout production-clean || exit 1
fi

# Step 2: Pull latest changes
echo "📌 Step 2: Syncing with GitHub..."
git pull origin production-clean || exit 1

# Step 3: Commit any local changes
echo "📌 Step 3: Checking for local changes..."
if [[ -n $(git status -s) ]]; then
    echo "💾 Found local changes. Committing..."
    git add .
    git commit -m "AUTO: Deploy update $(date +%Y-%m-%d_%H:%M:%S)"
fi

# Step 4: Push to GitHub (triggers Render auto-deploy)
echo "📌 Step 4: Pushing to GitHub..."
git push origin production-clean || exit 1
echo "✅ GitHub updated - Render will auto-deploy"

# Step 5: Deploy to Vercel
echo "📌 Step 5: Deploying to Vercel..."
vercel --prod --yes || exit 1

# Step 6: Get the production URLs
echo ""
echo "🎉 Deployment Complete!"
echo "📍 Production URLs:"
echo "   Frontend: https://smart-planner2-clean.vercel.app"
echo "   Backend: https://smart-planner2-clean.onrender.com"
echo ""
echo "⏰ Note: Render backend may take 2-5 minutes to deploy"
echo "🔍 Check status at: https://dashboard.render.com"
echo ""
echo "✅ Done!"
