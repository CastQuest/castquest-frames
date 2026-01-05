"use client";

import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {Icon && (
        <div className="mb-4 p-3 rounded-full bg-neutral-900 border border-neutral-800">
          <Icon size={32} className="text-neutral-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-neutral-300 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-500 text-center max-w-sm mb-4">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
