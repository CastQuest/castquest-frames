import { Metadata } from 'next';
import Link from 'next/link';
import { Code, Key, FileText, PlayCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Developer Dashboard | CastQuest',
  description: 'Developer tools and API management',
};

export default function DeveloperPage() {
  const stats = [
    { label: 'API Requests (24h)', value: '12,543' },
    { label: 'Active API Keys', value: '3' },
    { label: 'Error Rate', value: '0.02%' },
    { label: 'Avg Response Time', value: '125ms' },
  ];

  const quickLinks = [
    {
      title: 'Request Logs',
      description: 'View API request logs and debugging information',
      href: '/dashboard/developer/logs',
      icon: FileText,
      color: 'text-primary',
    },
    {
      title: 'API Keys',
      description: 'Manage your API keys and access tokens',
      href: '/dashboard/developer/api-keys',
      icon: Key,
      color: 'text-success',
    },
    {
      title: 'Sandbox',
      description: 'Test API endpoints in a sandbox environment',
      href: '/dashboard/developer/sandbox',
      icon: PlayCircle,
      color: 'text-secondary',
    },
  ];

  const recentRequests = [
    {
      id: '1',
      endpoint: 'POST /api/quests',
      status: 200,
      duration: '145ms',
      timestamp: '2 minutes ago',
    },
    {
      id: '2',
      endpoint: 'GET /api/frames/123',
      status: 200,
      duration: '89ms',
      timestamp: '5 minutes ago',
    },
    {
      id: '3',
      endpoint: 'PUT /api/quests/456',
      status: 404,
      duration: '234ms',
      timestamp: '12 minutes ago',
    },
    {
      id: '4',
      endpoint: 'GET /api/users/profile',
      status: 200,
      duration: '112ms',
      timestamp: '25 minutes ago',
    },
  ];

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-success';
    if (status >= 400 && status < 500) return 'text-warning';
    if (status >= 500) return 'text-error';
    return 'text-neutral-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Developer Dashboard</h1>
        <p className="mt-2 text-neutral-400">
          API tools, documentation, and debugging resources
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-neutral-950 border border-neutral-800 rounded-lg p-6"
          >
            <div className="text-3xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-neutral-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg ${link.color} bg-current/10 flex items-center justify-center`}
                >
                  <Icon className={link.color} size={24} />
                </div>
                <ArrowRight
                  className="text-neutral-600 group-hover:text-primary transition-colors"
                  size={20}
                />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {link.title}
              </h3>
              <p className="text-sm text-neutral-400">{link.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent API Requests */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent API Requests</h2>
          <Link
            href="/dashboard/developer/logs"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View All Logs
          </Link>
        </div>
        <div className="space-y-3">
          {recentRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg"
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`text-sm font-mono font-medium ${getStatusColor(
                    request.status
                  )}`}
                >
                  {request.status}
                </div>
                <div className="flex-1">
                  <div className="text-white font-mono text-sm">
                    {request.endpoint}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    {request.duration} • {request.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Documentation */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Code className="text-primary" size={24} />
          <h2 className="text-xl font-bold text-white">Quick Links</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/docs/api"
            className="p-4 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <div className="text-white font-medium">API Documentation</div>
            <div className="text-sm text-neutral-400 mt-1">
              Full API reference and guides
            </div>
          </a>
          <a
            href="/docs/sdk"
            className="p-4 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <div className="text-white font-medium">SDK Documentation</div>
            <div className="text-sm text-neutral-400 mt-1">
              TypeScript SDK usage examples
            </div>
          </a>
          <a
            href="/docs/frames"
            className="p-4 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <div className="text-white font-medium">Frame Builder Guide</div>
            <div className="text-sm text-neutral-400 mt-1">
              Learn how to build custom frames
            </div>
          </a>
          <a
            href="/docs/webhooks"
            className="p-4 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <div className="text-white font-medium">Webhook Setup</div>
            <div className="text-sm text-neutral-400 mt-1">
              Configure webhooks for events
            </div>
          </a>
'use client';

import { motion } from 'framer-motion';
import { Code } from 'lucide-react';

export default function Developer_HubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <Code className="w-10 h-10 text-purple-400" />
            Developer Hub
          </h1>
          <p className="text-slate-400">Developer tools and resources</p>
        </motion.div>
        <div className="mt-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
          <p className="text-slate-300">Page content coming soon...</p>
        </div>
      </div>
    </div>
  );
}
