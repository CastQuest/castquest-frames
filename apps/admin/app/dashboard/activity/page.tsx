'use client';

import { Activity } from 'lucide-react';

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Activity className="text-primary" />
          Activity Feed
        </h1>
        <p className="mt-2 text-neutral-400">
          Track all activities and interactions across the platform
        </p>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <p className="text-neutral-400">Activity feed coming soon...</p>
      </div>
    </div>
  );
}
