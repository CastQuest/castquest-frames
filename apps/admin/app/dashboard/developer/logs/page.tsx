import { Metadata } from 'next';
import { Search, Filter, Download } from 'lucide-react';
import { formatDate } from '../../../../lib/utils';

export const metadata: Metadata = {
  title: 'API Logs | CastQuest Developer',
  description: 'View API request logs and debugging information',
};

export default function DeveloperLogsPage() {
  // Placeholder data
  const logs = [
    {
      id: '1',
      method: 'POST',
      endpoint: '/api/quests',
      status: 200,
      duration: 145,
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      timestamp: '2024-01-15T10:30:00Z',
      apiKey: 'sk_test_***abc',
    },
    {
      id: '2',
      method: 'GET',
      endpoint: '/api/frames/123',
      status: 200,
      duration: 89,
      ip: '192.168.1.2',
      userAgent: 'Mozilla/5.0...',
      timestamp: '2024-01-15T10:25:00Z',
      apiKey: 'sk_test_***abc',
    },
    {
      id: '3',
      method: 'PUT',
      endpoint: '/api/quests/456',
      status: 404,
      duration: 234,
      ip: '192.168.1.3',
      userAgent: 'curl/7.68.0',
      timestamp: '2024-01-15T10:18:00Z',
      apiKey: 'sk_test_***xyz',
    },
    {
      id: '4',
      method: 'GET',
      endpoint: '/api/users/profile',
      status: 200,
      duration: 112,
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      timestamp: '2024-01-15T10:05:00Z',
      apiKey: 'sk_test_***abc',
    },
    {
      id: '5',
      method: 'DELETE',
      endpoint: '/api/frames/789',
      status: 500,
      duration: 567,
      ip: '192.168.1.4',
      userAgent: 'PostmanRuntime/7.29.0',
      timestamp: '2024-01-15T09:45:00Z',
      apiKey: 'sk_test_***def',
    },
  ];

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-success bg-success/10 border-success/30';
    if (status >= 400 && status < 500) return 'text-warning bg-warning/10 border-warning/30';
    if (status >= 500) return 'text-error bg-error/10 border-error/30';
    return 'text-neutral-400 bg-neutral-800 border-neutral-700';
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'text-primary bg-primary/10 border-primary/30',
      POST: 'text-success bg-success/10 border-success/30',
      PUT: 'text-warning bg-warning/10 border-warning/30',
      DELETE: 'text-error bg-error/10 border-error/30',
      PATCH: 'text-secondary bg-secondary/10 border-secondary/30',
    };
    return colors[method] || 'text-neutral-400 bg-neutral-800 border-neutral-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">API Request Logs</h1>
          <p className="mt-2 text-neutral-400">
            View and filter API request logs for debugging
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium">
          <Download size={18} />
          Export Logs
        </button>
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
            placeholder="Search by endpoint, IP, or API key..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white hover:border-neutral-700 transition-colors">
          <Filter size={18} />
          Filter by Status
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">12,543</div>
          <div className="text-sm text-neutral-400">Total Requests (24h)</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-success">12,518</div>
          <div className="text-sm text-neutral-400">Successful (2xx)</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-warning">23</div>
          <div className="text-sm text-neutral-400">Client Errors (4xx)</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-error">2</div>
          <div className="text-sm text-neutral-400">Server Errors (5xx)</div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-900 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Endpoint
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  API Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-neutral-900 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-bold rounded border ${getMethodColor(
                        log.method
                      )}`}
                    >
                      {log.method}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-white font-mono">
                      {log.endpoint}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getStatusColor(
                        log.status
                      )}`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-300">
                      {log.duration}ms
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-400 font-mono">
                      {log.ip}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-400 font-mono">
                      {log.apiKey}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-400">
                      {formatDate(log.timestamp)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-400">
          Showing 1-5 of 12,543 requests
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-lg hover:border-neutral-700 transition-colors disabled:opacity-50">
            Previous
          </button>
          <button className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-lg hover:border-neutral-700 transition-colors">
            Next
          </button>
'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function System_LogsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <FileText className="w-10 h-10 text-purple-400" />
            System Logs
          </h1>
          <p className="text-slate-400">View system logs and events</p>
        </motion.div>
        <div className="mt-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
          <p className="text-slate-300">Page content coming soon...</p>
        </div>
      </div>
    </div>
  );
}
