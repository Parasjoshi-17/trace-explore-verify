import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { projects as seedProjects, agentPhases, executionScript, type Project } from "./mock-data";

interface ExploreConfig { url: string; objective: string; browser: string; depth: number; categories: string[]; }

interface Store {
  projects: Project[];
  addProject: (p: Omit<Project, "id" | "coverage" | "tests" | "lastRun" | "passRate" | "history">) => void;
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  activeProject: Project;
  exploration: { running: boolean; progress: number; phase: number; config?: ExploreConfig; log: string[] };
  startExploration: (c: ExploreConfig) => void;
  run: { running: boolean; paused: boolean; line: number };
  startRun: () => void;
  togglePause: () => void;
  stopRun: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState(seedProjects);
  const [activeProjectId, setActiveProjectId] = useState(seedProjects[0].id);
  const [exploration, setExploration] = useState<Store["exploration"]>({ running: false, progress: 100, phase: agentPhases.length - 1, log: [] });
  const [run, setRun] = useState({ running: false, paused: false, line: executionScript.length });
  const runRef = useRef(run);
  runRef.current = run;

  useEffect(() => {
    if (!exploration.running) return;
    const id = setInterval(() => {
      setExploration((e) => {
        const progress = Math.min(100, e.progress + 3);
        const phase = Math.min(agentPhases.length - 1, Math.floor((progress / 100) * agentPhases.length));
        const log = phase !== e.phase ? [...e.log, `${agentPhases[phase]} started`] : e.log;
        return { ...e, progress, phase, log, running: progress < 100 };
      });
    }, 350);
    return () => clearInterval(id);
  }, [exploration.running]);

  useEffect(() => {
    if (!run.running || run.paused) return;
    const id = setInterval(() => {
      setRun((r) => {
        const line = r.line + 1;
        return { ...r, line, running: line < executionScript.length };
      });
    }, 700);
    return () => clearInterval(id);
  }, [run.running, run.paused]);

  const value: Store = {
    projects,
    addProject: (p) => {
      const id = `p${Date.now()}`;
      setProjects((ps) => [...ps, { ...p, id, coverage: 0, tests: 0, lastRun: "never", passRate: 0, history: [] }]);
      setActiveProjectId(id);
    },
    activeProjectId,
    setActiveProjectId,
    activeProject: projects.find((p) => p.id === activeProjectId) ?? projects[0],
    exploration,
    startExploration: (config) => setExploration({ running: true, progress: 0, phase: 0, config, log: [`${agentPhases[0]} started`] }),
    run,
    startRun: () => setRun({ running: true, paused: false, line: 0 }),
    togglePause: () => setRun((r) => ({ ...r, paused: !r.paused })),
    stopRun: () => setRun((r) => ({ ...r, running: false, paused: false })),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}
