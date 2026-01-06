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

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Mock data
    setQuests([
      {
        id: '1',
        title: 'Create Your First Frame',
        description: 'Design and publish your first CastQuest frame',
        reward: 100,
        participants: 245,
        completions: 189,
        status: 'active',
        difficulty: 'easy',
        deadline: '2026-02-01',
        createdAt: '2026-01-01',
      },
      {
        id: '2',
        title: 'Share 10 Frames',
        description: 'Share 10 frames on Farcaster to earn rewards',
        reward: 500,
        participants: 142,
        completions: 78,
        status: 'active',
        difficulty: 'medium',
        deadline: '2026-02-15',
        createdAt: '2026-01-02',
      },
      {
        id: '3',
        title: 'Community Leader',
        description: 'Reach 100 followers and 1000 interactions',
        reward: 2000,
        participants: 67,
        completions: 12,
        status: 'active',
        difficulty: 'hard',
        deadline: '2026-03-01',
        createdAt: '2026-01-03',
      },
      {
        id: '4',
        title: 'Early Adopter',
        description: 'Join CastQuest in the first month',
        reward: 150,
        participants: 523,
        completions: 523,
        status: 'completed',
        difficulty: 'easy',
        deadline: '2026-01-31',
        createdAt: '2025-12-20',
      },
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'draft':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const filteredQuests = quests.filter((quest) => {
    const matchesSearch = quest.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || quest.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <Target className="w-10 h-10 text-purple-400" />
                Quest Management
              </h1>
              <p className="text-slate-400">Create and manage quests for your community</p>
            </div>
            <Link href="/dashboard/quests/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all shadow-lg shadow-purple-500/25 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Quest
              </motion.button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Quests', value: quests.length, icon: Target, colorClasses: { bg: 'from-purple-600/20', text: 'text-purple-400' } },
              { label: 'Active', value: quests.filter((q) => q.status === 'active').length, icon: Play, colorClasses: { bg: 'from-green-600/20', text: 'text-green-400' } },
              { label: 'Total Participants', value: quests.reduce((sum, q) => sum + q.participants, 0), icon: Users, colorClasses: { bg: 'from-cyan-600/20', text: 'text-cyan-400' } },
              { label: 'Completions', value: quests.reduce((sum, q) => sum + q.completions, 0), icon: Trophy, colorClasses: { bg: 'from-yellow-600/20', text: 'text-yellow-400' } },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.colorClasses.bg} to-pink-600/20 rounded-xl blur-xl group-hover:blur-2xl transition-all`} />
                <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-4 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.colorClasses.text}`} />
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                  </div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search quests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </motion.div>

        {/* Quests List */}
        <div className="space-y-4">
          {filteredQuests.map((quest, index) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Trophy className="w-6 h-6 text-purple-400" />
                      <h3 className="text-xl font-bold text-white">{quest.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(quest.status)}`}>
                        {quest.status}
                      </span>
                      <span className={`text-sm font-semibold ${getDifficultyColor(quest.difficulty)}`}>
                        {quest.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-400 mb-4">{quest.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-green-400">
                        <Trophy className="w-4 h-4" />
                        <span>{quest.reward} CAST</span>
                      </div>
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Users className="w-4 h-4" />
                        <span>{quest.participants} participants</span>
                      </div>
                      <div className="flex items-center gap-2 text-purple-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>{quest.completions} completed</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>Ends {quest.deadline}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/quests/${quest.id}`}>
                      <button className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-all">
                        <Eye className="w-5 h-5" />
                      </button>
                    </Link>
                    <button className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-all">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredQuests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No quests found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
