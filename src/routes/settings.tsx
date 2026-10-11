import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import { Btn, Field, inputCls, MockNote, PageHeader, Panel } from "@/components/qa";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — TRACE QA" },
      { name: "description", content: "Configure AI model provider, browsers, timeouts and workspace." },
      { property: "og:title", content: "Settings — TRACE QA" },
      { property: "og:description", content: "AI provider, browser configuration and workspace settings." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);
  const [browsers, setBrowsers] = useState(["Chromium"]);
  const [headless, setHeadless] = useState(true);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Settings" sub="Workspace configuration" actions={<><MockNote /><Btn variant="primary" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1500); }}>{saved && <Check className="size-3.5" />}{saved ? "Saved locally" : "Save changes"}</Btn></>} />
      <div className="space-y-3">
        <Panel title="AI model provider">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Provider"><select className={inputCls}><option>Google Gemini</option><option>OpenAI</option><option>Anthropic</option></select></Field>
            <Field label="Model"><select className={inputCls}><option>gemini-2.5-pro</option><option>gemini-2.5-flash</option></select></Field>
            <Field label="API key">
              <div className="relative">
                <input type={show ? "text" : "password"} className={cn(inputCls, "pr-8 font-mono")} placeholder="Stored server-side by FastAPI backend" />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-2 text-muted-foreground">{show ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}</button>
              </div>
            </Field>
            <Field label="Temperature"><input type="number" step={0.1} defaultValue={0.2} className={cn(inputCls, "font-mono")} /></Field>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Keys are never stored in the browser. This prototype does not transmit them anywhere.</p>
        </Panel>
        <Panel title="Browser configuration">
          <div className="mb-3 flex gap-1.5">
            {["Chromium", "Firefox", "WebKit"].map((b) => (
              <button key={b} onClick={() => setBrowsers((x) => (x.includes(b) ? x.filter((y) => y !== b) : [...x, b]))} className={cn("h-8 rounded-sm border px-3 text-xs", browsers.includes(b) ? "border-primary/50 text-primary" : "border-border text-muted-foreground")}>{b}</button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Viewport"><select className={inputCls}><option>1440×900</option><option>1280×720</option><option>390×844 (mobile)</option></select></Field>
            <Field label="Parallel workers"><input type="number" defaultValue={4} className={cn(inputCls, "font-mono")} /></Field>
            <Field label="Mode">
              <button onClick={() => setHeadless((h) => !h)} className={cn(inputCls, "text-left")}>{headless ? "Headless" : "Headed"}</button>
            </Field>
          </div>
        </Panel>
        <Panel title="Timeouts">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Navigation (ms)"><input defaultValue={30000} className={cn(inputCls, "font-mono")} /></Field>
            <Field label="Action (ms)"><input defaultValue={10000} className={cn(inputCls, "font-mono")} /></Field>
            <Field label="Assertion (ms)"><input defaultValue={5000} className={cn(inputCls, "font-mono")} /></Field>
          </div>
        </Panel>
        <Panel title="Workspace">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Workspace name"><input defaultValue="Acme QA Workspace" className={inputCls} /></Field>
            <Field label="Backend API URL"><input defaultValue="http://localhost:8000/api" className={cn(inputCls, "font-mono")} /></Field>
            <Field label="Evidence retention"><select className={inputCls}><option>30 days</option><option>90 days</option><option>Forever</option></select></Field>
            <Field label="Failure notifications"><select className={inputCls}><option>Critical & high</option><option>All failures</option><option>Off</option></select></Field>
          </div>
        </Panel>
      </div>
    </div>
  );
}
