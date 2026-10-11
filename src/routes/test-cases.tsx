import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Play, X } from "lucide-react";
import { Btn, MockNote, PageHeader, Panel, PriorityTag, StatusBadge, td, th } from "@/components/qa";
import { categories, testCases, type TestCase } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/test-cases")({
  head: () => ({
    meta: [
      { title: "Test Cases — TRACE QA" },
      { name: "description", content: "AI-generated structured test cases with steps and assertions." },
      { property: "og:title", content: "Test Cases — TRACE QA" },
      { property: "og:description", content: "Design, filter and execute structured Playwright test cases." },
    ],
  }),
  component: TestCases,
});

function TestCases() {
  const [cat, setCat] = useState("All");
  const [sel, setSel] = useState<string[]>([]);
  const [open, setOpen] = useState<TestCase | null>(null);
  const { startRun } = useStore();
  const nav = useNavigate();
  const list = testCases.filter((t) => cat === "All" || t.category === cat);
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="mx-auto max-w-[1440px]">
      <PageHeader title="Test Cases" sub={`${testCases.length} generated from 4 discovered workflows`}
        actions={<><MockNote /><Btn variant="primary" disabled={!sel.length} onClick={() => { startRun(); nav({ to: "/executions" }); }}><Play className="size-3.5" />Execute {sel.length || ""} selected</Btn></>} />
      <div className="mb-3 flex gap-1">
        {["All", ...categories].map((c) => (
          <button key={c} onClick={() => setCat(c)} className={cn("h-7 rounded-sm border px-2.5 text-xs", cat === c ? "border-primary/50 bg-elevated text-primary" : "border-border text-muted-foreground hover:text-foreground")}>
            {c}<span className="ml-1.5 font-mono text-[10px] opacity-60">{c === "All" ? testCases.length : testCases.filter((t) => t.category === c).length}</span>
          </button>
        ))}
      </div>
      <Panel bodyClass="p-0">
        <table className="w-full">
          <thead><tr>
            <th className={cn(th, "w-8")}><input type="checkbox" className="accent-primary" checked={sel.length === list.length && list.length > 0} onChange={(e) => setSel(e.target.checked ? list.map((t) => t.id) : [])} /></th>
            {["ID", "Title", "Category", "Priority", "Workflow", "Steps", "Last status", "Duration"].map((h) => <th key={h} className={th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {list.map((t) => (
              <tr key={t.id} className={cn("cursor-pointer hover:bg-elevated", open?.id === t.id && "bg-elevated")} onClick={() => setOpen(t)}>
                <td className={td} onClick={(e) => e.stopPropagation()}><input type="checkbox" className="accent-primary" checked={sel.includes(t.id)} onChange={() => toggle(t.id)} /></td>
                <td className={cn(td, "font-mono text-xs")}>{t.id}</td>
                <td className={td}>{t.title}</td>
                <td className={cn(td, "text-muted-foreground")}>{t.category}</td>
                <td className={td}><PriorityTag p={t.priority} /></td>
                <td className={cn(td, "text-[11px] text-muted-foreground")}>{t.flow}</td>
                <td className={cn(td, "font-mono text-xs")}>{t.steps.length}</td>
                <td className={td}><StatusBadge status={t.status} /></td>
                <td className={cn(td, "font-mono text-xs")}>{t.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {open && (
        <aside className="fixed inset-y-0 right-0 z-40 flex w-[480px] flex-col border-l border-border bg-surface animate-in slide-in-from-right">
          <div className="flex items-start justify-between border-b border-border p-4">
            <div>
              <div className="flex items-center gap-2"><span className="font-mono text-xs text-muted-foreground">{open.id}</span><PriorityTag p={open.priority} /><StatusBadge status={open.status} /></div>
              <h3 className="mt-1.5 font-medium">{open.title}</h3>
            </div>
            <button onClick={() => setOpen(null)}><X className="size-4 text-muted-foreground" /></button>
          </div>
          <div className="flex-1 space-y-5 overflow-auto p-4">
            <section>
              <h4 className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Preconditions</h4>
              {open.preconditions.length ? <ul className="space-y-1">{open.preconditions.map((p) => <li key={p} className="flex gap-2 text-xs"><span className="text-primary">›</span>{p}</li>)}</ul> : <p className="text-xs text-muted-foreground">None</p>}
            </section>
            <section>
              <h4 className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Browser steps</h4>
              <ol className="overflow-hidden rounded-sm border border-border">
                {open.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 border-b border-border/60 bg-background px-3 py-2 font-mono text-[11px] last:border-0">
                    <span className="w-4 text-muted-foreground">{i + 1}</span>
                    <span className="w-14 text-info">{s.action}</span>
                    <span className="flex-1 break-all">{s.target}</span>
                    {s.value && <span className="text-warning">"{s.value}"</span>}
                  </li>
                ))}
              </ol>
            </section>
            <section>
              <h4 className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Assertions</h4>
              <ul className="space-y-1.5">
                {open.assertions.map((a, i) => (
                  <li key={i} className="flex items-center gap-2 rounded-sm border border-border px-3 py-2 font-mono text-[11px]">
                    {a.ok === true ? <Check className="size-3.5 text-success" /> : a.ok === false ? <X className="size-3.5 text-destructive" /> : <span className="size-3.5 rounded-full border border-border" />}
                    <span className="text-info">{a.type}</span><span>{a.expected}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </aside>
      )}
    </div>
  );
}
