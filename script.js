// Global variables
let currentDate = new Date();
let selectedDate = new Date();
let events = [];
let todos = [];
let currentEventForTodos = null;
let preventTodoModalReopen = false;

// Korean month names
const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

// HIGHLY PERSONALIZED TODO RECOMMENDATIONS
const todoRecommendations = {
    // Social Events - Meeting Friends
    meeting_friends: [
        {
            id: 'friends_1',
            title: '장소 정하기',
            description: '분위기 좋고 대화하기 편한 카페나 레스토랑 찾기',
            category: 'planning',
            daysBefore: 3
        },
        {
            id: 'friends_2',
            title: '예약하기',
            description: '인원수에 맞춰 미리 예약하기',
            category: 'coordination',
            daysBefore: 2
        },
        {
            id: 'friends_3',
            title: '친구들에게 시간/장소 공유',
            description: '카톡으로 만날 시간과 장소 정확히 알리기',
            category: 'communication',
            daysBefore: 1
        },
        {
            id: 'friends_4',
            title: '교통편 확인',
            description: '대중교통 시간이나 주차 가능 여부 확인',
            category: 'logistical',
            daysBefore: 1
        }
    ],
    
    // Dating & Romance
    date_event: [
        {
            id: 'date_1',
            title: '데이트 코스 계획',
            description: '식사, 영화, 산책 등 하루 동선 짜기',
            category: 'planning',
            daysBefore: 3
        },
        {
            id: 'date_2',
            title: '레스토랑 예약',
            description: '분위기 좋은 곳으로 미리 예약하기',
            category: 'coordination',
            daysBefore: 2
        },
        {
            id: 'date_3',
            title: '날씨 확인',
            description: '야외 활동이 있다면 날씨 체크하기',
            category: 'information',
            daysBefore: 1
        },
        {
            id: 'date_4',
            title: '옷 준비하기',
            description: '깔끔하고 상황에 맞는 옷 준비',
            category: 'preparation',
            daysBefore: 1
        }
    ],
    
    // Birthday & Parties
    birthday_party: [
        {
            id: 'bday_1',
            title: '선물 준비하기',
            description: '받는 사람이 좋아할 만한 선물 고르기',
            category: 'preparation',
            daysBefore: 3
        },
        {
            id: 'bday_2',
            title: '케이크 주문/준비',
            description: '생일 케이크나 특별한 디저트 준비',
            category: 'coordination',
            daysBefore: 2
        },
        {
            id: 'bday_3',
            title: '파티 장소 꾸미기',
            description: '풍선, 가랜드 등 파티 장식 준비',
            category: 'preparation',
            daysBefore: 1
        },
        {
            id: 'bday_4',
            title: '음식/음료 준비',
            description: '파티에 필요한 음식과 음료 준비',
            category: 'logistical',
            daysBefore: 1
        }
    ],
    
    // Study & Academic (Subject-Specific)
    math_test: [
        {
            id: 'math_1',
            title: '공식 정리하기',
            description: '시험 범위의 중요 공식들 한 장에 정리',
            category: 'study',
            daysBefore: 5
        },
        {
            id: 'math_2',
            title: '계산 실수 체크리스트',
            description: '자주 하는 실수들 정리해서 주의하기',
            category: 'review',
            daysBefore: 3
        },
        {
            id: 'math_3',
            title: '응용문제 연습',
            description: '교과서와 문제집의 고난도 문제 풀기',
            category: 'practice',
            daysBefore: 2
        },
        {
            id: 'math_4',
            title: '계산기 확인',
            description: '허용되면 계산기 배터리와 작동 확인',
            category: 'logistical',
            daysBefore: 1
        }
    ],
    
    english_test: [
        {
            id: 'eng_1',
            title: '단어장 만들기',
            description: '시험 범위 단어와 뜻 정리하기',
            category: 'study',
            daysBefore: 5
        },
        {
            id: 'eng_2',
            title: '문법 규칙 정리',
            description: '헷갈리는 문법 포인트 예문과 함께 정리',
            category: 'study',
            daysBefore: 4
        },
        {
            id: 'eng_3',
            title: '리스닝 연습',
            description: '교재 MP3로 듣기 연습하기',
            category: 'practice',
            daysBefore: 2
        },
        {
            id: 'eng_4',
            title: '작문 연습',
            description: '자주 나오는 주제로 영작 연습',
            category: 'practice',
            daysBefore: 2
        }
    ],
    
    science_test: [
        {
            id: 'sci_1',
            title: '실험 과정 정리',
            description: '중요 실험의 과정과 결과 정리하기',
            category: 'study',
            daysBefore: 5
        },
        {
            id: 'sci_2',
            title: '그림/도표 암기',
            description: '교과서의 중요 그림과 도표 그려보기',
            category: 'practice',
            daysBefore: 3
        },
        {
            id: 'sci_3',
            title: '용어 정리',
            description: '과학 용어와 정확한 정의 암기',
            category: 'study',
            daysBefore: 2
        }
    ],
    
    // School exam related todos
    exam: [
        {
            id: 'exam_1',
            title: '시험 범위 정리',
            description: '시험에 나올 단원과 핵심 개념 정리',
            category: 'study',
            daysBefore: 7
        },
        {
            id: 'exam_2',
            title: '오답 노트 작성',
            description: '이전 시험에서 틀린 문제들 복습',
            category: 'review',
            daysBefore: 5
        },
        {
            id: 'exam_3',
            title: '모의고사 풀기',
            description: '실제 시험과 유사한 환경에서 연습',
            category: 'practice',
            daysBefore: 3
        },
        {
            id: 'exam_4',
            title: '시험 시간표 확인',
            description: '시험 일정, 교실, 좌석번호 확인',
            category: 'information',
            daysBefore: 1
        },
        {
            id: 'exam_5',
            title: '시험용품 준비',
            description: '연필, 지우개, 자, 계산기 등 준비',
            category: 'logistical',
            daysBefore: 1
        },
        {
            id: 'exam_6',
            title: '수면 및 식사 조절',
            description: '시험 전날 충분한 수면과 아침 식사',
            category: 'health',
            daysBefore: 1
        }
    ],
    
    // School project related todos
    project: [
        {
            id: 'project_1',
            title: '프로젝트 주제 선정',
            description: '관심 있는 주제와 관련 자료 조사',
            category: 'research',
            daysBefore: 14
        },
        {
            id: 'project_2',
            title: '계획서 작성',
            description: '프로젝트 일정과 진행 계획 수립',
            category: 'planning',
            daysBefore: 10
        },
        {
            id: 'project_3',
            title: '자료 수집 및 정리',
            description: '도서관, 인터넷 등에서 관련 자료 찾기',
            category: 'research',
            daysBefore: 7
        },
        {
            id: 'project_4',
            title: '초안 작성',
            description: '프로젝트 내용의 첫 번째 버전 작성',
            category: 'writing',
            daysBefore: 5
        },
        {
            id: 'project_5',
            title: '발표 자료 제작',
            description: 'PPT나 포스터 등 발표용 자료 만들기',
            category: 'preparation',
            daysBefore: 3
        },
        {
            id: 'project_6',
            title: '발표 연습',
            description: '시간 배분과 말투 연습',
            category: 'practice',
            daysBefore: 2
        }
    ],
    
    // School event related todos
    school_event: [
        {
            id: 'school_event_1',
            title: '참가 신청서 제출',
            description: '학교 행사 참가 신청서 작성 및 제출',
            category: 'administration',
            daysBefore: 7
        },
        {
            id: 'school_event_2',
            title: '참가비 납부',
            description: '행사 참가비를 학교에 납부',
            category: 'administration',
            daysBefore: 5
        },
        {
            id: 'school_event_3',
            title: '준비물 및 복장',
            description: '행사에 필요한 준비물과 복장 준비',
            category: 'logistical',
            daysBefore: 2
        },
        {
            id: 'school_event_4',
            title: '집합 시간 및 장소',
            description: '행사 당일 집합 시간과 장소 확인',
            category: 'information',
            daysBefore: 1
        }
    ],
    
    // Club/After-school activity todos
    club: [
        {
            id: 'club_1',
            title: '동아리 활동 계획',
            description: '이번 주 동아리 활동 내용과 준비사항',
            category: 'planning',
            daysBefore: 3
        },
        {
            id: 'club_2',
            title: '활동 준비물',
            description: '동아리 활동에 필요한 도구나 재료 준비',
            category: 'logistical',
            daysBefore: 2
        },
        {
            id: 'club_3',
            title: '동아리실 예약',
            description: '활동할 공간과 장비 예약',
            category: 'coordination',
            daysBefore: 1
        },
        {
            id: 'club_4',
            title: '참가자 명단 확인',
            description: '참가할 동아리원들과 시간 조율',
            category: 'coordination',
            daysBefore: 1
        }
    ],
    
    // Homework/Assignment todos
    homework: [
        {
            id: 'homework_1',
            title: '과제 내용 파악',
            description: '과제 요구사항과 제출 기한 확인',
            category: 'understanding',
            daysBefore: 5
        },
        {
            id: 'homework_2',
            title: '참고 자료 찾기',
            description: '과제에 필요한 책, 논문, 인터넷 자료 찾기',
            category: 'research',
            daysBefore: 3
        },
        {
            id: 'homework_3',
            title: '과제 작성',
            description: '계획에 따라 과제 내용 작성',
            category: 'writing',
            daysBefore: 2
        },
        {
            id: 'homework_4',
            title: '최종 점검',
            description: '오타, 문법, 내용 완성도 최종 점검',
            category: 'review',
            daysBefore: 1
        }
    ],
    
    // School trip/Field trip todos
    field_trip: [
        {
            id: 'field_trip_1',
            title: '참가 동의서 제출',
            description: '부모님 서명이 필요한 참가 동의서 제출',
            category: 'administration',
            daysBefore: 7
        },
        {
            id: 'field_trip_2',
            title: '준비물 목록 확인',
            description: '학교에서 제공하는 준비물 목록 점검',
            category: 'logistical',
            daysBefore: 5
        },
        {
            id: 'field_trip_3',
            title: '개인 준비물',
            description: '간식, 물, 돈, 개인용품 등 준비',
            category: 'logistical',
            daysBefore: 2
        },
        {
            id: 'field_trip_4',
            title: '집합 시간 및 복장',
            description: '출발 시간과 편한 복장으로 준비',
            category: 'information',
            daysBefore: 1
        }
    ],
    
    // Study group/Peer study todos
    study_group: [
        {
            id: 'study_group_1',
            title: '스터디 그룹 모임 계획',
            description: '함께 공부할 친구들과 시간, 장소 조율',
            category: 'coordination',
            daysBefore: 3
        },
        {
            id: 'study_group_2',
            title: '공부할 내용 정리',
            description: '스터디에서 다룰 문제나 개념 정리',
            category: 'preparation',
            daysBefore: 2
        },
        {
            id: 'study_group_3',
            title: '질문 목록 작성',
            description: '이해가 안 되는 부분 질문 목록 만들기',
            category: 'preparation',
            daysBefore: 1
        },
        {
            id: 'study_group_4',
            title: '학습 도구 준비',
            description: '노트, 교재, 계산기 등 준비',
            category: 'logistical',
            daysBefore: 0
        }
    ],
    
    // Social Events - Meeting Friends
    meeting_friends: [
        {
            id: 'friends_1',
            title: '장소 정하기',
            description: '분위기 좋고 대화하기 편한 카페나 레스토랑 찾기',
            category: 'planning',
            daysBefore: 3
        },
        {
            id: 'friends_2',
            title: '예약하기',
            description: '인원수에 맞춰 미리 예약하기',
            category: 'coordination',
            daysBefore: 2
        },
        {
            id: 'friends_3',
            title: '친구들에게 시간/장소 공유',
            description: '카톡으로 만날 시간과 장소 정확히 알리기',
            category: 'communication',
            daysBefore: 1
        },
        {
            id: 'friends_4',
            title: '교통편 확인',
            description: '대중교통 시간이나 주차 가능 여부 확인',
            category: 'logistical',
            daysBefore: 1
        }
    ],
    
    // Dating & Romance
    date_event: [
        {
            id: 'date_1',
            title: '데이트 코스 계획',
            description: '식사, 영화, 산책 등 하루 동선 짜기',
            category: 'planning',
            daysBefore: 3
        },
        {
            id: 'date_2',
            title: '레스토랑 예약',
            description: '분위기 좋은 곳으로 미리 예약하기',
            category: 'coordination',
            daysBefore: 2
        },
        {
            id: 'date_3',
            title: '날씨 확인',
            description: '야외 활동이 있다면 날씨 체크하기',
            category: 'information',
            daysBefore: 1
        },
        {
            id: 'date_4',
            title: '옷 준비하기',
            description: '깔끔하고 상황에 맞는 옷 준비',
            category: 'preparation',
            daysBefore: 1
        }
    ],
    
    // Birthday & Parties
    birthday_party: [
        {
            id: 'bday_1',
            title: '선물 준비하기',
            description: '받는 사람이 좋아할 만한 선물 고르기',
            category: 'preparation',
            daysBefore: 3
        },
        {
            id: 'bday_2',
            title: '케이크 주문/준비',
            description: '생일 케이크나 특별한 디저트 준비',
            category: 'coordination',
            daysBefore: 2
        },
        {
            id: 'bday_3',
            title: '파티 장소 꾸미기',
            description: '풍선, 가랜드 등 파티 장식 준비',
            category: 'preparation',
            daysBefore: 1
        },
        {
            id: 'bday_4',
            title: '음식/음료 준비',
            description: '파티에 필요한 음식과 음료 준비',
            category: 'logistical',
            daysBefore: 1
        }
    ],
    
    // Sports & Physical Activities
    sports_event: [
        {
            id: 'sport_1',
            title: '운동복/장비 준비',
            description: '운동화, 운동복, 필요한 장비 체크',
            category: 'preparation',
            daysBefore: 1
        },
        {
            id: 'sport_2',
            title: '몸 컨디션 조절',
            description: '무리한 운동 피하고 스트레칭하기',
            category: 'health',
            daysBefore: 1
        },
        {
            id: 'sport_3',
            title: '음료/간식 준비',
            description: '물, 스포츠음료, 에너지바 준비',
            category: 'logistical',
            daysBefore: 1
        },
        {
            id: 'sport_4',
            title: '장소/시간 확인',
            description: '운동 장소와 집합 시간 재확인',
            category: 'information',
            daysBefore: 1
        }
    ],
    
    // Job & Career
    job_interview: [
        {
            id: 'job_1',
            title: '회사 조사하기',
            description: '회사 홈페이지, 뉴스, 비전 등 조사',
            category: 'research',
            daysBefore: 3
        },
        {
            id: 'job_2',
            title: '예상 질문 준비',
            description: '자기소개, 지원동기 등 답변 준비',
            category: 'preparation',
            daysBefore: 2
        },
        {
            id: 'job_3',
            title: '면접 복장 준비',
            description: '깔끔한 정장이나 비즈니스 캐주얼 준비',
            category: 'preparation',
            daysBefore: 1
        },
        {
            id: 'job_4',
            title: '서류/포트폴리오',
            description: '이력서, 자격증 사본 등 필요 서류 준비',
            category: 'logistical',
            daysBefore: 1
        },
        {
            id: 'job_5',
            title: '면접장 위치 확인',
            description: '위치와 교통편, 소요시간 확인',
            category: 'information',
            daysBefore: 1
        }
    ],
    
    // Travel & Vacation
    travel: [
        {
            id: 'travel_1',
            title: '숙소 예약',
            description: '호텔이나 숙박시설 예약 확인',
            category: 'coordination',
            daysBefore: 7
        },
        {
            id: 'travel_2',
            title: '교통편 예약',
            description: '기차표, 버스표, 항공권 등 예약',
            category: 'coordination',
            daysBefore: 5
        },
        {
            id: 'travel_3',
            title: '여행 일정 짜기',
            description: '가고 싶은 곳과 동선 계획하기',
            category: 'planning',
            daysBefore: 3
        },
        {
            id: 'travel_4',
            title: '짐 싸기',
            description: '날씨에 맞는 옷과 필수품 챙기기',
            category: 'preparation',
            daysBefore: 1
        },
        {
            id: 'travel_5',
            title: '여행 서류 확인',
            description: '신분증, 예약 확인서 등 챙기기',
            category: 'logistical',
            daysBefore: 1
        }
    ],
    
    // Health & Medical
    hospital_appointment: [
        {
            id: 'hosp_1',
            title: '진료 예약 확인',
            description: '예약 시간과 진료과 확인하기',
            category: 'information',
            daysBefore: 1
        },
        {
            id: 'hosp_2',
            title: '보험증/신분증',
            description: '건강보험증과 신분증 준비',
            category: 'logistical',
            daysBefore: 1
        },
        {
            id: 'hosp_3',
            title: '증상 정리하기',
            description: '의사에게 설명할 증상들 메모',
            category: 'preparation',
            daysBefore: 1
        },
        {
            id: 'hosp_4',
            title: '검사 전 주의사항',
            description: '금식 등 검사 전 지켜야 할 사항 확인',
            category: 'health',
            daysBefore: 1
        }
    ],
    
    // Family Events
    family_gathering: [
        {
            id: 'fam_1',
            title: '선물 준비',
            description: '어른들께 드릴 선물이나 과일 준비',
            category: 'preparation',
            daysBefore: 2
        },
        {
            id: 'fam_2',
            title: '교통편 확인',
            description: '이동 수단과 출발 시간 확인',
            category: 'logistical',
            daysBefore: 1
        },
        {
            id: 'fam_3',
            title: '옷 준비',
            description: '단정한 옷 준비하기',
            category: 'preparation',
            daysBefore: 1
        },
        {
            id: 'fam_4',
            title: '용돈 준비',
            description: '조카들 용돈이나 현금 준비',
            category: 'logistical',
            daysBefore: 1
        }
    ],
    
    // Subject-specific study todos
    math_test: [
        {
            id: 'math_1',
            title: '공식 정리하기',
            description: '시험 범위의 중요 공식들 한 장에 정리',
            category: 'study',
            daysBefore: 5
        },
        {
            id: 'math_2',
            title: '계산 실수 체크리스트',
            description: '자주 하는 실수들 정리해서 주의하기',
            category: 'review',
            daysBefore: 3
        },
        {
            id: 'math_3',
            title: '응용문제 연습',
            description: '교과서와 문제집의 고난도 문제 풀기',
            category: 'practice',
            daysBefore: 2
        },
        {
            id: 'math_4',
            title: '계산기 확인',
            description: '허용되면 계산기 배터리와 작동 확인',
            category: 'logistical',
            daysBefore: 1
        }
    ],
    
    english_test: [
        {
            id: 'eng_1',
            title: '단어장 만들기',
            description: '시험 범위 단어와 뜻 정리하기',
            category: 'study',
            daysBefore: 5
        },
        {
            id: 'eng_2',
            title: '문법 규칙 정리',
            description: '헷갈리는 문법 포인트 예문과 함께 정리',
            category: 'study',
            daysBefore: 4
        },
        {
            id: 'eng_3',
            title: '리스닝 연습',
            description: '교재 MP3로 듣기 연습하기',
            category: 'practice',
            daysBefore: 2
        },
        {
            id: 'eng_4',
            title: '작문 연습',
            description: '자주 나오는 주제로 영작 연습',
            category: 'practice',
            daysBefore: 2
        }
    ],
    
    science_test: [
        {
            id: 'sci_1',
            title: '실험 과정 정리',
            description: '중요 실험의 과정과 결과 정리하기',
            category: 'study',
            daysBefore: 5
        },
        {
            id: 'sci_2',
            title: '그림/도표 암기',
            description: '교과서의 중요 그림과 도표 그려보기',
            category: 'practice',
            daysBefore: 3
        },
        {
            id: 'sci_3',
            title: '용어 정리',
            description: '과학 용어와 정확한 정의 암기',
            category: 'study',
            daysBefore: 2
        }
    ],
    
    // Default - More Intelligent and Relevant
    default: [
        {
            id: 'default_1',
            title: '일정 세부사항 확인',
            description: '시간, 장소, 참석자 등 세부사항 확인',
            category: 'coordination',
            daysBefore: 1
        },
        {
            id: 'default_2',
            title: '필요한 준비물 점검',
            description: '이벤트에 필요한 준비물과 자료 점검',
            category: 'preparation',
            daysBefore: 1
        },
        {
            id: 'default_3',
            title: '교통편 및 장소 확인',
            description: '목적지까지의 경로와 소요시간 확인',
            category: 'logistical',
            daysBefore: 1
        }
    ]
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 App initializing...');
    initializeCalendar();
    initializeEventHandlers();
    loadEvents();
    loadTodos();
    updateEventList();
    
    // Ensure calendar view is shown and properly initialized
    console.log('🔧 Setting up initial view...');
    showCalendarView();
    
    // Set initial button state - calendar view is default
    document.getElementById('calendarViewBtn').classList.add('active');
    console.log('✅ App initialization complete');
});

