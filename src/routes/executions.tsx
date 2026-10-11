import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Lock, MousePointer2, Pause, Play, RotateCw, Square } from "lucide-react";
import { Btn, MockNote, StatusBadge } from "@/components/qa";
import { executionScript } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/executions")({
  head: () => ({
    meta: [
      { title: "Executions — TRACE QA" },
      { name: "description", content: "Live Playwright browser execution with technical console." },
      { property: "og:title", content: "Executions — TRACE QA" },
      { property: "og:description", content: "Watch tests run in a real browser with timestamped logs." },
    ],
  }),
  component: Executions,
});

const levels = ["all", "step", "pass", "fail", "info", "warn"] as const;
const lvlCls = { info: "text-muted-foreground", step: "text-info", pass: "text-success", fail: "text-destructive", warn: "text-warning" };

function Executions() {
  const { run, startRun, togglePause, stopRun, activeProject } = useStore();
  const [filter, setFilter] = useState<(typeof levels)[number]>("all");
  const lines = executionScript.slice(0, run.line);
  const shown = lines.filter((l) => filter === "all" || l.level === filter);
  const last = lines.at(-1);
  const status = run.running ? "running" : lines.some((l) => l.level === "fail") ? "failed" : "passed";
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollTo({ top: 1e6 }); }, [run.line]);
  const stepIdx = lines.filter((l) => l.level === "step").length;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-4 rounded-md border border-border bg-surface px-4 py-2.5">
        <span className="font-mono text-xs">RUN-2049</span>
        <StatusBadge status={status} />
        <span className="text-xs">TC-101 · Guest completes checkout</span>
        <span className="font-mono text-[11px] text-muted-foreground">chromium · 1440×900 · {activeProject.environments[0]}</span>
        <div className="mx-2 h-1 flex-1 rounded-full bg-elevated"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(run.line / executionScript.length) * 100}%` }} /></div>
        <span className="font-mono text-[11px]">{last?.t ?? "00:00.000"}</span>
        <MockNote />
        {run.running ? (
          <>
            <Btn onClick={togglePause}>{run.paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}{run.paused ? "Resume" : "Pause"}</Btn>
            <Btn variant="danger" onClick={stopRun}><Square className="size-3.5" />Stop</Btn>
          </>
        ) : <Btn variant="primary" onClick={startRun}><RotateCw className="size-3.5" />Run again</Btn>}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1.2fr_1fr] gap-3">
        <section className="flex min-h-0 flex-col overflow-hidden rounded-md border border-border bg-surface">
          <div className="flex h-9 items-center gap-2 border-b border-border px-3">
            <span className="size-2.5 rounded-full bg-destructive" /><span className="size-2.5 rounded-full bg-warning" /><span className="size-2.5 rounded-full bg-success" />
            <div className="ml-3 flex h-6 flex-1 items-center gap-1.5 rounded-sm bg-background px-2 font-mono text-[11px] text-muted-foreground">
              <Lock className="size-3" />{activeProject.url}{stepIdx > 6 ? "/checkout" : stepIdx > 2 ? "/products/42" : "/"}
            </div>
          </div>
          <div className="relative flex-1 bg-background p-6">
            <div className="mx-auto max-w-md space-y-3 opacity-80">
              <div className="h-6 w-1/2 rounded-sm bg-elevated" />
              <div className="h-3 w-3/4 rounded-sm bg-elevated" />
              <div className="mt-6 grid grid-cols-2 gap-3">{[0, 1, 2, 3].map((i) => <div key={i} className="h-24 rounded-sm border border-border bg-surface" />)}</div>
              <div className={cn("mt-4 h-9 w-40 rounded-sm border", last?.level === "step" ? "border-primary glow" : "border-border")} />
            </div>
            {last?.level === "step" && run.running && (
              <div className="absolute left-1/2 top-1/2 flex items-center gap-2 rounded-sm border border-primary/40 bg-surface px-2 py-1 font-mono text-[10px] text-primary">
                <MousePointer2 className="size-3" />{last.msg}
              </div>
            )}
            <div className="absolute bottom-3 left-3 font-mono text-[10px] text-muted-foreground">browser viewport · live stream placeholder</div>
          </div>
          <div className="border-t border-border p-2 font-mono text-[10px] text-muted-foreground">step {stepIdx} / {executionScript.filter((l) => l.level === "step").length} · assertions {lines.filter((l) => l.level === "pass").length} passed, {lines.filter((l) => l.level === "fail").length} failed</div>
        </section>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-md border border-border bg-surface">
          <div className="flex h-9 items-center gap-1 border-b border-border px-2">
            <span className="mr-2 px-1 text-[11px] uppercase tracking-wider text-muted-foreground">Console</span>
            {levels.map((l) => (
              <button key={l} onClick={() => setFilter(l)} className={cn("rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase", filter === l ? "bg-elevated text-foreground" : "text-muted-foreground hover:text-foreground")}>{l}</button>
            ))}
          </div>
          <div ref={ref} className="flex-1 overflow-auto bg-background p-2 font-mono text-[11px] leading-6">
            {shown.map((l, i) => (
              <div key={i} className={cn("flex gap-3 px-1", l.level === "fail" && "bg-destructive/5")}>
                <span className="text-muted-foreground/60">{l.t}</span>
                <span className={cn("w-9 uppercase", lvlCls[l.level])}>{l.level}</span>
                <span className={l.level === "fail" ? "text-destructive" : "text-foreground/90"}>{l.msg}</span>
              </div>
            ))}
            {run.running && !run.paused && <div className="px-1 text-primary animate-pulse">▍</div>}
            {!lines.length && <div className="p-2 text-muted-foreground">Waiting for run…</div>}
          </div>
        </section>
      </div>
    </div>
  );
}
