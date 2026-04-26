import { CheckCircle2, Loader2, OctagonAlert, RefreshCw } from "lucide-react";
import { summary } from "@/lib/dashboard-data";
import { type TabValue } from "./CellTabs";

const accentByTab: Record<TabValue, string> = {
  all: "bg-foreground",
  video: "bg-cell-video",
  ux: "bg-cell-ux",
  edit: "bg-cell-edit",
};

interface Props {
  activeTab: TabValue;
}

export function SummaryCards({ activeTab }: Props) {
  const items = [
    {
      label: "진행 중",
      sub: "In Progress",
      value: summary.progress,
      delta: "12개 활성",
      icon: Loader2,
      dot: "bg-blue-500",
      cardClass: "md:col-span-2 bg-gradient-to-br from-blue-500/10 to-surface border-blue-500/20",
      iconClass: "text-blue-500",
    },
    {
      label: "상시",
      sub: "Ongoing",
      value: summary.ongoing || 8,
      delta: "루틴 업무",
      icon: RefreshCw,
      dot: "bg-indigo-400",
      cardClass: "bg-surface",
      iconClass: "text-indigo-400",
    },
    {
      label: "이슈",
      sub: "Issue",
      value: summary.issue || 3,
      delta: "검토 필요",
      icon: OctagonAlert,
      dot: "bg-red-500",
      cardClass: "bg-gradient-to-br from-red-500/10 to-surface border-red-500/20",
      iconClass: "text-red-500",
    },
    {
      label: "완료",
      sub: "Completed",
      value: summary.done,
      delta: "+4 이번 주",
      icon: CheckCircle2,
      dot: "bg-emerald-500",
      cardClass: "bg-surface",
      iconClass: "text-emerald-500",
    },
  ];

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">2026 3Q 리소스 현황 및 프로젝트 진척도</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div
              key={it.label}
              className={`relative overflow-hidden rounded-3xl p-6 shadow-soft border border-hairline/40 transition-transform duration-300 hover:-translate-y-1 ${it.cardClass}`}
            >
              <div className="flex flex-col justify-between h-full gap-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${it.dot}`} />
                    <span className="text-[15px] font-bold text-foreground tracking-tight">{it.label}</span>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-background/50 backdrop-blur-sm text-foreground shadow-sm">
                    <Icon className={`h-5 w-5 ${it.iconClass}`} strokeWidth={2.5} />
                  </div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-black tracking-tighter text-foreground tabular-nums">
                    {it.value}
                  </div>
                  <div className="mt-2 text-[13px] font-medium text-muted-foreground/90">{it.delta}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
