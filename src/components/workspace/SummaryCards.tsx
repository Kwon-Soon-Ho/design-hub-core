import { Status, summary } from "@/lib/dashboard-data";

interface Props {
  activeTab: string;
  statusFilter: Status | "all";
  onStatusChange: (status: Status | "all") => void;
}

const activeClassByStatus: Record<Status | "all", string> = {
  all: "bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 text-neutral-900 dark:text-neutral-50 border-transparent shadow-md",
  progress: "bg-gradient-to-br from-blue-400 to-blue-500 text-white border-transparent shadow-md shadow-blue-500/20",
  ongoing: "bg-gradient-to-br from-indigo-400 to-indigo-500 text-white border-transparent shadow-md shadow-indigo-500/20",
  issue: "bg-gradient-to-br from-red-400 to-red-500 text-white border-transparent shadow-md shadow-red-500/20",
  done: "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white border-transparent shadow-md shadow-emerald-500/20",
};

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
          className={`flex items-center gap-2.5 rounded-full px-5 py-2 text-[14px] font-bold transition-all border ${
            statusFilter === f.value
              ? activeClassByStatus[f.value]
              : "bg-surface border-border/60 text-muted-foreground hover:bg-muted"
          }`}
        >
          {f.label}
          {f.count !== undefined && (
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-black tabular-nums ${
                statusFilter === f.value
                  ? "bg-white/30 text-white shadow-inner"
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
