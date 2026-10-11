import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Bell, Bug, ChevronsLeft, ChevronsRight, FlaskConical, FolderKanban, Gauge, Images, ListChecks, Network, PlayCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

const nav = [
  { to: "/", label: "Overview", icon: Gauge },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/exploration", label: "Exploration", icon: Network },
  { to: "/test-cases", label: "Test Cases", icon: FlaskConical },
  { to: "/executions", label: "Executions", icon: PlayCircle },
  { to: "/results", label: "Results", icon: ListChecks },
  { to: "/bugs", label: "Bug Reports", icon: Bug },
  { to: "/evidence", label: "Evidence", icon: Images },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { projects, activeProjectId, setActiveProjectId, exploration, run } = useStore();
  const busy = exploration.running || run.running;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <aside className={cn("flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width]", collapsed ? "w-14" : "w-56")}>
        <div className="flex h-12 items-center gap-2 border-b border-sidebar-border px-3">
          <div className="grid size-7 shrink-0 place-items-center rounded-sm bg-primary font-mono text-xs font-bold text-primary-foreground glow">T</div>
          {!collapsed && <span className="font-semibold tracking-tight">TRACE<span className="text-primary"> QA</span></span>}
        </div>
        <nav className="flex-1 space-y-0.5 p-2">
          {nav.map((n) => {
            const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} title={n.label}
                className={cn("relative flex h-8 items-center gap-2.5 rounded-sm px-2.5 text-[13px] transition-colors",
                  active ? "bg-sidebar-accent text-foreground" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground")}>
                {active && <span className="absolute left-0 top-1.5 h-5 w-0.5 rounded-r bg-primary glow" />}
                <n.icon className={cn("size-4 shrink-0", active && "text-primary")} />
                {!collapsed && n.label}
              </Link>
            );
          })}
        </nav>
        {!collapsed && (
          <div className="m-2 rounded-sm border border-sidebar-border p-2.5 font-mono text-[10px] leading-relaxed text-muted-foreground">
            <span className="text-primary">AI</span> PLANS · <span className="text-foreground">PLAYWRIGHT</span> EXECUTES<br />ASSERTIONS VERIFY · EVIDENCE PROVES
          </div>
        )}
        <button onClick={() => setCollapsed((c) => !c)} className="flex h-10 items-center justify-center border-t border-sidebar-border text-muted-foreground hover:text-foreground" aria-label="Toggle sidebar">
          {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
          <span className="text-muted-foreground">Acme QA Workspace</span>
          <span className="text-border">/</span>
          <select value={activeProjectId} onChange={(e) => setActiveProjectId(e.target.value)}
            className="h-7 rounded-sm border border-border bg-surface px-2 text-xs outline-none focus:border-primary/60">
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-sm border border-border px-2 py-1 font-mono text-[10px]">
              <span className={cn("size-1.5 rounded-full", busy ? "animate-pulse bg-info" : "bg-primary glow")} />
              {busy ? "AGENT ACTIVE" : "ALL SYSTEMS NOMINAL"}
            </div>
            <button className="relative text-muted-foreground hover:text-foreground" aria-label="Notifications">
              <Bell className="size-4" />
              <span className="absolute -right-1 -top-1 size-2 rounded-full bg-destructive" />
            </button>
            <div className="grid size-7 place-items-center rounded-full border border-border bg-elevated text-[11px] font-medium">PJ</div>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-auto p-5">{children}</main>
      </div>
    </div>
  );
}
