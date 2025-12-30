"use client";

export function GlowPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-xl shadow-inner">
      {children}
    </div>
  );
}
