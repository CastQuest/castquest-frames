import { ReactNode } from "react";
import { neo } from "../theme";

interface StatsPanelProps {
  children: ReactNode;
}

export function StatsPanel({ children }: StatsPanelProps) {
  return (
    <div className={`p-4 rounded-lg bg-neutral-900 border border-neutral-800 ${neo.glow.idle}`}>
      {children}
    </div>
  );
}
