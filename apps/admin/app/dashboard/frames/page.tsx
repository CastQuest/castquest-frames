"use client";

import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { formatDate } from '../../../lib/utils';
import Link from 'next/link';

interface Frame {
  id: string;
  name: string;
  template: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function FramesPage() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFrames();
  }, []);

  async function fetchFrames() {
    try {
      setLoading(true);
      const response = await fetch('/api/frame-templates');
      const data = await response.json();
      if (data.success) {
        setFrames(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch frames:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'text-green-400 bg-green-900/20',
      draft: 'text-yellow-400 bg-yellow-900/20',
      paused: 'text-gray-400 bg-gray-900/20',
      archived: 'text-red-400 bg-red-900/20',
    };
    return colors[status] || 'text-gray-400 bg-gray-900/20';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Frames</h1>
          <p className="text-neutral-400">Manage your frames and configurations</p>
        </div>
        <Link
          href="/frame-templates/create"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 transition-all font-medium"
        >
          <Plus size={18} />
          Create Frame
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
          <input
            type="text"
            placeholder="Search frames..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-white"
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
                <th className="px-4 py-3 text-left font-semibold text-neutral-300">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-300">Template</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-300">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-300">Created</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {frames.filter(f => 
                f.name.toLowerCase().includes(search.toLowerCase())
              ).map((frame) => (
                <tr key={frame.id} className="bg-neutral-950 hover:bg-neutral-900">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{frame.name}</div>
                    <div className="text-xs text-neutral-500">{frame.id}</div>
                  </td>
                  <td className="px-4 py-3 text-primary">{frame.template}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(frame.status)}`}>
                      {frame.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-400 text-xs">{formatDate(frame.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/frame-templates/${frame.id}`} className="text-primary hover:text-primary/80">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
