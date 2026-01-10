import { Metadata } from 'next';
import Link from 'next/link';
import {
  Activity,
  Users,
  Zap,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard Overview | CastQuest',
  description: 'Overview of your CastQuest dashboard with key metrics and activity',
};

export default function DashboardOverview() {
  // Placeholder data
  const metrics = [
    {
      label: 'Active Quests',
      value: '24',
      change: '+12%',
      trend: 'up' as const,
      icon: Zap,
      color: 'text-primary',
    },
    {
      label: 'Total Frames',
      value: '156',
      change: '+8%',
      trend: 'up' as const,
      icon: Activity,
      color: 'text-success',
    },
    {
      label: 'Participants',
      value: '1,247',
      change: '+23%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-secondary',
    },
    {
      label: 'Treasury Balance',
      value: '$45.2K',
      change: '-2%',
      trend: 'down' as const,
      icon: DollarSign,
      color: 'text-warning',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      user: '0x1234...5678',
      action: 'Completed Quest: Welcome to CastQuest',
      timestamp: '2 minutes ago',
    },
    {
      id: '2',
      user: '0x8765...4321',
      action: 'Minted Frame NFT #156',
      timestamp: '15 minutes ago',
    },
    {
      id: '3',
      user: '0x9999...1111',
      action: 'Created new Quest: Share Your Story',
      timestamp: '1 hour ago',
    },
    {
      id: '4',
      user: '0x2222...3333',
      action: 'Completed Quest: First Frame',
      timestamp: '2 hours ago',
    },
    {
      id: '5',
      user: '0x4444...5555',
      action: 'Joined Treasury Pool',
      timestamp: '3 hours ago',
    },
  ];

  const topQuests = [
    {
      id: '1',
      name: 'Welcome to CastQuest',
      participants: 456,
      status: 'active',
      reward: '100 CAST',
    },
    {
      id: '2',
      name: 'First Frame Challenge',
      participants: 324,
      status: 'active',
      reward: '250 CAST',
    },
    {
      id: '3',
      name: 'Share Your Story',
      participants: 189,
      status: 'active',
      reward: '500 CAST',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="mt-2 text-neutral-400">
          Welcome back! Here's what's happening with your quests and frames.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <div
              key={metric.label}
              className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`${metric.color}`} size={24} />
                <span
                  className={`flex items-center gap-1 text-sm ${
                    metric.trend === 'up' ? 'text-success' : 'text-error'
                  }`}
                >
                  <TrendIcon size={16} />
                  {metric.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-neutral-400">{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/quests/create"
            className="flex items-center justify-between p-4 bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors group"
          >
            <span className="text-white font-medium">Create New Quest</span>
            <ArrowRight
              size={20}
              className="text-neutral-400 group-hover:text-primary transition-colors"
            />
          </Link>
          <Link
            href="/dashboard/builder"
            className="flex items-center justify-between p-4 bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors group"
          >
            <span className="text-white font-medium">Build a Frame</span>
            <ArrowRight
              size={20}
              className="text-neutral-400 group-hover:text-primary transition-colors"
            />
          </Link>
          <Link
            href="/dashboard/treasury"
            className="flex items-center justify-between p-4 bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors group"
          >
            <span className="text-white font-medium">View Treasury</span>
            <ArrowRight
              size={20}
              className="text-neutral-400 group-hover:text-primary transition-colors"
            />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <Link
              href="/dashboard/activity"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b border-neutral-800 last:border-0 last:pb-0"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{activity.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-neutral-400">
                      {activity.user}
                    </span>
                    <span className="text-xs text-neutral-600">•</span>
                    <span className="text-xs text-neutral-400">
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Quests */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              Top Performing Quests
            </h2>
            <Link
              href="/dashboard/quests"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {topQuests.map((quest) => (
              <Link
                key={quest.id}
                href={`/dashboard/quests/${quest.id}`}
                className="block p-4 bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-white">{quest.name}</h3>
                  <span className="px-2 py-1 text-xs rounded bg-success/10 text-success border border-success/30">
                    {quest.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">
                    {quest.participants} participants
                  </span>
                  <span className="text-primary font-medium">
                    {quest.reward}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
