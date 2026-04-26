import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { WorkspaceSidebar } from "@/components/workspace/Sidebar";
import { Topbar } from "@/components/workspace/Topbar";
import { HeroSection } from "@/components/workspace/HeroSection";
import { CellTabs, type TabValue } from "@/components/workspace/CellTabs";
import { SummaryCards } from "@/components/workspace/SummaryCards";
import { ActiveProjects } from "@/components/workspace/ActiveProjects";
import { type Status } from "@/lib/dashboard-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Design Workspace · 디자인 팀 대시보드" },
      {
        name: "description",
        content:
          "디자인 팀의 영상, UX, 편집 셀 프로젝트를 한 눈에 관리하는 모던 워크스페이스 대시보드.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [tab, setTab] = useState<TabValue>("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  return (
    <div className="flex min-h-screen w-full bg-background">
      <WorkspaceSidebar />

      <main className="flex-1 min-w-0">
        <Topbar />

        <div className="px-6 lg:px-10 pb-16 space-y-10">
          <HeroSection />

          <section className="space-y-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  셀별 현황
                </h2>
                <p className="text-sm text-muted-foreground">
                  현재 분기 데이터 · 탭을 전환하여 셀별 색상 테마를 확인하세요
                </p>
              </div>
              <CellTabs value={tab} onChange={setTab} />
            </div>

            <SummaryCards activeTab={tab} statusFilter={statusFilter} onStatusChange={setStatusFilter} />
          </section>

          <ActiveProjects activeTab={tab} statusFilter={statusFilter} />
        </div>
      </main>
    </div>
  );
}
