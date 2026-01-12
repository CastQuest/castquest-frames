'use client';

import { Plus } from 'lucide-react';

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">API Keys</h1>
          <p className="mt-2 text-neutral-400">
            Manage your API keys and authentication
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium">
          <Plus size={18} />
          Generate New Key
        </button>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <p className="text-neutral-400">API keys management coming soon...</p>
      </div>
    </div>
  );
}