// Initialize calendar
function initializeCalendar() {
    renderCalendar();
    updateMonthDisplay();
}

// Initialize event handlers
function initializeEventHandlers() {
    // Month navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
        updateMonthDisplay();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
        updateMonthDisplay();
    });

    // Calendar view button
    document.getElementById('calendarViewBtn').addEventListener('click', () => {
        showCalendarView();
        // Go to today
        currentDate = new Date();
        selectedDate = new Date();
        renderCalendar();
        updateMonthDisplay();
        updateEventList();
    });

    // Todo list view button
    document.getElementById('todoListViewBtn').addEventListener('click', showTodoListView);

    // AI Input
    const aiInput = document.getElementById('aiInput');
    const aiSendBtn = document.getElementById('aiSendBtn');
    
    console.log('🔧 AI Input elements:', { aiInput: !!aiInput, aiSendBtn: !!aiSendBtn });

    // Auto-resize textarea
    aiInput.addEventListener('input', () => {
        aiInput.style.height = 'auto';
        aiInput.style.height = aiInput.scrollHeight + 'px';
    });

    // Send on Enter (without Shift)
    aiInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendAIMessage();
        }
    });

    aiSendBtn.addEventListener('click', sendAIMessage);

    // Camera button functionality
    const cameraBtn = document.getElementById('cameraBtn');
    const cameraInput = document.getElementById('cameraInput');
    
    cameraBtn.addEventListener('click', () => {
        console.log('📷 Camera button clicked');
        cameraInput.click(); // Trigger file input
    });
    
    cameraInput.addEventListener('change', handleImageUpload);

    // Modal close
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('eventModal').addEventListener('click', (e) => {
        if (e.target.id === 'eventModal') {
            closeModal();
        }
    });

    // Todo modal close
    document.getElementById('todoModalClose').addEventListener('click', closeTodoModal);
    document.getElementById('todoModal').addEventListener('click', (e) => {
        if (e.target.id === 'todoModal') {
            closeTodoModal();
        }
    });

    // Schedule confirmation modal
    document.getElementById('scheduleConfirmClose').addEventListener('click', hideScheduleConfirmation);
    document.getElementById('scheduleConfirmModal').addEventListener('click', (e) => {
        if (e.target.id === 'scheduleConfirmModal') {
            hideScheduleConfirmation();
        }
    });

    // Image crop modal
    document.getElementById('cropModalClose').addEventListener('click', cancelCrop);
    document.getElementById('resetCrop').addEventListener('click', resetCropBox);
    document.getElementById('cancelCrop').addEventListener('click', cancelCrop);
    document.getElementById('confirmCrop').addEventListener('click', confirmCrop);
    document.getElementById('imageCropModal').addEventListener('click', (e) => {
        if (e.target.id === 'imageCropModal') {
            cancelCrop();
        }
    });
    
    // Keyboard shortcuts for closing modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (document.getElementById('imageCropModal').classList.contains('active')) {
                cancelCrop();
            } else if (document.getElementById('scheduleConfirmModal').classList.contains('active')) {
                hideScheduleConfirmation();
            } else if (document.getElementById('todoModal').classList.contains('active')) {
                closeTodoModal();
            } else if (document.getElementById('eventModal').classList.contains('active')) {
                closeModal();
            }
        }
    });
}

// Render calendar
function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Clear existing calendar days
    const existingDays = calendarGrid.querySelectorAll('.calendar-day');
    existingDays.forEach(day => day.remove());
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Add days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayElement = createDayElement(
            daysInPrevMonth - i,
            new Date(year, month - 1, daysInPrevMonth - i),
            true
        );
        calendarGrid.appendChild(dayElement);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayElement = createDayElement(day, date, false);
        calendarGrid.appendChild(dayElement);
    }
    
    // Add days from next month
    const totalCells = calendarGrid.children.length - 7; // Subtract weekday headers
    const cellsNeeded = 42 - totalCells; // 6 weeks * 7 days
    
    for (let day = 1; day <= cellsNeeded; day++) {
        const dayElement = createDayElement(
            day,
            new Date(year, month + 1, day),
            true
        );
        calendarGrid.appendChild(dayElement);
    }
}

// Create day element
function createDayElement(dayNumber, date, isOtherMonth) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }
    
    // Check if today
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
        dayElement.classList.add('today');
    }
    
    // Check if selected
    if (date.toDateString() === selectedDate.toDateString()) {
        dayElement.classList.add('selected');
    }
    
    // Check if has events
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length > 0) {
        dayElement.classList.add('has-events');
    }
    
    // Check if has todos
    const dayTodos = getTodosForDate(date);
    if (dayTodos.length > 0) {
        dayElement.classList.add('has-todos');
        console.log(`📅 Date ${date.toDateString()} has ${dayTodos.length} todos:`, dayTodos.map(t => t.title));
    }
    
    const dayNumberElement = document.createElement('span');
    dayNumberElement.className = 'day-number';
    dayNumberElement.textContent = dayNumber;
    
    dayElement.appendChild(dayNumberElement);
    
    // Add event and todo indicators
    if (dayEvents.length > 0 || dayTodos.length > 0) {
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'day-indicators';
        
        // Add event indicator
        if (dayEvents.length > 0) {
            const eventIndicator = document.createElement('div');
            eventIndicator.className = 'indicator events';
            eventIndicator.title = `${dayEvents.length}개 이벤트`;
            indicatorsContainer.appendChild(eventIndicator);
        }
        
        // Add todo indicator
        if (dayTodos.length > 0) {
            const todoIndicator = document.createElement('div');
            todoIndicator.className = 'indicator todos';
            todoIndicator.title = `${dayTodos.length}개 할일`;
            indicatorsContainer.appendChild(todoIndicator);
        }
        
        dayElement.appendChild(indicatorsContainer);
    }
    
    // Add click handler
    dayElement.addEventListener('click', () => {
        selectedDate = new Date(date);
        document.querySelectorAll('.calendar-day').forEach(el => {
            el.classList.remove('selected');
        });
        dayElement.classList.add('selected');
        updateEventList();
    });
    
    return dayElement;
}

// Update month display
function updateMonthDisplay() {
    const monthElement = document.getElementById('currentMonth');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthElement.textContent = `${year}년 ${monthNames[month]}`;
}

// Get events for a specific date (timezone-safe)
function getEventsForDate(date) {
    // Use local date formatting to avoid timezone issues
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return events.filter(event => event.date === dateStr);
}

// Get todos for a specific date (timezone-safe)
function getTodosForDate(date) {
    // Use local date formatting to avoid timezone issues
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return todos.filter(todo => todo.dueDate === dateStr);
}

