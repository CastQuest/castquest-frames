"use client";

import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function PageContainer({ children, title, description, action }: PageContainerProps) {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {(title || action) && (
        <div className="flex items-start justify-between">
          <div>
            {title && <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>}
            {description && <p className="text-neutral-400">{description}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
