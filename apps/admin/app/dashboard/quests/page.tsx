import { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Search, Filter } from 'lucide-react';
import { getStatusColor } from '../../../lib/utils';

export const metadata: Metadata = {
  title: 'Quests | CastQuest',
  description: 'Manage and view all quests',
};

export default function QuestsPage() {
  // Placeholder data
  const quests = [
    {
      id: '1',
      name: 'Welcome to CastQuest',
      description: 'Complete your first quest and earn rewards',
      status: 'active',
      participants: 456,
      reward: '100 CAST',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      category: 'Onboarding',
    },
    {
      id: '2',
      name: 'First Frame Challenge',
      description: 'Create and mint your first frame',
      status: 'active',
      participants: 324,
      reward: '250 CAST',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      category: 'Creation',
    },
    {
      id: '3',
      name: 'Share Your Story',
      description: 'Share a frame that tells your story',
      status: 'active',
      participants: 189,
      reward: '500 CAST',
      startDate: '2024-02-01',
      endDate: '2024-08-31',
      category: 'Engagement',
    },
    {
      id: '4',
      name: 'Community Builder',
      description: 'Invite 10 friends to join CastQuest',
      status: 'paused',
      participants: 67,
      reward: '1000 CAST',
      startDate: '2024-01-20',
      endDate: '2024-12-31',
      category: 'Growth',
    },
    {
      id: '5',
      name: 'Beta Tester',
      description: 'Test new features and provide feedback',
      status: 'draft',
      participants: 0,
      reward: '750 CAST',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      category: 'Testing',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Quests</h1>
          <p className="mt-2 text-neutral-400">
            Manage and monitor all quests and challenges
          </p>
        </div>
        <Link
          href="/dashboard/quests/create"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus size={18} />
          Create Quest
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
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
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white hover:border-neutral-700 transition-colors">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">5</div>
          <div className="text-sm text-neutral-400">Total Quests</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-success">3</div>
          <div className="text-sm text-neutral-400">Active</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-warning">1</div>
          <div className="text-sm text-neutral-400">Paused</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-neutral-400">1</div>
          <div className="text-sm text-neutral-400">Draft</div>
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
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Reward
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
                    <div>
                      <div className="font-medium text-white">{quest.name}</div>
                      <div className="text-sm text-neutral-400 mt-1">
                        {quest.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-300">
                      {quest.category}
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
                    <span className="text-sm text-white">
                      {quest.participants}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-primary font-medium">
                      {quest.reward}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/quests/${quest.id}`}
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Users,
  Trophy,
  Clock,
  CheckCircle,
  Play,
} from 'lucide-react';
import Link from 'next/link';

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  participants: number;
  completions: number;
  status: 'active' | 'paused' | 'completed' | 'draft';
  difficulty: 'easy' | 'medium' | 'hard';
  deadline: string;
  createdAt: string;
}

