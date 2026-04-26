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

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

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
  cover: img("photo-1618005182384-a83a8bd57fbe", 1600),
  updatedAt: "2시간 전 업데이트",
  assignees: [
    { name: "강미나" },
    { name: "권순호" },
    { name: "이영희" }
  ],
  tasks: [
    { id: "t1", title: "메인 랜딩페이지 UI 시안", status: "done", date: "10.21" },
    { id: "t2", title: "컴포넌트 라이브러리 정비", status: "progress", date: "10.23" },
    { id: "t3", title: "에셋 패키징 및 핸드오프", status: "ongoing", date: "10.24" },
    { id: "t4", title: "QA 및 최종 배포 준비", status: "progress", date: "10.25" },
  ],
  issues: [
    { id: "i1", title: "반응형 웹 가이드라인 검토 지연", status: "issue", date: "10.22" },
    { id: "i2", title: "폰트 라이선스 확보 지연", status: "issue", date: "10.24" },
  ]
};

export const microThumbnails: Project[] = [
  { id: "m-1", title: "브랜드 리뉴얼", description: "업무 내용입니다.", cell: "ux", status: "progress", priority: "high", progress: 62, dDay: 14, owner: "강미나", cover: img("photo-1557683316-973673baf926"), updatedAt: "2시간 전" },
  { id: "m-2", title: "신제품 런칭 영상", description: "내용.", cell: "video", status: "progress", priority: "high", progress: 41, dDay: 7, owner: "김철수", cover: img("photo-1550745165-9bc0b252726f"), updatedAt: "5시간 전" },
  { id: "m-3", title: "모바일 앱 온보딩 개선", description: "내용.", cell: "ux", status: "issue", priority: "mid", progress: 28, dDay: 3, owner: "이영희", cover: img("photo-1561070791-2526d30994b5"), updatedAt: "어제" },
  { id: "m-4", title: "패키지 디자인", description: "내용.", cell: "edit", status: "ongoing", priority: "mid", progress: 75, dDay: 21, owner: "박지훈", cover: img("photo-1558591710-4b4a1ae0f04d"), updatedAt: "1일 전" },
  { id: "m-5", title: "캠페인 키비주얼", description: "내용.", cell: "edit", status: "issue", priority: "high", progress: 18, dDay: 2, owner: "최수정", cover: img("photo-1579546929518-9e396f3cc135"), updatedAt: "방금 전" },
  { id: "m-6", title: "사내 워크샵 영상", description: "내용.", cell: "video", status: "done", priority: "low", progress: 100, dDay: 30, owner: "정유진", cover: img("photo-1611532736597-de2d4265fba3"), updatedAt: "3일 전" },
  { id: "m-7", title: "디자인 시스템 토큰 정비", description: "내용.", cell: "ux", status: "ongoing", priority: "mid", progress: 54, dDay: 11, owner: "강미나", cover: img("photo-1558655146-9f40138edfeb"), updatedAt: "오늘" },
  { id: "m-8", title: "가을 프로모션 배너", description: "내용.", cell: "edit", status: "progress", priority: "high", progress: 85, dDay: 1, owner: "이영희", cover: img("photo-1604871000636-074fa5117945"), updatedAt: "4시간 전" },
  { id: "m-9", title: "웹사이트 메인 개편", description: "내용.", cell: "ux", status: "progress", priority: "high", progress: 12, dDay: 45, owner: "강미나", cover: img("photo-1614850523459-c2f4c699c52e"), updatedAt: "1시간 전" },
  { id: "m-10", title: "유튜브 인트로/아웃트로", description: "내용.", cell: "video", status: "issue", priority: "mid", progress: 40, dDay: 5, owner: "김철수", cover: img("photo-1563089145-599997674d42"), updatedAt: "어제" },
];

export const activeProjects: Project[] = [
  { id: "a-1", title: "브랜드 리뉴얼", description: "업무 내용입니다.", cell: "ux", status: "progress", priority: "high", progress: 62, dDay: 14, owner: "강미나", cover: img("photo-1557683316-973673baf926"), updatedAt: "2시간 전" },
  { id: "a-2", title: "신제품 런칭 영상", description: "내용.", cell: "video", status: "progress", priority: "high", progress: 41, dDay: 7, owner: "김철수", cover: img("photo-1550745165-9bc0b252726f"), updatedAt: "5시간 전" },
  { id: "a-3", title: "모바일 앱 온보딩 개선", description: "내용.", cell: "ux", status: "issue", priority: "mid", progress: 28, dDay: 3, owner: "이영희", cover: img("photo-1561070791-2526d30994b5"), updatedAt: "어제" },
  { id: "a-4", title: "패키지 디자인", description: "내용.", cell: "edit", status: "ongoing", priority: "mid", progress: 75, dDay: 21, owner: "박지훈", cover: img("photo-1558591710-4b4a1ae0f04d"), updatedAt: "1일 전" },
  { id: "a-5", title: "캠페인 키비주얼", description: "내용.", cell: "edit", status: "issue", priority: "high", progress: 18, dDay: 2, owner: "최수정", cover: img("photo-1579546929518-9e396f3cc135"), updatedAt: "방금 전" },
  { id: "a-6", title: "사내 워크샵 영상", description: "내용.", cell: "video", status: "done", priority: "low", progress: 100, dDay: 30, owner: "정유진", cover: img("photo-1611532736597-de2d4265fba3"), updatedAt: "3일 전" },
  { id: "a-7", title: "디자인 시스템 토큰 정비", description: "내용.", cell: "ux", status: "ongoing", priority: "mid", progress: 54, dDay: 11, owner: "강미나", cover: img("photo-1558655146-9f40138edfeb"), updatedAt: "오늘" },
  { id: "a-8", title: "가을 프로모션 배너", description: "내용.", cell: "edit", status: "progress", priority: "high", progress: 85, dDay: 1, owner: "이영희", cover: img("photo-1604871000636-074fa5117945"), updatedAt: "4시간 전" },
];

export const summary = {
  done: 24,
  progress: 12,
  issue: 5,
  ongoing: 8,
};
