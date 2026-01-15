import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frame Detail | CastQuest',
  description: 'View frame details',
};

export default function FrameDetailPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/frames"
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Frames
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-white">Frame Detail</h1>
        <p className="mt-2 text-neutral-400">
          View and manage frame information
        </p>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <p className="text-neutral-400">Frame detail view coming soon...</p>
      </div>
    </div>
  );
}
