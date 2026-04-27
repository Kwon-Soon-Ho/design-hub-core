import { motion } from "framer-motion";
import { type CellType } from "@/lib/dashboard-data";

export type TabValue = "all" | CellType;

const tabs: { value: TabValue; label: string }[] = [
  { value: "all",   label: "전체" },
  { value: "video", label: "영상" },
  { value: "ux",    label: "UX" },
  { value: "edit",  label: "편집" },
];

// Task 4: Brand-colored hover — bg tint (10%) + 100% brand text color on hover
const tabHoverClass: Record<TabValue, string> = {
  all:   "hover:bg-foreground/5   hover:text-foreground",
  video: "hover:bg-cell-video-soft/50 hover:text-cell-video",
  ux:    "hover:bg-cell-ux-soft/50    hover:text-cell-ux",
  edit:  "hover:bg-cell-edit-soft/50  hover:text-cell-edit",
};

interface Props {
  value: TabValue;
  onChange: (v: TabValue) => void;
}

export function CellTabs({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 border-b border-hairline/60 w-fit pb-1">
      {tabs.map((t) => {
        const isActive = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={`relative px-3 py-2 rounded-lg text-[15px] transition-all ${
              isActive
                ? "font-black text-foreground"
                : `font-semibold text-muted-foreground ${tabHoverClass[t.value]}`
            }`}
          >
            {t.label}
            {isActive && (
              <motion.div
                layoutId="cellTabUnderline"
                className="absolute bottom-[-5px] left-0 right-0 h-[3px] bg-foreground rounded-t-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
