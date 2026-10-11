import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, FileCode2, RefreshCw } from "lucide-react";
import { Btn, MockNote, PageHeader, Panel } from "@/components/qa";
import { flowEdges, flowNodes } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/exploration")({
  head: () => ({
    meta: [
      { title: "Exploration — TRACE QA" },
      { name: "description", content: "Discovered routes, workflow graph and interactive element inspector." },
      { property: "og:title", content: "Exploration — TRACE QA" },
      { property: "og:description", content: "Inspect the site map the AI agent discovered." },
    ],
  }),
  component: Exploration,
});

const W = 150, H = 54;

function Exploration() {
  const { activeProject, exploration, startExploration } = useStore();
  const [nodeId, setNodeId] = useState("checkout");
  const node = flowNodes.find((n) => n.id === nodeId)!;
  const [elId, setElId] = useState(node.elements[0]!.id);
  const element = node.elements.find((e) => e.id === elId) ?? node.elements[0]!;
  const pick = (id: string) => { setNodeId(id); setElId(flowNodes.find((n) => n.id === id)!.elements[0]!.id); };
  const total = flowNodes.reduce((a, n) => a + n.elements.length, 0);

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Exploration" sub={`Discovered map of ${activeProject.url}`}
        actions={<><MockNote /><Btn variant="primary" disabled={exploration.running} onClick={() => startExploration({ url: activeProject.url, objective: "Re-explore", browser: "Chromium", depth: 3, categories: [] })}>
          <RefreshCw className={cn("size-3.5", exploration.running && "animate-spin")} />{exploration.running ? `Exploring ${exploration.progress}%` : "Re-explore"}</Btn></>} />

      <div className="mb-3 flex gap-6 rounded-md border border-border bg-surface px-4 py-2 font-mono text-[11px] text-muted-foreground">
        <span>routes <b className="text-foreground">{flowNodes.length}</b></span>
        <span>elements <b className="text-foreground">{total}</b></span>
        <span>workflows <b className="text-foreground">4</b></span>
        <span>forms <b className="text-foreground">{flowNodes.filter((n) => n.kind === "form").length}</b></span>
        <span>external links <b className="text-foreground">11</b></span>
        <span className="ml-auto">last crawl 12 min ago · depth 3</span>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[220px_1fr_300px] gap-3">
        <Panel title="Site structure" bodyClass="p-1">
          <div className="px-2 py-1 font-mono text-[11px] text-muted-foreground">{new URL(activeProject.url).host}</div>
          {flowNodes.map((n) => (
            <button key={n.id} onClick={() => pick(n.id)}
              className={cn("flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-left font-mono text-[11px]", n.id === nodeId ? "bg-elevated text-primary" : "text-muted-foreground hover:text-foreground")}
              style={{ paddingLeft: 8 + (n.route.split("/").length - 2) * 10 }}>
              <ChevronRight className="size-3" />{n.route}
              <span className="ml-auto text-[10px] text-muted-foreground">{n.elements.length}</span>
            </button>
          ))}
        </Panel>

        <Panel title="Workflow graph" bodyClass="relative h-[calc(100%-2.5rem)] overflow-auto p-0">
          <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
          <svg width={1240} height={360} className="relative">
            {flowEdges.map(([a, b]) => {
              const s = flowNodes.find((n) => n.id === a)!, t = flowNodes.find((n) => n.id === b)!;
              const x1 = s.x + W, y1 = s.y + H / 2, x2 = t.x, y2 = t.y + H / 2;
              const hot = a === nodeId || b === nodeId;
              return <path key={a + b} d={`M${x1},${y1} C${x1 + 40},${y1} ${x2 - 40},${y2} ${x2},${y2}`} fill="none" stroke={hot ? "var(--primary)" : "var(--border)"} strokeWidth={hot ? 1.5 : 1} />;
            })}
            {flowNodes.map((n) => {
              const sel = n.id === nodeId;
              return (
                <g key={n.id} transform={`translate(${n.x},${n.y})`} className="cursor-pointer" onClick={() => pick(n.id)}>
                  <rect width={W} height={H} rx={4} fill="var(--elevated)" stroke={sel ? "var(--primary)" : "var(--border)"} style={sel ? { filter: "drop-shadow(0 0 6px color-mix(in oklab, var(--primary) 50%, transparent))" } : undefined} />
                  <text x={12} y={22} fill="var(--foreground)" fontSize={12}>{n.label}</text>
                  <text x={12} y={40} fill="var(--muted-foreground)" fontSize={10} fontFamily="JetBrains Mono">{n.route}</text>
                  <text x={W - 10} y={22} textAnchor="end" fill={n.kind === "terminal" ? "var(--primary)" : "var(--muted-foreground)"} fontSize={9} fontFamily="JetBrains Mono">{n.kind}</text>
                </g>
              );
            })}
          </svg>
        </Panel>

        <Panel title="Element inspector" bodyClass="p-0">
          <div className="border-b border-border p-3">
            <div className="font-medium">{node.label}</div>
            <div className="font-mono text-[11px] text-muted-foreground">{node.route}</div>
          </div>
          <div className="border-b border-border">
            {node.elements.map((e) => (
              <button key={e.id} onClick={() => setElId(e.id)} className={cn("flex w-full items-center gap-2 px-3 py-2 text-left text-xs", e.id === element.id ? "bg-elevated" : "hover:bg-elevated/50")}>
                <FileCode2 className={cn("size-3.5", e.id === element.id ? "text-primary" : "text-muted-foreground")} />
                <span className="font-mono text-[10px] text-muted-foreground">&lt;{e.tag}&gt;</span>{e.label}
              </button>
            ))}
          </div>
          <dl className="space-y-3 p-3 text-xs">
            <div><dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Selector</dt><dd className="mt-1 break-all rounded-sm border border-border bg-background p-2 font-mono text-[11px] text-primary">{element.selector}</dd></div>
            <div><dt className="text-[10px] uppercase tracking-wider text-muted-foreground">ARIA role</dt><dd className="mt-1 font-mono">{element.role}</dd></div>
            <div><dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Attributes</dt>
              <dd className="mt-1 space-y-1 font-mono text-[11px]">
                {Object.entries(element.attrs).length ? Object.entries(element.attrs).map(([k, v]) => <div key={k} className="flex justify-between border-b border-border/50 pb-1"><span className="text-muted-foreground">{k}</span><span>{v}</span></div>) : <span className="text-muted-foreground">none</span>}
              </dd>
            </div>
          </dl>
        </Panel>
      </div>
    </div>
  );
}
