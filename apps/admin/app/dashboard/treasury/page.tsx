import { Metadata } from 'next';
import { DollarSign, TrendingUp, Users, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Treasury | CastQuest',
  description: 'Treasury and financial overview',
};

export default function TreasuryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Treasury</h1>
        <p className="mt-2 text-neutral-400">
          Financial overview and treasury management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="text-primary" size={24} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            $0.00
          </div>
          <div className="text-sm text-neutral-400">Total Balance</div>
        </div>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <p className="text-neutral-400">Treasury dashboard coming soon...</p>
      </div>
    </div>
  );
}
