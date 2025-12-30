import { ReactNode } from "react";
import { neo } from "../theme";

interface DashboardGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}

export function DashboardGrid({ children, columns = 3 }: DashboardGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={`grid gap-4 ${gridCols[columns]}`}>
      {children}
    </div>
  );
}

interface DashboardStatProps {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  icon?: ReactNode;
  subtitle?: string;
}

export function DashboardStat({ label, value, trend, icon, subtitle }: DashboardStatProps) {
  const trendColors = {
    up: "text-emerald-400",
    down: "text-red-400",
    neutral: "text-neutral-400"
  };

  const trendColor = trend ? trendColors[trend] : "text-neutral-400";

  return (
    <div className={`p-4 rounded-lg bg-neutral-900 border border-neutral-800 ${neo.glow.idle} hover:${neo.glow.active} transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">{label}</span>
        {icon && <span className="text-neutral-500">{icon}</span>}
      </div>
      <div className={`text-2xl font-bold ${trendColor}`}>{value}</div>
      {subtitle && <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>}
    </div>
  );
}

interface DashboardSectionProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export function DashboardSection({ title, children, action }: DashboardSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-200">{title}</h2>
        {action && <div>{action}</div>}
      </div>
      {children}
    </section>
  );
}
