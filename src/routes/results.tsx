import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { MockNote, PageHeader, Panel, PriorityTag, StatusBadge } from "@/components/qa";
import { bugs, evidence, testCases } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Results — TRACE QA" },
      { name: "description", content: "Analyze test outcomes with expected vs. actual assertion inspection." },
      { property: "og:title", content: "Results — TRACE QA" },
      { property: "og:description", content: "Failed assertion inspector, durations and linked evidence." },
    ],
  }),
  component: Results,
});

function Results() {
  const ran = testCases.filter((t) => t.status === "passed" || t.status === "failed");
  const [id, setId] = useState(ran.find((t) => t.status === "failed")!.id);
  const t = ran.find((x) => x.id === id)!;
  const linkedBugs = bugs.filter((b) => b.test === t.id);
  const linkedEv = evidence.filter((e) => e.test === t.id);
  const passed = ran.filter((x) => x.status === "passed").length;

  return (
    <div className="mx-auto max-w-[1440px]">
      <PageHeader title="Results" sub={`RUN-2048 · ${passed} passed · ${ran.length - passed} failed`} actions={<MockNote />} />
      <div className="grid grid-cols-[360px_1fr] gap-3">
        <Panel title="Test outcomes" bodyClass="p-0">
          {ran.map((x) => (
            <button key={x.id} onClick={() => setId(x.id)} className={cn("flex w-full items-center gap-3 border-b border-border/60 px-3 py-2.5 text-left", x.id === id ? "bg-elevated" : "hover:bg-elevated/50")}>
              <span className={cn("h-8 w-0.5 rounded", x.status === "passed" ? "bg-success" : "bg-destructive")} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs">{x.title}</div>
                <div className="font-mono text-[10px] text-muted-foreground">{x.id} · {x.duration}</div>
              </div>
              <StatusBadge status={x.status} />
            </button>
          ))}
        </Panel>

        <div className="space-y-3">
          <Panel>
            <div className="flex items-center gap-2"><span className="font-mono text-xs text-muted-foreground">{t.id}</span><PriorityTag p={t.priority} /><StatusBadge status={t.status} /></div>
            <h2 className="mt-1.5 text-base font-medium">{t.title}</h2>
            <div className="mt-3 flex gap-8 font-mono text-[11px] text-muted-foreground">
              <span>duration <b className="text-foreground">{t.duration}</b></span>
              <span>steps <b className="text-foreground">{t.steps.length}</b></span>
              <span>assertions <b className="text-foreground">{t.assertions.length}</b></span>
              <span>browser <b className="text-foreground">chromium</b></span>
            </div>
          </Panel>

          <Panel title="Assertion inspector" bodyClass="p-0">
            <div className="grid grid-cols-[28px_160px_1fr_1fr] border-b border-border px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground"><span /><span>Matcher</span><span>Expected</span><span>Actual</span></div>
            {t.assertions.map((a, i) => (
              <div key={i} className={cn("grid grid-cols-[28px_160px_1fr_1fr] items-center border-b border-border/60 px-3 py-2.5 font-mono text-[11px]", a.ok === false && "bg-destructive/5")}>
                {a.ok ? <Check className="size-3.5 text-success" /> : <X className="size-3.5 text-destructive" />}
                <span className="text-info">{a.type}</span>
                <span className="text-success">{a.expected}</span>
                <span className={a.ok ? "text-foreground" : "text-destructive"}>{a.actual}</span>
              </div>
            ))}
          </Panel>

          <div className="grid grid-cols-2 gap-3">
            <Panel title="Linked bug reports" bodyClass="p-0">
              {linkedBugs.length ? linkedBugs.map((b) => (
                <Link key={b.id} to="/bugs" className="block border-b border-border/60 px-3 py-2 text-xs last:border-0 hover:bg-elevated"><span className="mr-2 font-mono text-[10px] text-destructive">{b.id}</span>{b.title}</Link>
              )) : <p className="p-3 text-xs text-muted-foreground">No bugs linked.</p>}
            </Panel>
            <Panel title="Evidence" bodyClass="p-0">
              {linkedEv.length ? linkedEv.map((e) => (
                <Link key={e.id} to="/evidence" className="flex justify-between border-b border-border/60 px-3 py-2 font-mono text-[11px] last:border-0 hover:bg-elevated"><span>{e.name}</span><span className="text-muted-foreground">{e.kind}</span></Link>
              )) : <p className="p-3 text-xs text-muted-foreground">No evidence captured.</p>}
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
