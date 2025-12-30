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

/**
 * Props for DashboardGrid component
 */
interface DashboardGridProps {
  /** Child elements to display in the grid */
  children: ReactNode;
}

/**
 * Grid layout component for displaying dashboard widgets in a responsive grid
 */
export function DashboardGrid({ children }: DashboardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {children}
    </div>
  );
}

/**
 * Props for DashboardStat component
 */
interface DashboardStatProps {
  /** Label text displayed above the stat value */
  label: string;
  /** Main stat value to display */
  value: string;
  /** Trend indicator with visual arrow and color (optional) */
  trend?: "up" | "down" | "neutral";
}

/**
 * DashboardStat component displays a single statistic with trend indicator
 */
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
