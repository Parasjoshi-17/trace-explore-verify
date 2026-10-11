import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Priority, Severity, Status } from "@/lib/mock-data";

export function Panel({ title, action, children, className, bodyClass }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; bodyClass?: string }) {
  return (
    <section className={cn("rounded-md border border-border bg-surface", className)}>
      {title && (
        <header className="flex h-10 items-center justify-between border-b border-border px-3">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{title}</h2>
          {action}
        </header>
      )}
      <div className={cn("p-3", bodyClass)}>{children}</div>
    </section>
  );
}

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-0.5 text-muted-foreground">{sub}</p>}
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
}

const statusCls: Record<Status, string> = {
  passed: "text-success border-success/30 bg-success/5",
  failed: "text-destructive border-destructive/30 bg-destructive/5",
  running: "text-info border-info/30 bg-info/5",
  queued: "text-muted-foreground border-border",
  skipped: "text-warning border-warning/30 bg-warning/5",
};
export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase", statusCls[status])}>
      <span className={cn("size-1.5 rounded-full bg-current", status === "running" && "animate-pulse")} />
      {status}
    </span>
  );
}

const sevCls: Record<Severity, string> = {
  critical: "bg-destructive text-destructive-foreground border-destructive",
  high: "text-destructive border-destructive/40",
  medium: "text-warning border-warning/40",
  low: "text-muted-foreground border-border",
};
export function SeverityBadge({ s }: { s: Severity }) {
  return <span className={cn("rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase", sevCls[s])}>{s}</span>;
}

export function PriorityTag({ p }: { p: Priority }) {
  const c = p === "P0" ? "text-destructive border-destructive/40" : p === "P1" ? "text-warning border-warning/40" : "text-muted-foreground border-border";
  return <span className={cn("rounded-sm border px-1.5 py-0.5 font-mono text-[10px]", c)}>{p}</span>;
}

export function Btn({ variant = "ghost", className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const v = {
    primary: "bg-primary text-primary-foreground hover:glow font-semibold border-primary",
    ghost: "border-border bg-transparent text-foreground hover:bg-accent",
    danger: "border-destructive/40 text-destructive hover:bg-destructive/10",
  }[variant];
  return <button {...props} className={cn("inline-flex h-8 items-center gap-1.5 rounded-sm border px-3 text-xs transition-all disabled:opacity-40", v, className)} />;
}

export const inputCls = "h-8 w-full rounded-sm border border-input bg-background px-2.5 text-xs outline-none placeholder:text-muted-foreground/60 focus:border-primary/60";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function Metric({ label, value, delta, tone }: { label: string; value: string; delta?: string; tone?: "good" | "bad" }) {
  return (
    <div className="border-r border-border px-4 py-3 last:border-r-0">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-mono text-xl font-medium">{value}</span>
        {delta && <span className={cn("font-mono text-[10px]", tone === "bad" ? "text-destructive" : "text-success")}>{delta}</span>}
      </div>
    </div>
  );
}

export function MockNote() {
  return <span className="rounded-sm border border-warning/30 px-1.5 py-0.5 font-mono text-[10px] text-warning">MOCK DATA</span>;
}

export const th = "h-8 border-b border-border px-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground";
export const td = "h-10 border-b border-border/60 px-3";
