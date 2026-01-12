import { Metadata } from 'next';
import { Filter, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'API Logs | CastQuest',
  description: 'View API request logs',
};

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">API Logs</h1>
        <p className="mt-2 text-neutral-400">
          View and analyze API request logs
        </p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search logs..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white hover:border-neutral-700 transition-colors">
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <p className="text-neutral-400">API logs viewer coming soon...</p>
      </div>
    </div>
  );
}
