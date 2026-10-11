import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Btn, Field, inputCls, MockNote, PageHeader, Panel, td, th } from "@/components/qa";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — TRACE QA" },
      { name: "description", content: "Manage tested applications, environments and coverage." },
      { property: "og:title", content: "Projects — TRACE QA" },
      { property: "og:description", content: "Projects, environments, test coverage and run history." },
    ],
  }),
  component: Projects,
});

function Projects() {
  const { projects, activeProjectId, setActiveProjectId, addProject } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("https://");
  const [envs, setEnvs] = useState("staging, production");

  return (
    <div className="mx-auto max-w-[1440px]">
      <PageHeader title="Projects" sub={`${projects.length} applications under test`} actions={<><MockNote /><Btn variant="primary" onClick={() => setOpen(true)}><Plus className="size-3.5" />Create project</Btn></>} />
      <Panel bodyClass="p-0">
        <table className="w-full">
          <thead><tr>{["Project", "Base URL", "Environments", "Tests", "Coverage", "Pass rate", "History", "Last run", ""].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className={cn("hover:bg-elevated", p.id === activeProjectId && "bg-elevated/60")}>
                <td className={cn(td, "font-medium")}>{p.name}</td>
                <td className={cn(td, "font-mono text-xs text-muted-foreground")}>{p.url}</td>
                <td className={td}><div className="flex gap-1">{p.environments.map((e) => <span key={e} className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px]">{e}</span>)}</div></td>
                <td className={cn(td, "font-mono text-xs")}>{p.tests}</td>
                <td className={td}>
                  <div className="flex items-center gap-2"><div className="h-1 w-20 rounded-full bg-elevated"><div className="h-full rounded-full bg-primary" style={{ width: `${p.coverage}%` }} /></div><span className="font-mono text-[11px]">{p.coverage}%</span></div>
                </td>
                <td className={cn(td, "font-mono text-xs", p.passRate >= 90 ? "text-success" : "text-warning")}>{p.passRate}%</td>
                <td className={td}><div className="flex gap-0.5">{p.history.map((h, i) => <span key={i} className={cn("h-4 w-1.5 rounded-[1px]", h === "passed" ? "bg-success/70" : "bg-destructive/80")} />)}{!p.history.length && <span className="text-muted-foreground">—</span>}</div></td>
                <td className={cn(td, "text-muted-foreground")}>{p.lastRun}</td>
                <td className={td}>{p.id === activeProjectId ? <span className="font-mono text-[10px] text-primary">ACTIVE</span> : <Btn onClick={() => setActiveProjectId(p.id)} className="h-6">Set active</Btn>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80" onClick={() => setOpen(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; addProject({ name, url, environments: envs.split(",").map((s) => s.trim()).filter(Boolean) }); setOpen(false); setName(""); }}
            className="w-[440px] rounded-md border border-border bg-surface">
            <div className="flex h-11 items-center justify-between border-b border-border px-4"><span className="font-medium">Create project</span><button type="button" onClick={() => setOpen(false)}><X className="size-4 text-muted-foreground" /></button></div>
            <div className="space-y-3 p-4">
              <Field label="Project name"><input autoFocus className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Customer portal" /></Field>
              <Field label="Base URL"><input className={cn(inputCls, "font-mono")} value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
              <Field label="Environments (comma separated)"><input className={inputCls} value={envs} onChange={(e) => setEnvs(e.target.value)} /></Field>
            </div>
            <div className="flex justify-end gap-2 border-t border-border p-3"><Btn type="button" onClick={() => setOpen(false)}>Cancel</Btn><Btn variant="primary" type="submit">Create</Btn></div>
          </form>
        </div>
      )}
    </div>
  );
}
