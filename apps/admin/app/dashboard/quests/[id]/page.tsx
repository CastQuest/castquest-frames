import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  Trophy,
  Calendar,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { formatDate, getStatusColor } from '../../../../lib/utils';

export const metadata: Metadata = {
  title: 'Quest Details | CastQuest',
  description: 'View detailed information about a quest',
};

export default function QuestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Placeholder data based on quest ID
  const quest = {
    id: params.id,
    name: 'Welcome to CastQuest',
    description:
      'Complete your first quest and earn rewards. This is a great way to get started with CastQuest and learn about the platform.',
    status: 'active',
    participants: 456,
    completions: 342,
    reward: '100 CAST',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    category: 'Onboarding',
    difficulty: 'Easy',
    estimatedTime: '5 minutes',
  };

  const requirements = [
    { id: '1', task: 'Create a CastQuest account', completed: 456 },
    { id: '2', task: 'Connect your wallet', completed: 398 },
    { id: '3', task: 'Complete profile setup', completed: 342 },
  ];

  const recentCompletions = [
    {
      id: '1',
      user: '0x1234...5678',
      completedAt: '2024-01-15T10:30:00Z',
      reward: '100 CAST',
    },
    {
      id: '2',
      user: '0x8765...4321',
      completedAt: '2024-01-15T09:15:00Z',
      reward: '100 CAST',
    },
    {
      id: '3',
      user: '0x9999...1111',
      completedAt: '2024-01-15T08:45:00Z',
      reward: '100 CAST',
    },
    {
      id: '4',
      user: '0x2222...3333',
      completedAt: '2024-01-14T22:10:00Z',
      reward: '100 CAST',
    },
  ];

  const analytics = [
    { label: 'Total Participants', value: quest.participants.toString() },
    { label: 'Completed', value: quest.completions.toString() },
    {
      label: 'Completion Rate',
      value: `${Math.round((quest.completions / quest.participants) * 100)}%`,
    },
    {
      label: 'Total Rewards Paid',
      value: `${quest.completions * 100} CAST`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/quests"
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Quests
      </Link>

      {/* Header */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{quest.name}</h1>
              <span
                className={`inline-flex px-3 py-1 text-xs font-medium rounded border ${getStatusColor(
                  quest.status
                )}`}
              >
                {quest.status}
              </span>
            </div>
            <p className="text-neutral-400 mb-4">{quest.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Trophy className="text-primary" size={16} />
                <span className="text-neutral-300">
                  Reward: <span className="text-primary">{quest.reward}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-primary" size={16} />
                <span className="text-neutral-300">
                  {quest.participants} participants
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-primary" size={16} />
                <span className="text-neutral-300">
                  {formatDate(quest.startDate)} - {formatDate(quest.endDate)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium">
              Edit Quest
            </button>
            <button className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-lg hover:border-neutral-700 transition-colors">
              Pause Quest
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analytics.map((stat) => (
          <div
            key={stat.label}
            className="bg-neutral-950 border border-neutral-800 rounded-lg p-4"
          >
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-neutral-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requirements */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Requirements</h2>
          <div className="space-y-3">
            {requirements.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-success" size={20} />
                  <span className="text-white">{req.task}</span>
                </div>
                <span className="text-sm text-neutral-400">
                  {req.completed} completed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Completions */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Recent Completions
          </h2>
          <div className="space-y-3">
            {recentCompletions.map((completion) => (
              <div
                key={completion.id}
                className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg"
              >
                <div>
                  <div className="text-white font-medium">
                    {completion.user}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    {formatDate(completion.completedAt)}
                  </div>
                </div>
                <span className="text-sm text-primary font-medium">
                  {completion.reward}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            Participation Over Time
          </h2>
          <TrendingUp className="text-success" size={20} />
        </div>
        <div className="h-64 flex items-center justify-center text-neutral-500">
          {/* Placeholder for chart */}
          <div className="text-center">
            <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
            <p>Chart visualization would go here</p>
          </div>
        </div>
'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Target, ArrowLeft, Trophy, Users, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

