import React from "react";

export interface MetricProps {
  label: string;
  value: string;
  hint?: string;
  trend?: "up" | "down" | "neutral";
}

export function Metric({ label, value, hint, trend }: MetricProps) {
  const trendColors = {
    up: "text-emerald-400",
    down: "text-red-400",
    neutral: "text-slate-400",
  };

  return (
    <div className="cq-metric flex flex-col gap-1.5">
      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold gradient-text">
          {value}
        </span>
        {trend && (
          <span className={`text-xs ${trendColors[trend]}`}>
            {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
          </span>
        )}
      </div>
      {hint && <span className="text-[10px] text-slate-500">{hint}</span>}
    </div>
  );
}
