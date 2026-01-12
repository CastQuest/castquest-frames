'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';

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
  createdAt: string;
  updatedAt: string;
}

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchQuests();
  }, []);

  async function fetchQuests() {
    try {
      setLoading(true);
      const response = await fetch('/api/quests');
      const data = await response.json();
      if (data.success) {
        setQuests(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch quests:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'text-green-400 bg-green-900/20',
      draft: 'text-yellow-400 bg-yellow-900/20',
      paused: 'text-gray-400 bg-gray-900/20',
      completed: 'text-blue-400 bg-blue-900/20',
      archived: 'text-red-400 bg-red-900/20',
    };
    return colors[status] || 'text-gray-400 bg-gray-900/20';
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

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Quests</h1>
          <p className="mt-2 text-neutral-400">
            Manage and view all quests
          </p>
        </div>
        <Link href="/dashboard/quests/create" className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium">
          <Plus size={18} />
          Create Quest
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search quests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-800">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900 border-b border-neutral-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-neutral-300">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-300">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-300">Difficulty</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-300">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-300">Participants</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {quests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                    No quests found. Create your first quest to get started.
                  </td>
                </tr>
              ) : (
                quests
                  .filter(q => 
                    q.title.toLowerCase().includes(search.toLowerCase()) ||
                    q.category.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((quest) => (
                    <tr key={quest.id} className="bg-neutral-950 hover:bg-neutral-900">
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{quest.title}</div>
                        {quest.description && (
                          <div className="text-xs text-neutral-500 line-clamp-1">{quest.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-neutral-400 capitalize">{quest.category}</td>
                      <td className="px-4 py-3">
                        <span className={`capitalize ${getDifficultyColor(quest.difficulty)}`}>
                          {quest.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs capitalize ${getStatusColor(quest.status)}`}>
                          {quest.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-400">
                        {quest.participantCount} / {quest.completionCount} completed
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/quests/${quest.id}`} className="text-primary hover:text-primary/80">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
