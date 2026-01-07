import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quest Detail | CastQuest',
  description: 'View quest details',
};

export default function QuestDetailPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/quests"
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Quests
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-white">Quest Detail</h1>
        <p className="mt-2 text-neutral-400">
          View and manage quest information
        </p>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <p className="text-neutral-400">Quest detail view coming soon...</p>
      </div>
    </div>
  );
}
