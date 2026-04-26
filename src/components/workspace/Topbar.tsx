import { Search, Plus } from "lucide-react";

export function Topbar() {
  return (
    <header className="flex items-center gap-3 px-6 lg:px-10 pt-7 pb-4">
      <div>
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Dashboard
        </div>
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
          안녕하세요, 권순호님 👋
        </h1>
      </div>

      <div className="ml-auto hidden md:flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="프로젝트, 셀, 담당자 검색"
            className="h-10 w-72 rounded-full border border-hairline bg-surface pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
        <button className="inline-flex h-10 items-center gap-1.5 rounded-full bg-foreground px-4 text-sm font-medium text-background hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          새 프로젝트
        </button>
      </div>
    </header>
  );
}