// Update event list
function updateEventList() {
    const eventList = document.getElementById('eventList');
    const eventCount = document.getElementById('eventCount');
    const dayEvents = getEventsForDate(selectedDate);
    const dayTodos = getTodosForDate(selectedDate);
    
    const totalItems = dayEvents.length + dayTodos.length;
    eventCount.textContent = `${totalItems}개`;
    
    if (totalItems === 0) {
        eventList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <p>선택한 날짜에 일정이나 할일이 없습니다</p>
            </div>
        `;
        return;
    }
    
    eventList.innerHTML = '';
    
    // Sort events by time
    const sortedEvents = [...dayEvents].sort((a, b) => {
        if (a.allDay && !b.allDay) return -1;
        if (!a.allDay && b.allDay) return 1;
        if (a.time && b.time) return a.time.localeCompare(b.time);
        return 0;
    });
    
    // Sort todos by category and title
    const sortedTodos = [...dayTodos].sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        return a.title.localeCompare(b.title);
    });
    
    // Add events first
    sortedEvents.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item event';
        
        const timeDisplay = event.allDay ? '종일' : event.time || '시간 미정';
        
        eventItem.innerHTML = `
            <div class="event-time">${timeDisplay}</div>
            <div class="event-details">
                <div class="event-title">${event.title}</div>
                ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
            </div>
            <div class="event-type">📅</div>
        `;
        
        eventItem.addEventListener('click', () => showEventDetail(event));
        eventList.appendChild(eventItem);
    });
    
    // Add todos
    sortedTodos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = 'event-item todo';
        
        const event = events.find(e => e.id === todo.eventId);
        const eventTitle = event ? event.title : '알 수 없는 이벤트';
        
        todoItem.innerHTML = `
            <div class="event-time">할일</div>
            <div class="event-details">
                <div class="event-title">${todo.title}</div>
                <div class="event-description">${todo.description}</div>
                <div class="todo-event-link">📋 ${eventTitle}</div>
            </div>
            <div class="event-type">✅</div>
        `;
        
        todoItem.addEventListener('click', () => {
            console.log('📋 Todo item clicked:', todo.title);
            showTodoDetail(todo);
        });
        eventList.appendChild(todoItem);
    });
}

// Show event detail modal
function showEventDetail(event) {
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');
    
    const timeDisplay = event.allDay ? '종일' : event.time || '시간 미정';
    const dateObj = new Date(event.date);
    const dateDisplay = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;
    
    // Get relevant todos for this event
    const relevantTodos = analyzeEventAndGetTodos(event);
    const eventDate = new Date(event.date);
    const recommendations = relevantTodos.map(todo => {
        const todoDate = new Date(eventDate);
        todoDate.setDate(todoDate.getDate() - todo.daysBefore);
        
        // Use timezone-safe date formatting
        const year = todoDate.getFullYear();
        const month = (todoDate.getMonth() + 1).toString().padStart(2, '0');
        const day = todoDate.getDate().toString().padStart(2, '0');
        const dueDateStr = `${year}-${month}-${day}`;
        
        return {
            ...todo,
            dueDate: dueDateStr,
            displayDate: formatDateForDisplay(todoDate)
        };
    });
    
    modalBody.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4 style="margin-bottom: 8px; color: #FF5500;">${event.title}</h4>
            <p style="color: #666; font-size: 0.9rem;">
                <i class="fas fa-calendar" style="margin-right: 8px;"></i>${dateDisplay}
            </p>
            <p style="color: #666; font-size: 0.9rem;">
                <i class="fas fa-clock" style="margin-right: 8px;"></i>${timeDisplay}
            </p>
        </div>
        ${event.description ? `
            <div style="border-top: 1px solid #eee; padding-top: 16px;">
                <p style="color: #333; line-height: 1.6;">${event.description}</p>
            </div>
        ` : ''}
        
        <!-- Todo Recommendations Section -->
        <div style="margin-top: 24px; border-top: 1px solid #eee; padding-top: 16px;">
            <h5 style="margin-bottom: 16px; color: #333; font-size: 1rem;">
                <i class="fas fa-tasks" style="margin-right: 8px; color: #FF5500;"></i>추천 할일
            </h5>
            <div style="max-height: 300px; overflow-y: auto;">
                ${(() => {
                    // Filter out todos that have already been added
                    const availableRecommendations = recommendations.filter(todo => 
                        !todos.some(t => t.recommendationId === todo.id && t.eventId === event.id)
                    );
                    
                    // If no recommendations available, show a message
                    if (availableRecommendations.length === 0) {
                        return `
                            <div style="text-align: center; padding: 20px; color: #666;">
                                <i class="fas fa-check-circle" style="font-size: 2rem; color: #4CAF50; margin-bottom: 10px;"></i>
                                <p>모든 추천 할일이 추가되었습니다!</p>
                                <p style="font-size: 0.9rem; margin-top: 8px;">할일 목록에서 추가된 할일을 확인할 수 있습니다.</p>
                            </div>
                        `;
                    }
                    
                    // Render only available recommendations with swipe functionality
                    return availableRecommendations.map(todo => `
                        <div class="todo-item swipeable" data-todo-id="${todo.id}" data-event-id="${event.id}" style="
                            border: 1px solid #eee;
                            border-radius: 8px;
                            padding: 12px;
                            margin-bottom: 8px;
                            background: #fff;
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            position: relative;
                            overflow: hidden;
                            touch-action: pan-y;
                            cursor: grab;
                        ">
                            <!-- Swipe left indicator (add) -->
                            <div class="swipe-indicator swipe-left" style="
                                position: absolute;
                                left: -100px;
                                top: 0;
                                bottom: 0;
                                width: 100px;
                                background: linear-gradient(90deg, #4CAF50, #45a049);
                                color: white;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 0.8rem;
                                font-weight: 600;
                                transition: left 0.3s ease;
                            ">
                                <i class="fas fa-plus" style="margin-right: 8px;"></i>추가
                            </div>
                            
                            <!-- Swipe right indicator (remove) -->
                            <div class="swipe-indicator swipe-right" style="
                                position: absolute;
                                right: -100px;
                                top: 0;
                                bottom: 0;
                                width: 100px;
                                background: linear-gradient(270deg, #ff4444, #e63939);
                                color: white;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 0.8rem;
                                font-weight: 600;
                                transition: right 0.3s ease;
                            ">
                                <i class="fas fa-trash" style="margin-right: 8px;"></i>삭제
                            </div>
                            
                            <div class="todo-content" style="flex: 1; min-width: 0;">
                                <div class="todo-title" style="font-weight: 600; color: #333; margin-bottom: 4px;">${todo.title}</div>
                                <div class="todo-description" style="color: #666; font-size: 0.9rem; margin-bottom: 8px;">${todo.description}</div>
                                <div class="todo-date" style="color: #888; font-size: 0.8rem;">📅 ${todo.displayDate}</div>
                            </div>
                            
                            <!-- Swipe hint -->
                            <div class="swipe-hint" style="
                                color: #999;
                                font-size: 0.7rem;
                                text-align: center;
                                padding: 8px;
                                border: 1px dashed #ddd;
                                border-radius: 6px;
                                background: #f9f9f9;
                            ">
                                <div>← 추가</div>
                                <div>삭제 →</div>
                            </div>
                        </div>
                    `).join('');
                })()}
            </div>
        </div>
        
        <div style="margin-top: 24px; display: flex; gap: 8px;">
            <button onclick="deleteEvent('${event.id}')" style="
                flex: 1;
                padding: 12px;
                background: #ff4444;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 0.9rem;
                cursor: pointer;
            ">
                <i class="fas fa-trash" style="margin-right: 8px;"></i>삭제
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Initialize swipe functionality for todo items
    initializeSwipeGestures();
}

// Close modal
function closeModal() {
    console.log('closeModal called');
    const eventModal = document.getElementById('eventModal');
    eventModal.classList.remove('active');
    eventModal.style.display = '';
    eventModal.style.zIndex = '';
    console.log('Event modal closed');
}

// Close todo modal
function closeTodoModal() {
    console.log('closeTodoModal called');
    const todoModal = document.getElementById('todoModal');
    todoModal.classList.remove('active');
    todoModal.style.display = '';
    todoModal.style.zIndex = '';
    console.log('Todo modal closed');
}

// Show calendar view
function showCalendarView() {
    console.log('📅 Showing calendar view');
    document.getElementById('calendarView').style.display = 'block';
    document.getElementById('todoListView').style.display = 'none';
    document.getElementById('calendarViewBtn').classList.add('active');
    document.getElementById('todoListViewBtn').classList.remove('active');
    const elc = document.querySelector('.event-list-container');
    if (elc) elc.style.display = 'block';
}

// Show todo list view
function showTodoListView() {
    console.log('📋 Showing todo list view');
    document.getElementById('calendarView').style.display = 'none';
    document.getElementById('todoListView').style.display = 'block';
    document.getElementById('calendarViewBtn').classList.remove('active');
    document.getElementById('todoListViewBtn').classList.add('active');
    showAllTodos();
}

// Delete event
function deleteEvent(eventId) {
    events = events.filter(event => event.id !== eventId);
    saveEvents();
    renderCalendar();
    updateEventList();
    closeModal();
}

// Send AI message
async function sendAIMessage() {
    const aiInput = document.getElementById('aiInput');
    const message = aiInput.value.trim();
    
    if (!message) return;
    
    // Disable input
    aiInput.disabled = true;
    document.getElementById('aiSendBtn').disabled = true;
    
    // Show loading
    showLoading();
    
    try {
        const response = await callClaudeAPI(message);
        
        console.log('🔧 AI Response received:', response);
        
        if (response.success && response.event) {
            console.log('🔧 Creating new event from response:', response.event);
            console.log('🔧 Date from AI:', response.event.date);
            console.log('🔧 Today for comparison:', new Date().toISOString().split('T')[0]);
            
            // Add the event
            const newEvent = {
                id: generateId(),
                ...response.event
            };
            
            console.log('🔧 New event object:', newEvent);
            console.log('🔧 Events array before push (length):', events.length);
            
            events.push(newEvent);
            console.log('🔧 Events array after push (length):', events.length);
            
            console.log('🔧 Saving events...');
            saveEvents();
            
            console.log('🔧 Rendering calendar...');
            renderCalendar();
            
            // If event is today, update the list
            if (response.event.date === selectedDate.toISOString().split('T')[0]) {
                console.log('🔧 Updating event list...');
                updateEventList();
            }
            
            // Show success message
            showSuccessMessage(response.message || '일정이 추가되었습니다');
            
            console.log('🔧 Event creation completed successfully');
        } else {
            console.error('🔧 Invalid response format:', response);
        }
        
        // Clear input
        aiInput.value = '';
        aiInput.style.height = 'auto';
        
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage('일정 추가 중 오류가 발생했습니다');
    } finally {
        // Re-enable input
        aiInput.disabled = false;
        document.getElementById('aiSendBtn').disabled = false;
        aiInput.focus();
                 hideLoading();
     }
 }

// =============================================
// Image Enhancement for Better OCR
// =============================================

// Enhance image quality for better OCR accuracy
function enhanceImageForOCR(sourceCtx, sourceCanvas) {
    console.log('🔧 Enhancing image quality for OCR...');
    
    // Create new canvas for enhancement
    const enhancedCanvas = document.createElement('canvas');
    const enhancedCtx = enhancedCanvas.getContext('2d');
    
    // Set canvas size
    enhancedCanvas.width = sourceCanvas.width;
    enhancedCanvas.height = sourceCanvas.height;
    
    // Get image data
    const imageData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    const data = imageData.data;
    
    // Enhancement parameters
    const contrast = 1.5;    // Increase contrast
    const brightness = 10;   // Slight brightness boost
    const sharpening = 0.8;  // Sharpening factor
    
    // Apply contrast and brightness
    for (let i = 0; i < data.length; i += 4) {
        // Red, Green, Blue channels
        data[i] = Math.min(255, Math.max(0, contrast * (data[i] - 128) + 128 + brightness));
        data[i + 1] = Math.min(255, Math.max(0, contrast * (data[i + 1] - 128) + 128 + brightness));
        data[i + 2] = Math.min(255, Math.max(0, contrast * (data[i + 2] - 128) + 128 + brightness));
    }
    
    // Put enhanced image data
    enhancedCtx.putImageData(imageData, 0, 0);
    
    // Apply unsharp mask for better text clarity
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = sourceCanvas.width;
    tempCanvas.height = sourceCanvas.height;
    
    // Draw blurred version
    tempCtx.filter = 'blur(1px)';
    tempCtx.drawImage(enhancedCanvas, 0, 0);
    
    // Composite for sharpening effect
    enhancedCtx.globalCompositeOperation = 'source-over';
    enhancedCtx.globalAlpha = 1 + sharpening;
    enhancedCtx.drawImage(enhancedCanvas, 0, 0);
    enhancedCtx.globalAlpha = -sharpening;
    enhancedCtx.drawImage(tempCanvas, 0, 0);
    
    // Reset composite operation
    enhancedCtx.globalCompositeOperation = 'source-over';
    enhancedCtx.globalAlpha = 1;
    
         console.log('✨ Image enhancement complete');
     return enhancedCanvas;
 }

// Process image specifically for OCR with higher quality
async function processImageForOCR(file) {
    console.log('🔧 Processing image for OCR with enhanced quality...');
    
    // For OCR, we want higher quality and larger dimensions
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB for OCR (higher than mobile)
    const MAX_DIMENSION = 1600; // Larger dimensions for better text recognition
    
    console.log('📏 OCR size limits:', MAX_SIZE, 'bytes, max dimension:', MAX_DIMENSION);
    
    // Only resize if absolutely necessary
    if (file.size > MAX_SIZE) {
        console.log('⚠️ File too large for OCR, resizing:', file.size, 'bytes');
        return await resizeImageForOCR(file, MAX_DIMENSION);
    }
    
    console.log('✅ Image size acceptable for OCR, no resizing needed');
    return file;
}

// Resize image specifically for OCR with quality preservation
async function resizeImageForOCR(file, maxDimension) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            const dimensions = getImageDimensions(img, maxDimension);
            
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;
            
            // High quality settings for OCR
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Draw image
            ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
            
            // Convert to blob with higher quality (90% instead of 50%)
            canvas.toBlob((blob) => {
                const resizedFile = new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now()
                });
                
                console.log('✅ Image resized for OCR:', file.size, '→', resizedFile.size, 'bytes');
                resolve(resizedFile);
            }, file.type, 0.9); // Higher quality for OCR
        };
        
        img.src = URL.createObjectURL(file);
    });
}

// =============================================
// Crop Box Interaction Handlers
// =============================================

// Add crop box interaction after modal is shown
function initializeCropInteractions() {
    const cropBoxElement = document.getElementById('cropBox');
    const cropHandles = document.querySelectorAll('.crop-handle');
    
    // Crop box dragging
    cropBoxElement.addEventListener('mousedown', startDrag);
    cropBoxElement.addEventListener('touchstart', startDrag, { passive: false });
    
    // Handle resizing
    cropHandles.forEach(handle => {
        handle.addEventListener('mousedown', startResize);
        handle.addEventListener('touchstart', startResize, { passive: false });
    });
    
    // Global mouse/touch events
    document.addEventListener('mousemove', handleDragResize);
    document.addEventListener('touchmove', handleDragResize, { passive: false });
    document.addEventListener('mouseup', endDragResize);
    document.addEventListener('touchend', endDragResize);
}

function startDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    dragStart = { x: clientX - cropBox.x, y: clientY - cropBox.y };
    console.log('🖱️ Start dragging crop box');
}

function startResize(e) {
    e.preventDefault();
    e.stopPropagation();
    
    isResizing = true;
    resizeHandle = e.target.className.split(' ')[1]; // Get handle position
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    dragStart = { x: clientX, y: clientY };
    console.log('🔄 Start resizing from:', resizeHandle);
}

function handleDragResize(e) {
    if (!isDragging && !isResizing) return;
    
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const canvasRect = canvas.getBoundingClientRect();
    const containerRect = document.querySelector('.crop-canvas-container').getBoundingClientRect();
    
    const relativeX = clientX - canvasRect.left;
    const relativeY = clientY - canvasRect.top;
    
    if (isDragging) {
        // Move crop box
        const newX = Math.max(0, Math.min(canvas.width - cropBox.width, relativeX - dragStart.x));
        const newY = Math.max(0, Math.min(canvas.height - cropBox.height, relativeY - dragStart.y));
        
        cropBox.x = newX;
        cropBox.y = newY;
    } else if (isResizing) {
        // Resize crop box based on handle
        const deltaX = clientX - dragStart.x;
        const deltaY = clientY - dragStart.y;
        
        const minSize = 50;
        
        switch (resizeHandle) {
            case 'top-left':
                const newWidth1 = Math.max(minSize, cropBox.width - deltaX);
                const newHeight1 = Math.max(minSize, cropBox.height - deltaY);
                const newX1 = Math.max(0, cropBox.x + cropBox.width - newWidth1);
                const newY1 = Math.max(0, cropBox.y + cropBox.height - newHeight1);
                
                cropBox.x = newX1;
                cropBox.y = newY1;
                cropBox.width = newWidth1;
                cropBox.height = newHeight1;
                break;
                
            case 'top-right':
                const newWidth2 = Math.max(minSize, Math.min(canvas.width - cropBox.x, cropBox.width + deltaX));
                const newHeight2 = Math.max(minSize, cropBox.height - deltaY);
                const newY2 = Math.max(0, cropBox.y + cropBox.height - newHeight2);
                
                cropBox.y = newY2;
                cropBox.width = newWidth2;
                cropBox.height = newHeight2;
                break;
                
            case 'bottom-left':
                const newWidth3 = Math.max(minSize, cropBox.width - deltaX);
                const newHeight3 = Math.max(minSize, Math.min(canvas.height - cropBox.y, cropBox.height + deltaY));
                const newX3 = Math.max(0, cropBox.x + cropBox.width - newWidth3);
                
                cropBox.x = newX3;
                cropBox.width = newWidth3;
                cropBox.height = newHeight3;
                break;
                
            case 'bottom-right':
                cropBox.width = Math.max(minSize, Math.min(canvas.width - cropBox.x, cropBox.width + deltaX));
                cropBox.height = Math.max(minSize, Math.min(canvas.height - cropBox.y, cropBox.height + deltaY));
                break;
        }
        
        dragStart = { x: clientX, y: clientY };
    }
    
    updateCropBoxDisplay();
    updateCropDimensions();
}

function endDragResize(e) {
    if (isDragging || isResizing) {
        console.log('🏁 End drag/resize');
        isDragging = false;
        isResizing = false;
        resizeHandle = null;
    }
}

// Handle image upload and OCR processing
async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('📷 Image file selected:', file.name);
    
    // Show loading indicator
    document.getElementById('loadingOverlay').classList.add('active');
    
    try {
        // Convert image to base64
        const base64Image = await convertImageToBase64(file);
        console.log('🔄 Image converted to base64');
        
        // Send image to Claude for OCR and schedule extraction
        const ocrMessage = `Please analyze this image and extract any schedule or calendar information. Look for dates, times, events, appointments, or any scheduling information. Extract the text using OCR and then parse it into a structured schedule format. Respond in Korean and include specific dates and times if visible.`;
        
        const response = await callClaudeAPIWithImage(ocrMessage, base64Image);
        
        if (response && response.content) {
            console.log('📋 OCR response received:', response.content);
            
            // Process the OCR response as if it was typed text
            await processAIResponse(response);
            
            // Clear the file input for next use
            event.target.value = '';
            
            showSuccessMessage('📷 이미지에서 일정을 성공적으로 추출했습니다!');
        }
        
    } catch (error) {
        console.error('❌ Image processing error:', error);
        showErrorMessage('이미지 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        
        // Clear the file input
        event.target.value = '';
    } finally {
        // Hide loading indicator
        document.getElementById('loadingOverlay').classList.remove('active');
    }
}

// Convert image file to base64
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // Remove the data:image/jpeg;base64, prefix
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Call Claude API with image for OCR
async function callClaudeAPIWithImage(userMessage, base64Image) {
    const apiUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
        ? 'http://localhost:10000/api/claude-vision'
        : 'https://smart-planner2-clean.onrender.com/api/claude-vision';
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage,
                image: base64Image
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Backend API error:', error);
        throw error;
    }
}

// Call Claude API through our Render backend
async function callClaudeAPI(userMessage) {
    // Use local backend for development, Render backend for production
        // Always use Render backend - no more Vercel CORS issues!
    const apiUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
        ? 'http://localhost:10000/api/claude'
        : 'https://smart-planner2-clean.onrender.com/api/claude';
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        return data;
    } catch (error) {
        console.error('Backend API error:', error);
        
        // For local testing, provide a mock response
        if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Using mock AI response for local testing');
            return mockAIResponse(userMessage);
        }
        
        // Fallback: Show message that backend needs to be deployed
        throw new Error('백엔드 서버가 아직 배포되지 않았습니다. Render에 백엔드를 배포해주세요.');
    }
}

// Helper function to format date without timezone issues
function formatDateLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Mock AI response for local testing
function mockAIResponse(userMessage) {
    console.log('🔧 Mock AI called with message:', userMessage);
    
    // Parse Korean date format (e.g., "9월1일", "9월 3일", "내일", "다음주 월요일")
    let eventDate = new Date();
    let eventTime = null;
    let isAllDay = true;
    
    // Check for specific Korean date patterns
    const monthDayMatch = userMessage.match(/(\d+)월\s*(\d+)일/);
    if (monthDayMatch) {
        const month = parseInt(monthDayMatch[1]) - 1; // JavaScript months are 0-indexed
        const day = parseInt(monthDayMatch[2]);
        const currentYear = new Date().getFullYear();
        
        // If the month is in the past, assume next year
        if (month < new Date().getMonth()) {
            eventDate = new Date(currentYear + 1, month, day);
        } else {
            eventDate = new Date(currentYear, month, day);
        }
        
        console.log('🔧 Parsed Korean date:', monthDayMatch[1] + '월', monthDayMatch[2] + '일', '→', 
            `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`);
    }
    
    // Check for time patterns
    const timeMatch = userMessage.match(/(\d+)시/);
    if (timeMatch) {
        const hour = parseInt(timeMatch[1]);
        eventTime = `${hour.toString().padStart(2, '0')}:00`;
        isAllDay = false;
        console.log('🔧 Parsed time:', hour + '시', '→', eventTime);
    }
    
    // Check for specific keywords
    if (userMessage.includes('시험') || userMessage.includes('exam') || userMessage.includes('토익')) {
        return {
            success: true,
            event: {
                title: userMessage.includes('토익') ? '토익 시험' : '시험',
                date: eventDate.toISOString().split('T')[0],
                time: eventTime,
                description: userMessage.includes('토익') ? '토익 시험 준비 및 응시' : '시험 준비 및 응시',
                allDay: isAllDay
            },
            message: '시험이 추가되었습니다'
        };
    } else if (userMessage.includes('회의') || userMessage.includes('meeting')) {
        return {
            success: true,
            event: {
                title: '회의',
                date: eventDate.toISOString().split('T')[0],
                time: eventTime || '14:00',
                description: '팀 회의',
                allDay: false
            },
            message: '회의가 추가되었습니다'
        };
    } else if (userMessage.includes('프로젝트') || userMessage.includes('project')) {
        return {
            success: true,
            event: {
                title: '프로젝트',
                date: eventDate.toISOString().split('T')[0],
                time: eventTime,
                description: '프로젝트 진행',
                allDay: isAllDay
            },
            message: '프로젝트가 추가되었습니다'
        };
    } else if (userMessage.includes('약속') || userMessage.includes('appointment')) {
        return {
            success: true,
            event: {
                title: '약속',
                date: eventDate.toISOString().split('T')[0],
                time: eventTime || '18:00',
                description: userMessage,
                allDay: false
            },
            message: '약속이 추가되었습니다'
        };
    } else if (userMessage.includes('음악')) {
        return {
            success: true,
            event: {
                title: '음악 시험',
                date: eventDate.toISOString().split('T')[0],
                time: eventTime,
                description: '음악 시험 준비 및 응시',
                allDay: isAllDay
            },
            message: '음악 시험이 추가되었습니다'
        };
    } else {
        // Default response
        return {
            success: true,
            event: {
                title: userMessage.substring(0, 20) + '...',
                date: eventDate.toISOString().split('T')[0],
                time: eventTime,
                description: userMessage,
                allDay: isAllDay
            },
            message: '일정이 추가되었습니다'
        };
    }
}

// Show/hide loading
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
    updateLoadingProgress(0, 'AI가 일정을 분석하고 있습니다...');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
    updateLoadingProgress(0, 'AI가 일정을 분석하고 있습니다...');
}

// Update loading progress
function updateLoadingProgress(percentage, text) {
    const loadingText = document.getElementById('loadingText');
    const progressBar = document.getElementById('progressBar');
    
    if (loadingText) loadingText.textContent = text;
    if (progressBar) progressBar.style.width = `${percentage}%`;
}

// Show success message
function showSuccessMessage(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 140px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        animation: slideUp 0.3s ease;
    `;
    toast.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 8px;"></i>${message}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Handle image upload and OCR processing
async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('📷 Image file selected:', file.name);
    console.log('📱 Mobile camera debug:');
    console.log('- File size:', file.size, 'bytes');
    console.log('- File type:', file.type);
    console.log('- File last modified:', new Date(file.lastModified));
    console.log('- User agent:', navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop');
    
    // Show crop modal instead of immediately processing
    showImageCropModal(file);
    
    // Clear the file input for next use
    event.target.value = '';
}

// Process image for mobile compatibility
async function processImageForMobile(file) {
    console.log('🔧 Processing image for mobile compatibility...');
    
    // Detect if mobile device
    const isMobile = navigator.userAgent.includes('Mobile') || navigator.userAgent.includes('Android') || navigator.userAgent.includes('iPhone');
    
    // More aggressive limits for mobile
    const MAX_SIZE = isMobile ? 500 * 1024 : 1 * 1024 * 1024; // 500KB for mobile, 1MB for desktop
    const MAX_DIMENSION = isMobile ? 800 : 1200; // Smaller for mobile
    
    console.log('📱 Device type:', isMobile ? 'Mobile' : 'Desktop');
    console.log('📏 Size limits:', MAX_SIZE, 'bytes, max dimension:', MAX_DIMENSION);
    
    // Always resize mobile images to ensure compatibility
    if (isMobile || file.size > MAX_SIZE) {
        console.log('⚠️ Processing needed - Mobile device or large file:', file.size, 'bytes');
        return await resizeImage(file, MAX_DIMENSION);
    }
    
    // Check image dimensions for desktop
    const dimensions = await getImageDimensions(file);
    console.log('📐 Image dimensions:', dimensions.width, 'x', dimensions.height);
    
    if (dimensions.width > MAX_DIMENSION || dimensions.height > MAX_DIMENSION) {
        console.log('⚠️ Image dimensions too large, resizing...');
        return await resizeImage(file, MAX_DIMENSION);
    }
    
    console.log('✅ Image size acceptable, no processing needed');
    return file;
}

// Get image dimensions
function getImageDimensions(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({ width: img.width, height: img.height });
        };
        
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };
        
        img.src = url;
    });
}

