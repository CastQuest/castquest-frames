import { neo } from "@castquest/neo-ux-core";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export function EmptyState({ icon, title, description, action, children }: EmptyStateProps) {
  return (
    <div className={`p-12 rounded-2xl border ${neo.colors.border.default} ${neo.colors.bg.secondary} text-center`}>
      <div className="text-6xl mb-6">{icon}</div>
      <h2 className={`text-3xl font-bold ${neo.colors.text.primary} mb-4`}>
        {title}
      </h2>
      <p className={`text-lg ${neo.colors.text.secondary} max-w-2xl mx-auto mb-6`}>
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className={`px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all`}
        >
          {action.label}
        </button>
      )}
      {children}
    </div>
  );
}

interface ComingSoonProps {
  feature: string;
  description: string;
  icon?: string;
}

export function ComingSoon({ feature, description, icon = "🚀" }: ComingSoonProps) {
  return (
    <EmptyState
      icon={icon}
      title={`${feature} Coming Soon`}
      description={description}
    />
  );
}
