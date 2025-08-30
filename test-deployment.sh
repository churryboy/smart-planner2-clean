#!/bin/bash

echo "🔍 Testing Smart Calendar Deployment..."

# Test backend health
echo "📌 Testing backend..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://smart-planner2-clean.onrender.com/health)
if [ "$BACKEND_STATUS" == "200" ]; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is down (HTTP $BACKEND_STATUS)"
fi

# Test CORS
echo "📌 Testing CORS..."
CORS_TEST=$(curl -s -X OPTIONS https://smart-planner2-clean.onrender.com/api/claude \
  -H "Origin: https://smart-planner2-clean.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -w "%{http_code}" -o /dev/null)
  
if [ "$CORS_TEST" == "204" ] || [ "$CORS_TEST" == "200" ]; then
    echo "✅ CORS is configured correctly"
else
    echo "❌ CORS error (HTTP $CORS_TEST)"
fi

# Test frontend
echo "📌 Testing frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://smart-planner2-clean.vercel.app)
if [ "$FRONTEND_STATUS" == "200" ]; then
    echo "✅ Frontend is live"
else
    echo "❌ Frontend is down (HTTP $FRONTEND_STATUS)"
fi

echo ""
echo "🎯 Summary:"
echo "   Frontend: https://smart-planner2-clean.vercel.app"
echo "   Backend: https://smart-planner2-clean.onrender.com"
echo ""
