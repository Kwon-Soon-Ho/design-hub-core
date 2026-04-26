import { Status, summary } from "@/lib/dashboard-data";
import { type TabValue } from "./CellTabs";

interface Props {
  activeTab: TabValue;
  statusFilter: Status | "all";
  onStatusChange: (status: Status | "all") => void;
}

export function SummaryCards({ statusFilter, onStatusChange }: Props) {
  const filters: { label: string; value: Status | "all"; count?: number }[] = [
    { label: "전체", value: "all" },
    { label: "진행 중", value: "progress", count: summary.progress },
    { label: "상시", value: "ongoing", count: summary.ongoing },
    { label: "이슈", value: "issue", count: summary.issue },
    { label: "완료", value: "done", count: summary.done },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onStatusChange(f.value)}
          className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[14px] font-bold transition-all shadow-sm border ${
            statusFilter === f.value
              ? "bg-foreground border-foreground text-background"
              : "bg-surface border-hairline/60 text-muted-foreground hover:bg-muted"
          }`}
        >
          {f.label}
          {f.count !== undefined && (
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-black tabular-nums ${
                statusFilter === f.value
                  ? "bg-background/20 text-background"
                  : "bg-muted-foreground/10 text-foreground"
              }`}
            >
              {f.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
