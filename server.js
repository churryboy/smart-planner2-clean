require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 8080; // Use 8080 for local development

// CORS configuration for production and development
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            return callback(null, true);
        }
        
        // Define allowed origins
        const allowedOrigins = [
            /^https:\/\/smart-planner2.*\.vercel\.app$/,  // Any Vercel deployment
            /^https:\/\/smart-planner2.*\.onrender\.com$/,  // Any Render deployment
            'https://smart-planner2-clean.onrender.com',  // Specific Render URL
            /^http:\/\/localhost:\d+$/,                   // Any localhost port
            /^http:\/\/127\.0\.0\.1:\d+$/,               // Any 127.0.0.1 port
            /^file:\/\/.*$/                              // File protocol
        ];
        
        // Check if origin matches any allowed pattern
        const isAllowed = allowedOrigins.some(pattern => {
            if (pattern instanceof RegExp) {
                return pattern.test(origin);
            }
            return pattern === origin;
        });
        
        if (isAllowed || origin === 'null') {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Claude API configuration
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_ENDPOINT = 'https://api.anthropic.com/v1/messages';

// Check if API key is configured
if (!CLAUDE_API_KEY) {
    console.error('CLAUDE_API_KEY environment variable is not set!');
    console.error("CLAUDE_API_KEY environment variable is not set!");
    console.error("Please set your Claude API key in the environment variables.");
    console.log("CORS updated for new Vercel domain");
}

// System prompt for calendar input
const SYSTEM_PROMPT = `당신은 사용자가 자연어로 일정을 입력할 때 도움을 주는 스마트 캘린더 어시스턴트입니다.

사용자가 자연어로 일정이나 이벤트를 설명하면 다음을 수행해야 합니다:
1. 이벤트 세부사항 추출 (제목, 날짜, 시간, 설명)
2. 날짜와 시간을 정확하게 파악
3. 구조화된 응답 생성

반드시 다음 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요:
{
    "success": true,
    "event": {
        "title": "이벤트 제목",
        "date": "YYYY-MM-DD",
        "time": "HH:MM",
        "description": "이벤트 설명",
        "allDay": false
    },
    "message": "일정이 추가되었습니다"
}

시간이 명시되지 않은 경우 allDay를 true로 설정하고 time을 null로 설정하세요.
오늘 날짜는 ${(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
})()}입니다.
현재 한국 시간은 ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}입니다.
현재 년도는 ${new Date().getFullYear()}년이므로 모든 날짜는 이 년도 기준으로 계산하세요.

예시:
- "내일 오후 2시에 회의" → 내일 날짜, 14:00
- "9월 10일에 수학시험" → 2024-09-10, allDay: true
- "다음주 월요일에 출장" → 다음주 월요일 날짜, allDay: true
- "금요일 저녁 7시 저녁약속" → 이번주 금요일, 19:00

중요한 날짜 계산 규칙:
- "9월 1일" = 2025-09-01 (현재 년도 기준)
- "내일" = 오늘 날짜 + 1일 (정확히 2025-09-01)
- "모레" = 오늘 날짜 + 2일
- 월/일 형식은 현재 년도(2025) 기준으로 변환
- 과거 월은 다음 년도로 계산하지 말고 현재 년도 우선

중요: 반드시 유효한 JSON 형식으로만 응답하세요.`;

// Shared function to make Claude API requests
async function makeClaudeRequest(requestData) {
    const options = {
        hostname: 'api.anthropic.com',
        port: 443,
        path: '/v1/messages',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Length': Buffer.byteLength(requestData)
        }
    };

    const claudeResponse = await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const parsedData = JSON.parse(data);
                        resolve(parsedData);
                    } catch (e) {
                        reject(new Error('Invalid JSON response'));
                    }
                } else {
                    reject(new Error(`Claude API error: ${res.statusCode} - ${data}`));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.write(requestData);
        req.end();
    });

    return claudeResponse;
}

