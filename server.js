require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 10000; // Use 10000 for both local and production

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
app.use(express.json({ limit: '50mb' })); // Very large payload limit for mobile camera images
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname)));

// Claude API configuration
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
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

사용자가 자연어로 일정이나 이벤트를 설명하거나 이미지(특히 한국 학교 캘린더)를 업로드하면 다음을 수행해야 합니다:
1. 모든 이벤트 세부사항 정확히 추출 (제목, 날짜, 시간, 설명)
2. 날짜와 시간을 정확하게 파악 (특히 한국어 날짜 형식)
3. 학교 행사명을 정확히 인식 (재량휴업일, 중간고사, 기말고사, 수학여행 등)
4. 모든 텍스트를 놓치지 않고 구조화된 응답 생성

여러 일정이 있는 경우 다음 JSON 형식으로 응답하세요:
{
    "success": true,
    "events": [
        {
            "title": "이벤트 제목1",
            "date": "YYYY-MM-DD",
            "time": "HH:MM",
            "description": "이벤트 설명1",
            "allDay": false
        },
        {
            "title": "이벤트 제목2",
            "date": "YYYY-MM-DD",
            "time": null,
            "description": "이벤트 설명2",
            "allDay": true
        }
    ],
    "message": "일정들이 추가되었습니다"
}

단일 일정인 경우 다음 JSON 형식으로 응답하세요:
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

// Counselor chat system prompt
const CHAT_SYSTEM_PROMPT = `You are a school counsellor. Your job is not to take the order, but to consult the user and generate a personalized output.
Use a warm, thoughtful tone of voice with light humor and encouragement.
ALWAYS ask only one question per turn (단 한 가지 질문만). Avoid multi-question sentences. Wait for the user’s reply before asking the next question.
Ask at least 5 questions across the conversation to learn about the user. Ensure the final output will include at least 2 specific, personal elements gathered from the conversation (e.g., subject strengths, schedule constraints, preferred study style).
Keep conversations concise and in natural Korean.
Your very first reply must briefly introduce yourself as the user’s 학교 진로/학습 상담 선생님, then ask just one opening question relevant to the chosen topic.
When you feel you have enough information, ask the closing question exactly as:
"지금까지 얘기나눈 것을 바탕으로 구체적인 플래너를 만들어주려고 하는데 괜찮을까요^^?"`;

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

// OpenAI Chat Completions request helper
async function makeOpenAIChatRequest({ system, messages }) {
    const options = {
        hostname: 'api.openai.com',
        port: 443,
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
    };

    const body = JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.6,
        messages: [
            { role: 'system', content: system },
            ...messages
        ]
    });

    return await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const parsed = JSON.parse(data);
                        const text = parsed.choices?.[0]?.message?.content || '';
                        resolve({ text });
                    } catch (e) {
                        reject(new Error('Invalid OpenAI JSON response'));
                    }
                } else {
                    reject(new Error(`OpenAI API error: ${res.statusCode} - ${data}`));
                }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

// Parse Korean schedule text into JSON format (Enhanced)
function parseKoreanScheduleText(text) {
    console.log('🔧 Attempting to parse Korean schedule text:', text);
    
    const events = [];
    const currentYear = new Date().getFullYear();
    
    // Pattern 1: "9월 10일", "10월 23일" format
    const monthDayPattern = /(\d{1,2})월\s*(\d{1,2})일[:\s]*([^\n•~\-]+)/g;
    const monthDayMatches = [...text.matchAll(monthDayPattern)];
    
    // Pattern 2: "10.27", "12.8" format (month.day)
    const dotPattern = /(\d{1,2})\.(\d{1,2})[:\s]*([^\n•~\-]+)/g;
    const dotMatches = [...text.matchAll(dotPattern)];
    
    // Pattern 3: Date ranges like "10.27~10.29", "12.8~12.10"
    const rangePattern = /(\d{1,2})\.(\d{1,2})\s*[~\-]\s*(\d{1,2})\.(\d{1,2})[:\s]*([^\n•]+)/g;
    const rangeMatches = [...text.matchAll(rangePattern)];
    
    console.log('🔍 Pattern matches found:');
    console.log('- Month-Day format:', monthDayMatches.length);
    console.log('- Dot format:', dotMatches.length);
    console.log('- Range format:', rangeMatches.length);
    
    // Process month-day patterns (9월 10일)
    monthDayMatches.forEach(match => {
        const [, month, day, title] = match;
        const date = `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        
        events.push({
            title: title.trim(),
            date: date,
            time: null,
            description: `이미지에서 추출된 일정: ${title.trim()}`,
            allDay: true
        });
    });
    
    // Process dot patterns (10.27)
    dotMatches.forEach(match => {
        const [, month, day, title] = match;
        const date = `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        
        events.push({
            title: title.trim(),
            date: date,
            time: null,
            description: `이미지에서 추출된 일정: ${title.trim()}`,
            allDay: true
        });
    });
    
    // Process range patterns (10.27~10.29)
    rangeMatches.forEach(match => {
        const [, startMonth, startDay, endMonth, endDay, title] = match;
        
        // Create events for each day in the range
        const startDate = new Date(currentYear, parseInt(startMonth) - 1, parseInt(startDay));
        const endDate = new Date(currentYear, parseInt(endMonth) - 1, parseInt(endDay));
        
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const day = currentDate.getDate().toString().padStart(2, '0');
            const dateStr = `${currentYear}-${month}-${day}`;
            
            events.push({
                title: title.trim(),
                date: dateStr,
                time: null,
                description: `이미지에서 추출된 일정 (${startMonth}.${startDay}~${endMonth}.${endDay}): ${title.trim()}`,
                allDay: true
            });
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
    });
    
    // Remove duplicates based on date and title
    const uniqueEvents = events.filter((event, index, self) => 
        index === self.findIndex(e => e.date === event.date && e.title === event.title)
    );
    
    console.log('📅 Total unique events created:', uniqueEvents.length);
    uniqueEvents.forEach((event, i) => {
        console.log(`  ${i + 1}. ${event.title} - ${event.date}`);
    });
    
    if (uniqueEvents.length > 0) {
        return {
            success: true,
            events: uniqueEvents,
            message: `이미지에서 ${uniqueEvents.length}개의 일정이 추가되었습니다`
        };
    }
    
    return null;
}

