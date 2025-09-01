// INTELLIGENT EVENT ANALYZER
// This provides much more relevant todo recommendations based on event context

function intelligentAnalyzeEvent(event) {
    const title = event.title.toLowerCase();
    const description = (event.description || '').toLowerCase();
    const fullText = `${title} ${description}`;
    
    console.log('🧠 Intelligent Analysis:', { title, description });
    
    // Social Events
    if (containsKeywords(fullText, ['친구', 'friends', '만나', 'meet', '모임', 'gathering', '약속'])) {
        if (containsKeywords(fullText, ['생일', 'birthday', '파티', 'party'])) {
            return personalizedTodoRecommendations.birthday_party;
        }
        return personalizedTodoRecommendations.meeting_friends;
    }
    
    // Dating & Romance
    if (containsKeywords(fullText, ['데이트', 'date', '여자친구', '남자친구', 'girlfriend', 'boyfriend', '애인'])) {
        return personalizedTodoRecommendations.date_event;
    }
    
    // Academic - Subject Specific
    if (containsKeywords(fullText, ['시험', 'test', 'exam', '평가', '고사'])) {
        // Math
        if (containsKeywords(fullText, ['수학', 'math', '산수', '대수', '기하', '미적분'])) {
            return personalizedTodoRecommendations.math_test;
        }
        // English
        if (containsKeywords(fullText, ['영어', 'english', '영문', '토익', 'toeic', '토플'])) {
            return personalizedTodoRecommendations.english_test;
        }
        // Science
        if (containsKeywords(fullText, ['과학', 'science', '물리', '화학', '생물', '지구과학'])) {
            return personalizedTodoRecommendations.science_test;
        }
        // Korean
        if (containsKeywords(fullText, ['국어', 'korean', '문학', '독서', '작문'])) {
            return personalizedTodoRecommendations.korean_test || personalizedTodoRecommendations.exam;
        }
        // History/Social Studies
        if (containsKeywords(fullText, ['역사', 'history', '사회', 'social', '지리', '경제'])) {
            return personalizedTodoRecommendations.history_test || personalizedTodoRecommendations.exam;
        }
        // General exam
        return personalizedTodoRecommendations.exam;
    }
    
    // Sports & Exercise
    if (containsKeywords(fullText, ['운동', 'sports', 'exercise', '축구', '농구', '야구', '테니스', '수영', '체육', '경기', 'game', 'match'])) {
        return personalizedTodoRecommendations.sports_event;
    }
    
    // Job & Career
    if (containsKeywords(fullText, ['면접', 'interview', '취업', 'job', '인턴', 'intern', '채용', '회사'])) {
        return personalizedTodoRecommendations.job_interview;
    }
    
    // Travel
    if (containsKeywords(fullText, ['여행', 'travel', 'trip', '휴가', 'vacation', '출장', 'business trip'])) {
        return personalizedTodoRecommendations.travel;
    }
    
    // Health & Medical
    if (containsKeywords(fullText, ['병원', 'hospital', '의사', 'doctor', '진료', '검사', 'checkup', '치과', '건강'])) {
        return personalizedTodoRecommendations.hospital_appointment;
    }
    
    // Family
    if (containsKeywords(fullText, ['가족', 'family', '부모님', '집안', '친척', '명절', '추석', '설날'])) {
        return personalizedTodoRecommendations.family_gathering;
    }
    
    // School Events (non-exam)
    if (containsKeywords(fullText, ['학교', 'school', '수업', 'class', '발표', 'presentation'])) {
        if (containsKeywords(fullText, ['프로젝트', 'project', '과제', 'assignment'])) {
            return personalizedTodoRecommendations.project;
        }
        if (containsKeywords(fullText, ['체육대회', '축제', 'festival', '행사'])) {
            return personalizedTodoRecommendations.school_event;
        }
        if (containsKeywords(fullText, ['수학여행', 'field trip', '견학', '체험'])) {
            return personalizedTodoRecommendations.field_trip;
        }
    }
    
    // Work & Meetings
    if (containsKeywords(fullText, ['회의', 'meeting', '미팅', '업무', 'work', '직장', '사무실'])) {
        return personalizedTodoRecommendations.work_meeting || personalizedTodoRecommendations.default;
    }
    
    // Shopping & Errands
    if (containsKeywords(fullText, ['쇼핑', 'shopping', '장보기', '마트', '백화점', '구매'])) {
        return personalizedTodoRecommendations.shopping || personalizedTodoRecommendations.default;
    }
    
    // Entertainment
    if (containsKeywords(fullText, ['영화', 'movie', '콘서트', 'concert', '공연', '전시', '문화'])) {
        return personalizedTodoRecommendations.entertainment || personalizedTodoRecommendations.meeting_friends;
    }
    
    // Default - but more intelligent
    console.log('📌 Using default todos, but these are more relevant than before');
    return personalizedTodoRecommendations.default;
} 