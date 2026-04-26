import { ArrowUpRight, Clock } from "lucide-react";
import { type CellType, cellLabel, featured, microThumbnails } from "@/lib/dashboard-data";

const cellChipClass: Record<CellType, string> = {
  video: "bg-cell-video-soft text-cell-video",
  ux: "bg-cell-ux-soft text-cell-ux",
  edit: "bg-cell-edit-soft text-cell-edit",
};

export function HeroSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">최근 업데이트</h2>
          <p className="text-sm text-muted-foreground">최근 업데이트된 프로젝트 내역입니다.</p>
        </div>
        <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
          전체 보기
        </button>
      </div>

      {/* Featured card */}
      <article className="group relative overflow-hidden rounded-2xl bg-surface shadow-soft-md">
        <div className="grid md:grid-cols-[1.4fr_1fr]">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={featured.cover}
              alt={featured.title}
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover blur-3xl opacity-50 scale-110"
            />
            <img
              src={featured.cover}
              alt={featured.title}
              loading="eager"
              className="relative z-10 h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute left-4 top-4 flex items-center gap-2 z-20">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${cellChipClass[featured.cell]}`}
              >
                {cellLabel[featured.cell]}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white">
                <Clock className="h-3 w-3" />
                {featured.updatedAt}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
            <div className="space-y-3">
              <h3 className="text-xl md:text-2xl font-semibold leading-snug tracking-tight text-foreground line-clamp-3">
                {featured.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-semibold text-foreground border border-hairline/60">
                  PM: {featured.owner}
                </span>
                <div className="flex -space-x-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-surface bg-muted text-[10px] font-semibold text-foreground">SJ</span>
                  <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-surface bg-muted text-[10px] font-semibold text-foreground">JH</span>
                  <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-surface bg-muted text-[10px] font-semibold text-foreground">YN</span>
                </div>
                <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-semibold text-foreground border border-hairline/60">
                  Team: Design
                </span>
                <span className="inline-flex items-center rounded-full bg-status-blocked/10 text-status-blocked px-2.5 py-0.5 text-[11px] font-semibold">
                  D-{featured.dDay}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {featured.description}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                  <span>진행률</span>
                  <span className="text-foreground">{featured.progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-foreground"
                    style={{ width: `${featured.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
                    {featured.owner.slice(0, 1)}
                  </span>
                  <span className="text-sm text-foreground">{featured.owner}</span>
                </div>
                <button className="inline-flex items-center gap-1 rounded-lg bg-foreground px-3 py-2 text-xs font-medium text-background hover:opacity-90 transition-opacity">
                  열기 <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Micro thumbnails slider */}
      <div className="relative">
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory">
          {microThumbnails.filter(p => p.status !== "blocked").map((p) => (
            <article
              key={p.id}
              className="relative shrink-0 snap-start overflow-hidden rounded-xl bg-surface shadow-soft w-[260px] aspect-video"
            >
              <img
                src={p.cover}
                alt={p.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover blur-3xl opacity-50 scale-110"
              />
              <img
                src={p.cover}
                alt={p.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-contain object-center z-10"
              />
              {/* Solid dim overlay (no blur) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-20 pointer-events-none" />

              <div className="absolute left-2.5 top-2.5 z-30">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${cellChipClass[p.cell]}`}
                >
                  {cellLabel[p.cell]}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-3 text-white z-30">
                <div className="mb-1 flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      p.status === "blocked" ? "bg-status-blocked" : "bg-status-progress"
                    }`}
                  />
                  <span className="text-[10px] uppercase tracking-wider opacity-85">
                    {p.status === "blocked" ? "Blocked" : "In Progress"}
                  </span>
                  <span className="ml-auto text-[10px] opacity-85">D-{p.dDay}</span>
                </div>
                <div className="line-clamp-2 text-[12.5px] font-semibold leading-snug">
                  {p.title}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium tabular-nums">{p.progress}%</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
