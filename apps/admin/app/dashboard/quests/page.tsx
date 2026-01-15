import { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quests | CastQuest',
  description: 'Manage and view all quests',
};

export default function QuestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Quests</h1>
          <p className="mt-2 text-neutral-400">
            Manage and view all quests
          </p>
        </div>
        <Link href="/dashboard/builder" className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium">
          <Plus size={18} />
          Create Quest
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search quests..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <p className="text-neutral-400">Quest list coming soon...</p>
      </div>
    </div>
  );
}