// Parse Korean schedule text into JSON format
function parseKoreanScheduleText(text) {
    console.log('🔧 Attempting to parse Korean schedule text:', text);
    
    // Look for date patterns like "9월 10일", "9월 23일", etc.
    const datePattern = /(\d{1,2})월\s*(\d{1,2})일[:\s]*([^\n•]+)/g;
    const matches = [...text.matchAll(datePattern)];
    
    console.log('🔍 Found', matches.length, 'schedule items in image');
    
    if (matches.length > 0) {
        // Create multiple events
        const events = matches.map((match, index) => {
            const [, month, day, title] = match;
            const currentYear = new Date().getFullYear();
            
            // Format date as YYYY-MM-DD (ensure local timezone)
            const date = `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            
            return {
                title: title.trim(),
                date: date,
                time: null,
                description: `이미지에서 추출된 일정: ${title.trim()}`,
                allDay: true
            };
        });
        
        console.log('📅 Created events:', events);
        
        return {
            success: true,
            events: events, // Return multiple events
            message: `이미지에서 ${events.length}개의 일정이 추가되었습니다`
        };
    }
    
    return null;
}

// API endpoint for Claude with image (OCR)
app.post('/api/claude-vision', async (req, res) => {
    try {
        // Check if API key is available
        if (!CLAUDE_API_KEY) {
            return res.status(500).json({ 
                error: 'Claude API key not configured. Please set CLAUDE_API_KEY environment variable.' 
            });
        }

        const { message, image, mediaType } = req.body;
        
        if (!message || !image) {
            return res.status(400).json({ error: 'Message and image are required' });
        }
        
        // Use provided media type or default to jpeg
        const imageMediaType = mediaType || 'image/jpeg';
        
        console.log('📷 Vision API called with:');
        console.log('- Message length:', message.length);
        console.log('- Image data length:', image.length);
        console.log('- Media type:', imageMediaType);
        console.log('- API Key configured:', !!CLAUDE_API_KEY);

        const requestData = JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1000,
            system: SYSTEM_PROMPT,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: message
                        },
                        {
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: imageMediaType,
                                data: image
                            }
                        }
                    ]
                }
            ]
        });

        console.log('📷 Sending image to Claude API for OCR...');

        const claudeResponse = await makeClaudeRequest(requestData);
        
        console.log('✅ Claude Vision API response received');
        
        // Extract the response content
        const responseContent = claudeResponse.content[0].text;
        
        try {
            // Parse the JSON response from Claude
            const parsedResponse = JSON.parse(responseContent);
            
            if (parsedResponse.success && parsedResponse.event) {
                res.json(parsedResponse);
            } else {
                throw new Error('Invalid response format from Claude Vision');
            }
        } catch (parseError) {
            console.error('Error parsing Claude Vision response:', parseError);
            console.error('Raw response:', responseContent);
            
            // Try to manually parse the Korean text into JSON format
            try {
                console.log('🔧 Attempting manual parsing of Korean text...');
                const manuallyParsed = parseKoreanScheduleText(responseContent);
                if (manuallyParsed) {
                    console.log('✅ Manually parsed Korean schedule:', JSON.stringify(manuallyParsed, null, 2));
                    res.json(manuallyParsed);
                    return;
                } else {
                    console.log('❌ Manual parsing returned null');
                }
            } catch (manualParseError) {
                console.error('Manual parsing also failed:', manualParseError);
            }
            
            // Fallback response
            res.json({
                success: false,
                error: 'OCR 응답을 처리할 수 없습니다. 다시 시도해주세요.'
            });
        }

    } catch (error) {
        console.error('Claude Vision API error:', error);
        res.status(500).json({ 
            error: 'Failed to process image with Claude API',
            details: error.message 
        });
    }
});

// API endpoint for Claude
app.post('/api/claude', async (req, res) => {
    try {
        // Check if API key is available
        if (!CLAUDE_API_KEY) {
            return res.status(500).json({ 
                error: 'Claude API key not configured. Please set CLAUDE_API_KEY environment variable.' 
            });
        }

        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const requestData = JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1000,
            system: SYSTEM_PROMPT,
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ]
        });

        const claudeResponse = await makeClaudeRequest(requestData);

        // Extract the response content
        const responseContent = claudeResponse.content[0].text;
        
        try {
            // Parse the JSON response from Claude
            const parsedResponse = JSON.parse(responseContent);
            
            if (parsedResponse.success && parsedResponse.event) {
                res.json(parsedResponse);
            } else {
                throw new Error('Invalid response format from Claude');
            }
        } catch (parseError) {
            console.error('Error parsing Claude response:', parseError);
            console.error('Raw response:', responseContent);
            
            // Fallback response
            res.json({
                success: false,
                error: 'AI 응답을 처리할 수 없습니다. 다시 시도해주세요.'
            });
        }
        
    } catch (error) {
        console.error('Claude API error:', error);
        res.status(500).json({ 
            error: 'AI 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.' 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Smart Calendar server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    if (CLAUDE_API_KEY) {
        console.log('Claude API: Configured');
    } else {
        console.log('Claude API: NOT CONFIGURED - Please set CLAUDE_API_KEY');
    }
}); 
