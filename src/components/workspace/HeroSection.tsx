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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveDraftCover(activeProject.cover);
  }, [activeProject]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -350 : 350;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const handleThumbnailClick = (clickedProject: Project, index: number) => {
    const newThumbnails = [...thumbnails];
    newThumbnails[index] = activeProject;
    setActiveProject(clickedProject);
    setThumbnails(newThumbnails);
    setSegmentTab("tasks"); // reset tab on change
  };

  const draftImages = [
    activeProject.cover,
    "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
  ];
  
  const leftOffsets = ["left-0 group-hover/drafts:left-0", "left-0 group-hover/drafts:left-[26px]", "left-0 group-hover/drafts:left-[52px]"];

  const listItems = segmentTab === "tasks" ? activeProject.tasks : activeProject.issues;
  const sortedItems = listItems ? [...listItems].sort((a, b) => a.date.localeCompare(b.date)) : [];

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">최근 업데이트</h2>
          <p className="text-sm font-medium text-muted-foreground">최근 업데이트된 프로젝트 내역입니다.</p>
        </div>
        <button className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
          전체 보기
        </button>
      </div>

      {/* Featured card */}
      <motion.article 
        layout 
        className="group relative overflow-hidden rounded-[32px] bg-surface shadow-soft-md border border-hairline/40"
      >
        <div className="grid md:grid-cols-[1.4fr_1fr]">
          <motion.div layoutId={`project-img-${activeProject.id}`} className="relative aspect-video md:aspect-auto md:h-full overflow-hidden bg-neutral-100/80 dark:bg-neutral-900/50 rounded-2xl p-4 flex items-center justify-center shadow-inner">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={`fg-${activeDraftCover}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                src={activeDraftCover}
                alt={activeProject.title}
                loading="eager"
                className="relative z-10 w-full h-full object-contain shadow-xl drop-shadow-lg rounded-xl ring-1 ring-black/5 transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </AnimatePresence>
            
            <div className="absolute left-6 top-6 flex items-center gap-2 z-20">
              <span className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[12px] font-bold shadow-sm backdrop-blur-md ${cellChipClass[activeProject.cell]}`}>
                {cellLabel[activeProject.cell]}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3.5 py-1.5 text-[12px] font-bold text-white backdrop-blur-md shadow-sm">
                <Clock className="h-3.5 w-3.5" />
                {activeProject.updatedAt}
              </span>
            </div>

            {/* Image Stack Indicator (Drafts) */}
            <div className="absolute right-6 bottom-6 z-20 group/drafts flex items-center bg-background/60 backdrop-blur-md rounded-full px-2 py-1.5 border border-white/10 shadow-lg cursor-pointer hover:bg-background/80 transition-colors">
              <div className="flex relative w-8 h-8 group-hover/drafts:w-[84px] transition-all duration-300 ease-out">
                {draftImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
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
          </motion.div>

          <div className="flex flex-col p-7 md:p-8 gap-5 relative z-20 bg-surface">
            <div>
              <motion.h3 layout className="text-2xl md:text-[26px] font-bold tracking-tight leading-snug text-foreground line-clamp-2 mb-3">
                {activeProject.title}
              </motion.h3>

              {/* Progress Bar directly under title */}
              <motion.div layout className="mb-4">
                <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground mb-1.5">
                  <span>진행률</span>
                  <span className="text-foreground">{activeProject.progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-foreground transition-all duration-500"
                    style={{ width: `${activeProject.progress}%` }}
                  />
                </div>
              </motion.div>

              {/* Metadata row */}
              <motion.div layout className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-[11px] font-bold text-foreground border border-hairline/60 shadow-sm">
                  PM: {activeProject.owner}
                </span>
                <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-[11px] font-bold text-foreground border border-hairline/60 shadow-sm">
                  협업: 경영기획팀
                </span>
                <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-[11px] font-bold text-foreground border border-hairline/60 shadow-sm">
                  담당자: {activeProject.assignees?.map(a => a.name).join(", ") || "배정 전"}
                </span>
              </motion.div>
            </div>

            <motion.div layout className="grid grid-cols-2 gap-3">
              <div className="bg-surface/50 border border-hairline/40 rounded-xl p-3 flex flex-col justify-center shadow-sm backdrop-blur-sm transition-colors hover:bg-surface">
                <span className="text-[12.5px] font-bold text-foreground tracking-tight">🗓️ 기간: 2026.04.01 - 2026.12.31</span>
              </div>
              <div className="bg-surface/50 border border-hairline/40 rounded-xl p-3 flex flex-col justify-center shadow-sm backdrop-blur-sm transition-colors hover:bg-surface">
                <span className="text-[12.5px] font-bold text-destructive tracking-tight">⏰ 마감: 2026년 12월 31일 (D-{activeProject.dDay})</span>
              </div>
            </motion.div>

            {/* Segment Tab View */}
            <motion.div layout className="flex-1 min-h-0 flex flex-col bg-background/50 border border-border/40 rounded-[20px] p-5 pb-16 shadow-sm relative">
              <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg mb-4 w-fit">
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
              
              <div className="overflow-y-auto max-h-[160px] custom-scrollbar pr-2 flex-1 relative z-10">
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
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-bold text-foreground truncate">{item.title}</div>
                      </div>
                      <span className="text-[11px] font-bold text-muted-foreground tabular-nums shrink-0">{item.date}</span>
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

              {/* Floating Button */}
              <button className="absolute bottom-5 right-5 inline-flex items-center gap-1.5 rounded-[12px] bg-foreground px-5 py-2.5 text-[13px] font-bold text-background hover:scale-105 transition-all shadow-md active:scale-95 z-20">
                프로젝트 상세 보기 <ArrowUpRight className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.article>

      {/* Micro thumbnails slider */}
      <div className="relative group/slider mt-2">
        <button onClick={() => scroll("left")} className="absolute -left-5 top-1/2 -translate-y-1/2 z-[60] grid h-12 w-12 place-items-center rounded-full bg-background/80 backdrop-blur-xl border border-hairline/60 text-foreground shadow-xl opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-background">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button onClick={() => scroll("right")} className="absolute -right-5 top-1/2 -translate-y-1/2 z-[60] grid h-12 w-12 place-items-center rounded-full bg-background/80 backdrop-blur-xl border border-hairline/60 text-foreground shadow-xl opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-background">
          <ChevronRight className="h-6 w-6" />
        </button>
        
        <div ref={scrollRef} className="no-scrollbar flex gap-4 overflow-x-auto py-4 -my-4 px-1 snap-x snap-mandatory scroll-smooth relative z-40">
          <AnimatePresence mode="popLayout">
            {thumbnails.map((p, index) => (
              <motion.article
                layoutId={`project-img-${p.id}`}
                key={p.id}
                onClick={() => handleThumbnailClick(p, index)}
                className="relative shrink-0 snap-start overflow-hidden rounded-[24px] bg-surface shadow-soft w-[280px] aspect-video cursor-pointer hover:-translate-y-1.5 hover:shadow-2xl hover:z-50 hover:ring-2 hover:ring-ring/50 transition-all duration-400"
              >
                <img
                  src={p.cover}
                  alt={p.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover blur-3xl opacity-80 scale-110 pointer-events-none"
                />
                <img
                  src={p.cover}
                  alt={p.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-contain object-center z-10 pointer-events-none"
                />
                {/* Premium Black Dim Gradient */}
                <div className="absolute inset-0 z-15 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                <div className="absolute left-4 top-4 z-30 pointer-events-none">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold shadow-md backdrop-blur-md ${cellChipClass[p.cell]}`}>
                    {cellLabel[p.cell]}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 text-white z-30 pointer-events-none">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full shadow-sm ${
                        p.status === "issue" ? "bg-red-500" : p.status === "done" ? "bg-emerald-500" : p.status === "ongoing" ? "bg-indigo-400" : "bg-blue-500"
                      }`}
                    />
                    <span className="text-[11px] font-bold tracking-wider opacity-100">
                      {p.status === "issue" ? "이슈" : p.status === "ongoing" ? "상시" : p.status === "done" ? "완료" : "진행 중"}
                    </span>
                    <span className="ml-auto text-[11px] font-bold opacity-100 tracking-tight bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">D-{p.dDay}</span>
                  </div>
                  <div className="line-clamp-2 text-[15px] font-bold leading-snug tracking-tight text-white/95">
                    {p.title}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
