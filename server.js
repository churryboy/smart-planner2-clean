const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 8080; // Use 8080 for local development

// CORS configuration for production and development
const corsOptions = {
    origin: [
        'https://smart-planner2.vercel.app',
        'https://smart-planner2-churryboys-projects.vercel.app',
        'http://localhost:3000',
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'null' // Allow file:// protocol for local testing
    ],
    credentials: true,
    optionsSuccessStatus: 200
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
    console.error('Please set your Claude API key in the environment variables.');
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
오늘 날짜는 ${new Date().toISOString().split('T')[0]}입니다.

예시:
- "내일 오후 2시에 회의" → 내일 날짜, 14:00
- "다음주 월요일에 출장" → 다음주 월요일 날짜, allDay: true
- "금요일 저녁 7시 저녁약속" → 이번주 금요일, 19:00

중요: 반드시 유효한 JSON 형식으로만 응답하세요.`;

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