import { useState, useRef } from "react";
import { ArrowUpRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { type CellType, cellLabel, featured as initialFeatured, microThumbnails, Project } from "@/lib/dashboard-data";

const cellChipClass: Record<CellType, string> = {
  video: "bg-cell-video-soft text-cell-video",
  ux: "bg-cell-ux-soft text-cell-ux",
  edit: "bg-cell-edit-soft text-cell-edit",
};

export function HeroSection() {
  const [featured, setFeatured] = useState<Project>(initialFeatured);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section className="space-y-4">
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
      <article className="group relative overflow-hidden rounded-3xl bg-surface shadow-soft-md border border-hairline/40">
        <div className="grid md:grid-cols-[1.4fr_1fr]">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={featured.cover}
              alt={featured.title}
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover blur-3xl opacity-80 scale-110"
            />
            {/* inner shadow mask */}
            <div className="absolute inset-0 z-[5] bg-gradient-to-t from-background/80 via-transparent to-background/20 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none" />
            
            <img
              src={featured.cover}
              alt={featured.title}
              loading="eager"
              className="relative z-10 h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />
            
            <div className="absolute left-4 top-4 flex items-center gap-2 z-20">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-bold ${cellChipClass[featured.cell]}`}
              >
                {cellLabel[featured.cell]}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-[12px] font-bold text-white backdrop-blur-md">
                <Clock className="h-3.5 w-3.5" />
                {featured.updatedAt}
              </span>
            </div>

            {/* Image Stack Indicator */}
            <div className="absolute right-4 bottom-4 z-20 flex items-center gap-2 bg-background/60 backdrop-blur-md rounded-full pr-3.5 p-1.5 border border-white/10 shadow-lg">
              <div className="flex -space-x-2.5">
                <img src={featured.cover} className="h-8 w-8 rounded-full object-cover border-2 border-background" />
                <img src={microThumbnails[0]?.cover} className="h-8 w-8 rounded-full object-cover border-2 border-background" />
                <img src={microThumbnails[1]?.cover} className="h-8 w-8 rounded-full object-cover border-2 border-background" />
              </div>
              <span className="text-[11px] font-bold text-foreground tracking-tight">+2 시안</span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-snug text-foreground line-clamp-3">
                {featured.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-[12px] font-bold text-foreground border border-hairline/60 shadow-sm">
                  PM: {featured.owner}
                </span>
                <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-[12px] font-bold text-foreground border border-hairline/60 shadow-sm">
                  협업부서: 경영기획팀
                </span>
                <span className="inline-flex items-center rounded-full bg-destructive/10 text-destructive px-3 py-1 text-[12px] font-bold">
                  D-{featured.dDay}
                </span>
              </div>
              <p className="text-[14.5px] font-medium leading-relaxed text-muted-foreground/90 line-clamp-3">
                {featured.description}
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-[12px] font-bold text-muted-foreground">
                  <span>진행률</span>
                  <span className="text-foreground">{featured.progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-foreground"
                    style={{ width: `${featured.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-bold text-foreground">{featured.owner}</span>
                </div>
                <button className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2.5 text-[13px] font-bold text-background hover:opacity-90 transition-opacity shadow-md">
                  열기 <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Micro thumbnails slider */}
      <div className="relative group/slider mt-6">
        <button onClick={() => scroll("left")} className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 grid h-10 w-10 place-items-center rounded-full bg-background/80 backdrop-blur-md border border-hairline/60 text-foreground shadow-lg opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-background">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button onClick={() => scroll("right")} className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 grid h-10 w-10 place-items-center rounded-full bg-background/80 backdrop-blur-md border border-hairline/60 text-foreground shadow-lg opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-background">
          <ChevronRight className="h-5 w-5" />
        </button>
        <div ref={scrollRef} className="no-scrollbar flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 snap-x snap-mandatory scroll-smooth">
          {microThumbnails.map((p) => (
            <article
              key={p.id}
              onClick={() => setFeatured(p)}
              className="relative shrink-0 snap-start overflow-hidden rounded-2xl bg-surface shadow-soft w-[280px] aspect-video cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:ring-2 hover:ring-ring/50 transition-all duration-300"
            >
              <img
                src={p.cover}
                alt={p.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover blur-3xl opacity-80 scale-110"
              />
              <img
                src={p.cover}
                alt={p.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-contain object-center z-10"
              />
              {/* inner shadow mask for thumbnail */}
              <div className="absolute inset-0 z-15 bg-gradient-to-t from-background/90 via-background/10 to-transparent pointer-events-none" />

              <div className="absolute left-3 top-3 z-30">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm ${cellChipClass[p.cell]}`}
                >
                  {cellLabel[p.cell]}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 text-white z-30">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      p.status === "issue" ? "bg-red-500" : p.status === "done" ? "bg-emerald-500" : p.status === "ongoing" ? "bg-indigo-400" : "bg-blue-500"
                    }`}
                  />
                  <span className="text-[11px] font-bold tracking-wider opacity-90">
                    {p.status === "issue" ? "이슈" : p.status === "ongoing" ? "상시" : p.status === "done" ? "완료" : "진행 중"}
                  </span>
                  <span className="ml-auto text-[11px] font-bold opacity-90 tracking-tight">D-{p.dDay}</span>
                </div>
                <div className="line-clamp-2 text-[14px] font-bold leading-snug tracking-tight">
                  {p.title}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
