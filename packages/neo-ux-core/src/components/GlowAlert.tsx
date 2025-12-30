import { ReactNode } from "react";
import { neo } from "../theme";

interface GlowAlertProps {
  children: ReactNode;
}

export function GlowAlert({ children }: GlowAlertProps) {
  return (
    <div className={`p-4 rounded-md bg-neutral-900 border border-neutral-800 ${neo.glow.idle}`}>
      {children}
    </div>
  );
}
