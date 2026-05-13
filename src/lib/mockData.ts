// 실제 Supabase courses/lectures 테이블이 채워지면 이 mock 데이터는 쓰지 않음
// Store.tsx, LectureViewer.tsx 에서 Supabase 쿼리 결과가 비었을 때만 fallback으로 사용

export interface Course {
  id: string
  title: string
  description: string
  price: number
  category: string
  initial: string
  color: string
  level: string
}

export interface Lecture {
  id: string
  course_id: string
  title: string
  youtube_url: string
  order_index: number
}

export const MOCK_COURSES: Course[] = [
  {
    id: 'mock-course-free',
    title: '맛보기 강의 (무료)',
    description: '강의 스타일을 직접 경험해보세요. 원리 중심 수업이 어떤 것인지 4강으로 맛볼 수 있습니다.',
    price: 0,
    category: '무료체험',
    initial: '▶',
    color: '#2c7a4b',
    level: '무료 · 맛보기',
  },
  {
    id: 'mock-course-1',
    title: '중학교 전범위 수학강의',
    description: '도형을 제외한 중학교 수학 전 범위를 개념 원리 중심으로 완성합니다.',
    price: 400000,
    category: '중등수학',
    initial: '中',
    color: '#8b0000',
    level: 'Lv.1 ~ 60',
  },
  {
    id: 'mock-course-2',
    title: '중학 도형 특강',
    description: '중학교 도형 영역만 집중적으로 파고드는 특화 강의입니다.',
    price: 400000,
    category: '중등수학',
    initial: '圖',
    color: '#2c5282',
    level: 'Lv.30 ~ 70',
  },
  {
    id: 'mock-course-3',
    title: '고1 전범위 수학강의',
    description: '고등학교 1학년 수학 전 범위를 수능 개념까지 연결하며 완성합니다.',
    price: 400000,
    category: '고등수학',
    initial: '高',
    color: '#c0392b',
    level: 'Lv.60 ~ 90',
  },
  {
    id: 'mock-course-4',
    title: '고2 수학 전범위 강의',
    description: '미적분·확률과 통계까지, 수능 최고 레벨을 완전 정복합니다.',
    price: 400000,
    category: '고등수학',
    initial: 'Σ',
    color: '#5b2d8e',
    level: 'Lv.90 ~ 120',
  },
]

export const MOCK_LECTURES: Record<string, Lecture[]> = {
  'mock-course-free': [
    { id: 'lec-f-1', course_id: 'mock-course-free', title: '1강 — 수학을 왜 어렵게 느끼는가', youtube_url: '', order_index: 1 },
    { id: 'lec-f-2', course_id: 'mock-course-free', title: '2강 — 개념을 외우지 않고 이해하는 법', youtube_url: '', order_index: 2 },
    { id: 'lec-f-3', course_id: 'mock-course-free', title: '3강 — 원리로 푸는 첫 번째 문제', youtube_url: '', order_index: 3 },
    { id: 'lec-f-4', course_id: 'mock-course-free', title: '4강 — 다음 단계로 넘어가기 전 체크리스트', youtube_url: '', order_index: 4 },
  ],
  'mock-course-1': [
    { id: 'lec-1-1', course_id: 'mock-course-1', title: '1강 — 자연수와 정수', youtube_url: '', order_index: 1 },
    { id: 'lec-1-2', course_id: 'mock-course-1', title: '2강 — 유리수와 소수', youtube_url: '', order_index: 2 },
    { id: 'lec-1-3', course_id: 'mock-course-1', title: '3강 — 사칙연산과 분배법칙', youtube_url: '', order_index: 3 },
    { id: 'lec-1-4', course_id: 'mock-course-1', title: '4강 — 방정식의 기초', youtube_url: '', order_index: 4 },
    { id: 'lec-1-5', course_id: 'mock-course-1', title: '5강 — 일차방정식 활용', youtube_url: '', order_index: 5 },
  ],
  'mock-course-2': [
    { id: 'lec-2-1', course_id: 'mock-course-2', title: '1강 — 기본 도형과 작도', youtube_url: '', order_index: 1 },
    { id: 'lec-2-2', course_id: 'mock-course-2', title: '2강 — 삼각형의 합동 조건', youtube_url: '', order_index: 2 },
    { id: 'lec-2-3', course_id: 'mock-course-2', title: '3강 — 사각형의 성질', youtube_url: '', order_index: 3 },
    { id: 'lec-2-4', course_id: 'mock-course-2', title: '4강 — 원과 부채꼴', youtube_url: '', order_index: 4 },
    { id: 'lec-2-5', course_id: 'mock-course-2', title: '5강 — 피타고라스 정리', youtube_url: '', order_index: 5 },
  ],
  'mock-course-3': [
    { id: 'lec-3-1', course_id: 'mock-course-3', title: '1강 — 다항식의 연산', youtube_url: '', order_index: 1 },
    { id: 'lec-3-2', course_id: 'mock-course-3', title: '2강 — 인수분해 완전 정복', youtube_url: '', order_index: 2 },
    { id: 'lec-3-3', course_id: 'mock-course-3', title: '3강 — 이차방정식', youtube_url: '', order_index: 3 },
    { id: 'lec-3-4', course_id: 'mock-course-3', title: '4강 — 이차함수 그래프', youtube_url: '', order_index: 4 },
    { id: 'lec-3-5', course_id: 'mock-course-3', title: '5강 — 집합과 명제', youtube_url: '', order_index: 5 },
  ],
  'mock-course-4': [
    { id: 'lec-4-1', course_id: 'mock-course-4', title: '1강 — 수열과 점화식', youtube_url: '', order_index: 1 },
    { id: 'lec-4-2', course_id: 'mock-course-4', title: '2강 — 극한의 개념', youtube_url: '', order_index: 2 },
    { id: 'lec-4-3', course_id: 'mock-course-4', title: '3강 — 미분 기초', youtube_url: '', order_index: 3 },
    { id: 'lec-4-4', course_id: 'mock-course-4', title: '4강 — 적분과 넓이', youtube_url: '', order_index: 4 },
    { id: 'lec-4-5', course_id: 'mock-course-4', title: '5강 — 확률과 통계', youtube_url: '', order_index: 5 },
  ],
}
