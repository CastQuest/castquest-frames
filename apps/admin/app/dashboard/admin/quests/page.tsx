import { Metadata } from 'next';
import { Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { formatDate, getStatusColor } from '../../../../lib/utils';

export const metadata: Metadata = {
  title: 'Quest Moderation | CastQuest Admin',
  description: 'Review and moderate quests',
};

export default function AdminQuestsPage() {
  // Placeholder data
  const quests = [
    {
      id: '1',
      name: 'Welcome to CastQuest',
      creator: '0x1234...5678',
      status: 'active',
      moderationStatus: 'approved',
      reports: 0,
      participants: 456,
      submittedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Spam Quest Example',
      creator: '0x9999...1111',
      status: 'paused',
      moderationStatus: 'flagged',
      reports: 12,
      participants: 3,
      submittedAt: '2024-01-14T00:00:00Z',
    },
    {
      id: '3',
      name: 'First Frame Challenge',
      creator: '0x8765...4321',
      status: 'active',
      moderationStatus: 'approved',
      reports: 0,
      participants: 324,
      submittedAt: '2024-01-05T00:00:00Z',
    },
    {
      id: '4',
      name: 'New Quest Pending Review',
      creator: '0x2222...3333',
      status: 'draft',
      moderationStatus: 'pending',
      reports: 0,
      participants: 0,
      submittedAt: '2024-01-15T08:00:00Z',
    },
  ];

  const getModerationColor = (status: string) => {
    const colors: Record<string, string> = {
      approved: 'text-success bg-success/10 border-success/30',
      pending: 'text-warning bg-warning/10 border-warning/30',
      flagged: 'text-error bg-error/10 border-error/30',
      rejected: 'text-neutral-400 bg-neutral-800 border-neutral-700',
    };
    return colors[status] || 'text-neutral-400 bg-neutral-800 border-neutral-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Quest Moderation</h1>
        <p className="mt-2 text-neutral-400">
          Review and moderate quest submissions
        </p>
      </div>

      {/* Search */}
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">24</div>
          <div className="text-sm text-neutral-400">Total Quests</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-warning">3</div>
          <div className="text-sm text-neutral-400">Pending Review</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-error">2</div>
          <div className="text-sm text-neutral-400">Flagged</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-success">19</div>
          <div className="text-sm text-neutral-400">Approved</div>
        </div>
      </div>

      {/* Quests Table */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-900 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Quest Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Creator
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Moderation
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Reports
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {quests.map((quest) => (
                <tr
                  key={quest.id}
                  className="hover:bg-neutral-900 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{quest.name}</div>
                    <div className="text-sm text-neutral-400">
                      {quest.participants} participants
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-300 font-mono">
                      {quest.creator}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getStatusColor(
                        quest.status
                      )}`}
                    >
                      {quest.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getModerationColor(
                        quest.moderationStatus
                      )}`}
                    >
                      {quest.moderationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-2 ${
                        quest.reports > 0 ? 'text-error' : 'text-neutral-400'
                      }`}
                    >
                      {quest.reports > 0 && (
                        <AlertTriangle size={16} />
                      )}
                      <span className="text-sm">{quest.reports}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-400">
                      {formatDate(quest.submittedAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 text-success hover:bg-success/10 rounded transition-colors"
                        title="Approve"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        className="p-1.5 text-error hover:bg-error/10 rounded transition-colors"
                        title="Reject"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
'use client';

import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

export default function Admin_Quest_ManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <Target className="w-10 h-10 text-purple-400" />
            Admin Quest Management
          </h1>
          <p className="text-slate-400">Manage all quests</p>
        </motion.div>
        <div className="mt-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
          <p className="text-slate-300">Page content coming soon...</p>
        </div>
      </div>
    </div>
  );
}
