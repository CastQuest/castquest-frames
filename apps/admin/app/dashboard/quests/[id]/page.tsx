'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Trophy, Calendar, Target } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description?: string;
  difficulty: string;
  category: string;
  status: string;
  participantCount: number;
  completionCount: number;
  rewardType: string;
  rewardAmount?: string;
  rewardData?: string;
  requirementType: string;
  requirementData: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function QuestDetailPage({ params }: { params: { id: string } }) {
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuest();
  }, [params.id]);

  async function fetchQuest() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/quests/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setQuest(data.data);
      } else {
        setError(data.error || 'Failed to load quest');
      }
    } catch (err) {
      console.error('Failed to fetch quest:', err);
      setError('Failed to load quest');
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'text-green-400 bg-green-900/20 border-green-400/20',
      draft: 'text-yellow-400 bg-yellow-900/20 border-yellow-400/20',
      paused: 'text-gray-400 bg-gray-900/20 border-gray-400/20',
      completed: 'text-blue-400 bg-blue-900/20 border-blue-400/20',
      archived: 'text-red-400 bg-red-900/20 border-red-400/20',
    };
    return colors[status] || 'text-gray-400 bg-gray-900/20 border-gray-400/20';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'text-green-400',
      medium: 'text-yellow-400',
      hard: 'text-orange-400',
      expert: 'text-red-400',
    };
    return colors[difficulty] || 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/quests"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Quests
        </Link>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-400">Loading quest...</p>
        </div>
      </div>
    );
  }

  if (error || !quest) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/quests"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Quests
        </Link>
        <div className="bg-red-950 border border-red-800 rounded-lg p-6">
          <p className="text-red-400">{error || 'Quest not found'}</p>
        </div>
      </div>
    );
  }

  const completionRate = quest.participantCount > 0
    ? ((quest.completionCount / quest.participantCount) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/quests"
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Quests
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{quest.title}</h1>
          {quest.description && (
            <p className="mt-2 text-neutral-400">{quest.description}</p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-lg text-sm border capitalize ${getStatusColor(quest.status)}`}>
          {quest.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-primary" />
            <span className="text-sm text-neutral-400">Participants</span>
          </div>
          <div className="text-2xl font-bold text-white">{quest.participantCount}</div>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={18} className="text-primary" />
            <span className="text-sm text-neutral-400">Completed</span>
          </div>
          <div className="text-2xl font-bold text-white">{quest.completionCount}</div>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target size={18} className="text-primary" />
            <span className="text-sm text-neutral-400">Completion Rate</span>
          </div>
          <div className="text-2xl font-bold text-white">{completionRate}%</div>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={18} className="text-primary" />
            <span className="text-sm text-neutral-400">Difficulty</span>
          </div>
          <div className={`text-2xl font-bold capitalize ${getDifficultyColor(quest.difficulty)}`}>
            {quest.difficulty}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quest Details</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-neutral-400">Category</span>
              <div className="text-white capitalize">{quest.category}</div>
            </div>
            <div>
              <span className="text-sm text-neutral-400">Requirement Type</span>
              <div className="text-white capitalize">{quest.requirementType}</div>
            </div>
            {quest.startDate && (
              <div>
                <span className="text-sm text-neutral-400">Start Date</span>
                <div className="text-white">{new Date(quest.startDate).toLocaleDateString()}</div>
              </div>
            )}
            {quest.endDate && (
              <div>
                <span className="text-sm text-neutral-400">End Date</span>
                <div className="text-white">{new Date(quest.endDate).toLocaleDateString()}</div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Reward</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-neutral-400">Reward Type</span>
              <div className="text-white capitalize">{quest.rewardType}</div>
            </div>
            {quest.rewardAmount && (
              <div>
                <span className="text-sm text-neutral-400">Amount</span>
                <div className="text-white">{quest.rewardAmount}</div>
              </div>
            )}
            {quest.rewardData && (
              <div>
                <span className="text-sm text-neutral-400">Additional Data</span>
                <div className="text-white text-sm font-mono bg-neutral-900 p-2 rounded overflow-auto max-h-32">
                  {quest.rewardData}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Requirements</h2>
        <div className="bg-neutral-900 p-4 rounded overflow-auto max-h-64">
          <pre className="text-sm text-neutral-300 whitespace-pre-wrap font-mono">
            {(() => {
              try {
                return JSON.stringify(JSON.parse(quest.requirementData), null, 2);
              } catch (error) {
                return quest.requirementData;
              }
            })()}
          </pre>
        </div>
      </div>
    </div>
  );
}
