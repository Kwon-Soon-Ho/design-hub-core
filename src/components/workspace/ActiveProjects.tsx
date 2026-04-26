import { ChevronRight, Flag } from "lucide-react";
import { activeProjects, cellLabel, type CellType, type Priority } from "@/lib/dashboard-data";
import { type TabValue } from "./CellTabs";

const cellChipClass: Record<CellType, string> = {
  video: "bg-cell-video-soft text-cell-video",
  ux: "bg-cell-ux-soft text-cell-ux",
  edit: "bg-cell-edit-soft text-cell-edit",
};

const cellBarClass: Record<CellType, string> = {
  video: "bg-cell-video",
  ux: "bg-cell-ux",
  edit: "bg-cell-edit",
};

const priorityClass: Record<Priority, string> = {
  high: "text-status-blocked",
  mid: "text-cell-edit",
  low: "text-muted-foreground",
};

const priorityLabel: Record<Priority, string> = {
  high: "높음",
  mid: "보통",
  low: "낮음",
};

interface Props {
  activeTab: TabValue;
}

export function ActiveProjects({ activeTab }: Props) {
  const list = activeProjects.filter((p) => activeTab === "all" || p.cell === activeTab);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">진행 중인 프로젝트</h2>
          <p className="text-sm text-muted-foreground">{list.length}개의 활성 작업</p>
        </div>
        <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
          전체 보기
        </button>
      </div>

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <article
            key={p.id}
            className="group relative overflow-hidden rounded-2xl bg-surface shadow-soft border border-hairline/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            {/* cell color stripe */}
            <span className={`absolute left-0 top-0 h-full w-[3px] ${cellBarClass[p.cell]}`} />

            <div className="p-4 pl-5">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${cellChipClass[p.cell]}`}
                >
                  {cellLabel[p.cell]}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-medium rounded-full bg-muted/60 px-2 py-0.5 ${priorityClass[p.priority]}`}
                >
                  <Flag className="h-3 w-3" />
                  우선순위 {priorityLabel[p.priority]}
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground rounded-full border border-hairline/60 px-2 py-0.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      p.status === "blocked" ? "bg-status-blocked" : "bg-status-progress"
                    }`}
                  />
                  D-{p.dDay}
                </span>
              </div>

              <h3 className="mt-3 text-[14.5px] font-semibold leading-snug tracking-tight text-foreground line-clamp-2 break-keep">
                {p.title}
              </h3>
              <p className="mt-1 text-[12.5px] text-muted-foreground line-clamp-2 break-keep">
                {p.description}
              </p>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>진행률</span>
                  <span className="font-medium text-foreground tabular-nums">{p.progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${cellBarClass[p.cell]}`}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
                    {p.owner.slice(0, 1)}
                  </span>
                  <span className="text-[12px] text-muted-foreground">{p.owner} · {p.updatedAt}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