// Resize image if too large
function resizeImage(file, maxDimension) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const url = URL.createObjectURL(file);
        
        img.onload = () => {
            URL.revokeObjectURL(url);
            
            // Calculate new dimensions
            let { width, height } = img;
            if (width > height) {
                if (width > maxDimension) {
                    height = (height * maxDimension) / width;
                    width = maxDimension;
                }
            } else {
                if (height > maxDimension) {
                    width = (width * maxDimension) / height;
                    height = maxDimension;
                }
            }
            
            // Resize image
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert back to file
            canvas.toBlob((blob) => {
                if (blob) {
                    // Create new file with same name and type
                    const resizedFile = new File([blob], file.name, {
                        type: file.type || 'image/jpeg',
                        lastModified: Date.now()
                    });
                    console.log('✅ Image resized:', file.size, '→', resizedFile.size, 'bytes');
                    resolve(resizedFile);
                } else {
                    reject(new Error('Failed to resize image'));
                }
            }, file.type || 'image/jpeg', 0.5); // 50% quality for mobile compatibility
        };
        
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image for resizing'));
        };
        
        img.src = url;
    });
}

// Convert image file to base64
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // Extract base64 data and media type
            const result = reader.result;
            const [header, base64] = result.split(',');
            
            // Extract media type from data URL header or use file.type
            const mediaTypeMatch = header.match(/data:([^;]+)/);
            let mediaType = mediaTypeMatch ? mediaTypeMatch[1] : file.type || 'image/png';
            
            // Handle HEIC images (common on iOS) - convert to JPEG for Claude
            if (mediaType === 'image/heic' || mediaType === 'image/heif') {
                console.log('📱 HEIC image detected, converting to JPEG for compatibility');
                mediaType = 'image/jpeg';
            }
            
            console.log('🔍 File type:', file.type, 'Detected media type:', mediaType);
            
            resolve({ base64, mediaType });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Call Claude API with image for OCR
async function callClaudeAPIWithImage(userMessage, base64Image, mediaType = 'image/jpeg') {
    const apiUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
        ? 'http://localhost:10000/api/claude-vision'
        : 'https://smart-planner2-clean.onrender.com/api/claude-vision';
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage,
                image: base64Image,
                mediaType: mediaType
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Backend API error:', error);
        throw error;
    }
}

