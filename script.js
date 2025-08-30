// Global variables
let currentDate = new Date();
let selectedDate = new Date();
let events = [];
let todos = [];
let currentEventForTodos = null;

// Korean month names
const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

// Todo recommendations data - Korean Middle/High School Student Focused
const todoRecommendations = {
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
    
    // Default generic todos for unknown event types
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
    initializeCalendar();
    initializeEventHandlers();
    loadEvents();
    loadTodos();
    updateEventList();
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

    // Today button
    document.getElementById('todayBtn').addEventListener('click', () => {
        currentDate = new Date();
        selectedDate = new Date();
        renderCalendar();
        updateMonthDisplay();
        updateEventList();
    });

    // Todos button
    document.getElementById('todosBtn').addEventListener('click', showAllTodos);

    // AI Input
    const aiInput = document.getElementById('aiInput');
    const aiSendBtn = document.getElementById('aiSendBtn');

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
    
    // Keyboard shortcuts for closing modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (document.getElementById('todoModal').classList.contains('active')) {
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

// Get events for a specific date
function getEventsForDate(date) {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
}

// Get todos for a specific date
function getTodosForDate(date) {
    const dateStr = date.toISOString().split('T')[0];
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
        
        todoItem.addEventListener('click', () => showTodoDetail(todo));
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
        
        return {
            ...todo,
            dueDate: todoDate.toISOString().split('T')[0],
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

// Call Claude API through our Render backend
async function callClaudeAPI(userMessage) {
    // Use local backend for development, Render backend for production
    const apiUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') 
        ? 'http://localhost:8080/api/claude' 
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
        
        console.log('🔧 Parsed Korean date:', monthDayMatch[1] + '월', monthDayMatch[2] + '일', '→', eventDate.toISOString().split('T')[0]);
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
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
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
            
            return {
                ...todo,
                dueDate: todoDate.toISOString().split('T')[0],
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
    
    console.log('Analyzing event:', { title, description, fullText });
    console.log('Available todo categories:', Object.keys(todoRecommendations));
    
    // Check for Korean school-related event types and return relevant todos
    if (containsKeywords(fullText, ['시험', 'exam', '중간고사', '기말고사', '모의고사', '수능', '학력평가'])) {
        console.log('✅ Matched EXAM category');
        console.log('Exam todos:', todoRecommendations.exam);
        return todoRecommendations.exam;
    }
    
    if (containsKeywords(fullText, ['프로젝트', 'project', '과제', 'assignment', '발표', 'presentation', '연구'])) {
        console.log('✅ Matched PROJECT category');
        return todoRecommendations.project;
    }
    
    if (containsKeywords(fullText, ['학교행사', 'school event', '체육대회', '예술제', '수학여행', '졸업식', '입학식'])) {
        console.log('✅ Matched SCHOOL_EVENT category');
        return todoRecommendations.school_event;
    }
    
    if (containsKeywords(fullText, ['동아리', 'club', '방과후', 'after school', '특별활동', '동호회'])) {
        console.log('✅ Matched CLUB category');
        return todoRecommendations.club;
    }
    
    if (containsKeywords(fullText, ['숙제', 'homework', '과제', 'assignment', '레포트', 'report'])) {
        console.log('✅ Matched HOMEWORK category');
        return todoRecommendations.homework;
    }
    
    if (containsKeywords(fullText, ['수학여행', 'field trip', '견학', '체험학습', '현장학습'])) {
        console.log('✅ Matched FIELD_TRIP category');
        return todoRecommendations.field_trip;
    }
    
    if (containsKeywords(fullText, ['스터디', 'study group', '그룹스터디', 'peer study', '같이공부'])) {
        console.log('✅ Matched STUDY_GROUP category');
        return todoRecommendations.study_group;
    }
    
    console.log('❌ No category matched, returning DEFAULT');
    return todoRecommendations.default;
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
        
        return {
            ...todo,
            dueDate: todoDate.toISOString().split('T')[0],
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
    // Find the recommendation from the appropriate category
    let recommendation = null;
    for (const category in todoRecommendations) {
        const found = todoRecommendations[category].find(r => r.id === recommendationId);
        if (found) {
            recommendation = found;
            break;
        }
    }
    
    const event = events.find(e => e.id === eventId);
    
    if (!recommendation || !event) return;
    
    const eventDate = new Date(event.date);
    const todoDate = new Date(eventDate);
    todoDate.setDate(todoDate.getDate() - recommendation.daysBefore);
    
    const newTodo = {
        id: generateId(),
        recommendationId: recommendationId,
        eventId: eventId,
        title: recommendation.title,
        description: recommendation.description,
        category: recommendation.category,
        dueDate: todoDate.toISOString().split('T')[0],
        displayDate: formatDateForDisplay(todoDate),
        addedAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    saveTodos();
    
    // Update calendar to show todo indicators
    renderCalendar();
    
    // Show success message
    showSuccessMessage('할일이 추가되었습니다');
    
    // Update the todo recommendations UI to show the change
    // updateTodoRecommendationsUI(eventId);
}

// Remove todo from user's list
function removeTodo(recommendationId, eventId) {
    todos = todos.filter(todo => !(todo.recommendationId === recommendationId && todo.eventId === eventId));
    saveTodos();
    
    // Update calendar to show todo indicators
    renderCalendar();

    // Update the event list/todo panel at the bottom
    updateEventList();

    // Close the todo detail modal if it is open
    const todoModal = document.getElementById('todoModal');
    if (todoModal && todoModal.classList.contains('active')) {
        todoModal.classList.remove('active');
    }
    
    // Show success message
    // showSuccessMessage('할일이 삭제되었습니다');
    
    // Update the todo recommendations UI to show the change
    // updateTodoRecommendationsUI(eventId);
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
    if (todos.length === 0) {
        showSuccessMessage('추가된 할일이 없습니다');
        return;
    }
    
    // Sort todos by due date
    const sortedTodos = [...todos].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    const modal = document.getElementById('todoModal');
    const recommendationsContainer = document.getElementById('todoRecommendations');
    
    // Change modal title
    const modalTitle = modal.querySelector('.modal-header h3');
    modalTitle.textContent = '내 할일 목록';
    
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
    
    modal.classList.add('active');
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
