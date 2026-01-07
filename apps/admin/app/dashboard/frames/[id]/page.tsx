import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Eye,
  MousePointer,
  Share2,
  TrendingUp,
  Copy,
} from 'lucide-react';
import { formatDate, formatNumber, getStatusColor } from '../../../../lib/utils';

export const metadata: Metadata = {
  title: 'Frame Details | CastQuest',
  description: 'View detailed information about a frame',
};

export default function FrameDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Placeholder data
  const frame = {
    id: params.id,
    name: 'Welcome Frame',
    template: 'Interactive Poll',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    views: 12543,
    clicks: 3421,
    shares: 876,
    imageUrl: '/placeholder-frame.png',
  };

  const buttons = [
    { id: '1', label: 'Option A', clicks: 1234, percentage: 36 },
    { id: '2', label: 'Option B', clicks: 987, percentage: 29 },
    { id: '3', label: 'Option C', clicks: 765, percentage: 22 },
    { id: '4', label: 'Option D', clicks: 435, percentage: 13 },
  ];

  const recentInteractions = [
    {
      id: '1',
      user: '0x1234...5678',
      action: 'Clicked Option A',
      timestamp: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      user: '0x8765...4321',
      action: 'Clicked Option B',
      timestamp: '2024-01-15T09:15:00Z',
    },
    {
      id: '3',
      user: '0x9999...1111',
      action: 'Shared frame',
      timestamp: '2024-01-15T08:45:00Z',
    },
    {
      id: '4',
      user: '0x2222...3333',
      action: 'Clicked Option A',
      timestamp: '2024-01-14T22:10:00Z',
    },
  ];

  const analytics = [
    { label: 'Total Views', value: formatNumber(frame.views), icon: Eye },
    {
      label: 'Total Clicks',
      value: formatNumber(frame.clicks),
      icon: MousePointer,
    },
    { label: 'Shares', value: formatNumber(frame.shares), icon: Share2 },
    {
      label: 'Click Rate',
      value: `${Math.round((frame.clicks / frame.views) * 100)}%`,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/frames"
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Frames
      </Link>

      {/* Header */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{frame.name}</h1>
              <span
                className={`inline-flex px-3 py-1 text-xs font-medium rounded border ${getStatusColor(
                  frame.status
                )}`}
              >
                {frame.status}
              </span>
            </div>
            <p className="text-neutral-400 mb-4">
              Template: {frame.template}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
              <span>Created: {formatDate(frame.createdAt)}</span>
              <span>•</span>
              <span>Last Updated: {formatDate(frame.updatedAt)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium">
              Edit Frame
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-lg hover:border-neutral-700 transition-colors">
              <Copy size={16} />
              Duplicate
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analytics.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-neutral-950 border border-neutral-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="text-primary" size={20} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-neutral-400">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Frame Preview */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Frame Preview</h2>
          <div className="aspect-video bg-neutral-900 rounded-lg flex items-center justify-center border border-neutral-800">
            <div className="text-center text-neutral-500">
              <Eye size={48} className="mx-auto mb-2 opacity-50" />
              <p>Frame preview would render here</p>
            </div>
          </div>
        </div>

        {/* Button Analytics */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Button Performance
          </h2>
          <div className="space-y-4">
            {buttons.map((button) => (
              <div key={button.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{button.label}</span>
                  <span className="text-sm text-neutral-400">
                    {button.clicks} clicks ({button.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${button.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Interactions */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Recent Interactions
        </h2>
        <div className="space-y-3">
          {recentInteractions.map((interaction) => (
            <div
              key={interaction.id}
              className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg"
            >
              <div>
                <div className="text-white font-medium">{interaction.user}</div>
                <div className="text-sm text-neutral-400 mt-1">
                  {interaction.action}
                </div>
              </div>
              <div className="text-xs text-neutral-500">
                {formatDate(interaction.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Chart Placeholder */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Engagement Over Time</h2>
          <TrendingUp className="text-success" size={20} />
        </div>
        <div className="h-64 flex items-center justify-center text-neutral-500">
          <div className="text-center">
            <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
            <p>Engagement chart would go here</p>
          </div>
        </div>
'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Frame, ArrowLeft, Eye, Edit } from 'lucide-react';
import Link from 'next/link';

