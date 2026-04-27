export type CellType = "video" | "ux" | "edit";
export type Status = "progress" | "ongoing" | "issue" | "done";
export type Priority = "high" | "mid" | "low";

export interface Task {
  id: string;
  title: string;
  status: Status;
  date: string;
}

export interface Issue {
  id: string;
  title: string;
  status: Status;
  date: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  cell: CellType;
  status: Status;
  priority: Priority;
  progress: number;
  dDay: number;
  owner: string;
  cover: string;
  updatedAt: string;
  assignees?: { name: string; avatar?: string }[];
  tasks?: Task[];
  issues?: Issue[];
}

export const cellLabel: Record<CellType, string> = {
  video: "영상",
  ux: "UX",
  edit: "편집",
};

export const statusLabel: Record<Status, string> = {
  progress: "진행 중",
  ongoing: "상시",
  issue: "이슈",
  done: "완료",
};

export const priorityLabel: Record<Priority, string> = {
  high: "높음",
  mid: "보통",
  low: "낮음",
};

// 16:9 helper (w=1600, h=900)
const img16x9 = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&h=900&q=80`;

// Square 1:1 helper
const img1x1 = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&h=800&q=80`;

// Tall 9:16 helper
const img9x16 = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&h=1067&q=80`;

// Ultra-wide 21:9 helper
const img21x9 = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2100&h=900&q=80`;

export const featured: Project = {
  id: "p-hero",
  title: "2026년 3분기 대규모 브랜드 리뉴얼 및 가이드라인 재정립 프로젝트",
  description:
    "이곳에는 상세한 업무 내용과 협업 부서의 피드백 이슈 사항이 구체적으로 기록됩니다.",
  cell: "ux",
  status: "progress",
  priority: "high",
  progress: 62,
  dDay: 14,
  owner: "강미나",
  cover: img16x9("photo-1618005182384-a83a8bd57fbe"),
  updatedAt: "2시간 전 업데이트",
  assignees: [
    { name: "강미나" },
    { name: "권순호" },
    { name: "이영희" }
  ],
  tasks: [
    // Task 2: Long title stress-test samples
    { id: "t1", title: "신규 브랜드 아이덴티티 수립을 위한 메인 비주얼 가이드라인 고도화 및 하위 페이지 레이아웃 변형 작업", status: "done", date: "10.21" },
    { id: "t2", title: "2026년 상반기 글로벌 프로모션 캠페인을 위한 인터랙티브 모션 그래픽 소스 제작 및 디지털 사이니지 최적화", status: "progress", date: "10.23" },
    { id: "t3", title: "에셋 패키징 및 핸드오프", status: "ongoing", date: "10.24" },
    { id: "t4", title: "QA 및 최종 배포 준비", status: "progress", date: "10.25" },
    { id: "t5", title: "브랜드 컬러 시스템 정의", status: "done", date: "10.18" },
    { id: "t6", title: "타이포그래피 가이드 작성", status: "done", date: "10.19" },
    { id: "t7", title: "아이콘 세트 제작", status: "ongoing", date: "10.26" },
    { id: "t8", title: "모션 가이드라인 초안 작성", status: "progress", date: "10.27" },
    { id: "t9", title: "반응형 브레이크포인트 검토", status: "progress", date: "10.28" },
    { id: "t10", title: "다크모드 컬러 토큰 산정", status: "ongoing", date: "10.29" },
    { id: "t11", title: "그리드 시스템 문서화", status: "ongoing", date: "10.30" },
    { id: "t12", title: "스테이크홀더 최종 승인 요청", status: "progress", date: "10.31" },
  ],
  issues: [
    // Task 2: Long title stress-test samples
    { id: "i1", title: "신규 브랜드 아이덴티티 수립을 위한 메인 비주얼 가이드라인 고도화 및 하위 페이지 레이아웃 변형 작업 승인 지연", status: "issue", date: "10.22" },
    { id: "i2", title: "2026년 상반기 글로벌 프로모션 캠페인을 위한 인터랙티브 모션 그래픽 소스 제작 납기 지연 및 협력사 조율 필요", status: "issue", date: "10.24" },
    { id: "i3", title: "경영기획팀 피드백 미수신", status: "issue", date: "10.25" },
    { id: "i4", title: "외주 일러스트레이터 납기 지연", status: "issue", date: "10.26" },
    { id: "i5", title: "다크모드 접근성 기준 불명확", status: "progress", date: "10.23" },
    { id: "i6", title: "구형 브라우저 호환성 문제 발생", status: "issue", date: "10.27" },
    { id: "i7", title: "디자인 QA 환경 서버 불안정", status: "ongoing", date: "10.28" },
    { id: "i8", title: "최종 산출물 포맷 합의 필요", status: "progress", date: "10.29" },
    { id: "i9", title: "일부 아이콘 저작권 재검토", status: "issue", date: "10.30" },
    { id: "i10", title: "협업툴 권한 설정 오류", status: "done", date: "10.20" },
  ]
};

