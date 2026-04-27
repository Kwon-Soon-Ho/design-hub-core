import { useState, useRef, useEffect } from "react";
import { ArrowUpRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type CellType, cellLabel, statusLabel, featured as initialFeatured, microThumbnails as initialThumbnails, Project } from "@/lib/dashboard-data";

const cellChipClass: Record<CellType, string> = {
  video: "bg-cell-video-soft text-cell-video",
  ux: "bg-cell-ux-soft text-cell-ux",
  edit: "bg-cell-edit-soft text-cell-edit",
};

export function HeroSection() {
  const [activeProject, setActiveProject] = useState<Project>(initialFeatured);
  const [thumbnails, setThumbnails] = useState<Project[]>(initialThumbnails);
  const [activeDraftCover, setActiveDraftCover] = useState(initialFeatured.cover);
  const [segmentTab, setSegmentTab] = useState<"tasks" | "issues">("tasks");
  // Task 4: scrollProgress ranges 0–400 for thumb translateX
  const [scrollProgress, setScrollProgress] = useState(0);

  // Drag-to-scroll state
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);
  const dragged = useRef(false);

  useEffect(() => {
    setActiveDraftCover(activeProject.cover);
  }, [activeProject]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -350 : 350;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  // Task 5: Calculate raw progress (0 to 1) to multiply by 400 for a 20% width thumb
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft: sl, scrollWidth, clientWidth } = scrollRef.current;
    const maxScrollLeft = scrollWidth - clientWidth;
    setScrollProgress(maxScrollLeft > 0 ? sl / maxScrollLeft : 0);
  };

  // Drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    dragged.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    if (Math.abs(walk) > 5) {
      dragged.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleThumbnailClick = (clickedProject: Project, index: number) => {
    if (dragged.current) return;
    const newThumbnails = [...thumbnails];
    newThumbnails[index] = activeProject;
    setActiveProject(clickedProject);
    setThumbnails(newThumbnails);
    setSegmentTab("tasks");
  };

  const draftImages = [
    activeProject.cover,
    "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1600&h=900&q=80",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc135?auto=format&fit=crop&w=1600&h=900&q=80"
  ];

  const leftOffsets = ["left-0 group-hover/drafts:left-0", "left-0 group-hover/drafts:left-[26px]", "left-0 group-hover/drafts:left-[52px]"];

  const listItems = segmentTab === "tasks" ? activeProject.tasks : activeProject.issues;
  const sortedItems = listItems ? [...listItems].sort((a, b) => a.date.localeCompare(b.date)) : [];

  const filteredAssignees = activeProject.assignees?.filter(member => member.name !== activeProject.owner) || [];

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">최근 업데이트</h2>
          <p className="text-sm font-medium text-muted-foreground">최근 업데이트된 프로젝트 내역입니다.</p>
        </div>
      </div>

      <motion.article
        layout
        className="group relative rounded-[32px] bg-surface shadow-soft-md border border-hairline/40"
      >
        <div className="grid h-auto md:h-[780px] md:grid-cols-[1.4fr_1fr] rounded-[32px] overflow-hidden">

          {/* Hero image — overflow-hidden traps shadow inside rounded corners; both images are absolute so they never dictate height */}
          <div className="relative overflow-hidden flex items-center justify-center bg-surface h-full">
            {/* Background blur matte — absolute, fills container */}
            <img
              src={activeDraftCover}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30 scale-110 pointer-events-none z-0"
            />

            {/* Task 2: Foreground — absolute inset-0 so it NEVER drives container height */}
            <AnimatePresence mode="popLayout">
              <motion.img
                key={`fg-${activeDraftCover}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ filter: "drop-shadow(0 28px 56px rgba(0,0,0,0.42)) brightness(1.05)" }}
                src={activeDraftCover}
                alt={activeProject.title}
                loading="eager"
                draggable={false}
                className="absolute inset-0 w-full h-full object-contain p-6 z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-[filter] duration-500"
              />
            </AnimatePresence>

            {/* Chips overlay */}
            <div className="absolute left-6 top-6 flex items-center gap-2 z-20">
              <span className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[12px] font-bold shadow-sm backdrop-blur-md ${cellChipClass[activeProject.cell]}`}>
                {cellLabel[activeProject.cell]}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3.5 py-1.5 text-[12px] font-bold text-white backdrop-blur-md shadow-sm">
                <Clock className="h-3.5 w-3.5" />
                {activeProject.updatedAt}
              </span>
            </div>

            {/* Draft thumbnails overlay */}
            <div className="absolute right-6 bottom-6 z-20 group/drafts flex items-center bg-background/60 backdrop-blur-md rounded-full px-2 py-1.5 border border-white/10 shadow-lg cursor-pointer hover:bg-background/80 transition-colors">
              <div className="flex relative w-8 h-8 group-hover/drafts:w-[84px] transition-all duration-300 ease-out">
                {draftImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    draggable={false}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDraftCover(src);
                    }}
                    className={`absolute h-8 w-8 rounded-full object-cover border-[2px] border-background transition-all duration-300 ease-out shadow-sm hover:scale-110 hover:-translate-y-1 ${leftOffsets[i]}`}
                    style={{ zIndex: 3 - i }}
                  />
                ))}
              </div>
              <span className="text-[11px] font-bold text-foreground tracking-tight ml-2 mr-1 whitespace-nowrap opacity-90">+3 시안</span>
            </div>
          </div>

          {/* Task 2: Right panel — min-h-0 added to complete the Flexbox chain */}
          <div className="flex flex-col h-full min-h-0 p-7 md:p-8 gap-5 relative z-20 bg-surface">
            <div className="shrink-0">
              <h3 className="text-2xl md:text-[26px] font-bold tracking-tight leading-snug text-foreground line-clamp-2 mb-3">
                {activeProject.title}
              </h3>

              <div className="mb-5 flex flex-col gap-2">
                <span className="text-sm font-bold text-muted-foreground uppercase">진행률</span>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black tabular-nums tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground leading-none shrink-0">
                    {activeProject.progress}%
                  </span>
                  <div className="h-4 w-full overflow-hidden rounded-full bg-muted/60 shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-700 ease-out"
                      style={{ width: `${activeProject.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-[11px] font-bold text-foreground border border-hairline/60 shadow-sm">
                  PM: {activeProject.owner}
                </span>
                <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-[11px] font-bold text-foreground border border-hairline/60 shadow-sm">
                  협업: 경영기획팀
                </span>
                {filteredAssignees.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-[11px] font-bold text-foreground border border-hairline/60 shadow-sm">
                    담당자: {filteredAssignees.map(a => a.name).join(", ")}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="bg-surface/50 border border-hairline/40 rounded-xl p-3 flex flex-col justify-center shadow-sm backdrop-blur-sm transition-colors hover:bg-surface">
                <span className="text-[12.5px] font-bold text-foreground tracking-tight">🗓️ 기간: 2026.04.01 - 2026.12.31</span>
              </div>
              <div className="bg-surface/50 border border-hairline/40 rounded-xl p-3 flex flex-col justify-center shadow-sm backdrop-blur-sm transition-colors hover:bg-surface">
                <span className="text-[12.5px] font-bold text-destructive tracking-tight">⏰ 마감: 2026년 12월 31일 (D-{activeProject.dDay})</span>
              </div>
            </div>

            {/* Task 2: Segment panel — layout prop REMOVED to fix Framer Motion flex-shrink override */}
            <div className="flex-1 min-h-0 flex flex-col bg-background/50 border border-border/40 rounded-[20px] p-5 shadow-sm">
              <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg mb-4 w-fit shrink-0">
                <button
                  onClick={() => setSegmentTab("tasks")}
                  className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-all ${
                    segmentTab === "tasks" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  업무 내역
                </button>
                <button
                  onClick={() => setSegmentTab("issues")}
                  className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-all ${
                    segmentTab === "issues" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  이슈 사항
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/60">
                <AnimatePresence mode="popLayout">
                  {sortedItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-border/50 rounded-xl p-3 mb-2 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <span className="text-[11.5px] font-bold text-muted-foreground tabular-nums shrink-0 w-[42px]">{item.date}</span>
                      {/* Task 1: flex-1 min-w-0 + truncate ensures ellipsis before status badge */}
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="text-[13px] font-bold text-foreground truncate leading-snug" title={item.title}>{item.title}</div>
                      </div>
                      <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        item.status === "issue" ? "bg-red-500/10 text-red-500 border-red-500/20" : item.status === "done" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : item.status === "ongoing" ? "bg-indigo-400/10 text-indigo-400 border-indigo-400/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      }`}>
                        {statusLabel[item.status] || "진행 중"}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {sortedItems.length === 0 && (
                  <p className="text-[13px] text-muted-foreground leading-relaxed py-4 text-center">등록된 항목이 없습니다.</p>
                )}
              </div>

              <div className="shrink-0 pt-4 mt-auto flex justify-end z-20">
                <button className="inline-flex items-center gap-1.5 rounded-[12px] bg-foreground px-5 py-2.5 text-[13px] font-bold text-background hover:scale-105 transition-all shadow-md active:scale-95">
                  프로젝트 상세 보기 <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      {/* Thumbnail slider */}
      <div className="relative group/slider mt-2">
        <button onClick={() => scroll("left")} className="absolute -left-5 top-1/2 -translate-y-1/2 z-[60] grid h-12 w-12 place-items-center rounded-full bg-background/80 backdrop-blur-xl border border-hairline/60 text-foreground shadow-xl opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-background">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button onClick={() => scroll("right")} className="absolute -right-5 top-1/2 -translate-y-1/2 z-[60] grid h-12 w-12 place-items-center rounded-full bg-background/80 backdrop-blur-xl border border-hairline/60 text-foreground shadow-xl opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-background">
          <ChevronRight className="h-6 w-6" />
        </button>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="no-scrollbar flex gap-4 overflow-x-auto py-4 -my-4 px-1 snap-x snap-mandatory scroll-smooth relative z-40 cursor-grab active:cursor-grabbing select-none"
        >
          <AnimatePresence mode="popLayout">
            {thumbnails.map((p, index) => (
              <motion.article
                key={p.id}
                layout
                onClick={() => handleThumbnailClick(p, index)}
                className="w-[260px] shrink-0 snap-start rounded-xl border border-foreground/20 shadow-sm bg-card overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col hover:-translate-y-1 duration-300"
              >
                {/* Task 2/4: Thumbnail — fixed height Blur Matte + GPU Optimization */}
                <div className="h-[140px] relative overflow-hidden bg-surface">
                  {/* Background blurred matte with will-change-transform */}
                  <img
                    src={p.cover}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110 z-0 pointer-events-none will-change-transform"
                  />
                  {/* Foreground true-ratio image */}
                  <img
                    src={p.cover}
                    alt={p.title}
                    loading="lazy"
                    draggable={false}
                    className="relative z-10 w-full h-full object-contain"
                  />
                </div>

                {/* Task 2: Info panel with subtle border+shadow */}
                <div className="bg-background border-t border-border/40 p-3 flex flex-col gap-3">
                  <h4 className="text-[14px] font-semibold text-foreground truncate leading-snug">
                    {p.title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-muted-foreground tabular-nums">
                      {p.updatedAt}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      p.status === "issue" ? "bg-red-500/10 text-red-500 border-red-500/20" : p.status === "done" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : p.status === "ongoing" ? "bg-indigo-400/10 text-indigo-400 border-indigo-400/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    }`}>
                      {statusLabel[p.status] || "진행 중"}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Task 5: Thumb scrollbar — 20%-wide relative thumb, exact translation */}
        <div className="h-1 w-full bg-border/30 rounded-full mt-4 relative">
          <div
            className="absolute top-0 left-0 h-full w-1/5 bg-foreground/40 rounded-full transition-transform duration-100 ease-out"
            style={{ transform: `translateX(${scrollProgress * 400}%)` }}
          />
        </div>
      </div>
    </section>
  );
}
