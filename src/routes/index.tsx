import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Loader2, Radar } from "lucide-react";
import { Btn, Field, inputCls, Metric, MockNote, PageHeader, Panel, SeverityBadge, StatusBadge, td, th } from "@/components/qa";
import { agentPhases, bugs, categories, executions, flowNodes } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — TRACE QA" },
      { name: "description", content: "Operations console for autonomous AI-driven website testing." },
      { property: "og:title", content: "Overview — TRACE QA" },
      { property: "og:description", content: "Launch explorations, watch the agent, review executions and findings." },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { activeProject, exploration, startExploration } = useStore();
  const [url, setUrl] = useState(activeProject.url);
  const [objective, setObjective] = useState("Verify guest checkout and authentication flows");
  const [browser, setBrowser] = useState("Chromium");
  const [depth, setDepth] = useState(3);
  const [cats, setCats] = useState<string[]>(["Functional", "Authentication", "Forms"]);
  const toggle = (c: string) => setCats((x) => (x.includes(c) ? x.filter((y) => y !== c) : [...x, c]));
  const reached = Math.ceil((exploration.progress / 100) * flowNodes.length);

  return (
    <div className="mx-auto max-w-[1440px]">
      <PageHeader title="Operations Console" sub={`${activeProject.name} · ${activeProject.url}`} actions={<MockNote />} />

      <div className="mb-4 grid grid-cols-5 rounded-md border border-border bg-surface">
        <Metric label="Executions (7d)" value="214" delta="+18%" />
        <Metric label="Pass rate" value={`${activeProject.passRate}%`} delta="-2.1%" tone="bad" />
        <Metric label="Open bugs" value="3" delta="+2" tone="bad" />
        <Metric label="Coverage" value={`${activeProject.coverage}%`} delta="+4%" />
        <Metric label="Avg duration" value="3m 41s" delta="-12s" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel title="Quick test launch" className="col-span-5">
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); startExploration({ url, objective, browser, depth, categories: cats }); }}>
            <Field label="Target URL"><input className={cn(inputCls, "font-mono")} value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
            <Field label="Testing objective"><textarea className={cn(inputCls, "h-16 py-2")} value={objective} onChange={(e) => setObjective(e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Browser">
                <select className={inputCls} value={browser} onChange={(e) => setBrowser(e.target.value)}>
                  {["Chromium", "Firefox", "WebKit"].map((b) => <option key={b}>{b}</option>)}
                </select>
              </Field>
              <Field label={`Exploration depth · ${depth}`}>
                <input type="range" min={1} max={6} value={depth} onChange={(e) => setDepth(+e.target.value)} className="h-8 w-full accent-primary" />
              </Field>
            </div>
            <Field label="Test categories">
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button type="button" key={c} onClick={() => toggle(c)}
                    className={cn("rounded-sm border px-2 py-1 text-[11px]", cats.includes(c) ? "border-primary/50 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>
                    {c}
                  </button>
                ))}
              </div>
            </Field>
            <Btn variant="primary" type="submit" disabled={exploration.running} className="w-full justify-center">
              {exploration.running ? <Loader2 className="size-3.5 animate-spin" /> : <Radar className="size-3.5" />}
              {exploration.running ? "Exploring…" : "Start Exploration"}
            </Btn>
          </form>
        </Panel>

        <Panel title="Agent activity" className="col-span-7" action={<span className="font-mono text-[11px] text-primary">{exploration.progress}%</span>}>
          <div className="mb-4 h-1 overflow-hidden rounded-full bg-elevated">
            <div className="h-full bg-primary glow transition-all" style={{ width: `${exploration.progress}%` }} />
          </div>
          <ol className="space-y-0">
            {agentPhases.map((p, i) => {
              const done = i < exploration.phase || (!exploration.running && exploration.progress === 100);
              const active = i === exploration.phase && exploration.running;
              return (
                <li key={p} className="flex items-center gap-3 border-l border-border py-1.5 pl-4 relative">
                  <span className={cn("absolute -left-[5px] size-2.5 rounded-full border", done ? "border-primary bg-primary" : active ? "border-info bg-info animate-pulse" : "border-border bg-background")} />
                  <span className={cn("w-40", done ? "text-foreground" : active ? "text-info" : "text-muted-foreground")}>{p}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {done ? <span className="inline-flex items-center gap-1 text-success"><Check className="size-3" />done</span> : active ? "in progress…" : "pending"}
                  </span>
                </li>
              );
            })}
          </ol>
        </Panel>

        <Panel title="Website workflow" className="col-span-12" action={<Link to="/exploration" className="text-[11px] text-muted-foreground hover:text-primary">Open graph →</Link>}>
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {flowNodes.map((n, i) => (
              <div key={n.id} className="flex items-center gap-1">
                <div className={cn("min-w-28 rounded-sm border px-3 py-2 transition-colors", i < reached ? "border-primary/40 bg-elevated" : "border-border opacity-40")}>
                  <div className="text-xs">{n.label}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{n.route}</div>
                </div>
                {i < flowNodes.length - 1 && <ArrowRight className={cn("size-3.5", i < reached - 1 ? "text-primary" : "text-border")} />}
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent executions" className="col-span-8" bodyClass="p-0" action={<Link to="/executions" className="text-[11px] text-muted-foreground hover:text-primary">All →</Link>}>
          <table className="w-full">
            <thead><tr>{["Run", "Suite", "Status", "Pass / Fail", "Browser", "Duration", "Started"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
            <tbody>
              {executions.map((e) => (
                <tr key={e.id} className="hover:bg-elevated">
                  <td className={cn(td, "font-mono text-xs")}>{e.id}</td>
                  <td className={td}>{e.suite}<div className="text-[11px] text-muted-foreground">{e.project}</div></td>
                  <td className={td}><StatusBadge status={e.status} /></td>
                  <td className={cn(td, "font-mono text-xs")}><span className="text-success">{e.passed}</span> / <span className={e.failed ? "text-destructive" : "text-muted-foreground"}>{e.failed}</span></td>
                  <td className={cn(td, "text-muted-foreground")}>{e.browser}</td>
                  <td className={cn(td, "font-mono text-xs")}>{e.duration}</td>
                  <td className={cn(td, "text-muted-foreground")}>{e.started}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Latest findings" className="col-span-4" bodyClass="p-0">
          {bugs.slice(0, 4).map((b) => (
            <Link key={b.id} to="/bugs" className="block border-b border-border/60 px-3 py-2.5 last:border-0 hover:bg-elevated">
              <div className="flex items-center gap-2"><SeverityBadge s={b.severity} /><span className="font-mono text-[10px] text-muted-foreground">{b.id}</span></div>
              <div className="mt-1 text-xs leading-snug">{b.title}</div>
            </Link>
          ))}
        </Panel>
      </div>
    </div>
  );
}
