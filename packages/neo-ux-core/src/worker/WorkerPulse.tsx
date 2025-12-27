import { ReactNode } from "react";
import { neo } from "../theme";

interface WorkerPulseProps {
  children: ReactNode;
}

export function WorkerPulse({ children }: WorkerPulseProps) {
  return (
    <div className={`p-4 rounded-lg bg-neutral-900 border border-neutral-800 ${neo.glow.active}`}>
      {children}
    </div>
  );
}
