import { motion } from "framer-motion";
import { type CellType } from "@/lib/dashboard-data";

export type TabValue = "all" | CellType;

const tabs: { value: TabValue; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "video", label: "영상" },
  { value: "ux", label: "UX" },
  { value: "edit", label: "편집" },
];

interface Props {
  value: TabValue;
  onChange: (v: TabValue) => void;
}

export function CellTabs({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-6 border-b border-hairline/60 w-fit pb-1">
      {tabs.map((t) => {
        const isActive = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={`relative px-1 py-2 text-[15px] transition-colors ${
              isActive ? "font-black text-foreground" : "font-semibold text-muted-foreground hover:text-foreground"
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