// Free-form chat endpoint (counsellor tone)
app.post('/api/claude-chat', async (req, res) => {
    try {
        if (!CLAUDE_API_KEY) {
            return res.status(500).json({ error: 'Claude API key not configured. Please set CLAUDE_API_KEY environment variable.' });
        }
        const { message, preset, history } = req.body || {};
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        // Build messages array with optional history
        const chatMessages = [];
        // Optional topic hint
        let system = CHAT_SYSTEM_PROMPT;
        if (preset) {
            system += `\nTopic preset: ${preset}`;
        }
        if (Array.isArray(history)) {
            history.forEach(m => {
                const role = m.role === 'assistant' ? 'assistant' : 'user';
                chatMessages.push({ role, content: m.text });
            });
        }
        chatMessages.push({ role: 'user', content: message });

        const requestData = JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 800,
            system,
            messages: chatMessages
        });

        const claudeResponse = await makeClaudeRequest(requestData);
        const responseContent = claudeResponse.content?.[0]?.text || '';
        res.json({ success: true, text: responseContent });
    } catch (error) {
        console.error('Claude Chat API error:', error);
        res.status(500).json({ error: 'Failed to get chat response', details: error.message });
    }
});

// Unified chat endpoint: prefers OpenAI when provided, falls back to Claude
app.post('/api/chat', async (req, res) => {
    try {
        const { message, preset, history, provider } = req.body || {};
        if (!message) return res.status(400).json({ error: 'Message is required' });

        // Build system and messages
        let system = CHAT_SYSTEM_PROMPT;
        if (preset) system += `\nTopic preset: ${preset}`;
        const chatMessages = Array.isArray(history) ? history.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.text
        })) : [];
        chatMessages.push({ role: 'user', content: message });

        // Provider selection
        const wantOpenAI = provider === 'openai' || (!provider && OPENAI_API_KEY);
        if (wantOpenAI && OPENAI_API_KEY) {
            const resp = await makeOpenAIChatRequest({ system, messages: chatMessages });
            return res.json({ success: true, text: resp.text });
        }

        if (!CLAUDE_API_KEY) return res.status(500).json({ error: 'No chat provider configured' });

        const requestData = JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 800,
            system,
            messages: chatMessages
        });
        const claudeResponse = await makeClaudeRequest(requestData);
        const responseContent = claudeResponse.content?.[0]?.text || '';
        return res.json({ success: true, text: responseContent });
    } catch (error) {
        console.error('Chat API error:', error);
        return res.status(500).json({ error: 'Failed to get chat response', details: error.message });
    }
});

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
        console.log('- Image data preview:', image.substring(0, 50) + '...');

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

        // Implement retry logic for API overload
        let claudeResponse;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
            try {
                claudeResponse = await makeClaudeRequest(requestData);
                break; // Success, exit retry loop
            } catch (error) {
                retryCount++;
                
                if (error.message.includes('overloaded') || error.message.includes('529')) {
                    console.log(`⏳ Claude API overloaded, retry ${retryCount}/${maxRetries} in ${retryCount * 2}s...`);
                    
                    if (retryCount < maxRetries) {
                        // Exponential backoff: wait 2s, 4s, 6s
                        await new Promise(resolve => setTimeout(resolve, retryCount * 2000));
                        continue;
                    } else {
                        // Max retries reached, use fallback
                        console.log('🔄 Max retries reached, using fallback OCR processing...');
                        throw new Error('FALLBACK_NEEDED');
                    }
                } else {
                    // Other error, don't retry
                    throw error;
                }
            }
        }
        
        console.log('✅ Claude Vision API response received');
        
        // Extract the response content
        const responseContent = claudeResponse.content[0].text;
        
        console.log('📋 Claude extracted text from image:');
        console.log('---START TEXT---');
        console.log(responseContent);
        console.log('---END TEXT---');
        
        try {
            // Parse the JSON response from Claude
            const parsedResponse = JSON.parse(responseContent);
            
            if (parsedResponse.success && (parsedResponse.event || parsedResponse.events)) {
                console.log('✅ Valid JSON response from Claude:', parsedResponse.events ? 'Multiple events' : 'Single event');
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
        
        // Handle Claude API overload and fallback
        if (error.message === 'FALLBACK_NEEDED' || error.message.includes('overloaded') || error.message.includes('529')) {
            console.log('🔄 Using intelligent fallback for image processing...');
            
            // Return a fallback response that triggers client-side processing
            res.json({
                success: false,
                fallback: true,
                error: 'CLAUDE_OVERLOADED',
                message: '이미지를 클라이언트에서 처리합니다...'
            });
        } else {
            res.status(500).json({ 
                error: 'Failed to process image with Claude API',
                details: error.message 
            });
        }
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
