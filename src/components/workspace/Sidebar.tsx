import { Link } from "@tanstack/react-router";
import { LayoutDashboard, CalendarDays, BarChart3, Users, Bell, Sparkles } from "lucide-react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/", active: true },
  { label: "Scheduler", icon: CalendarDays, to: "/", active: false },
  { label: "Analytics", icon: BarChart3, to: "/", active: false },
  { label: "Team Info", icon: Users, to: "/", active: false },
];

export function WorkspaceSidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-hairline bg-sidebar">
      {/* Logo */}
      <div className="px-6 pt-7 pb-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background">
            <Sparkles className="h-4 w-4" strokeWidth={2.25} />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-semibold tracking-tight text-foreground">
              Design Workspace
            </div>
            <div className="text-[11px] text-muted-foreground">Team OS</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="px-3 flex-1">
        <div className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Workspace
        </div>
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className={[
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    item.active
                      ? "bg-foreground text-background shadow-soft"
                      : "text-foreground/75 hover:bg-sidebar-accent hover:text-foreground",
                  ].join(" ")}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={item.active ? 2.25 : 1.75} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: notifications + profile */}
      <div className="p-3 border-t border-hairline">
        <button
          type="button"
          className="mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/75 hover:bg-sidebar-accent hover:text-foreground transition-colors"
        >
          <span className="relative">
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-status-blocked ring-2 ring-sidebar" />
          </span>
          <span className="font-medium">알림</span>
          <span className="ml-auto text-[11px] text-muted-foreground">3</span>
        </button>

        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=3&w=128&h=128&q=80"
            alt="강미나 프로필"
            className="h-9 w-9 rounded-full object-cover ring-2 ring-hairline"
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-foreground">강미나</div>
            <div className="truncate text-[11px] text-muted-foreground">UX 셀 · 리드</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
