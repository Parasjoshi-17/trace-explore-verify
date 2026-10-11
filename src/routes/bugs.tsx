import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { MockNote, PageHeader, Panel, SeverityBadge } from "@/components/qa";
import { bugs, evidence, testCases, type Severity } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bugs")({
  head: () => ({
    meta: [
      { title: "Bug Reports — TRACE QA" },
      { name: "description", content: "Investigate AI-detected bugs with repro steps and evidence." },
      { property: "og:title", content: "Bug Reports — TRACE QA" },
      { property: "og:description", content: "Severity-ranked issues with failed assertions and screenshots." },
    ],
  }),
  component: Bugs,
});

const sevs: ("all" | Severity)[] = ["all", "critical", "high", "medium", "low"];

function Bugs() {
  const [sev, setSev] = useState<(typeof sevs)[number]>("all");
  const [status, setStatus] = useState("all");
  const list = bugs.filter((b) => (sev === "all" || b.severity === sev) && (status === "all" || b.status === status));
  const [id, setId] = useState(bugs[0].id);
  const b = list.find((x) => x.id === id) ?? list[0];
  const tc = b && testCases.find((t) => t.id === b.test);

  return (
    <div className="mx-auto max-w-[1440px]">
      <PageHeader title="Bug Reports" sub={`${bugs.filter((x) => x.status !== "resolved").length} open issues`} actions={<MockNote />} />
      <div className="mb-3 flex items-center gap-1">
        {sevs.map((s) => <button key={s} onClick={() => setSev(s)} className={cn("h-7 rounded-sm border px-2.5 text-xs capitalize", sev === s ? "border-primary/50 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>{s}</button>)}
        <span className="mx-2 h-4 w-px bg-border" />
        {["all", "open", "triaged", "resolved"].map((s) => <button key={s} onClick={() => setStatus(s)} className={cn("h-7 rounded-sm border px-2.5 text-xs capitalize", status === s ? "border-primary/50 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>{s}</button>)}
      </div>
      <div className="grid grid-cols-[400px_1fr] gap-3">
        <Panel bodyClass="p-0">
          {list.map((x) => (
            <button key={x.id} onClick={() => setId(x.id)} className={cn("block w-full border-b border-border/60 px-3 py-3 text-left", b?.id === x.id ? "bg-elevated" : "hover:bg-elevated/50")}>
              <div className="flex items-center gap-2"><SeverityBadge s={x.severity} /><span className="font-mono text-[10px] text-muted-foreground">{x.id}</span><span className="ml-auto font-mono text-[10px] uppercase text-muted-foreground">{x.status}</span></div>
              <div className="mt-1.5 text-xs">{x.title}</div>
              <div className="mt-1 font-mono text-[10px] text-muted-foreground">{x.route} · {x.found}</div>
            </button>
          ))}
          {!list.length && <p className="p-4 text-xs text-muted-foreground">No bugs match these filters.</p>}
        </Panel>
        {b && (
          <div className="space-y-3">
            <Panel>
              <div className="flex items-center gap-2"><SeverityBadge s={b.severity} /><span className="font-mono text-xs text-muted-foreground">{b.id} · from {b.test}</span></div>
              <h2 className="mt-2 text-base font-medium">{b.title}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{b.summary}</p>
            </Panel>
            <div className="grid grid-cols-2 gap-3">
              <Panel title="Reproduction steps">
                <ol className="space-y-1.5">{b.repro.map((r, i) => <li key={i} className="flex gap-3 text-xs"><span className="font-mono text-primary">{i + 1}.</span>{r}</li>)}</ol>
              </Panel>
              <Panel title="Failed assertions">
                {tc?.assertions.filter((a) => a.ok === false).map((a, i) => (
                  <div key={i} className="mb-2 rounded-sm border border-destructive/30 bg-destructive/5 p-2 font-mono text-[11px]">
                    <div className="text-info">{a.type}</div>
                    <div>expected <span className="text-success">{a.expected}</span></div>
                    <div>received <span className="text-destructive">{a.actual}</span></div>
                  </div>
                )) ?? <p className="text-xs text-muted-foreground">Not available.</p>}
              </Panel>
            </div>
            <Panel title="Screenshots & evidence" action={<Link to="/evidence" className="text-[11px] text-muted-foreground hover:text-primary">Library →</Link>}>
              <div className="grid grid-cols-3 gap-2">
                {evidence.filter((e) => b.evidence.includes(e.id)).map((e) => (
                  <div key={e.id} className="rounded-sm border border-border bg-background">
                    <div className="grid aspect-video place-items-center bg-elevated"><ImageIcon className="size-5 text-muted-foreground" /></div>
                    <div className="truncate p-1.5 font-mono text-[10px]">{e.name}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        )}
      </div>
    </div>
  );
}
