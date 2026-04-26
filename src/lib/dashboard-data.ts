export type CellType = "video" | "ux" | "edit";
export type Status = "progress" | "blocked" | "done" | "wait";
export type Priority = "high" | "mid" | "low";

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
}

export const cellLabel: Record<CellType, string> = {
  video: "영상",
  ux: "UX",
  edit: "편집",
};

export const statusLabel: Record<Status, string> = {
  progress: "진행 중",
  blocked: "블록",
  done: "완료",
  wait: "대기",
};

export const priorityLabel: Record<Priority, string> = {
  high: "높음",
  mid: "보통",
  low: "낮음",
};

// Realistic Unsplash image URLs (design / workspace / creative themed)
const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const featured: Project = {
  id: "p-hero",
  title: "2026년 3분기 대규모 브랜드 리뉴얼 및 가이드라인 재정립 프로젝트 (테스트용 긴 텍스트)",
  description:
    "이곳에는 상세한 업무 내용과 협업 부서의 피드백 이슈 사항이 구체적으로 기록됩니다.",
  cell: "ux",
  status: "progress",
  priority: "high",
  progress: 62,
  dDay: 14,
  owner: "강미나",
  cover: img("photo-1561070791-2526d30994b8", 1600),
  updatedAt: "2시간 전 업데이트",
};

export const microThumbnails: Project[] = [
  {
    id: "m-1",
    title: "브랜드 리뉴얼",
    description: "업무 내용입니다.",
    cell: "ux",
    status: "progress",
    priority: "high",
    progress: 62,
    dDay: 14,
    owner: "강미나",
    cover: img("photo-1558655146-9f40138edfeb"),
    updatedAt: "2시간 전",
  },
  {
    id: "m-2",
    title: "신제품 런칭 영상 시리즈 5편 편집 및 컬러그레이딩",
    description: "이곳에는 상세한 업무 내용과 협업 부서의 피드백 이슈 사항이 구체적으로 기록됩니다.",
    cell: "video",
    status: "progress",
    priority: "high",
    progress: 41,
    dDay: 7,
    owner: "김철수",
    cover: img("photo-1492691527719-9d1e07e534b4"),
    updatedAt: "5시간 전",
  },
  {
    id: "m-3",
    title: "모바일 앱 온보딩 개선",
    description: "업무 내용입니다.",
    cell: "ux",
    status: "blocked",
    priority: "mid",
    progress: 28,
    dDay: 3,
    owner: "이영희",
    cover: img("photo-1512941937669-90a1b58e7e9c"),
    updatedAt: "어제",
  },
  {
    id: "m-4",
    title: "패키지 디자인",
    description: "업무 내용입니다.",
    cell: "edit",
    status: "progress",
    priority: "mid",
    progress: 75,
    dDay: 21,
    owner: "박지훈",
    cover: img("photo-1513519245088-0e12902e5a38"),
    updatedAt: "1일 전",
  },
  {
    id: "m-5",
    title: "캠페인 키비주얼 시안 3종 및 서브 비주얼 변형안 제작",
    description: "이곳에는 상세한 업무 내용과 협업 부서의 피드백 이슈 사항이 구체적으로 기록됩니다.",
    cell: "edit",
    status: "blocked",
    priority: "high",
    progress: 18,
    dDay: 2,
    owner: "최수정",
    cover: img("photo-1542744095-291d1f67b221"),
    updatedAt: "방금 전",
  },
  {
    id: "m-6",
    title: "사내 워크샵 영상",
    description: "업무 내용입니다.",
    cell: "video",
    status: "progress",
    priority: "low",
    progress: 88,
    dDay: 30,
    owner: "정유진",
    cover: img("photo-1485846234645-a62644f84728"),
    updatedAt: "3일 전",
  },
  {
    id: "m-7",
    title: "디자인 시스템 토큰 정비",
    description: "업무 내용입니다.",
    cell: "ux",
    status: "progress",
    priority: "mid",
    progress: 54,
    dDay: 11,
    owner: "강미나",
    cover: img("photo-1545235617-9465d2a55698"),
    updatedAt: "오늘",
  },
];

export const activeProjects: Project[] = [
  {
    id: "a-1",
    title: "브랜드 리뉴얼",
    description: "업무 내용입니다.",
    cell: "ux",
    status: "progress",
    priority: "high",
    progress: 62,
    dDay: 14,
    owner: "강미나",
    cover: img("photo-1558655146-9f40138edfeb"),
    updatedAt: "2시간 전",
  },
  {
    id: "a-2",
    title: "2026년 3분기 대규모 브랜드 리뉴얼 및 가이드라인 재정립 프로젝트 (테스트용 긴 텍스트)",
    description:
      "이곳에는 상세한 업무 내용과 협업 부서의 피드백 이슈 사항이 구체적으로 기록됩니다.",
    cell: "ux",
    status: "progress",
    priority: "high",
    progress: 41,
    dDay: 7,
    owner: "강미나",
    cover: img("photo-1561070791-2526d30994b8"),
    updatedAt: "오늘",
  },
  {
    id: "a-3",
    title: "신제품 영상 편집",
    description: "업무 내용입니다.",
    cell: "video",
    status: "progress",
    priority: "mid",
    progress: 73,
    dDay: 9,
    owner: "김철수",
    cover: img("photo-1492691527719-9d1e07e534b4"),
    updatedAt: "어제",
  },
  {
    id: "a-4",
    title: "모바일 앱 온보딩 개선 및 사용성 테스트 리포트 정리 (블록 상태 검수 필요)",
    description:
      "이곳에는 상세한 업무 내용과 협업 부서의 피드백 이슈 사항이 구체적으로 기록됩니다.",
    cell: "ux",
    status: "blocked",
    priority: "high",
    progress: 28,
    dDay: 3,
    owner: "이영희",
    cover: img("photo-1512941937669-90a1b58e7e9c"),
    updatedAt: "어제",
  },
  {
    id: "a-5",
    title: "패키지 디자인",
    description: "업무 내용입니다.",
    cell: "edit",
    status: "progress",
    priority: "mid",
    progress: 75,
    dDay: 21,
    owner: "박지훈",
    cover: img("photo-1513519245088-0e12902e5a38"),
    updatedAt: "1일 전",
  },
  {
    id: "a-6",
    title: "캠페인 키비주얼",
    description: "업무 내용입니다.",
    cell: "edit",
    status: "blocked",
    priority: "high",
    progress: 18,
    dDay: 2,
    owner: "최수정",
    cover: img("photo-1542744095-291d1f67b221"),
    updatedAt: "방금 전",
  },
  {
    id: "a-7",
    title: "사내 워크샵 영상 시리즈 컬러 그레이딩",
    description: "업무 내용입니다.",
    cell: "video",
    status: "progress",
    priority: "low",
    progress: 88,
    dDay: 30,
    owner: "정유진",
    cover: img("photo-1485846234645-a62644f84728"),
    updatedAt: "3일 전",
  },
  {
    id: "a-8",
    title: "디자인 시스템 토큰 정비",
    description: "업무 내용입니다.",
    cell: "ux",
    status: "progress",
    priority: "mid",
    progress: 54,
    dDay: 11,
    owner: "강미나",
    cover: img("photo-1545235617-9465d2a55698"),
    updatedAt: "오늘",
  },
];

export const summary = {
  done: 24,
  progress: 12,
  blocked: 3,
  ongoing: 8,
};
