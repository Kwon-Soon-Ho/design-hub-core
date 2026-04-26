import { ChevronRight, Flag } from "lucide-react";
import { activeProjects, cellLabel, type CellType, type Priority, statusLabel, Status } from "@/lib/dashboard-data";
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
  high: "text-red-500",
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
  statusFilter: Status | "all";
}

export function ActiveProjects({ activeTab, statusFilter }: Props) {
  const list = activeProjects.filter((p) => {
    const tabMatch = activeTab === "all" || p.cell === activeTab;
    const statusMatch = statusFilter === "all" || p.status === statusFilter;
    return tabMatch && statusMatch;
  });

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">진행 중인 프로젝트</h2>
          <p className="text-sm font-medium text-muted-foreground">{list.length}개의 활성 작업</p>
        </div>
        <button className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
          전체 보기
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <article
            key={p.id}
            className="group relative overflow-hidden rounded-3xl bg-surface shadow-soft border border-hairline/40 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300"
          >
            {/* cell color stripe */}
            <span className={`absolute left-0 top-0 h-full w-[4px] ${cellBarClass[p.cell]}`} />

            <div className="p-5 pl-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${cellChipClass[p.cell]}`}
                >
                  {cellLabel[p.cell]}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold rounded-full bg-muted/60 px-2.5 py-1 ${priorityClass[p.priority]}`}
                >
                  <Flag className="h-3 w-3" />
                  우선순위 {priorityLabel[p.priority]}
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold text-foreground rounded-full border border-hairline/60 px-3 py-1 shadow-sm">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      p.status === "issue" ? "bg-red-500" : p.status === "ongoing" ? "bg-indigo-400" : p.status === "done" ? "bg-emerald-500" : "bg-blue-500"
                    }`}
                  />
                  {statusLabel[p.status]} · D-{p.dDay}
                </span>
              </div>

              <h3 className="mt-4 text-[16px] font-bold tracking-tight leading-snug text-foreground line-clamp-2 break-keep">
                {p.title}
              </h3>
              <p className="mt-1.5 text-[13.5px] font-medium text-muted-foreground/90 leading-relaxed line-clamp-2 break-keep">
                {p.description}
              </p>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-[12px] font-bold text-muted-foreground">
                  <span>진행률</span>
                  <span className="font-bold text-foreground tabular-nums">{p.progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${cellBarClass[p.cell]}`}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-muted text-[11px] font-bold text-foreground">
                    {p.owner.slice(0, 1)}
                  </span>
                  <span className="text-[12.5px] font-bold text-muted-foreground">{p.owner} · {p.updatedAt}</span>
                </div>
                <ChevronRight className="h-4.5 w-4.5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </article>
        ))}
        {list.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-hairline rounded-3xl">
            <p className="text-muted-foreground font-medium">선택한 상태에 해당하는 프로젝트가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}
