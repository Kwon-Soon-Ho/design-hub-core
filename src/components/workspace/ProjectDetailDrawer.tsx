"use client";

import { useState, useRef, useEffect } from "react";
import { ExternalLink, X, Plus, Check, Calendar, User } from "lucide-react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import {
  type Project,
  teamMembers,
  cellLabel,
  statusLabel,
} from "@/lib/dashboard-data";

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

export function ProjectDetailDrawer({ isOpen, onClose, project }: ProjectDetailDrawerProps) {
  /* ── Title inline edit ─────────────────────────────── */
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(project.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleValue(project.title);
  }, [project.title]);

  useEffect(() => {
    if (isEditingTitle) titleInputRef.current?.focus();
  }, [isEditingTitle]);

  const commitTitle = () => {
    setIsEditingTitle(false);
    if (!titleValue.trim()) setTitleValue(project.title);
  };

  /* ── Collaborator pill state (UI only) ────────────── */
  const managerMember = teamMembers.find(m => m.id === project.details?.manager);
  const collaboratorMembers = (project.details?.collaborators ?? [])
    .map(id => teamMembers.find(m => m.id === id))
    .filter(Boolean) as typeof teamMembers;

  const [collabs, setCollabs] = useState(collaboratorMembers);
  const removeCollab = (id: string) => setCollabs(c => c.filter(m => m.id !== id));

  /* ── Progress value ───────────────────────────────── */
  const progressValue = project.details?.progress ?? project.progress;

  /* ── Date range ───────────────────────────────────── */
  const startDate = project.details?.startDate ?? "—";
  const endDate   = project.details?.endDate   ?? "—";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full md:w-[800px] xl:w-[1000px] sm:max-w-full overflow-y-auto p-0 flex flex-col gap-0 border-l border-border/60 bg-background"
      >
        {/* ── Top Bar ─────────────────────────────────── */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4 shrink-0 border-b border-border/40">
          {/* Cell chip + Status */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold border ${cellChipClass[project.cell]}`}>
              {cellLabel[project.cell]}
            </span>
            <Badge
              variant="outline"
              className={`text-[10px] font-bold ${
                project.status === "issue"    ? "border-red-400/40 text-red-500 bg-red-500/5" :
                project.status === "done"     ? "border-emerald-400/40 text-emerald-500 bg-emerald-500/5" :
                project.status === "ongoing"  ? "border-indigo-400/40 text-indigo-400 bg-indigo-400/5" :
                                                "border-blue-400/40 text-blue-500 bg-blue-500/5"
              }`}
            >
              {statusLabel[project.status]}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-1.5 text-[12px] font-semibold"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              새 창으로 분리
            </Button>
          </div>
        </div>

        {/* ── Meta Section ─────────────────────────────── */}
        <div className="px-8 pt-6 pb-4 shrink-0 space-y-5">
          {/* Inline editable title */}
          {isEditingTitle ? (
            <Input
              ref={titleInputRef}
              value={titleValue}
              onChange={e => setTitleValue(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={e => { if (e.key === "Enter") commitTitle(); if (e.key === "Escape") { setTitleValue(project.title); setIsEditingTitle(false); } }}
              className="text-2xl md:text-[26px] font-bold tracking-tight h-auto py-1 px-2 border-primary/40 ring-primary/20"
            />
          ) : (
            <h2
              onClick={() => setIsEditingTitle(true)}
              className="text-2xl md:text-[26px] font-bold tracking-tight text-foreground leading-snug cursor-text rounded-lg px-2 py-1 -mx-2 hover:bg-muted transition-colors"
              title="클릭하여 제목 편집"
            >
              {titleValue}
            </h2>
          )}

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-wide">진행률</span>
              <span className="text-[13px] font-black tabular-nums text-foreground">{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-2.5" />
          </div>

          {/* PM + Collaborators + Dates grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PM */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <User className="h-3 w-3" /> PM
              </span>
              {managerMember ? (
                <div className="flex items-center gap-2 bg-muted/40 rounded-xl px-3 py-2 w-fit">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                      {managerMember.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[12px] font-semibold text-foreground">{managerMember.name}</span>
                  <span className="text-[10px] text-muted-foreground">{managerMember.dept}</span>
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
              <div className="flex items-center gap-2 text-[12px] font-medium text-foreground bg-muted/40 rounded-xl px-3 py-2 w-fit">
                {startDate} → {endDate}
                <Badge variant="outline" className="text-[10px] font-bold border-destructive/40 text-destructive ml-1">
                  D-{project.dDay}
                </Badge>
              </div>
            </div>

            {/* Collaborators */}
            <div className="md:col-span-2 space-y-2">
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
                {/* Add collaborator placeholder */}
                <button className="flex items-center gap-1 rounded-full border border-dashed border-border/60 px-3 py-1 text-[11px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                  <Plus className="h-3 w-3" />
                  멤버 추가
                </button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* ── Tabs Body ────────────────────────────────── */}
        <div className="flex-1 px-8 pt-6 pb-8">
          <Tabs defaultValue="timeline">
            <TabsList className="mb-6 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="timeline"  className="rounded-lg text-[12px] font-bold px-4">워크플랜</TabsTrigger>
              <TabsTrigger value="report"    className="rounded-lg text-[12px] font-bold px-4">보고</TabsTrigger>
              <TabsTrigger value="feedback"  className="rounded-lg text-[12px] font-bold px-4">피드백</TabsTrigger>
              <TabsTrigger value="assets"    className="rounded-lg text-[12px] font-bold px-4">시안 에셋</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              <div className="h-[400px] border border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center gap-3 text-muted-foreground bg-muted/20">
                <span className="text-[32px]">📅</span>
                <p className="text-[13px] font-semibold">워크플랜 (타임라인/간트차트) — 준비 중</p>
              </div>
            </TabsContent>

            <TabsContent value="report">
              <div className="h-[400px] border border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center gap-3 text-muted-foreground bg-muted/20">
                <span className="text-[32px]">📊</span>
                <p className="text-[13px] font-semibold">보고 섹션 — 준비 중</p>
              </div>
            </TabsContent>

            <TabsContent value="feedback">
              <div className="h-[400px] border border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center gap-3 text-muted-foreground bg-muted/20">
                <span className="text-[32px]">💬</span>
                <p className="text-[13px] font-semibold">피드백 섹션 — 준비 중</p>
              </div>
            </TabsContent>

            <TabsContent value="assets">
              <div className="h-[400px] border border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center gap-3 text-muted-foreground bg-muted/20">
                <span className="text-[32px]">🖼️</span>
                <p className="text-[13px] font-semibold">시안 에셋 갤러리 — 준비 중</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
