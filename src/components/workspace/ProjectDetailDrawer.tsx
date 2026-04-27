"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  ExternalLink, X, Plus, Calendar, Link2, ZoomIn,
  CheckCircle2, Clock3, AlertCircle, Pause, Check, ChevronsUpDown,
} from "lucide-react";

import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

import {
  type Project,
  type Task,
  teamMembers,
  cellLabel,
  statusLabel,
} from "@/lib/dashboard-data";

/* ─────────────────────────────────────────────────────────── */
/*  Types & Constants                                          */
/* ─────────────────────────────────────────────────────────── */

type TaskStatus = "대기" | "진행 중" | "완료" | "이슈";
type ZoomLevel = "1w" | "2w" | "1m";

interface LocalTask {
  id: string;
  title: string;
  status: TaskStatus;
  progress: number;     // 0–100
  startDate: string;    // YYYY-MM-DD
  endDate: string;      // YYYY-MM-DD
  weight?: number;      // optional weight (default 1)
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

const statusBarClass: Record<TaskStatus, string> = {
  "대기":   "bg-muted-foreground/40",
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

/* Zoom: pixels per day */
const ZOOM_PX_PER_DAY: Record<ZoomLevel, number> = {
  "1w": 40,
  "2w": 20,
  "1m": 10,
};

const ZOOM_LABEL: Record<ZoomLevel, string> = {
  "1w": "1주",
  "2w": "2주",
  "1m": "1개월",
};

/* ─────────────────────────────────────────────────────────── */
/*  Helpers                                                    */
/* ─────────────────────────────────────────────────────────── */

const MS_PER_DAY = 86400000;

const parseDate = (s: string) => {
  const d = new Date(s);
  d.setHours(0, 0, 0, 0);
  return d;
};

const daysBetween = (a: Date, b: Date) =>
  Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);

const fmtMD = (d: Date) =>
  `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, "0")}`;

/** Weighted average progress (default weight = 1) */
function calcTotalProgress(tasks: LocalTask[]): number {
  if (!tasks.length) return 0;
  const totalW = tasks.reduce((s, t) => s + (t.weight ?? 1), 0);
  const sum    = tasks.reduce((s, t) => s + t.progress * (t.weight ?? 1), 0);
  return Math.round(sum / totalW);
}

/** Apply progress rule: clamp + auto-flip status */
function applyProgressRule(task: LocalTask, newProgress: number): LocalTask {
  const clamped = Math.max(0, Math.min(100, newProgress));
  let status = task.status;
  if (clamped === 100) status = "완료";
  else if (status === "완료") status = "진행 중";
  return { ...task, progress: clamped, status };
}

/* Seed local tasks from project data with date spread for the Gantt */
function seedTasks(project: Project, projStart: string, projEnd: string): LocalTask[] {
  const base = project.details?.tasks ?? (project.tasks as Task[] | undefined) ?? [];
  const ps = parseDate(projStart);
  const pe = parseDate(projEnd);
  const span = Math.max(1, daysBetween(ps, pe));

  if (base.length > 0) {
    return base.map((t, i) => {
      const startOffset = Math.floor((span * i) / Math.max(base.length, 1));
      const duration    = Math.max(3, Math.floor(span / Math.max(base.length, 1)));
      const sd = new Date(ps.getTime() + startOffset * MS_PER_DAY);
      const ed = new Date(sd.getTime() + duration * MS_PER_DAY);
      return {
        id:        t.id,
        title:     t.title,
        status:    t.status === "done" ? "완료" : t.status === "issue" ? "이슈" : t.status === "ongoing" ? "대기" : "진행 중",
        progress:  t.status === "done" ? 100 : t.status === "progress" ? 60 : t.status === "ongoing" ? 30 : 10,
        startDate: sd.toISOString().slice(0, 10),
        endDate:   ed.toISOString().slice(0, 10),
      };
    });
  }
  return [
    { id: "lt1", title: "리서치 & 벤치마킹", status: "완료",   progress: 100, startDate: projStart, endDate: new Date(ps.getTime() + 7 * MS_PER_DAY).toISOString().slice(0,10) },
    { id: "lt2", title: "와이어프레임 설계",  status: "진행 중", progress: 60,  startDate: new Date(ps.getTime() + 7 * MS_PER_DAY).toISOString().slice(0,10), endDate: new Date(ps.getTime() + 21 * MS_PER_DAY).toISOString().slice(0,10) },
    { id: "lt3", title: "최종 디자인 완성",   status: "대기",   progress: 0,   startDate: new Date(ps.getTime() + 21 * MS_PER_DAY).toISOString().slice(0,10), endDate: projEnd },
  ];
}

/* ─────────────────────────────────────────────────────────── */
/*  Member Combobox                                            */
/* ─────────────────────────────────────────────────────────── */

function MemberCombobox({
  value, onChange, placeholder, exclude = [],
}: {
  value: string | null;
  onChange: (id: string) => void;
  placeholder: string;
  exclude?: string[];
}) {
  const [open, setOpen] = useState(false);
  const selected = teamMembers.find(m => m.id === value);
  const options  = teamMembers.filter(m => !exclude.includes(m.id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-surface px-3 py-1.5 text-[12px] font-bold text-foreground shadow-sm hover:bg-muted/50 transition-colors"
        >
          {selected ? (
            <>
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">{selected.name[0]}</AvatarFallback>
              </Avatar>
              <span>{selected.name}</span>
              <span className="text-[10px] font-medium text-muted-foreground">{selected.dept}</span>
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0" align="start">
        <Command>
          <CommandInput placeholder="멤버 검색..." className="text-[12px]" />
          <CommandList>
            <CommandEmpty>결과 없음</CommandEmpty>
            <CommandGroup>
              {options.map(m => (
                <CommandItem
                  key={m.id}
                  value={`${m.name} ${m.dept}`}
                  onSelect={() => { onChange(m.id); setOpen(false); }}
                  className="flex items-center gap-2 text-[12px]"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">{m.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{m.name}</span>
                  <span className="text-[10px] text-muted-foreground">{m.dept}</span>
                  <Check className={cn("ml-auto h-3.5 w-3.5", value === m.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
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

  /* ── PM & Collaborators (Combobox-driven) ─────────────── */
  const [managerId, setManagerId] = useState<string | null>(project.details?.manager ?? teamMembers[0]?.id ?? null);
  const [collabIds, setCollabIds] = useState<string[]>(project.details?.collaborators ?? []);

  const removeCollab = (id: string) => setCollabIds(c => c.filter(x => x !== id));
  const addCollab    = (id: string) => setCollabIds(c => c.includes(id) ? c : [...c, id]);

  const collabs = collabIds
    .map(id => teamMembers.find(m => m.id === id))
    .filter(Boolean) as typeof teamMembers;

  /* ── Tasks ──────────────────────────────────────────── */
  const [tasks, setTasks] = useState<LocalTask[]>(() => seedTasks(project, startDate, endDate));

  // Auto-sort by startDate
  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime()),
    [tasks],
  );

  const updateTaskProgress = (id: string, val: number) =>
    setTasks(ts => ts.map(t => t.id === id ? applyProgressRule(t, val) : t));

  const updateTaskStatus = (id: string, status: TaskStatus) =>
    setTasks(ts => ts.map(t => {
      if (t.id !== id) return t;
      const progress = status === "완료" ? 100 : (t.progress === 100 ? 99 : t.progress);
      return { ...t, status, progress };
    }));

  const totalProgress = calcTotalProgress(tasks);

  /* ── Project status consistency (Constraint 4) ──────── */
  const projectStatus: TaskStatus = useMemo(() => {
    if (totalProgress === 100) return "완료";
    // If original was done but progress < 100, demote
    if (project.status === "done") return "진행 중";
    if (project.status === "issue") return "이슈";
    if (project.status === "ongoing") return "대기";
    return "진행 중";
  }, [totalProgress, project.status]);

  /* ── Gantt zoom + dimensions ─────────────────────────── */
  const [zoom, setZoom] = useState<ZoomLevel>("1w");
  const pxPerDay = ZOOM_PX_PER_DAY[zoom];

  const ganttBounds = useMemo(() => {
    const ps = parseDate(startDate);
    const pe = parseDate(endDate);
    const totalDays = Math.max(28, daysBetween(ps, pe) + 1); // min 4 weeks visible
    return { ps, pe, totalDays, totalWidth: totalDays * pxPerDay };
  }, [startDate, endDate, pxPerDay]);

  /* Date axis ticks: every 7 days */
  const ticks = useMemo(() => {
    const out: { left: number; label: string }[] = [];
    for (let d = 0; d < ganttBounds.totalDays; d += 7) {
      const date = new Date(ganttBounds.ps.getTime() + d * MS_PER_DAY);
      out.push({ left: d * pxPerDay, label: fmtMD(date) });
    }
    return out;
  }, [ganttBounds, pxPerDay]);

  /* ── Asset links (Google Drive multi-add) ────────────── */
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
        className="w-screen h-screen sm:max-w-none p-0 flex flex-col bg-background border-l border-foreground/20 overflow-hidden [&>button.absolute]:hidden"
      >
        {/* ══ STICKY HEADER + HERO (45vh) ══════════════════ */}
        <div className="shrink-0 border-b border-foreground/20" style={{ height: "45vh" }}>
          <div className="relative w-full h-full bg-surface overflow-hidden">

            {/* Background blur matte */}
            <img
              src={project.cover}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30 scale-110 pointer-events-none"
            />

            {/* Foreground image */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
              <img
                src={project.cover}
                alt={project.title}
                draggable={false}
                className="max-w-full max-h-full object-contain rounded-2xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              />
            </div>

            {/* Top-left: chips + title */}
            <div className="absolute left-8 top-7 z-30 flex items-center gap-3 max-w-[calc(100%-360px)]">
              <span className={`shrink-0 inline-flex items-center rounded-full px-3.5 py-1.5 text-[12px] font-bold border shadow-sm backdrop-blur-md ${cellChipClass[project.cell]}`}>
                {cellLabel[project.cell]}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 text-[11px] font-bold backdrop-blur-md shadow-sm",
                  projectStatus === "이슈"   ? "border-red-400/40 text-red-500 bg-red-500/10" :
                  projectStatus === "완료"   ? "border-emerald-400/40 text-emerald-600 bg-emerald-500/10" :
                  projectStatus === "대기"   ? "border-indigo-400/40 text-indigo-500 bg-indigo-400/10" :
                                                "border-blue-400/40 text-blue-500 bg-blue-500/10",
                )}
              >
                {projectStatus}
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
                  className="text-xl font-bold tracking-tight h-9 min-w-0 flex-1 border-foreground/20 bg-background/80 backdrop-blur-md"
                />
              ) : (
                <h2
                  onClick={() => setIsEditingTitle(true)}
                  className="text-xl font-bold tracking-tight text-foreground truncate cursor-text rounded-lg px-2 py-1 hover:bg-background/60 backdrop-blur-md transition-colors"
                  title="클릭하여 제목 편집"
                >
                  {titleValue}
                </h2>
              )}
            </div>

            {/* Top-right: actions (gap-6) — built-in SheetClose lives here too */}
            <div className="absolute right-7 top-6 z-30 flex items-center gap-6">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 text-[12px] font-bold border-foreground/20 bg-background/80 backdrop-blur-md shadow-sm"
                onClick={() => window.open(window.location.href, "_blank")}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                새 창으로 분리
              </Button>
              <SheetClose asChild>
                <button
                  className="rounded-full p-2 bg-background/80 backdrop-blur-md border border-foreground/20 shadow-sm text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                  aria-label="닫기"
                >
                  <X className="h-4 w-4" />
                </button>
              </SheetClose>
            </div>

            {/* Bottom-left: PM + Collaborators pill badges */}
            <div className="absolute left-8 bottom-6 z-30 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mr-1 bg-background/80 backdrop-blur-md px-2 py-1 rounded-md">PM</span>
              <MemberCombobox
                value={managerId}
                onChange={setManagerId}
                placeholder="PM 선택"
                exclude={collabIds}
              />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-3 mr-1 bg-background/80 backdrop-blur-md px-2 py-1 rounded-md">협업</span>
              {collabs.map(m => (
                <div
                  key={m.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-surface px-2 py-1 text-[11px] font-bold text-foreground shadow-sm"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">{m.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{m.name}</span>
                  <span className="text-[10px] font-medium text-muted-foreground">{m.dept}</span>
                  <button
                    onClick={() => removeCollab(m.id)}
                    className="ml-0.5 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`${m.name} 제거`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <MemberCombobox
                value={null}
                onChange={addCollab}
                placeholder="+ 멤버 추가"
                exclude={[managerId, ...collabIds].filter(Boolean) as string[]}
              />
            </div>

            {/* Bottom-right: total progress */}
            <div className="absolute right-7 bottom-6 z-30 flex items-center gap-3 bg-background/80 backdrop-blur-md border border-foreground/20 rounded-2xl px-4 py-2.5 shadow-sm">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">전체 진행률</span>
                <span className="text-2xl font-black tabular-nums tracking-tighter text-foreground leading-none mt-1">{totalProgress}%</span>
              </div>
              <div className="h-10 w-[140px] flex flex-col justify-center gap-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-700"
                    style={{ width: `${totalProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground tabular-nums">
                  <span>{startDate}</span>
                  <span className="text-destructive">D-{project.dDay}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ SCROLLABLE BOTTOM (Work Plan + Tasks + Assets) ══ */}
        <div className="flex-1 min-h-0 overflow-y-auto px-10 py-8 space-y-10">

          {/* ── WORK PLAN — DATE-BASED GANTT ───────────────── */}
          <section>
            <header className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold tracking-tight text-foreground">워크플랜</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground tabular-nums">
                  <Calendar className="h-3 w-3" />
                  {startDate} → {endDate}
                </span>
              </div>

              {/* Zoom controls */}
              <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                <ZoomIn className="h-3.5 w-3.5 text-muted-foreground ml-1" />
                {(["1w", "2w", "1m"] as ZoomLevel[]).map(z => (
                  <button
                    key={z}
                    onClick={() => setZoom(z)}
                    className={cn(
                      "px-3 py-1 text-[11px] font-bold rounded-md transition-all",
                      zoom === z ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {ZOOM_LABEL[z]}
                  </button>
                ))}
              </div>
            </header>

            {/* Gantt — horizontally scrollable */}
            <div className="rounded-2xl border border-foreground/20 bg-surface shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <div style={{ width: `${ganttBounds.totalWidth + 280}px`, minWidth: "100%" }}>

                  {/* Date axis */}
                  <div className="flex border-b border-foreground/10 bg-muted/30 sticky top-0">
                    <div className="w-[280px] shrink-0 px-4 py-2 border-r border-foreground/10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">업무</span>
                    </div>
                    <div className="relative h-9" style={{ width: `${ganttBounds.totalWidth}px` }}>
                      {ticks.map((t, i) => (
                        <div
                          key={i}
                          className="absolute top-0 bottom-0 flex items-center border-l border-foreground/10 px-1.5"
                          style={{ left: `${t.left}px` }}
                        >
                          <span className="text-[10px] font-bold tabular-nums text-muted-foreground">{t.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Task rows */}
                  {sortedTasks.map(task => {
                    const ts     = parseDate(task.startDate);
                    const te     = parseDate(task.endDate);
                    const left   = Math.max(0, daysBetween(ganttBounds.ps, ts)) * pxPerDay;
                    const width  = Math.max(pxPerDay * 0.5, daysBetween(ts, te) * pxPerDay);

                    return (
                      <div key={task.id} className="flex border-b border-foreground/10 hover:bg-muted/20 transition-colors group">
                        {/* Sticky task label column */}
                        <div className="w-[280px] shrink-0 px-4 py-3 border-r border-foreground/10 flex items-center gap-2">
                          <span className={cn("shrink-0 p-1 rounded-full text-white", statusBarClass[task.status])}>
                            {statusIcon[task.status]}
                          </span>
                          <span className="text-[12px] font-semibold text-foreground truncate flex-1" title={task.title}>
                            {task.title}
                          </span>
                          <select
                            value={task.status}
                            onChange={e => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                            className="text-[10px] font-bold rounded-md border border-foreground/20 bg-background px-1.5 py-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40"
                          >
                            {(["대기","진행 중","완료","이슈"] as TaskStatus[]).map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        {/* Bar lane */}
                        <div className="relative h-12" style={{ width: `${ganttBounds.totalWidth}px` }}>
                          {/* Grid lines */}
                          {ticks.map((t, i) => (
                            <div key={i} className="absolute top-0 bottom-0 border-l border-foreground/5" style={{ left: `${t.left}px` }} />
                          ))}
                          {/* The bar */}
                          <div
                            className="absolute top-1/2 -translate-y-1/2 h-7 rounded-lg shadow-sm border border-foreground/20 overflow-hidden group/bar"
                            style={{ left: `${left}px`, width: `${width}px` }}
                            title={`${task.startDate} → ${task.endDate}`}
                          >
                            {/* Background track */}
                            <div className={cn("absolute inset-0 opacity-25", statusBarClass[task.status])} />
                            {/* Progress fill */}
                            <div
                              className={cn("absolute top-0 left-0 bottom-0 transition-all duration-500", statusBarClass[task.status])}
                              style={{ width: `${task.progress}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-between px-2.5">
                              <span className="text-[10px] font-bold text-foreground/80 tabular-nums">
                                {fmtMD(ts)} → {fmtMD(te)}
                              </span>
                              <span className="text-[10px] font-black tabular-nums text-foreground/90">
                                {task.progress}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Per-task progress sliders below the chart */}
              <div className="border-t border-foreground/10 bg-muted/10 px-4 py-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">진행률 조정</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {sortedTasks.map(task => (
                    <div key={`s-${task.id}`} className="flex items-center gap-3">
                      <span className="text-[11px] font-semibold text-foreground truncate flex-1 max-w-[160px]" title={task.title}>
                        {task.title}
                      </span>
                      <input
                        type="range"
                        min={0} max={100} value={task.progress}
                        onChange={e => updateTaskProgress(task.id, Number(e.target.value))}
                        className="flex-1 h-1.5 accent-primary cursor-pointer"
                      />
                      <span className="text-[11px] font-bold tabular-nums text-foreground w-10 text-right">{task.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── ASSET MANAGEMENT — Google Drive Links ─────── */}
          <section>
            <header className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold tracking-tight text-foreground">시안 에셋</h3>
              <span className="text-[11px] font-semibold text-muted-foreground">
                {assetLinks.length}개의 링크
              </span>
            </header>

            <div className="rounded-2xl border border-foreground/20 bg-surface shadow-sm p-5 space-y-4">
              {/* Google Drive Link Input */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    value={linkInput}
                    onChange={e => setLinkInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") addAssetLink(); }}
                    placeholder="구글 드라이브 링크를 입력하세요 (예: https://drive.google.com/file/d/...)"
                    className="pl-9 text-[13px] border-foreground/20"
                  />
                </div>
                <Button onClick={addAssetLink} className="shrink-0 font-bold">
                  <Plus className="h-4 w-4 mr-1" /> 추가
                </Button>
              </div>

              {/* Thumbnail slider */}
              {assetLinks.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-1 px-1">
                  {assetLinks.map((url, i) => (
                    <div
                      key={i}
                      className="shrink-0 w-[200px] rounded-xl border border-foreground/20 bg-card overflow-hidden group relative shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="h-[120px] bg-gradient-to-br from-muted/40 to-muted/70 flex items-center justify-center">
                        <Link2 className="h-7 w-7 text-muted-foreground/70" />
                      </div>
                      <div className="p-2.5">
                        <p className="text-[11px] font-bold text-foreground truncate">{`시안 ${i + 1}`}</p>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-primary hover:underline truncate block"
                        >
                          {url}
                        </a>
                      </div>
                      <button
                        onClick={() => setAssetLinks(l => l.filter((_, j) => j !== i))}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-background/90 border border-foreground/20 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                        aria-label="링크 제거"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[140px] border border-dashed border-foreground/20 rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/10">
                  <Link2 className="h-6 w-6 opacity-50" />
                  <p className="text-[12px] font-semibold">구글 드라이브 링크를 추가하면 여기에 표시됩니다</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