// Task 4: Diverse ratios for stress-testing Blur Matte (1:1, 9:16, 21:9, 16:9)
export const microThumbnails: Project[] = [
  { id: "m-1",  title: "브랜드 리뉴얼",             description: "업무 내용입니다.", cell: "ux",    status: "progress", priority: "high", progress: 62,  dDay: 14, owner: "강미나", cover: img16x9("photo-1618005182384-a83a8bd57fbe"), updatedAt: "2시간 전",  tasks: [], issues: [] },
  { id: "m-2",  title: "신제품 런칭 영상",           description: "내용.",           cell: "video", status: "progress", priority: "high", progress: 41,  dDay: 7,  owner: "김철수", cover: img1x1("photo-1574717024653-61fd2cf4d44d"),  updatedAt: "5시간 전",  tasks: [], issues: [] },
  { id: "m-3",  title: "모바일 앱 온보딩 개선",      description: "내용.",           cell: "ux",    status: "issue",    priority: "mid",  progress: 28,  dDay: 3,  owner: "이영희", cover: img9x16("photo-1512941937669-90a1b58e7e9c"), updatedAt: "어제",       tasks: [], issues: [] },
  { id: "m-4",  title: "패키지 디자인",              description: "내용.",           cell: "edit",  status: "ongoing",  priority: "mid",  progress: 75,  dDay: 21, owner: "박지훈", cover: img21x9("photo-1558591710-4b4a1ae0f04d"),  updatedAt: "1일 전",    tasks: [], issues: [] },
  { id: "m-5",  title: "캠페인 키비주얼",            description: "내용.",           cell: "edit",  status: "issue",    priority: "high", progress: 18,  dDay: 2,  owner: "최수정", cover: img16x9("photo-1609921212029-bb5a28e60960"), updatedAt: "방금 전",   tasks: [], issues: [] },
  { id: "m-6",  title: "사내 워크샵 영상",           description: "내용.",           cell: "video", status: "done",     priority: "low",  progress: 100, dDay: 30, owner: "정유진", cover: img1x1("photo-1611532736597-de2d4265fba3"),  updatedAt: "3일 전",    tasks: [], issues: [] },
  { id: "m-7",  title: "디자인 시스템 토큰 정비",    description: "내용.",           cell: "ux",    status: "ongoing",  priority: "mid",  progress: 54,  dDay: 11, owner: "강미나", cover: img9x16("photo-1558655146-9f40138edfeb"),  updatedAt: "오늘",       tasks: [], issues: [] },
  { id: "m-8",  title: "가을 프로모션 배너",          description: "내용.",           cell: "edit",  status: "progress", priority: "high", progress: 85,  dDay: 1,  owner: "이영희", cover: img21x9("photo-1561070791-2526d30994b5"),  updatedAt: "4시간 전",  tasks: [], issues: [] },
  { id: "m-9",  title: "웹사이트 메인 개편",         description: "내용.",           cell: "ux",    status: "progress", priority: "high", progress: 12,  dDay: 45, owner: "강미나", cover: img16x9("photo-1467232004584-a241de8bcf5d"), updatedAt: "1시간 전",  tasks: [], issues: [] },
  { id: "m-10", title: "유튜브 인트로/아웃트로",      description: "내용.",           cell: "video", status: "issue",    priority: "mid",  progress: 40,  dDay: 5,  owner: "김철수", cover: img1x1("photo-1550745165-9bc0b252726f"),   updatedAt: "어제",       tasks: [], issues: [] },
  { id: "m-11", title: "SNS 콘텐츠 패키지",          description: "내용.",           cell: "edit",  status: "progress", priority: "mid",  progress: 33,  dDay: 9,  owner: "최수정", cover: img9x16("photo-1504868584819-f8e8b4b6d7e3"), updatedAt: "2일 전",   tasks: [], issues: [] },
  { id: "m-12", title: "연간 리포트 디자인",          description: "내용.",           cell: "edit",  status: "ongoing",  priority: "low",  progress: 60,  dDay: 60, owner: "박지훈", cover: img21x9("photo-1497366216548-37526070297c"), updatedAt: "오늘",     tasks: [], issues: [] },
];

