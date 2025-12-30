import { ReactNode } from "react";
import { neo } from "../theme";

interface DashboardWidgetsProps {
  children: ReactNode;
}

export function DashboardWidgets({ children }: DashboardWidgetsProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 ${neo.glow.idle}`}>
      {children}
    </div>
  );
}

interface DashboardGridProps {
  children: ReactNode;
}

export function DashboardGrid({ children }: DashboardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {children}
    </div>
  );
}

interface DashboardStatProps {
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
}

export function DashboardStat({ label, value, trend = "neutral" }: DashboardStatProps) {
  const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-neutral-400";
  
  return (
    <div className={`${neo.colors.bg.secondary} border ${neo.colors.border.glow} rounded-lg p-4`}>
      <div className={`text-xs ${neo.colors.text.tertiary} uppercase mb-1`}>{label}</div>
      <div className="flex items-center gap-2">
        <div className={`text-2xl font-bold ${neo.colors.text.primary}`}>{value}</div>
        <span className={`text-xs ${trendColor}`}>{trendIcon}</span>
      </div>
    </div>
  );
}
