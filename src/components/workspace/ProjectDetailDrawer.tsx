"use client";

import { useState, useRef, useEffect } from "react";
import {
  ExternalLink, X, Plus, Calendar, User,
  Link2, CheckCircle2, Clock3, AlertCircle, Pause,
} from "lucide-react";

import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import {
  type Project,
  type Task,
  teamMembers,
  cellLabel,
  statusLabel,
} from "@/lib/dashboard-data";

/* ─────────────────────────────────────────────────────────── */
/*  Types & Constants                                           */
/* ─────────────────────────────────────────────────────────── */

type TaskStatus = "대기" | "진행 중" | "완료" | "이슈";

interface LocalTask {
  id: string;
  title: string;
  status: TaskStatus;
  progress: number; // 0–100
  startDate: string;
  endDate: string;
}

interface ProjectDetailDrawerProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  project: Project;
}

const cellChipClass: Record<string, string> = {
  video: "bg-cell-video-soft text-cell-video border-cell-video/30",
  ux:    "bg-cell-ux-soft text-cell-ux border-cell-ux/30",
  edit:  "bg-cell-edit-soft text-cell-edit border-cell-edit/30",
};

const statusColor: Record<TaskStatus, string> = {
  "대기":   "bg-muted-foreground/30",
  "진행 중": "bg-blue-500",
  "완료":   "bg-emerald-500",
  "이슈":   "bg-red-500",
};

const statusIcon: Record<TaskStatus, React.ReactNode> = {
  "대기":    <Pause        className="h-3 w-3" />,
  "진행 중": <Clock3       className="h-3 w-3" />,
  "완료":    <CheckCircle2 className="h-3 w-3" />,
  "이슈":    <AlertCircle  className="h-3 w-3" />,
};

/* ─────────────────────────────────────────────────────────── */
/*  Helpers                                                    */
/* ─────────────────────────────────────────────────────────── */

/** Parse "YYYY-MM-DD" into a Date object */
const parseDate = (s: string) => new Date(s);

/**
 * Calculate bar position (left%) and width(%) within the project span.
 * Returns null if dates are invalid.
 */
function barMetrics(
  taskStart: string, taskEnd: string,
  projStart: string, projEnd: string,
): { left: number; width: number } | null {
  try {
    const ps = parseDate(projStart).getTime();
    const pe = parseDate(projEnd).getTime();
    const ts = parseDate(taskStart).getTime();
    const te = parseDate(taskEnd).getTime();
    const span = pe - ps;
    if (span <= 0) return null;
    const left  = Math.max(0, Math.min(100, ((ts - ps) / span) * 100));
    const width = Math.max(2, Math.min(100 - left, ((te - ts) / span) * 100));
    return { left, width };
  } catch { return null; }
}

/** Clamp task progress and auto-flip status */
function applyProgressRule(task: LocalTask, newProgress: number): LocalTask {
  const clamped = Math.max(0, Math.min(100, newProgress));
  let status = task.status;
  if (clamped === 100) status = "완료";
  else if (status === "완료") status = "진행 중"; // revert if pulled back below 100
  return { ...task, progress: clamped, status };
}

/** Total progress = average of all tasks' individual progress */
function calcTotalProgress(tasks: LocalTask[]): number {
  if (!tasks.length) return 0;
  return Math.round(tasks.reduce((s, t) => s + t.progress, 0) / tasks.length);
}

/* ─────────────────────────────────────────────────────────── */
/*  Seed demo tasks from project.details.tasks or defaults    */
/* ─────────────────────────────────────────────────────────── */

function seedTasks(project: Project, startDate: string, endDate: string): LocalTask[] {
  const base = project.details?.tasks ?? (project.tasks as Task[] | undefined) ?? [];
  if (base.length > 0) {
    return base.map((t, i) => ({
      id:        t.id,
      title:     t.title,
      status:    (["대기","진행 중","완료","이슈"] as TaskStatus[])[i % 4],
      progress:  t.status === "done" ? 100 : t.status === "progress" ? 60 : t.status === "ongoing" ? 40 : 0,
      startDate,
      endDate,
    }));
  }
  // Fallback: 3 demo tasks spread across the project period
  return [
    { id: "lt1", title: "리서치 & 벤치마킹", status: "완료",   progress: 100, startDate, endDate: startDate },
    { id: "lt2", title: "와이어프레임 설계",  status: "진행 중", progress: 60,  startDate, endDate },
    { id: "lt3", title: "최종 디자인 완성",   status: "대기",   progress: 0,   startDate, endDate },
  ];
}

