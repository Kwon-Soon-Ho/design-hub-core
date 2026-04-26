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
      dot: "bg-status-progress",
      cardClass: "border-t-[3px] border-t-[#3B82F6]",
      iconClass: "text-[#3B82F6]",
    },
    {
      label: "상시",
      sub: "Ongoing",
      value: summary.ongoing || 8,
      delta: "루틴 업무",
      icon: RefreshCw,
      dot: "bg-cell-video",
      cardClass: "",
      iconClass: "",
    },
    {
      label: "완료",
      sub: "Completed",
      value: summary.done,
      delta: "+4 이번 주",
      icon: CheckCircle2,
      dot: "bg-status-done",
      cardClass: "",
      iconClass: "text-status-done",
    },
    {
      label: "대기 / 블록",
      sub: "Blocked",
      value: summary.blocked,
      delta: "검토 필요",
      icon: OctagonAlert,
      dot: "bg-status-blocked",
      cardClass: "",
      iconClass: "text-status-blocked",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <div
            key={it.label}
            className={`relative overflow-hidden rounded-2xl bg-surface p-5 shadow-soft border border-hairline/60 ${it.cardClass}`}
          >
            <span
              className={`absolute left-0 top-0 h-full w-[3px] ${accentByTab[activeTab]} transition-colors`}
            />
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${it.dot}`} />
                  <span className="text-sm font-medium text-foreground">{it.label}</span>
                  <span className="text-[11px] text-muted-foreground">{it.sub}</span>
                </div>
                <div className="mt-3 text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                  {it.value}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">{it.delta}</div>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-foreground">
                <Icon className={`h-4 w-4 ${it.iconClass}`} strokeWidth={2} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
