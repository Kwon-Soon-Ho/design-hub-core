import { type CellType } from "@/lib/dashboard-data";

export type TabValue = "all" | CellType;

const tabs: { value: TabValue; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "video", label: "영상" },
  { value: "ux", label: "UX" },
  { value: "edit", label: "편집" },
];

const activeClass: Record<TabValue, string> = {
  all: "bg-foreground text-background",
  video: "bg-cell-video text-white",
  ux: "bg-cell-ux text-white",
  edit: "bg-cell-edit text-white",
};

interface Props {
  value: TabValue;
  onChange: (v: TabValue) => void;
}

export function CellTabs({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-hairline bg-surface p-1 shadow-soft w-fit">
      {tabs.map((t) => {
        const isActive = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={[
              "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
              isActive
                ? `${activeClass[t.value]} shadow-soft`
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
