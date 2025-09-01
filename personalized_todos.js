// HIGHLY PERSONALIZED TODO RECOMMENDATIONS
// This replaces the generic todos with context-aware, relevant suggestions

const personalizedTodoRecommendations = {
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
    
    // Default - More Intelligent
    default: [
        {
            id: 'default_1',
            title: '일정 상세 확인',
            description: '정확한 시간, 장소, 참석자 확인하기',
            category: 'coordination',
            daysBefore: 2
        },
        {
            id: 'default_2',
            title: '준비물 체크',
            description: '필요한 물건들 미리 준비하기',
            category: 'preparation',
            daysBefore: 1
        },
        {
            id: 'default_3',
            title: '이동 계획',
            description: '교통수단과 소요시간 확인하기',
            category: 'logistical',
            daysBefore: 1
        }
    ]
}; 