// Show error message
function showErrorMessage(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 140px;
        left: 50%;
        transform: translateX(-50%);
        background: #f44336;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        animation: slideUp 0.3s ease;
    `;
    toast.innerHTML = `<i class="fas fa-exclamation-circle" style="margin-right: 8px;"></i>${message}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Parse Korean schedule text on client side (Enhanced)
function parseKoreanScheduleTextClient(text) {
    console.log('🔧 Client-side parsing Korean text:', text);
    
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
    
    console.log('🔍 Client pattern matches found:');
    console.log('- Month-Day format:', monthDayMatches.length);
    console.log('- Dot format:', dotMatches.length);
    console.log('- Range format:', rangeMatches.length);
    
    // Process all patterns the same way as server
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
    
    rangeMatches.forEach(match => {
        const [, startMonth, startDay, endMonth, endDay, title] = match;
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
    
    // Remove duplicates
    const uniqueEvents = events.filter((event, index, self) => 
        index === self.findIndex(e => e.date === event.date && e.title === event.title)
    );
    
    console.log('📅 Client created', uniqueEvents.length, 'unique events');
    
    return uniqueEvents;
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Show todo recommendations modal
function showTodoRecommendations(eventId) {
    console.log('showTodoRecommendations called with eventId:', eventId);
    
    const event = events.find(e => e.id === eventId);
    if (!event) {
        console.log('Event not found');
        return;
    }
    
    console.log('Event found:', event);
    
    currentEventForTodos = event;
    const todoModal = document.getElementById('todoModal');
    const recommendationsContainer = document.getElementById('todoRecommendations');
    
    console.log('Todo modal element:', todoModal);
    console.log('Recommendations container:', recommendationsContainer);
    
    // Close event modal first
    closeModal();
    
    // Wait a moment for the event modal to close, then open todo modal
    setTimeout(() => {
        // Check if modal reopening is prevented
        if (preventTodoModalReopen) {
            console.log('🚫 Preventing showTodoRecommendations modal reopen');
            return;
        }
        
        // Analyze event and get relevant todos
        const relevantTodos = analyzeEventAndGetTodos(event);
        console.log('Relevant todos found:', relevantTodos);
        
        // Debug: Check if relevantTodos is valid
        if (!relevantTodos || relevantTodos.length === 0) {
            console.error('No relevant todos found! This means analyzeEventAndGetTodos returned undefined or empty array');
            console.log('Event title:', event.title);
            console.log('Event description:', event.description);
            console.log('Available todo categories:', Object.keys(todoRecommendations));
            return;
        }
        
        // Generate recommendations based on event date
        const eventDate = new Date(event.date);
        const recommendations = relevantTodos.map(todo => {
            const todoDate = new Date(eventDate);
            todoDate.setDate(todoDate.getDate() - todo.daysBefore);
            
            // Use timezone-safe date formatting
            const year = todoDate.getFullYear();
            const month = (todoDate.getMonth() + 1).toString().padStart(2, '0');
            const day = todoDate.getDate().toString().padStart(2, '0');
            const dueDateStr = `${year}-${month}-${day}`;
            
            return {
                ...todo,
                dueDate: dueDateStr,
                displayDate: formatDateForDisplay(todoDate)
            };
        });
        
        console.log('Generated recommendations:', recommendations);
        
        // Render recommendations
        recommendationsContainer.innerHTML = recommendations.map(todo => {
            const isAdded = todos.some(t => t.recommendationId === todo.id && t.eventId === eventId);
            
            return `
                <div class="todo-item ${isAdded ? 'added' : ''}" data-todo-id="${todo.id}">
                    <div class="todo-content">
                        <div class="todo-title">${todo.title}</div>
                        <div class="todo-description">${todo.description}</div>
                        <div class="todo-date">📅 ${todo.displayDate}</div>
                    </div>
                    <div class="todo-actions">
                        ${isAdded ? 
                            `<button class="todo-btn delete" onclick="removeTodo('${todo.id}', '${eventId}')">
                                <i class="fas fa-trash"></i> 삭제
                            </button>` :
                            `<button class="todo-btn add" onclick="addTodo('${todo.id}', '${eventId}')">
                                <i class="fas fa-plus"></i> 추가
                            </button>`
                        }
                    </div>
                </div>
            `;
        }).join('');
        
        // Show the todo modal
        todoModal.classList.add('active');
        todoModal.style.display = 'flex';
        todoModal.style.zIndex = '2000';
        
        // Debug log
        console.log('Todo modal opened with', recommendations.length, 'recommendations');
        console.log('Modal element:', todoModal);
        console.log('Modal classes:', todoModal.className);
        console.log('Modal display style:', window.getComputedStyle(todoModal).display);
        console.log('Modal z-index:', window.getComputedStyle(todoModal).zIndex);
        
        // Additional checks
        console.log('Modal parent:', todoModal.parentElement);
        console.log('Modal is in DOM:', document.body.contains(todoModal));
        console.log('Modal computed styles:', {
            display: window.getComputedStyle(todoModal).display,
            visibility: window.getComputedStyle(todoModal).visibility,
            opacity: window.getComputedStyle(todoModal).opacity,
            zIndex: window.getComputedStyle(todoModal).zIndex
        });
    }, 150); // Small delay to ensure smooth transition
}

// Analyze event and return relevant todos
function analyzeEventAndGetTodos(event) {
    const title = event.title.toLowerCase();
    const description = (event.description || '').toLowerCase();
    const fullText = `${title} ${description}`;
    
    console.log('🧠 Intelligent Event Analysis:', { title, description });
    
    // PERSONALIZED RECOMMENDATIONS - Much more relevant!
    
    // Social Events
    if (containsKeywords(fullText, ['친구', 'friends', '만나', 'meet', '모임', 'gathering', '약속', '놀', '만남'])) {
        console.log('✅ Meeting with friends detected');
        // Create custom friend meeting todos
        return [
            {
                id: 'friends_custom_1',
                title: '장소 정하기',
                description: '분위기 좋고 대화하기 편한 카페나 레스토랑 찾기',
                category: 'planning',
                daysBefore: 3
            },
            {
                id: 'friends_custom_2',
                title: '예약하기',
                description: '인원수에 맞춰 미리 예약하기',
                category: 'coordination',
                daysBefore: 2
            },
            {
                id: 'friends_custom_3',
                title: '친구들에게 연락',
                description: '시간과 장소 확정해서 알려주기',
                category: 'communication',
                daysBefore: 1
            },
            {
                id: 'friends_custom_4',
                title: '교통편 확인',
                description: '대중교통 시간이나 주차 가능 여부 확인',
                category: 'logistical',
                daysBefore: 1
            }
        ];
    }
    
    // Study & Exams - Subject Specific
    if (containsKeywords(fullText, ['시험', 'test', 'exam', '평가', '고사', 'quiz'])) {
        console.log('✅ Exam detected');
        
        // Math exam
        if (containsKeywords(fullText, ['수학', 'math', '산수', '대수', '기하', '미적분'])) {
            return [
                {
                    id: 'math_custom_1',
                    title: '공식 정리하기',
                    description: '시험 범위의 중요 공식들 한 장에 정리',
                    category: 'study',
                    daysBefore: 5
                },
                {
                    id: 'math_custom_2',
                    title: '계산 실수 체크리스트',
                    description: '자주 하는 실수들 정리해서 주의하기',
                    category: 'review',
                    daysBefore: 3
                },
                {
                    id: 'math_custom_3',
                    title: '응용문제 연습',
                    description: '교과서와 문제집의 고난도 문제 풀기',
                    category: 'practice',
                    daysBefore: 2
                },
                {
                    id: 'math_custom_4',
                    title: '계산기 확인',
                    description: '허용되면 계산기 배터리와 작동 확인',
                    category: 'logistical',
                    daysBefore: 1
                }
            ];
        }
        
        // English exam
        if (containsKeywords(fullText, ['영어', 'english', '영문', '토익', 'toeic'])) {
            return [
                {
                    id: 'eng_custom_1',
                    title: '단어장 만들기',
                    description: '시험 범위 단어와 뜻 정리하기',
                    category: 'study',
                    daysBefore: 5
                },
                {
                    id: 'eng_custom_2',
                    title: '문법 정리',
                    description: '헷갈리는 문법 포인트 예문과 함께 정리',
                    category: 'study',
                    daysBefore: 4
                },
                {
                    id: 'eng_custom_3',
                    title: '리스닝 연습',
                    description: '교재 MP3로 듣기 연습하기',
                    category: 'practice',
                    daysBefore: 2
                }
            ];
        }
        
        // Default exam todos
        return todoRecommendations.exam;
    }
    
    // Dating & Romance
    if (containsKeywords(fullText, ['데이트', 'date', '여자친구', '남자친구', 'girlfriend', 'boyfriend'])) {
        console.log('✅ Date event detected');
        return [
            {
                id: 'date_custom_1',
                title: '데이트 코스 계획',
                description: '식사, 영화, 산책 등 하루 동선 짜기',
                category: 'planning',
                daysBefore: 3
            },
            {
                id: 'date_custom_2',
                title: '레스토랑 예약',
                description: '분위기 좋은 곳으로 미리 예약하기',
                category: 'coordination',
                daysBefore: 2
            },
            {
                id: 'date_custom_3',
                title: '날씨 확인',
                description: '야외 활동이 있다면 날씨 체크하기',
                category: 'information',
                daysBefore: 1
            },
            {
                id: 'date_custom_4',
                title: '옷 준비하기',
                description: '깔끔하고 상황에 맞는 옷 준비',
                category: 'preparation',
                daysBefore: 1
            }
        ];
    }
    
    // Sports & Exercise
    if (containsKeywords(fullText, ['운동', 'sports', 'exercise', '축구', '농구', '야구', '테니스', '수영', '헬스', 'gym'])) {
        console.log('✅ Sports event detected');
        return [
            {
                id: 'sport_custom_1',
                title: '운동복/장비 준비',
                description: '운동화, 운동복, 필요한 장비 체크',
                category: 'preparation',
                daysBefore: 1
            },
            {
                id: 'sport_custom_2',
                title: '몸 컨디션 조절',
                description: '무리한 운동 피하고 스트레칭하기',
                category: 'health',
                daysBefore: 1
            },
            {
                id: 'sport_custom_3',
                title: '음료/간식 준비',
                description: '물, 스포츠음료, 에너지바 준비',
                category: 'logistical',
                daysBefore: 1
            }
        ];
    }
    
    // Birthday & Parties
    if (containsKeywords(fullText, ['생일', 'birthday', '파티', 'party', '축하'])) {
        console.log('✅ Birthday/Party detected');
        return [
            {
                id: 'party_custom_1',
                title: '선물 준비하기',
                description: '받는 사람이 좋아할 만한 선물 고르기',
                category: 'preparation',
                daysBefore: 3
            },
            {
                id: 'party_custom_2',
                title: '케이크 준비',
                description: '생일 케이크나 특별한 디저트 준비',
                category: 'coordination',
                daysBefore: 2
            },
            {
                id: 'party_custom_3',
                title: '파티 준비물',
                description: '파티에 필요한 것들 체크하기',
                category: 'preparation',
                daysBefore: 1
            }
        ];
    }
    
    // Travel
    if (containsKeywords(fullText, ['여행', 'travel', 'trip', '휴가', 'vacation', '출장'])) {
        console.log('✅ Travel detected');
        return [
            {
                id: 'travel_custom_1',
                title: '숙소 예약',
                description: '호텔이나 숙박시설 예약 확인',
                category: 'coordination',
                daysBefore: 7
            },
            {
                id: 'travel_custom_2',
                title: '교통편 예약',
                description: '기차표, 버스표, 항공권 등 예약',
                category: 'coordination',
                daysBefore: 5
            },
            {
                id: 'travel_custom_3',
                title: '여행 일정 짜기',
                description: '가고 싶은 곳과 동선 계획하기',
                category: 'planning',
                daysBefore: 3
            },
            {
                id: 'travel_custom_4',
                title: '짐 싸기',
                description: '날씨에 맞는 옷과 필수품 챙기기',
                category: 'preparation',
                daysBefore: 1
            }
        ];
    }
    
    // Job & Work
    if (containsKeywords(fullText, ['면접', 'interview', '취업', 'job', '회사', '업무', 'work'])) {
        console.log('✅ Job/Work event detected');
        return [
            {
                id: 'job_custom_1',
                title: '회사 조사하기',
                description: '회사 정보와 업무 내용 파악',
                category: 'research',
                daysBefore: 3
            },
            {
                id: 'job_custom_2',
                title: '준비물 체크',
                description: '필요한 서류와 준비물 확인',
                category: 'preparation',
                daysBefore: 1
            },
            {
                id: 'job_custom_3',
                title: '복장 준비',
                description: '적절한 복장 준비하기',
                category: 'preparation',
                daysBefore: 1
            }
        ];
    }
    
    // Hospital & Medical
    if (containsKeywords(fullText, ['병원', 'hospital', '의사', 'doctor', '진료', '검사', '치과'])) {
        console.log('✅ Medical appointment detected');
        return [
            {
                id: 'hosp_custom_1',
                title: '진료 예약 확인',
                description: '예약 시간과 진료과 확인하기',
                category: 'information',
                daysBefore: 1
            },
            {
                id: 'hosp_custom_2',
                title: '보험증/신분증',
                description: '건강보험증과 신분증 준비',
                category: 'logistical',
                daysBefore: 1
            },
            {
                id: 'hosp_custom_3',
                title: '증상 정리하기',
                description: '의사에게 설명할 증상들 메모',
                category: 'preparation',
                daysBefore: 1
            }
        ];
    }
    
    // School projects and assignments (non-exam)
    if (containsKeywords(fullText, ['프로젝트', 'project', '과제', 'assignment', '발표', 'presentation'])) {
        console.log('✅ Project/Assignment detected');
        return todoRecommendations.project;
    }
    
    // School events
    if (containsKeywords(fullText, ['학교', 'school', '수업', 'class'])) {
        if (containsKeywords(fullText, ['행사', 'event', '축제', 'festival'])) {
            return todoRecommendations.school_event;
        }
        if (containsKeywords(fullText, ['수학여행', 'field trip', '견학'])) {
            return todoRecommendations.field_trip;
        }
    }
    
    // Default - but more relevant
    console.log('📌 Using improved default todos');
    return [
        {
            id: 'default_custom_1',
            title: '일정 상세 확인',
            description: '정확한 시간, 장소, 참석자 확인하기',
            category: 'coordination',
            daysBefore: 2
        },
        {
            id: 'default_custom_2',
            title: '준비물 체크',
            description: '필요한 물건들 미리 준비하기',
            category: 'preparation',
            daysBefore: 1
        },
        {
            id: 'default_custom_3',
            title: '이동 계획',
            description: '교통수단과 소요시간 확인하기',
            category: 'logistical',
            daysBefore: 1
        }
    ];
}

// Helper function to check if text contains any of the keywords
function containsKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
}

// Update todo recommendations UI without reopening modal
function updateTodoRecommendationsUI(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const recommendationsContainer = document.getElementById('todoRecommendations');
    
    // Analyze event and get relevant todos
    const relevantTodos = analyzeEventAndGetTodos(event);
    
    // Generate recommendations based on event date
    const eventDate = new Date(event.date);
    const recommendations = relevantTodos.map(todo => {
        const todoDate = new Date(eventDate);
        todoDate.setDate(todoDate.getDate() - todo.daysBefore);
        
        // Use timezone-safe date formatting
        const year = todoDate.getFullYear();
        const month = (todoDate.getMonth() + 1).toString().padStart(2, '0');
        const day = todoDate.getDate().toString().padStart(2, '0');
        const dueDateStr = `${year}-${month}-${day}`;
        
        return {
            ...todo,
            dueDate: dueDateStr,
            displayDate: formatDateForDisplay(todoDate)
        };
    });
    
    // Filter out todos that have already been added
    const availableRecommendations = recommendations.filter(todo => 
        !todos.some(t => t.recommendationId === todo.id && t.eventId === eventId)
    );
    
    // If no recommendations available, show a message
    if (availableRecommendations.length === 0) {
        recommendationsContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #666;">
                <i class="fas fa-check-circle" style="font-size: 2rem; color: #4CAF50; margin-bottom: 10px;"></i>
                <p>모든 추천 할일이 추가되었습니다!</p>
                <p style="font-size: 0.9rem; margin-top: 8px;">할일 목록에서 추가된 할일을 확인할 수 있습니다.</p>
            </div>
        `;
        return;
    }
    
    // Render only available recommendations
    recommendationsContainer.innerHTML = availableRecommendations.map(todo => {
        return `
            <div class="todo-item" data-todo-id="${todo.id}">
                <div class="todo-content">
                    <div class="todo-title">${todo.title}</div>
                    <div class="todo-description">${todo.description}</div>
                    <div class="todo-date">📅 ${todo.displayDate}</div>
                </div>
                <div class="todo-actions">
                    <button class="todo-btn add" onclick="addTodo('${todo.id}', '${eventId}')">
                        <i class="fas fa-plus"></i> 추가
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Add todo to user's list
function addTodo(recommendationId, eventId) {
    console.log('➕ addTodo called with:', recommendationId, eventId);
    
    // Find the recommendation from the appropriate category
    let recommendation = null;
    for (const category in todoRecommendations) {
        const found = todoRecommendations[category].find(r => r.id === recommendationId);
        if (found) {
            recommendation = found;
            break;
        }
    }
    
    // If not found in static recommendations, check dynamic custom todos
    if (!recommendation) {
        const event = events.find(e => e.id === eventId);
        if (event) {
            const customTodos = analyzeEventAndGetTodos(event);
            recommendation = customTodos.find(r => r.id === recommendationId);
            console.log('🔍 Searched in custom todos, found:', !!recommendation, recommendation?.title);
        }
    }
    
    const event = events.find(e => e.id === eventId);
    
    console.log('🔍 addTodo debug:');
    console.log('- Recommendation found:', !!recommendation, recommendation?.title);
    console.log('- Event found:', !!event, event?.title);
    
    if (!recommendation || !event) {
        console.log('❌ addTodo failed: Missing recommendation or event');
        console.log('- Available todo categories:', Object.keys(todoRecommendations));
        return;
    }
    
    const eventDate = new Date(event.date);
    const todoDate = new Date(eventDate);
    todoDate.setDate(todoDate.getDate() - recommendation.daysBefore);
    
    // Use timezone-safe date formatting for dueDate
    const year = todoDate.getFullYear();
    const month = (todoDate.getMonth() + 1).toString().padStart(2, '0');
    const day = todoDate.getDate().toString().padStart(2, '0');
    const dueDateStr = `${year}-${month}-${day}`;
    
    const newTodo = {
        id: generateId(),
        recommendationId: recommendationId,
        eventId: eventId,
        title: recommendation.title,
        description: recommendation.description,
        category: recommendation.category,
        dueDate: dueDateStr,
        displayDate: formatDateForDisplay(todoDate),
        addedAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    saveTodos();
    
    console.log('✅ Todo added:', newTodo.title, 'Due date:', newTodo.dueDate);
    console.log('📊 Total todos now:', todos.length);
    
    // Update calendar to show todo indicators
    renderCalendar();
    
    // Show success message
    showSuccessMessage('할일이 추가되었습니다');
    
    // Update the todo recommendations UI to show the change
    updateTodoRecommendationsUI(eventId);
}

// Remove todo from user's list
function removeTodo(recommendationId, eventId) {
    // Check the current modal state BEFORE making changes
    const todoModal = document.getElementById('todoModal');
    const modalTitle = todoModal?.querySelector('.modal-header h3');
    const isInTodoListModal = modalTitle && modalTitle.textContent === '내 할일 목록';
    const isInTodoDetailModal = modalTitle && modalTitle.textContent === '할일 상세';
    
    todos = todos.filter(todo => !(todo.recommendationId === recommendationId && todo.eventId === eventId));
    saveTodos();
    
    // Update calendar to show todo indicators
    renderCalendar();
    
    if (isInTodoListModal && todoModal.classList.contains('active')) {
        // If in todo list modal, refresh the list without closing modal
        showAllTodos();
    } else if (isInTodoDetailModal && todoModal.classList.contains('active')) {
        // If in todo detail modal, close all modals and return to calendar view
        console.log('🗑️ Trash clicked in todo detail modal - closing all modals and returning to calendar');
        preventTodoModalReopen = true; // Prevent modal from reopening
        closeTodoModal();
        closeModal(); // Also close any event modal that might be open
        showCalendarView(); // Ensure we're back to calendar view
        // Update the event list AFTER closing modals to prevent reopening
        updateEventList();
        // Clear the flag after a longer delay to ensure all async operations complete
        setTimeout(() => {
            preventTodoModalReopen = false;
            console.log('✅ Todo modal reopen prevention cleared');
        }, 500);
    } else {
        // If in other contexts, close the modal and update event list
        if (todoModal && todoModal.classList.contains('active')) {
            todoModal.classList.remove('active');
        }
        // Update the event list/todo panel at the bottom
        updateEventList();
    }
}

// Format date for display
function formatDateForDisplay(date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
        return '오늘';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return '내일';
    } else {
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = dayNames[date.getDay()];
        return `${date.getMonth() + 1}월 ${date.getDate()}일 (${dayName})`;
    }
}

// Show all user's todos
function showAllTodos() {
    const modal = document.getElementById('todoModal');
    const recommendationsContainer = document.getElementById('todoRecommendations');
    
    // Change modal title
    const modalTitle = modal.querySelector('.modal-header h3');
    modalTitle.textContent = '내 할일 목록';
    
    if (todos.length === 0) {
        // Show empty modal instead of system message
        recommendationsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #666;">
                <i class="fas fa-clipboard-list" style="font-size: 3rem; color: #ddd; margin-bottom: 16px;"></i>
                <h3 style="margin-bottom: 8px; color: #999;">할일이 없습니다</h3>
                <p style="font-size: 0.9rem;">캘린더에서 이벤트를 만들고 할일을 추가해보세요!</p>
            </div>
        `;
        modal.classList.add('active');
        return;
    }
    
    // Sort todos by due date
    const sortedTodos = [...todos].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    // Render all todos
    recommendationsContainer.innerHTML = sortedTodos.map(todo => {
        const event = events.find(e => e.id === todo.eventId);
        const eventTitle = event ? event.title : '알 수 없는 이벤트';
        
        return `
            <div class="todo-item added" data-todo-id="${todo.id}" style="display: flex; align-items: flex-start; gap: 12px;">
                <div class="todo-content" style="flex: 1;">
                    <div class="todo-title">${todo.title}</div>
                    <div class="todo-description">${todo.description}</div>
                    <div class="todo-date">📅 ${todo.displayDate}</div>
                    <div style="font-size: 0.7rem; color: #999; margin-top: 4px;">
                        📋 관련 이벤트: ${eventTitle}
                    </div>
                </div>
                <div class="todo-actions" style="flex-shrink: 0;">
                    <button class="todo-btn delete" onclick="removeTodo('${todo.recommendationId}', '${todo.eventId}')" style="
                        padding: 6px 10px;
                        font-size: 0.75rem;
                        min-width: auto;
                        width: auto;
                    ">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    modal.classList.add('active');
}

// Show todo detail
function showTodoDetail(todo) {
    // Check if modal reopening is currently prevented
    if (preventTodoModalReopen) {
        console.log('🚫 Preventing todo modal reopen after delete');
        return;
    }
    
    const event = events.find(e => e.id === todo.eventId);
    const eventTitle = event ? event.title : '알 수 없는 이벤트';
    
    const modal = document.getElementById('todoModal');
    const recommendationsContainer = document.getElementById('todoRecommendations');
    
    // Change modal title
    const modalTitle = modal.querySelector('.modal-header h3');
    modalTitle.textContent = '할일 상세';
    
    // Render todo detail
    recommendationsContainer.innerHTML = `
        <div class="todo-item added" data-todo-id="${todo.id}" style="display: flex; align-items: flex-start; gap: 12px;">
            <div class="todo-content" style="flex: 1;">
                <div class="todo-title">${todo.title}</div>
                <div class="todo-description">${todo.description}</div>
                <div class="todo-date">📅 ${todo.displayDate}</div>
                <div style="font-size: 0.8rem; color: #666; margin-top: 8px;">
                    📋 관련 이벤트: ${eventTitle}
                </div>
                <div style="font-size: 0.7rem; color: #999; margin-top: 4px;">
                    🏷️ 카테고리: ${getCategoryName(todo.category)}
                </div>
            </div>
            <div class="todo-actions" style="flex-shrink: 0;">
                <button class="todo-btn delete" onclick="removeTodo('${todo.recommendationId}', '${todo.eventId}')" style="
                    padding: 6px 10px;
                    font-size: 0.75rem;
                    min-width: auto;
                    width: auto;
                ">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    console.log('🔍 About to show todo detail modal, prevention flag:', preventTodoModalReopen);
    if (!preventTodoModalReopen) {
        modal.classList.add('active');
        console.log('✅ Todo detail modal shown');
    } else {
        console.log('🚫 Todo detail modal blocked by prevention flag');
    }
}

// Get category name in Korean
function getCategoryName(category) {
    const categoryNames = {
        'logistical': '물류/준비물',
        'preparation': '준비/계획',
        'research': '조사/리서치',
        'coordination': '조율/협의',
        'communication': '소통/공유',
        'content': '내용/자료',
        'administration': '행정/관리',
        'review': '복습/검토',
        'information': '정보/확인',
        'study': '학습/공부',
        'practice': '연습/실습',
        'planning': '계획/설계',
        'writing': '작성/글쓰기',
        'understanding': '이해/파악',
        'health': '건강/관리'
    };
    return categoryNames[category] || category;
}

// Save events to localStorage
function saveEvents() {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
}

// Load events from localStorage
function loadEvents() {
    const saved = localStorage.getItem('calendarEvents');
    if (saved) {
        events = JSON.parse(saved);
    }
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('calendarTodos', JSON.stringify(todos));
}

// Load todos from localStorage
function loadTodos() {
    const saved = localStorage.getItem('calendarTodos');
    if (saved) {
        todos = JSON.parse(saved);
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translate(-50%, 100%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, 100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 

// Initialize swipe gestures for todo items
function initializeSwipeGestures() {
    const swipeableItems = document.querySelectorAll('.todo-item.swipeable');
    
    swipeableItems.forEach(item => {
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let isDragging = false;
        let startTime = 0;
        
        // Touch events for mobile
        item.addEventListener('touchstart', handleTouchStart, { passive: false });
        item.addEventListener('touchmove', handleTouchMove, { passive: false });
        item.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        // Mouse events for desktop
        item.addEventListener('mousedown', handleMouseStart);
        item.addEventListener('mousemove', handleMouseMove);
        item.addEventListener('mouseup', handleMouseEnd);
        item.addEventListener('mouseleave', handleMouseEnd);
        
        function handleTouchStart(e) {
            e.preventDefault();
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
            isDragging = true;
            
            item.style.transition = 'none';
            item.style.transform = 'translateX(0)';
        }
        
        function handleTouchMove(e) {
            e.preventDefault();
            if (!isDragging) return;
            
            const touch = e.touches[0];
            currentX = touch.clientX - startX;
            
            // Limit horizontal movement
            if (Math.abs(currentX) > 100) {
                currentX = currentX > 0 ? 100 : -100;
            }
            
            item.style.transform = `translateX(${currentX}px)`;
            
            // Show swipe indicators
            const leftIndicator = item.querySelector('.swipe-left');
            const rightIndicator = item.querySelector('.swipe-right');
            
            if (currentX < -50) {
                leftIndicator.style.left = '0';
            } else {
                leftIndicator.style.left = '-100px';
            }
            
            if (currentX > 50) {
                rightIndicator.style.right = '0';
            } else {
                rightIndicator.style.right = '-100px';
            }
        }
        
        function handleTouchEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            const velocity = Math.abs(currentX) / duration;
            
            item.style.transition = 'transform 0.3s ease';
            
            // Determine swipe action based on distance and velocity
            if (Math.abs(currentX) > 80 || velocity > 0.5) {
                if (currentX < -50) {
                    // Swipe left - Add todo
                    handleSwipeLeft(item);
                } else if (currentX > 50) {
                    // Swipe right - Remove todo
                    handleSwipeRight(item);
                }
            } else {
                // Reset position
                item.style.transform = 'translateX(0)';
            }
            
            // Hide indicators
            const leftIndicator = item.querySelector('.swipe-left');
            const rightIndicator = item.querySelector('.swipe-right');
            leftIndicator.style.left = '-100px';
            rightIndicator.style.right = '-100px';
        }
        
        function handleMouseStart(e) {
            e.preventDefault();
            startX = e.clientX;
            startY = e.clientY;
            startTime = Date.now();
            isDragging = true;
            
            item.style.transition = 'none';
            item.style.transform = 'translateX(0)';
        }
        
        function handleMouseMove(e) {
            if (!isDragging) return;
            
            currentX = e.clientX - startX;
            
            // Limit horizontal movement
            if (Math.abs(currentX) > 100) {
                currentX = currentX > 0 ? 100 : -100;
            }
            
            item.style.transform = `translateX(${currentX}px)`;
            
            // Show swipe indicators
            const leftIndicator = item.querySelector('.swipe-left');
            const rightIndicator = item.querySelector('.swipe-right');
            
            if (currentX < -50) {
                leftIndicator.style.left = '0';
            } else {
                leftIndicator.style.left = '-100px';
            }
            
            if (currentX > 50) {
                rightIndicator.style.right = '0';
            } else {
                rightIndicator.style.right = '-100px';
            }
        }
        
        function handleMouseEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            const velocity = Math.abs(currentX) / duration;
            
            item.style.transition = 'transform 0.3s ease';
            
            // Determine swipe action based on distance and velocity
            if (Math.abs(currentX) > 80 || velocity > 0.5) {
                if (currentX < -50) {
                    // Swipe left - Add todo
                    handleSwipeLeft(item);
                } else if (currentX > 50) {
                    // Swipe right - Remove todo
                    handleSwipeRight(item);
                }
            } else {
                // Reset position
                item.style.transform = 'translateX(0)';
            }
            
            // Hide indicators
            const leftIndicator = item.querySelector('.swipe-left');
            const rightIndicator = item.querySelector('.swipe-right');
            leftIndicator.style.left = '-100px';
            rightIndicator.style.right = '-100px';
        }
    });
}

// Handle swipe left (add todo)
function handleSwipeLeft(item) {
    const todoId = item.dataset.todoId;
    const eventId = item.dataset.eventId;
    
    console.log('👆 Swipe left detected! TodoId:', todoId, 'EventId:', eventId);
    
    // Add the todo
    addTodo(todoId, eventId);
    
    // Show success message
    showSuccessMessage('캘린더에 추가되었습니다');
    
    // Animate the item out
    item.style.transform = 'translateX(-100%)';
    item.style.opacity = '0';
    
    // Remove the item after animation
    setTimeout(() => {
        item.remove();
        
        // Check if no more todos and show completion message
        const remainingTodos = document.querySelectorAll('.todo-item.swipeable');
        if (remainingTodos.length === 0) {
            const container = item.parentElement;
            container.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666;">
                    <i class="fas fa-check-circle" style="font-size: 2rem; color: #4CAF50; margin-bottom: 10px;"></i>
                    <p>모든 추천 할일이 추가되었습니다!</p>
                    <p style="font-size: 0.9rem; margin-top: 8px;">할일 목록에서 추가된 할일을 확인할 수 있습니다.</p>
                </div>
            `;
        }
    }, 300);
}

// Handle swipe right (remove todo)
function handleSwipeRight(item) {
    // Animate the item out
    item.style.transform = 'translateX(100%)';
    item.style.opacity = '0';
    
    // Remove the item after animation
    setTimeout(() => {
        item.remove();
        
        // Check if no more todos and show completion message
        const remainingTodos = document.querySelectorAll('.todo-item.swipeable');
        if (remainingTodos.length === 0) {
            const container = item.parentElement;
            container.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666;">
                    <i class="fas fa-check-circle" style="font-size: 2rem; color: #4CAF50; margin-bottom: 10px;"></i>
                    <p>모든 추천 할일이 추가되었습니다!</p>
                    <p style="font-size: 0.9rem; margin-top: 8px;">할일 목록에서 추가된 할일을 확인할 수 있습니다.</p>
                </div>
            `;
        }
    }, 300);
}

// =============================================
// Schedule Confirmation Modal Functions
// =============================================

let pendingScheduleEvents = []; // Store events waiting for confirmation
let acceptedEvents = []; // Store accepted events
let rejectedEvents = []; // Store rejected events

// Show schedule confirmation modal with multiple events
function showScheduleConfirmation(eventsArray) {
    console.log('📋 Showing schedule confirmation for:', eventsArray.length, 'events');
    
    // Handle both single event and array
    const events = Array.isArray(eventsArray) ? eventsArray : [eventsArray];
    
    const modal = document.getElementById('scheduleConfirmModal');
    const scheduleItemsContainer = document.getElementById('scheduleItems');
    
    // Clear previous items
    scheduleItemsContainer.innerHTML = '';
    acceptedEvents = [];
    rejectedEvents = [];
    
    // Generate HTML for each event
    events.forEach((eventData, index) => {
        const itemHtml = `
            <div class="schedule-item" data-event-index="${index}">
                <div class="schedule-info">
                    <div class="schedule-title">
                        <i class="fas fa-calendar-check"></i>
                        <input type="text" class="editable-title" value="${eventData.title}" 
                               data-original="${eventData.title}" 
                               onchange="updateEventTitle(${index}, this.value)"
                               placeholder="일정 제목을 수정하세요">
                        <button class="edit-btn" onclick="focusTitle(${index})" title="제목 수정">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="schedule-date">
                        <i class="fas fa-clock"></i>
                        <span>${formatDateForDisplay(eventData.date)}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="item-btn accept" onclick="acceptIndividualSchedule(${index})">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="item-btn reject" onclick="rejectIndividualSchedule(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        scheduleItemsContainer.innerHTML += itemHtml;
    });
    
    // Store the events data for confirmation
    modal.dataset.eventsData = JSON.stringify(events);
    
    // Show modal
    modal.classList.add('active');
    
    console.log('✅ Schedule confirmation modal displayed with', events.length, 'events');
}

// Show multiple schedule confirmations (legacy compatibility)
function showMultipleScheduleConfirmations(eventsArray) {
    showScheduleConfirmation(eventsArray);
}

// Format date for display in Korean
function formatDateForDisplay(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `${year}년 ${month}월 ${day}일`;
}

// Accept individual schedule item
function acceptIndividualSchedule(eventIndex) {
    const modal = document.getElementById('scheduleConfirmModal');
    const eventsData = JSON.parse(modal.dataset.eventsData);
    const eventData = eventsData[eventIndex];
    const scheduleItem = document.querySelector(`[data-event-index="${eventIndex}"]`);
    
    console.log('✅ Individual schedule accepted:', eventData.title);
    
    // Create and add the event immediately
    const newEvent = {
        id: generateId(),
        ...eventData
    };
    
    events.push(newEvent);
    saveEvents();
    renderCalendar();
    updateEventList();
    
    console.log('✅ Event added to calendar:', newEvent);
    
    // Store accepted event
    acceptedEvents.push(eventData);
    
    // Animate item disappearing
    scheduleItem.style.transform = 'translateX(100%)';
    scheduleItem.style.opacity = '0';
    
    // Remove item after animation
    setTimeout(() => {
        scheduleItem.remove();
        checkAllEventsProcessed();
    }, 300);
}

// Reject individual schedule item
function rejectIndividualSchedule(eventIndex) {
    const modal = document.getElementById('scheduleConfirmModal');
    const eventsData = JSON.parse(modal.dataset.eventsData);
    const eventData = eventsData[eventIndex];
    const scheduleItem = document.querySelector(`[data-event-index="${eventIndex}"]`);
    
    console.log('❌ Individual schedule rejected:', eventData.title);
    
    // Store rejected event
    rejectedEvents.push(eventData);
    
    // Animate item disappearing
    scheduleItem.style.transform = 'translateX(-100%)';
    scheduleItem.style.opacity = '0';
    
    // Remove item after animation
    setTimeout(() => {
        scheduleItem.remove();
        checkAllEventsProcessed();
    }, 300);
}

// Check if all events have been processed and show completion
function checkAllEventsProcessed() {
    const scheduleItemsContainer = document.getElementById('scheduleItems');
    const remainingItems = scheduleItemsContainer.querySelectorAll('.schedule-item');
    
    console.log(`📊 Remaining items in modal: ${remainingItems.length}`);
    
    if (remainingItems.length === 0) {
        // All events processed, show completion message and close modal
        console.log('✅ All schedule items processed, closing modal...');
        
        setTimeout(() => {
            hideScheduleConfirmation();
            
            if (acceptedEvents.length > 0) {
                showSuccessMessage(`📅 ${acceptedEvents.length}개의 일정이 추가되었습니다!`);
            }
            
            if (rejectedEvents.length > 0) {
                console.log(`❌ ${rejectedEvents.length}개의 일정이 거부되었습니다`);
            }
            
            // Reset for next use
            acceptedEvents = [];
            rejectedEvents = [];
        }, 500);
    }
}

// Hide schedule confirmation modal
function hideScheduleConfirmation() {
    const modal = document.getElementById('scheduleConfirmModal');
    modal.classList.remove('active');
    delete modal.dataset.eventsData;
    
    // Reset arrays
    acceptedEvents = [];
    rejectedEvents = [];
}

// =============================================
// Title Editing Functions
// =============================================

// Update event title when user edits it
function updateEventTitle(eventIndex, newTitle) {
    const modal = document.getElementById('scheduleConfirmModal');
    const eventsData = JSON.parse(modal.dataset.eventsData);
    
    // Update the event data
    eventsData[eventIndex].title = newTitle.trim();
    
    // Save back to modal dataset
    modal.dataset.eventsData = JSON.stringify(eventsData);
    
    console.log(`📝 Event ${eventIndex} title updated to:`, newTitle.trim());
}

// Focus on title input for editing
function focusTitle(eventIndex) {
    const titleInput = document.querySelector(`[data-event-index="${eventIndex}"] .editable-title`);
    if (titleInput) {
        titleInput.focus();
        titleInput.select(); // Select all text for easy replacement
        console.log('✏️ Title input focused for editing');
    }
}

// Reset title to original OCR value
function resetTitle(eventIndex) {
    const titleInput = document.querySelector(`[data-event-index="${eventIndex}"] .editable-title`);
    if (titleInput) {
        const originalTitle = titleInput.dataset.original;
        titleInput.value = originalTitle;
        updateEventTitle(eventIndex, originalTitle);
        console.log('🔄 Title reset to original:', originalTitle);
    }
}

// =============================================
// Image Crop Tool Functions
// =============================================

let currentImage = null;
let cropBox = { x: 0, y: 0, width: 0, height: 0 };
let isDragging = false;
let isResizing = false;
let dragStart = { x: 0, y: 0 };
let resizeHandle = null;
let canvas = null;
let ctx = null;
let imageScale = 1;
let imageOffset = { x: 0, y: 0 };

// Show image crop modal
function showImageCropModal(imageFile) {
    console.log('✂️ Showing image crop modal for:', imageFile.name);
    
    currentImage = imageFile;
    const modal = document.getElementById('imageCropModal');
    canvas = document.getElementById('cropCanvas');
    ctx = canvas.getContext('2d');
    
    // Load and display image
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            setupCropCanvas(img);
            initializeCropBox();
            initializeCropInteractions();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
    
    // Show modal and prevent background scrolling
    modal.classList.add('active');
    document.body.classList.add('crop-modal-open');
}

// Setup canvas with image
function setupCropCanvas(img) {
    const container = document.querySelector('.crop-canvas-container');
    const containerWidth = container.clientWidth - 16; // Smaller padding
    const containerHeight = container.clientHeight - 16;
    
    // Calculate scale to fit image in container, allowing upscale for better visibility
    const scaleX = containerWidth / img.width;
    const scaleY = containerHeight / img.height;
    imageScale = Math.min(scaleX, scaleY, 2); // Allow upscale up to 2x for better resolution
    
    const displayWidth = img.width * imageScale;
    const displayHeight = img.height * imageScale;
    
    // Set canvas size with device pixel ratio for high-DPI displays
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = displayWidth * devicePixelRatio;
    canvas.height = displayHeight * devicePixelRatio;
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';
    
    // Scale context for high-DPI
    ctx.scale(devicePixelRatio, devicePixelRatio);
    
    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw image with high quality
    ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
    
    // Store image offset for calculations
    imageOffset = {
        x: (containerWidth - displayWidth) / 2,
        y: (containerHeight - displayHeight) / 2
    };
    
    console.log('🖼️ High-res image setup:', { 
        displayWidth, 
        displayHeight, 
        imageScale, 
        devicePixelRatio,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
    });
}

// Initialize crop box in center
function initializeCropBox() {
    const overlay = document.getElementById('cropOverlay');
    const cropBoxElement = document.getElementById('cropBox');
    
    // Set initial crop box to center 20% of image (very small, centered)
    const margin = Math.min(canvas.width, canvas.height) * 0.25; // 25% margin on all sides
    const maxWidth = canvas.width - (margin * 2);
    const maxHeight = canvas.height - (margin * 2);
    
    const boxWidth = Math.min(maxWidth * 0.5, 200); // Much smaller: max 200px or 50% of available
    const boxHeight = Math.min(maxHeight * 0.5, 150); // Much smaller: max 150px or 50% of available
    const boxX = (canvas.width - boxWidth) / 2;
    const boxY = (canvas.height - boxHeight) / 2;
    
    // Ensure crop box is properly centered with margins
    cropBox = { 
        x: boxX, 
        y: boxY, 
        width: boxWidth, 
        height: boxHeight 
    };
    
    updateCropBoxDisplay();
    updateCropDimensions();
    
    console.log('📦 Crop box initialized centered with margins:', cropBox);
    console.log('📦 Canvas size:', { width: canvas.width, height: canvas.height });
    console.log('📦 Margin applied:', margin);
}

// Update crop box visual display
function updateCropBoxDisplay() {
    const cropBoxElement = document.getElementById('cropBox');
    const canvasRect = canvas.getBoundingClientRect();
    const containerRect = document.querySelector('.crop-canvas-container').getBoundingClientRect();
    
    const offsetX = canvasRect.left - containerRect.left;
    const offsetY = canvasRect.top - containerRect.top;
    
    // Ensure crop box stays within container bounds
    const maxX = containerRect.width - cropBox.width;
    const maxY = containerRect.height - cropBox.height;
    
    const displayX = Math.max(0, Math.min(offsetX + cropBox.x, maxX));
    const displayY = Math.max(0, Math.min(offsetY + cropBox.y, maxY));
    
    cropBoxElement.style.left = displayX + 'px';
    cropBoxElement.style.top = displayY + 'px';
    cropBoxElement.style.width = cropBox.width + 'px';
    cropBoxElement.style.height = cropBox.height + 'px';
}

// Update crop dimensions display
function updateCropDimensions() {
    const dimensionsElement = document.getElementById('cropDimensions');
    const actualWidth = Math.round(cropBox.width / imageScale);
    const actualHeight = Math.round(cropBox.height / imageScale);
    dimensionsElement.textContent = `선택 영역: ${actualWidth} x ${actualHeight}`;
}

// Reset crop box to full image
function resetCropBox() {
    cropBox = { x: 0, y: 0, width: canvas.width, height: canvas.height };
    updateCropBoxDisplay();
    updateCropDimensions();
    console.log('🔄 Crop box reset to full image');
}

// Cancel crop and close modal
function cancelCrop() {
    hideImageCropModal();
    console.log('❌ Crop cancelled');
}

// Confirm crop and proceed with OCR
async function confirmCrop() {
    console.log('✅ Crop confirmed:', cropBox);
    
    // Create cropped image
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    
    // Calculate actual crop dimensions
    const actualX = cropBox.x / imageScale;
    const actualY = cropBox.y / imageScale;
    const actualWidth = cropBox.width / imageScale;
    const actualHeight = cropBox.height / imageScale;
    
    croppedCanvas.width = actualWidth;
    croppedCanvas.height = actualHeight;
    
    // Create image from original file
    const img = new Image();
    img.onload = function() {
        // Draw cropped portion
        croppedCtx.drawImage(
            img,
            actualX, actualY, actualWidth, actualHeight,
            0, 0, actualWidth, actualHeight
        );
        
        // Enhance image quality before converting to blob
        const enhancedCanvas = enhanceImageForOCR(croppedCtx, croppedCanvas);
        
        // Convert enhanced image to blob and proceed with OCR
        enhancedCanvas.toBlob(async (blob) => {
            // Create file from blob
            const croppedFile = new File([blob], `enhanced_cropped_${currentImage.name}`, {
                type: currentImage.type,
                lastModified: Date.now()
            });
            
            console.log('✂️ Enhanced cropped image created:', croppedFile.name, croppedFile.size, 'bytes');
            
            // Hide crop modal
            hideImageCropModal();
            
            // Proceed with OCR using enhanced image
            await processCroppedImageForOCR(croppedFile);
        }, currentImage.type, 0.95);
    };
    
    const reader = new FileReader();
    reader.onload = function(e) {
        img.src = e.target.result;
    };
    reader.readAsDataURL(currentImage);
}

// Hide image crop modal
function hideImageCropModal() {
    const modal = document.getElementById('imageCropModal');
    modal.classList.remove('active');
    document.body.classList.remove('crop-modal-open');

    // Clean up crop interactions and restore scrolling
    isDragging = false;
    isResizing = false;
    resizeHandle = null;

    document.removeEventListener('mousemove', handleDragResize);
    document.removeEventListener('touchmove', handleDragResize, { passive: false });
    document.removeEventListener('mouseup', endDragResize);
    document.removeEventListener('touchend', endDragResize);

    currentImage = null;
    cropBox = { x: 0, y: 0, width: 0, height: 0 };
}

// Process cropped image for OCR (extracted from handleImageUpload)
async function processCroppedImageForOCR(croppedFile) {
    console.log('🔄 Processing cropped image for OCR...');
    
    try {
        // Show loading indicator
        showLoading();
        updateLoadingProgress(20, '📱 크롭된 이미지를 처리 중...');
        
        // Process image with higher quality for OCR
        const processedFile = await processImageForOCR(croppedFile);
        console.log('🔄 Cropped image processed for mobile compatibility');
        
        // Convert image to base64
        updateLoadingProgress(40, '🔄 이미지를 변환 중...');
        const imageData = await convertImageToBase64(processedFile);
        console.log('🔄 Cropped image converted to base64, type:', imageData.mediaType);
        
        // Send image to Claude for OCR and schedule extraction
        updateLoadingProgress(60, '🤖 AI가 크롭된 이미지에서 일정을 추출 중...');
        const ocrMessage = `이 한국 학교 학사일정 캘린더를 매우 정확하게 분석해주세요.

중요: 다음 단어들을 정확히 구별해서 읽어주세요:
- "전국연합학력평가" (전국연합학력평가)
- "재량휴업일" (재량휴업일) 
- "현장체험학습" (현장체험학습)
- "개교기념일" (개교기념일)
- "중간고사", "기말고사"
- "수학여행"

각 날짜별로 정확한 행사명을 읽고, 모든 일정을 빠뜨리지 말고 JSON 배열로 응답해주세요.
특히 작은 글씨나 괄호 안의 내용도 정확히 읽어주세요.`;
        
        const response = await callClaudeAPIWithImage(ocrMessage, imageData.base64, imageData.mediaType);
        updateLoadingProgress(90, '📋 일정 정보를 처리 중...');
        
        console.log('📋 Full OCR response received:', response);
        
        // Handle response same as original handleImageUpload
        if (response && response.fallback && response.error === 'CLAUDE_OVERLOADED') {
            console.log('🔄 Claude API overloaded, using intelligent fallback...');
            showErrorMessage('Claude API가 일시적으로 과부하 상태입니다. 잠시 후 다시 시도해주세요.');
            return;
        }
        
        if (response && (response.content || response.success)) {
            if (response.success && (response.event || response.events)) {
                if (response.events) {
                    hideLoading();
                    showScheduleConfirmation(response.events);
                } else if (response.event) {
                    hideLoading();
                    showScheduleConfirmation([response.event]);
                }
            } else {
                throw new Error('Invalid response format from OCR');
            }
        }
        
    } catch (error) {
        console.error('❌ Cropped image processing error:', error);
        showErrorMessage('크롭된 이미지 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        hideLoading();
    }
}

// Flow state for new multi-step UX
let flowState = {
    mode: null, // 'goal' | 'task'
    presetId: null,
    outputType: null, // 'calendar' | 'todo' | 'both'
    messages: [] // {role:'user'|'assistant', text:string}
};

function initNewFlowControllers() {
    const introView = document.getElementById('introView');
    const bottomSheet = document.getElementById('bottomSheet');
    const bsTitle = document.getElementById('bsTitle');
    const bsMessages = document.getElementById('bsMessages');
    const bsInput = document.getElementById('bsInput');
    const bsSend = document.getElementById('bsSend');
    const bsClose = document.getElementById('bsClose');
    // Removed output preference UI

    // Helper: fold intro card
        function collapseIntroCard(selectedText) {
        const introBody = document.getElementById('introBody');
        const selected = document.getElementById('introSelected');
        const introSub = document.querySelector('.intro-sub');
        if (selected) {
            selected.textContent = `${selectedText}`;
            selected.style.display = 'block';
        }
        if (introSub) {
            introSub.style.display = 'none';
        }
        if (!introBody) return;
        const fullHeight = introBody.scrollHeight;
        introBody.style.height = fullHeight + 'px';
        // force reflow
        void introBody.offsetHeight;
        introBody.style.opacity = '0';
        introBody.style.marginTop = '0px';
        introBody.style.height = '0px';
    }

    // Helper: restore intro card (no animation required)
    function restoreIntroCard() {
        const introBody = document.getElementById('introBody');
        const selected = document.getElementById('introSelected');
        const introSub = document.querySelector('.intro-sub');
        if (selected) {
            selected.style.display = 'none';
            selected.textContent = '';
        }
        if (introSub) {
            introSub.style.display = '';
        }
        if (!introBody) return;
        introBody.style.transition = '';
        introBody.style.height = '';
        introBody.style.opacity = '';
        introBody.style.marginTop = '';
    }

    // Helper: slide chat container in
    function slideInChat() {
        if (!bottomSheet) return;
        bottomSheet.style.display = 'block';
        bottomSheet.style.opacity = '0';
        bottomSheet.style.transform = 'translateY(12px)';
        bottomSheet.style.transition = 'transform 300ms ease, opacity 300ms ease';
        // insert under introView if needed
        if (introView && introView.nextElementSibling !== bottomSheet) {
            introView.parentNode.insertBefore(bottomSheet, introView.nextSibling);
        }
        // force reflow
        void bottomSheet.offsetHeight;
        bottomSheet.style.opacity = '1';
        bottomSheet.style.transform = 'translateY(0)';
    }

    // Initial view: intro only
    const aiBar = document.querySelector('.ai-input-section');
    if (aiBar) aiBar.style.display = 'none';
    const cal = document.getElementById('calendarView');
    const todoV = document.getElementById('todoListView');
    if (cal) cal.style.display = 'none';
    if (todoV) todoV.style.display = 'none';
    if (introView) introView.style.display = 'block';

    // Hide event list initially
    const elc = document.querySelector('.event-list-container');
    if (elc) elc.style.display = 'none';

    // Start buttons
    const startButtons = document.getElementById('startButtons');
    if (startButtons) {
        startButtons.addEventListener('click', (e) => {
            const btn = e.target.closest('button.home-btn');
            if (!btn) return;
            if (btn.id === 'customGoalApply') return; // handled separately (legacy)
            const mode = btn.dataset.mode; // goal or task
            const presetId = btn.dataset.id;
            flowState.mode = mode;
            flowState.presetId = presetId;
            document.body.classList.add('bs-open');
            introView.style.display = 'block';

            bsMessages.innerHTML = '';
            flowState.messages = [];

            // Unified behavior for all buttons
            const label = btn.textContent.trim();
            collapseIntroCard(label);
            setTimeout(() => {
                slideInChat();
                bsTitle.textContent = '목표 설정 대화';
                pushAssistant(getSeedPromptForPreset(presetId));
            }, 120);
        });
    }

    // Close chat
    bsClose.addEventListener('click', () => {
        bottomSheet.style.display = 'none';
        document.body.classList.remove('bs-open');
        restoreIntroCard();
        introView.style.display = 'block';
        flowState = { mode: null, presetId: null, outputType: null, messages: [] };
    });

    // Removed: output preference confirm handler

    async function handleLLMTurn() {
        // Build prompt per mode
        const latest = flowState.messages[flowState.messages.length - 1]?.text || '';
        let prompt = latest;
        if (flowState.mode === 'goal') {
            prompt = `당신은 코치입니다. 아래 사용자의 목표를 단계별로 구체화하고 필요한 일정/할일을 제안하세요. 대화는 간결한 한국어로 진행.
사용자: ${latest}`;
        } else if (flowState.mode === 'task') {
            // No guiding style; direct interpretation
            prompt = latest;
        }
        try {
            const ai = await callClaudeAPI(prompt);
            // For this flow, ai may yield event or plain text
            if (ai && ai.success && (ai.event || ai.events)) {
                // Apply to calendar immediately, then guide to output step
                if (ai.event) {
                    const newEvent = { id: generateId(), ...ai.event };
                    events.push(newEvent);
                }
                if (ai.events && Array.isArray(ai.events)) {
                    ai.events.forEach(ev => events.push({ id: generateId(), ...ev }));
                }
                saveEvents();
                renderCalendar();
                pushAssistant('일정을 생성했습니다. 출력 형식을 확인 후 계속 진행하세요.');
            } else if (ai && ai.success === false && ai.error) {
                pushAssistant(`오류: ${ai.error}`);
            } else {
                // Fallback: echo
                pushAssistant('내용을 반영했습니다. 출력 형식을 선택 후 확인을 눌러주세요.');
            }
        } catch (e) {
            pushAssistant('서버와 통신 중 오류가 발생했습니다.');
        }
    }

    function pushAssistant(text) {
        flowState.messages.push({ role: 'assistant', text });
        const div = document.createElement('div');
        div.className = 'msg assistant';
        div.textContent = text;
        bsMessages.appendChild(div);
        bsMessages.scrollTop = bsMessages.scrollHeight;
    }

    function pushUser(text) {
        flowState.messages.push({ role: 'user', text });
        const div = document.createElement('div');
        div.className = 'msg user';
        div.textContent = text;
        bsMessages.appendChild(div);
        bsMessages.scrollTop = bsMessages.scrollHeight;
    }

    bsSend.addEventListener('click', async () => {
        const text = bsInput.value.trim();
        if (!text) return;
        pushUser(text);
        bsInput.value = '';
        await handleLLMTurn();
    });

    bsInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const text = bsInput.value.trim();
            if (!text) return;
            pushUser(text);
            bsInput.value = '';
            await handleLLMTurn();
        }
    });

    // Removed: confirm to proceed handler
}

// Working view helpers
function showWorkingView() {
    document.getElementById('workingView').style.display = 'block';
    appendWorkingLog('> 작업 시작');
}
function hideWorkingView() {
    document.getElementById('workingView').style.display = 'none';
}
function appendWorkingLog(line) {
    const pre = document.getElementById('workingLog');
    if (!pre) return;
    pre.textContent += (pre.textContent ? "\n" : "") + line;
    pre.scrollTop = pre.scrollHeight;
}

function proceedAfterConfirm() {
    // Simulate working phase or stream logs
    const introView = document.getElementById('introView');
    const bottomSheet = document.getElementById('bottomSheet');
    introView.style.display = 'none';
    bottomSheet.style.display = 'none';
    showWorkingView();

    const steps = [
        '분석 중...', '데이터 구조화...', '캘린더/할일 반영...', '완료 정리...'
    ];
    let i = 0;
    const timer = setInterval(() => {
        if (i < steps.length) {
            appendWorkingLog(steps[i]);
            i++;
        } else {
            clearInterval(timer);
            hideWorkingView();
            // Final display by outputType
            if (flowState.outputType === 'calendar') {
                showCalendarView();
            } else if (flowState.outputType === 'todo') {
                showTodoListView();
            } else {
                // both: show calendar by default and toast
                showCalendarView();
                showSuccessMessage('캘린더와 할일에 반영되었습니다');
            }
            // Reset flow state
            flowState = { mode: null, presetId: null, outputType: null, messages: [] };
        }
    }, 600);
}

// Removed: confirm to proceed hook

// Initialize controllers after DOM ready
(function waitDom(){
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNewFlowControllers);
    } else {
        initNewFlowControllers();
    }
})();

