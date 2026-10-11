import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, FileText, Film, ImageIcon, Package, X } from "lucide-react";
import { Btn, MockNote, PageHeader } from "@/components/qa";
import { evidence, type Evidence } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence — TRACE QA" },
      { name: "description", content: "Screenshots, logs, traces and videos captured during test runs." },
      { property: "og:title", content: "Evidence — TRACE QA" },
      { property: "og:description", content: "Browse and download evidence that proves every result." },
    ],
  }),
  component: EvidencePage,
});

const icons = { screenshot: ImageIcon, log: FileText, trace: Package, video: Film };
const kinds = ["all", "screenshot", "log", "trace", "video"] as const;

function download(e: Evidence) {
  const blob = new Blob([`MOCK EVIDENCE PLACEHOLDER\n${e.name}\nrun: ${e.run}\ntest: ${e.test}\n`], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${e.name}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function EvidencePage() {
  const [kind, setKind] = useState<(typeof kinds)[number]>("all");
  const [preview, setPreview] = useState<Evidence | null>(null);
  const list = evidence.filter((e) => kind === "all" || e.kind === kind);

  return (
    <div className="mx-auto max-w-[1440px]">
      <PageHeader title="Evidence" sub={`${evidence.length} artifacts across 2 runs`} actions={<MockNote />} />
      <div className="mb-3 flex gap-1">
        {kinds.map((k) => <button key={k} onClick={() => setKind(k)} className={cn("h-7 rounded-sm border px-2.5 text-xs capitalize", kind === k ? "border-primary/50 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>{k}</button>)}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {list.map((e) => {
          const I = icons[e.kind];
          return (
            <div key={e.id} className="group overflow-hidden rounded-md border border-border bg-surface transition-colors hover:border-primary/40">
              <button onClick={() => setPreview(e)} className="relative grid aspect-video w-full place-items-center bg-elevated">
                {e.kind === "screenshot" ? (
                  <div className="absolute inset-3 space-y-1.5 rounded-sm border border-border bg-background p-2">
                    <div className="h-2 w-1/3 rounded-sm bg-elevated" /><div className="h-1.5 w-2/3 rounded-sm bg-elevated" />
                    <div className="grid grid-cols-3 gap-1 pt-1">{[0, 1, 2].map((i) => <div key={i} className="h-6 rounded-sm bg-elevated" />)}</div>
                  </div>
                ) : <I className="size-7 text-muted-foreground" />}
                <span className="absolute left-2 top-2 rounded-sm border border-border bg-background px-1.5 font-mono text-[9px] uppercase text-muted-foreground">{e.kind}</span>
              </button>
              <div className="flex items-center gap-2 p-2.5">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-mono text-[11px]">{e.name}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{e.test} · {e.run} · {e.size}</div>
                </div>
                <button onClick={() => download(e)} className="text-muted-foreground hover:text-primary" aria-label="Download"><Download className="size-3.5" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/90 p-10" onClick={() => setPreview(null)}>
          <div className="flex h-full max-h-[760px] w-full max-w-5xl flex-col rounded-md border border-border bg-surface" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-11 items-center gap-3 border-b border-border px-4">
              <span className="font-mono text-xs">{preview.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{preview.test} · {preview.run} · {preview.when}</span>
              <div className="ml-auto flex gap-2"><Btn onClick={() => download(preview)}><Download className="size-3.5" />Download</Btn><button onClick={() => setPreview(null)}><X className="size-4 text-muted-foreground" /></button></div>
            </div>
            <div className="flex-1 overflow-auto bg-background p-6">
              {preview.kind === "log" ? (
                <pre className="font-mono text-[11px] leading-6 text-muted-foreground">{`[firefox] 00:00.210 page.goto /invoices/881\n[firefox] 00:01.044 click text=Download PDF\n[firefox] 00:01.050 waitForEvent('download') timeout=30000\n`}<span className="text-destructive">[firefox] 00:31.050 TimeoutError: waiting for event "download"</span></pre>
              ) : (
                <div className="grid h-full place-items-center rounded-sm border border-dashed border-border">
                  <div className="text-center"><ImageIcon className="mx-auto size-8 text-muted-foreground" /><p className="mt-2 font-mono text-[11px] text-muted-foreground">{preview.kind} preview placeholder — real artifact served by backend</p></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
