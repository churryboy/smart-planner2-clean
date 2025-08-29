#!/bin/bash

echo "🚀 Starting Smart Calendar..."
echo "📱 Mobile-optimized calendar with Claude AI integration"
echo "🇰🇷 Korean interface ready"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🌐 Starting server on http://localhost:3000"
echo "📖 Open your browser and go to: http://localhost:3000"
echo "⚠️  IMPORTANT: Don't open the HTML file directly!"
echo "   Always access through http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start 