// Task 2: Scale to 12+ items for filter richness
export const activeProjects: Project[] = [
  { id: "a-1",  title: "브랜드 리뉴얼",              description: "업무 내용입니다.", cell: "ux",    status: "progress", priority: "high", progress: 62,  dDay: 14, owner: "강미나", cover: img16x9("photo-1618005182384-a83a8bd57fbe"), updatedAt: "2시간 전" },
  { id: "a-2",  title: "신제품 런칭 영상",            description: "내용.",           cell: "video", status: "progress", priority: "high", progress: 41,  dDay: 7,  owner: "김철수", cover: img16x9("photo-1574717024653-61fd2cf4d44d"), updatedAt: "5시간 전" },
  { id: "a-3",  title: "모바일 앱 온보딩 개선",       description: "내용.",           cell: "ux",    status: "issue",    priority: "mid",  progress: 28,  dDay: 3,  owner: "이영희", cover: img16x9("photo-1512941937669-90a1b58e7e9c"), updatedAt: "어제" },
  { id: "a-4",  title: "패키지 디자인",               description: "내용.",           cell: "edit",  status: "ongoing",  priority: "mid",  progress: 75,  dDay: 21, owner: "박지훈", cover: img16x9("photo-1558591710-4b4a1ae0f04d"), updatedAt: "1일 전" },
  { id: "a-5",  title: "캠페인 키비주얼",             description: "내용.",           cell: "edit",  status: "issue",    priority: "high", progress: 18,  dDay: 2,  owner: "최수정", cover: img16x9("photo-1609921212029-bb5a28e60960"), updatedAt: "방금 전" },
  { id: "a-6",  title: "사내 워크샵 영상",            description: "내용.",           cell: "video", status: "done",     priority: "low",  progress: 100, dDay: 30, owner: "정유진", cover: img16x9("photo-1611532736597-de2d4265fba3"), updatedAt: "3일 전" },
  { id: "a-7",  title: "디자인 시스템 토큰 정비",     description: "내용.",           cell: "ux",    status: "ongoing",  priority: "mid",  progress: 54,  dDay: 11, owner: "강미나", cover: img16x9("photo-1558655146-9f40138edfeb"), updatedAt: "오늘" },
  { id: "a-8",  title: "가을 프로모션 배너",           description: "내용.",           cell: "edit",  status: "progress", priority: "high", progress: 85,  dDay: 1,  owner: "이영희", cover: img16x9("photo-1561070791-2526d30994b5"), updatedAt: "4시간 전" },
  { id: "a-9",  title: "웹사이트 메인 개편",           description: "내용.",           cell: "ux",    status: "progress", priority: "high", progress: 12,  dDay: 45, owner: "강미나", cover: img16x9("photo-1467232004584-a241de8bcf5d"), updatedAt: "1시간 전" },
  { id: "a-10", title: "유튜브 채널 아트 리뉴얼",      description: "내용.",           cell: "video", status: "progress", priority: "mid",  progress: 40,  dDay: 5,  owner: "김철수", cover: img16x9("photo-1550745165-9bc0b252726f"), updatedAt: "어제" },
  { id: "a-11", title: "SNS 콘텐츠 템플릿 제작",       description: "내용.",           cell: "edit",  status: "progress", priority: "mid",  progress: 33,  dDay: 9,  owner: "최수정", cover: img16x9("photo-1504868584819-f8e8b4b6d7e3"), updatedAt: "2일 전" },
  { id: "a-12", title: "2026 연간 리포트 디자인",       description: "내용.",           cell: "edit",  status: "ongoing",  priority: "low",  progress: 60,  dDay: 60, owner: "박지훈", cover: img16x9("photo-1497366216548-37526070297c"), updatedAt: "오늘" },
];

export const summary = {
  done: 24,
  progress: 12,
  issue: 5,
  ongoing: 8,
};
