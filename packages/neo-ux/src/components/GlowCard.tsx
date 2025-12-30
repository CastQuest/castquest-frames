"use client";
import { neo } from "../theme";

export function GlowCard({ children }: { children: React.ReactNode }) {
  return (
    <div className={`p-4 rounded-lg bg-neutral-900 border border-neutral-800 ${neo.glow.idle}`}>
      {children}
    </div>
  );
}
