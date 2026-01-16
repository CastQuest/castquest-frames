import React from "react";

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ title, children, className = "", glow = false }: CardProps) {
  return (
    <section
      className={`cq-card rounded-xl fx-glass p-5 border border-slate-800 ${
        glow ? "aura-glow" : ""
      } ${className}`}
    >
      {title && (
        <h2 className="mb-3 text-sm font-bold tracking-tight text-slate-100 flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
          {title}
        </h2>
      )}
      <div className="text-xs text-slate-300">{children}</div>
    </section>
  );
}
