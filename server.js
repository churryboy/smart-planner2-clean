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
const SYSTEM_PROMPT = ``;

// Study buddy (schoolmate) chat system prompt
const CHAT_SYSTEM_PROMPT = `너는 학습 코치야.
나는 [과목명] 시험에서 100점을 받고 싶어. 현재 시점은 [현재 월]이고, 목표 시험은 [목표 월]에 있어.

1. 장기적으로 해야할 일, 중장기 적으로 해야할 일, 단기적으로 해야할 일 전략을 각각 제시해줘. (예: 장기=6개월 이상, 중기=3개월, 단기=1개월)
2. 각 전략 안에서는 내가 해야 할 주요 활동(개념 정리, 기출, 오답노트 등)을 구체적으로 나눠줘.
3. 마지막에는 이번 달(혹은 이번 주)의 일일 학습 계획을 아주 구체적으로 만들어줘. (데일리 태스크 단위: "9월 10일 → 교과서 1단원 시 읽고 주제 정리 + 문제 20문제")
4. 위 결과물을 만들어내기 위해서 필요한 정보가 있다면, 적극적으로 학생한테 질문해서 수집해

- 마지막 문장은 꼭 다음으로 끝내: "위 계획으로 캘린더에 등록해드릴까요?"`;

// Ensure only one question per assistant turn unless it's prescription stage
function enforceSingleQuestion(text) {
    try {
        if (!text) return text;
        // Allow full content for prescription stage
        if (text.includes('주간 계획') || text.includes('일일 체크리스트') || text.includes('#플래너 등록')) {
            return text;
        }
        // Find the earliest question mark (supports full-width too)
        const q1 = text.indexOf('?');
        const q2 = text.indexOf('？');
        const idx = (q1 === -1) ? q2 : (q2 === -1 ? q1 : Math.min(q1, q2));
        if (idx === -1) return text; // no question found
        const kept = text.slice(0, idx + 1).trim();
        return kept;
    } catch (e) {
        return text;
    }
}

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

    const model = process.env.OPENAI_MODEL || 'gpt-4o';
    const body = JSON.stringify({
        model: model,
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

// Free-form chat endpoint (study buddy tone)
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
        // Subject constraint by preset
        try {
            const presetToSubject = {
                goal_general: '영어',
                goal_study: '국어',
                goal_habit: '수학',
                goal_event: '사탐',
                goal_todo: '과탐',
                goal_academy_homework: '음악'
            };
            const subject = presetToSubject && preset ? presetToSubject[preset] : undefined;
            if (subject) {
                system = `${system}\n\n대화 주제(과목): ${subject}\n- 오직 ${subject} 성적 향상을 위한 계획만 제시해.\n- 다른 과목은 언급하지 마.\n- 질문, 계획, 일일 과업 모두 ${subject} 기준으로 작성.`;
            }
        } catch (_) { /* noop */ }
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
        let responseContent = claudeResponse.content?.[0]?.text || '';
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
        // Subject constraint by preset
        try {
            const presetToSubject = {
                goal_general: '영어',
                goal_study: '국어',
                goal_habit: '수학',
                goal_event: '사탐',
                goal_todo: '과탐',
                goal_academy_homework: '음악'
            };
            const subject = presetToSubject && preset ? presetToSubject[preset] : undefined;
            if (subject) {
                system = `${system}\n\n대화 주제(과목): ${subject}\n- 오직 ${subject} 성적 향상을 위한 계획만 제시해.\n- 다른 과목은 언급하지 마.\n- 질문, 계획, 일일 과업 모두 ${subject} 기준으로 작성.`;
            }
        } catch (_) { /* noop */ }
        const chatMessages = Array.isArray(history) ? history.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.text
        })) : [];
        chatMessages.push({ role: 'user', content: message });

        // Provider selection
        if (provider === 'openai' && !OPENAI_API_KEY) {
            return res.status(500).json({ error: 'OpenAI API key not configured' });
        }
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
        let responseContent = claudeResponse.content?.[0]?.text || '';
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
