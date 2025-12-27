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
