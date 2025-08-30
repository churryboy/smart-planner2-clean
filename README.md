# 🗓️ Smart Calendar - AI-Powered Mobile Calendar

모바일에 최적화된 AI 일정 관리 캘린더입니다. 자연어로 일정을 입력하면 Claude AI가 자동으로 파악하여 캘린더에 추가합니다.

## ✨ 주요 기능

- 📱 **모바일 최적화**: 모바일 기기에 완벽하게 최적화된 반응형 디자인
- 🇰🇷 **한국어 인터페이스**: 모든 UI가 한국어로 구성
- 🤖 **Claude AI 통합**: 자연어로 일정 입력 가능
- 📅 **직관적인 캘린더**: 월별 보기, 이벤트 표시, 날짜 선택
- 💾 **로컬 저장**: 브라우저에 일정 데이터 저장
- 🎨 **QandA-Store 디자인**: 오렌지 그라데이션 테마

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 서버 실행
```bash
npm start
```

### 3. 브라우저에서 접속
```
http://localhost:3000
```

## 💬 AI 일정 입력 예시

자연어로 일정을 입력하면 AI가 자동으로 파악합니다:

- **"내일 오후 2시에 회의"** → 내일 14:00 회의
- **"다음주 월요일에 출장"** → 다음주 월요일 종일 출장
- **"금요일 저녁 7시 저녁약속"** → 이번주 금요일 19:00 저녁약속
- **"3일 후 오전 10시에 면접"** → 3일 후 10:00 면접

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **AI**: Anthropic Claude API
- **스타일**: Font Awesome, Inter 폰트
- **데이터 저장**: Local Storage

## 📁 파일 구조

```
smart_planner2/
├── index.html          # 메인 HTML 파일
├── styles.css          # 스타일시트
├── script.js           # 프론트엔드 JavaScript
├── server.js           # Express 백엔드 서버
├── config.js           # API 설정
├── package.json        # Node.js 의존성
└── README.md           # 이 파일
```

## 🎯 사용법

1. **캘린더 탐색**: 상단 화살표로 월 이동
2. **날짜 선택**: 원하는 날짜 클릭
3. **일정 추가**: 하단 입력창에 자연어로 일정 입력
4. **일정 확인**: 선택한 날짜의 일정 목록 확인
5. **일정 삭제**: 일정 클릭 후 삭제 버튼

## 🔧 API 설정

Claude API 키는 `server.js`에 설정되어 있습니다. 필요시 환경변수로 변경 가능:

```javascript
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || 'your-api-key-here';
```

## 📱 모바일 최적화

- 터치 친화적 인터페이스
- 반응형 그리드 레이아웃
- 고정 헤더 및 하단 입력창
- 스와이프 제스처 지원
- 모바일 브라우저 최적화

## 🎨 디자인 특징

- **색상 테마**: 오렌지 그라데이션 (#FF5500)
- **타이포그래피**: Inter 폰트 사용
- **그림자 효과**: 부드러운 드롭 섀도우
- **애니메이션**: 부드러운 전환 효과
- **모던 UI**: 둥근 모서리, 깔끔한 레이아웃

## 🚨 문제 해결

### CORS 오류
- 백엔드 서버가 실행 중인지 확인
- `http://localhost:3000`으로 접속

### API 오류
- Claude API 키 유효성 확인
- 네트워크 연결 상태 확인

### 일정이 저장되지 않음
- 브라우저 Local Storage 지원 확인
- 브라우저 캐시 삭제

## 📄 라이선스

MIT License

---

**개발자**: Smart Calendar Team  
**버전**: 1.0.0  
**최종 업데이트**: 2024년 8월 # Force Render redeploy - Sat Aug 30 22:57:36 KST 2025