/* ─────────────────────────────────────────────────────────── */
/*  Component                                                  */
/* ─────────────────────────────────────────────────────────── */

export function ProjectDetailDrawer({ isOpen, onClose, project }: ProjectDetailDrawerProps) {

  const startDate = project.details?.startDate ?? "2026-05-01";
  const endDate   = project.details?.endDate   ?? "2026-12-31";

  /* ── Title inline edit ───────────────────────────────── */
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue]         = useState(project.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTitleValue(project.title); }, [project.title]);
  useEffect(() => { if (isEditingTitle) titleInputRef.current?.focus(); }, [isEditingTitle]);

  const commitTitle = () => {
    setIsEditingTitle(false);
    if (!titleValue.trim()) setTitleValue(project.title);
  };

  /* ── Collaborators ───────────────────────────────────── */
  const managerMember = teamMembers.find(m => m.id === project.details?.manager);
  const initCollabs   = (project.details?.collaborators ?? [])
    .map(id => teamMembers.find(m => m.id === id))
    .filter(Boolean) as typeof teamMembers;

  const [collabs, setCollabs] = useState(initCollabs);
  const removeCollab = (id: string) => setCollabs(c => c.filter(m => m.id !== id));

  /* ── Local tasks (with progress logic) ──────────────── */
  const [tasks, setTasks] = useState<LocalTask[]>(() => seedTasks(project, startDate, endDate));

  const updateTaskProgress = (id: string, val: number) =>
    setTasks(ts => ts.map(t => t.id === id ? applyProgressRule(t, val) : t));

  const updateTaskStatus = (id: string, status: TaskStatus) =>
    setTasks(ts => ts.map(t => {
      if (t.id !== id) return t;
      // If forced to 완료, clamp progress to 100
      const progress = status === "완료" ? 100 : (t.progress === 100 ? 99 : t.progress);
      return { ...t, status, progress };
    }));

  const totalProgress = calcTotalProgress(tasks);

  /* ── Asset links ─────────────────────────────────────── */
  const [assetLinks, setAssetLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput]   = useState("");

  const addAssetLink = () => {
    const trimmed = linkInput.trim();
    if (trimmed) {
      setAssetLinks(prev => [...prev, trimmed]);
      setLinkInput("");
    }
  };

  /* ─────────────────────────────────────────────────────── */
  /*  Render                                                 */
  /* ─────────────────────────────────────────────────────── */

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-screen h-screen sm:max-w-none p-0 flex flex-col bg-background border-l border-border/60 overflow-hidden"
      >
        {/* ══ HEADER BAR ══════════════════════════════════ */}
        <div className="flex items-center justify-between px-10 pt-7 pb-4 shrink-0 border-b border-border/40">

          {/* Left: Title inline edit + chips */}
          <div className="flex items-center gap-4 min-w-0 flex-1 pr-6">
            <span className={`shrink-0 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold border ${cellChipClass[project.cell]}`}>
              {cellLabel[project.cell]}
            </span>
            <Badge
              variant="outline"
              className={`shrink-0 text-[10px] font-bold ${
                project.status === "issue"   ? "border-red-400/40 text-red-500 bg-red-500/5" :
                project.status === "done"    ? "border-emerald-400/40 text-emerald-500 bg-emerald-500/5" :
                project.status === "ongoing" ? "border-indigo-400/40 text-indigo-400 bg-indigo-400/5" :
                                               "border-blue-400/40 text-blue-500 bg-blue-500/5"
              }`}
            >
              {statusLabel[project.status]}
            </Badge>

            {isEditingTitle ? (
              <Input
                ref={titleInputRef}
                value={titleValue}
                onChange={e => setTitleValue(e.target.value)}
                onBlur={commitTitle}
                onKeyDown={e => {
                  if (e.key === "Enter")  commitTitle();
                  if (e.key === "Escape") { setTitleValue(project.title); setIsEditingTitle(false); }
                }}
                className="text-xl font-bold tracking-tight h-9 min-w-0 flex-1 border-primary/40"
              />
            ) : (
              <h2
                onClick={() => setIsEditingTitle(true)}
                className="text-xl font-bold tracking-tight text-foreground truncate cursor-text rounded-lg px-2 py-1 hover:bg-muted transition-colors"
                title="클릭하여 제목 편집"
              >
                {titleValue}
              </h2>
            )}
          </div>

          {/* Right: actions — gap-6 keeps buttons well apart */}
          <div className="flex items-center gap-6 shrink-0">
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1.5 text-[12px] font-semibold">
              <ExternalLink className="h-3.5 w-3.5" />
              새 창으로 분리
            </Button>
            <SheetClose asChild>
              <button className="rounded-full p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </SheetClose>
          </div>
        </div>

        {/* ══ 2-COLUMN BODY ════════════════════════════════ */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-10">

          {/* ── LEFT: Visual / Cover (6 cols) ─────────────── */}
          <div className="lg:col-span-6 flex flex-col overflow-y-auto border-r border-border/40">
            {/* Cover image */}
            <div className="relative h-[300px] shrink-0 bg-surface overflow-hidden">
              <img
                src={project.cover}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
              />
              <img
                src={project.cover}
                alt={project.title}
                className="relative z-10 w-full h-full object-contain p-6 drop-shadow-xl"
              />
            </div>

            <div className="flex-1 px-10 py-8">
              {/* Tabs: Timeline + other placeholders */}
              <Tabs defaultValue="timeline">
                <TabsList className="mb-6 bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="timeline"  className="rounded-lg text-[12px] font-bold px-4">워크플랜</TabsTrigger>
                  <TabsTrigger value="report"    className="rounded-lg text-[12px] font-bold px-4">보고</TabsTrigger>
                  <TabsTrigger value="feedback"  className="rounded-lg text-[12px] font-bold px-4">피드백</TabsTrigger>
                  <TabsTrigger value="assets"    className="rounded-lg text-[12px] font-bold px-4">시안 에셋</TabsTrigger>
                </TabsList>

                {/* ── 워크플랜 Tab: Visual Timeline ──────────── */}
                <TabsContent value="timeline">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                        {startDate} → {endDate}
                      </span>
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        총 진행률 {totalProgress}%
                      </span>
                    </div>

                    {tasks.map(task => {
                      const metrics = barMetrics(task.startDate, task.endDate, startDate, endDate);
                      return (
                        <div key={task.id} className="group rounded-xl bg-muted/30 hover:bg-muted/50 border border-border/40 p-3.5 transition-colors">
                          {/* Row 1: title + status select */}
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`shrink-0 p-1 rounded-full text-white ${statusColor[task.status]}`}>
                              {statusIcon[task.status]}
                            </span>
                            <span className="text-[13px] font-semibold text-foreground flex-1 truncate">{task.title}</span>
                            <select
                              value={task.status}
                              onChange={e => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                              className="text-[11px] font-bold rounded-lg border border-border/60 bg-background px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40"
                            >
                              {(["대기","진행 중","완료","이슈"] as TaskStatus[]).map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>

                          {/* Row 2: Gantt-style bar */}
                          <div className="relative h-5 bg-muted rounded-full overflow-hidden mb-3">
                            {metrics ? (
                              <div
                                className={`absolute top-0 h-full rounded-full opacity-80 transition-all ${statusColor[task.status]}`}
                                style={{ left: `${metrics.left}%`, width: `${metrics.width}%` }}
                              />
                            ) : (
                              <div
                                className={`absolute top-0 left-0 h-full rounded-full opacity-80 transition-all ${statusColor[task.status]}`}
                                style={{ width: `${task.progress}%` }}
                              />
                            )}
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground/70">
                              {task.progress}%
                            </span>
                          </div>

                          {/* Row 3: progress slider */}
                          <input
                            type="range"
                            min={0} max={100} value={task.progress}
                            onChange={e => updateTaskProgress(task.id, Number(e.target.value))}
                            className="w-full h-1.5 accent-primary cursor-pointer"
                          />
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* ── 보고 Tab ─────────────────────────────── */}
                <TabsContent value="report">
                  <div className="h-[320px] border border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center gap-3 text-muted-foreground bg-muted/20">
                    <span className="text-[32px]">📊</span>
                    <p className="text-[13px] font-semibold">보고 섹션 — 준비 중</p>
                  </div>
                </TabsContent>

                {/* ── 피드백 Tab ───────────────────────────── */}
                <TabsContent value="feedback">
                  <div className="h-[320px] border border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center gap-3 text-muted-foreground bg-muted/20">
                    <span className="text-[32px]">💬</span>
                    <p className="text-[13px] font-semibold">피드백 섹션 — 준비 중</p>
                  </div>
                </TabsContent>

                {/* ── 시안 에셋 Tab ────────────────────────── */}
                <TabsContent value="assets">
                  <div className="space-y-4">
                    {/* Link input row */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          value={linkInput}
                          onChange={e => setLinkInput(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") addAssetLink(); }}
                          placeholder="구글 드라이브 링크를 입력하세요"
                          className="pl-9 text-[13px]"
                        />
                      </div>
                      <Button onClick={addAssetLink} className="shrink-0 font-bold">
                        <Plus className="h-4 w-4 mr-1" /> 추가
                      </Button>
                    </div>

                    {/* Thumbnail horizontal scroll list */}
                    {assetLinks.length > 0 ? (
                      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        {assetLinks.map((url, i) => (
                          <div key={i} className="shrink-0 w-[180px] rounded-xl border border-border/60 bg-muted/30 overflow-hidden group relative">
                            <div className="h-[100px] bg-muted/50 flex items-center justify-center">
                              <Link2 className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="p-2">
                              <p className="text-[11px] font-semibold text-foreground truncate">{url}</p>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-primary hover:underline"
                              >
                                열기 ↗
                              </a>
                            </div>
                            <button
                              onClick={() => setAssetLinks(l => l.filter((_, j) => j !== i))}
                              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-background/80 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-[200px] border border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center gap-3 text-muted-foreground bg-muted/20">
                        <span className="text-[32px]">🖼️</span>
                        <p className="text-[13px] font-semibold">링크를 추가하면 여기에 표시됩니다</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* ── RIGHT: Meta + Progress + Tasks (4 cols) ─── */}
          <div className="lg:col-span-4 flex flex-col overflow-y-auto px-8 py-8 gap-6">

            {/* Overall progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">전체 진행률</span>
                <span className="text-[22px] font-black tabular-nums text-foreground leading-none">{totalProgress}%</span>
              </div>
              <Progress value={totalProgress} className="h-3 rounded-full" />
            </div>

            <Separator />

            {/* PM */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <User className="h-3 w-3" /> PM
              </span>
              {managerMember ? (
                <div className="flex items-center gap-2 bg-muted/40 rounded-xl px-3 py-2 w-fit">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[11px] font-bold bg-primary/10 text-primary">{managerMember.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[12px] font-bold text-foreground leading-snug">{managerMember.name}</p>
                    <p className="text-[10px] text-muted-foreground">{managerMember.dept}</p>
                  </div>
                </div>
              ) : (
                <span className="text-[12px] text-muted-foreground">{project.owner}</span>
              )}
            </div>

            {/* Date range */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <Calendar className="h-3 w-3" /> 기간
              </span>
              <div className="flex items-center gap-2 text-[12px] font-medium text-foreground bg-muted/40 rounded-xl px-3 py-2 w-fit flex-wrap">
                <span>{startDate} → {endDate}</span>
                <Badge variant="outline" className="text-[10px] font-bold border-destructive/40 text-destructive">
                  D-{project.dDay}
                </Badge>
              </div>
            </div>

            {/* Collaborators */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase">협업 멤버</span>
              <div className="flex flex-wrap items-center gap-2">
                {collabs.map(m => (
                  <div key={m.id} className="flex items-center gap-1.5 bg-muted/50 border border-border/50 rounded-full pl-1.5 pr-2 py-1">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">{m.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-[11px] font-semibold text-foreground">{m.name}</span>
                    <span className="text-[10px] text-muted-foreground">{m.dept}</span>
                    <button
                      onClick={() => removeCollab(m.id)}
                      className="ml-0.5 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label={`${m.name} 제거`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button className="flex items-center gap-1 rounded-full border border-dashed border-border/60 px-3 py-1 text-[11px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                  <Plus className="h-3 w-3" />
                  멤버 추가
                </button>
              </div>
            </div>

            <Separator />

            {/* Per-task progress summary list */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase">업무 항목 진행률</span>
              {tasks.map(task => (
                <div key={task.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-foreground truncate max-w-[75%]">{task.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.status === "완료"   ? "bg-emerald-500/10 text-emerald-500" :
                      task.status === "이슈"   ? "bg-red-500/10 text-red-500" :
                      task.status === "진행 중" ? "bg-blue-500/10 text-blue-500" :
                                                  "bg-muted text-muted-foreground"
                    }`}>{task.status}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${statusColor[task.status]}`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