function getSeedPromptForPreset(presetId) {
    switch (presetId) {
        case 'goal_general':
            return '안녕하세요! 어떤 대학교에 입학하고 싶으신가요? 목표 전형(수시/정시)과 희망 학과도 알려주세요.';
        case 'goal_study':
            return '안녕하세요! 수능에서 올리고 싶은 과목과 목표 등급이 무엇인가요? 주간/일간 학습 계획을 함께 세워볼게요.';
        case 'goal_habit':
            return '안녕하세요! 내신에서 올리고 싶은 과목과 현재 등급은 어느 정도인가요? 시험까지 남은 기간도 알려주세요.';
        case 'task_event':
            return '수행평가 준비를 도와드릴게요. 과목, 평가 유형(발표/보고서/실험 등), 제출일을 알려주세요.';
        case 'task_todo':
            return '생기부 관리 항목을 도와드릴게요. 현재 활동(동아리/봉사/진로/독서)과 보완하고 싶은 영역이 있나요?';
        case 'task_academy_homework':
            return '학원 숙제 관리 도와드릴게요. 어떤 과목 숙제인지와 마감일을 알려주시면 주간/일간 계획으로 정리해 드릴게요.';
        default:
            return '어떤 목표를 달성하고 싶으신가요? 기간과 중요도를 알려주세요.';
    }
}
