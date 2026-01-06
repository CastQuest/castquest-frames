import { Metadata } from 'next';
import { Filter, Search } from 'lucide-react';
import { formatRelativeTime } from '../../../lib/utils';

export const metadata: Metadata = {
  title: 'Activity Feed | CastQuest',
  description: 'View all activity and interactions on the platform',
};

export default function ActivityPage() {
  // Placeholder data
  const activities = [
    {
      id: '1',
      type: 'quest_completed',
      user: '0x1234...5678',
      description: 'Completed quest: Welcome to CastQuest',
      timestamp: '2024-01-15T10:30:00Z',
      metadata: { reward: '100 CAST' },
    },
    {
      id: '2',
      type: 'frame_minted',
      user: '0x8765...4321',
      description: 'Minted Frame NFT #156',
      timestamp: '2024-01-15T10:15:00Z',
      metadata: { frameId: '156' },
    },
    {
      id: '3',
      type: 'quest_created',
      user: '0x9999...1111',
      description: 'Created new quest: Share Your Story',
      timestamp: '2024-01-15T09:45:00Z',
      metadata: { questId: '3' },
    },
    {
      id: '4',
      type: 'treasury_deposit',
      user: '0x2222...3333',
      description: 'Deposited 1000 USDC to treasury',
      timestamp: '2024-01-15T09:10:00Z',
      metadata: { amount: '1000 USDC' },
    },
    {
      id: '5',
      type: 'frame_interacted',
      user: '0x4444...5555',
      description: 'Clicked button on frame #145',
      timestamp: '2024-01-15T08:45:00Z',
      metadata: { frameId: '145', button: 'Option A' },
    },
    {
      id: '6',
      type: 'quest_started',
      user: '0x6666...7777',
      description: 'Started quest: First Frame Challenge',
      timestamp: '2024-01-15T08:20:00Z',
      metadata: { questId: '2' },
    },
    {
      id: '7',
      type: 'profile_updated',
      user: '0x8888...9999',
      description: 'Updated profile information',
      timestamp: '2024-01-15T08:00:00Z',
      metadata: {},
    },
    {
      id: '8',
      type: 'reward_claimed',
      user: '0xaaaa...bbbb',
      description: 'Claimed 250 CAST reward',
      timestamp: '2024-01-15T07:30:00Z',
      metadata: { amount: '250 CAST' },
    },
  ];

  const getActivityIcon = (type: string) => {
    const colors: Record<string, string> = {
      quest_completed: 'bg-success/10 text-success border-success/30',
      quest_created: 'bg-primary/10 text-primary border-primary/30',
      quest_started: 'bg-warning/10 text-warning border-warning/30',
      frame_minted: 'bg-secondary/10 text-secondary border-secondary/30',
      frame_interacted: 'bg-primary/10 text-primary border-primary/30',
      treasury_deposit: 'bg-success/10 text-success border-success/30',
      profile_updated: 'bg-neutral-800 text-neutral-400 border-neutral-700',
      reward_claimed: 'bg-success/10 text-success border-success/30',
    };
    return colors[type] || 'bg-neutral-800 text-neutral-400 border-neutral-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Activity Feed</h1>
        <p className="mt-2 text-neutral-400">
          Track all activities and interactions across the platform
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search activity..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white hover:border-neutral-700 transition-colors">
          <Filter size={18} />
          Filter by Type
        </button>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">2,847</div>
          <div className="text-sm text-neutral-400">Total Activities</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-success">1,234</div>
          <div className="text-sm text-neutral-400">Quest Completions</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-primary">567</div>
          <div className="text-sm text-neutral-400">Frame Interactions</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-warning">189</div>
          <div className="text-sm text-neutral-400">Treasury Actions</div>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${getActivityIcon(
                  activity.type
                )}`}
              >
                <div className="w-2 h-2 rounded-full bg-current" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-medium">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-neutral-400">
                      <span>{activity.user}</span>
                      {Object.keys(activity.metadata).length > 0 && (
                        <>
                          <span>•</span>
                          <span>
                            {Object.values(activity.metadata).join(', ')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-neutral-500 whitespace-nowrap">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-6 text-center">
          <button className="px-6 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-lg hover:border-neutral-700 transition-colors">
            Load More Activity
          </button>
'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function Activity_FeedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <Activity className="w-10 h-10 text-purple-400" />
            Activity Feed
          </h1>
          <p className="text-slate-400">View all platform activity</p>
        </motion.div>
        <div className="mt-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
          <p className="text-slate-300">Page content coming soon...</p>
        </div>
      </div>
    </div>
  );
}
