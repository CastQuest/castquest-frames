'use client';

import { useState } from 'react';
import { Plus, Eye, EyeOff, Copy, Trash2, CheckCircle } from 'lucide-react';

export default function ApiKeysPage() {
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const apiKeys = [
    {
      id: '1',
      name: 'Production API Key',
      key: 'cq_live_1234567890abcdefghijklmnopqrstuvwxyz',
      created: '2024-01-01',
      lastUsed: '2024-01-15 10:30:00',
      requests: 12543,
      status: 'active',
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'cq_test_abcdefghijklmnopqrstuvwxyz1234567890',
      created: '2024-01-01',
      lastUsed: '2024-01-15 09:15:00',
      requests: 8932,
      status: 'active',
    },
    {
      id: '3',
      name: 'Staging API Key',
      key: 'cq_test_zyxwvutsrqponmlkjihgfedcba0987654321',
      created: '2024-01-10',
      lastUsed: '2024-01-14 18:45:00',
      requests: 2341,
      status: 'active',
    },
  ];

  const toggleKeyVisibility = (id: string) => {
    setShowKey((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '•'.repeat(20) + key.substring(key.length - 4);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">API Keys</h1>
          <p className="mt-2 text-neutral-400">
            Manage your API keys and access tokens
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium">
          <Plus size={18} />
          Create New Key
        </button>
      </div>

      {/* Security Notice */}
      <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-warning text-2xl">⚠️</div>
          <div>
            <h3 className="font-medium text-warning mb-1">
              Keep your API keys secure
            </h3>
            <p className="text-sm text-neutral-300">
              Never share your API keys publicly or commit them to version
              control. Store them securely and rotate them regularly.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">3</div>
          <div className="text-sm text-neutral-400">Active API Keys</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-primary">23,816</div>
          <div className="text-sm text-neutral-400">Total Requests (24h)</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-success">99.8%</div>
          <div className="text-sm text-neutral-400">Success Rate</div>
        </div>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <div
            key={apiKey.id}
            className="bg-neutral-950 border border-neutral-800 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {apiKey.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-neutral-400">
                  <span>Created: {apiKey.created}</span>
                  <span>•</span>
                  <span>Last used: {apiKey.lastUsed}</span>
                  <span>•</span>
                  <span>{apiKey.requests.toLocaleString()} requests</span>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-medium rounded border text-success bg-success/10 border-success/30">
                {apiKey.status}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={
                    showKey[apiKey.id] ? apiKey.key : maskKey(apiKey.key)
                  }
                  readOnly
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono text-sm focus:outline-none"
                />
              </div>
              <button
                onClick={() => toggleKeyVisibility(apiKey.id)}
                className="p-3 bg-neutral-900 border border-neutral-800 text-white rounded-lg hover:border-neutral-700 transition-colors"
                title={showKey[apiKey.id] ? 'Hide key' : 'Show key'}
              >
                {showKey[apiKey.id] ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
              <button
                onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                className="p-3 bg-neutral-900 border border-neutral-800 text-white rounded-lg hover:border-neutral-700 transition-colors relative"
                title="Copy to clipboard"
              >
                {copied === apiKey.id ? (
                  <CheckCircle size={18} className="text-success" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
              <button
                className="p-3 bg-error/10 border border-error/30 text-error rounded-lg hover:bg-error/20 transition-colors"
                title="Delete key"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Key Permissions */}
            <div className="mt-4 pt-4 border-t border-neutral-800">
              <div className="text-sm text-neutral-400 mb-2">Permissions:</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary border border-primary/30">
                  quests:read
                </span>
                <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary border border-primary/30">
                  quests:write
                </span>
                <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary border border-primary/30">
                  frames:read
                </span>
                <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary border border-primary/30">
                  frames:write
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Guidelines */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          API Key Best Practices
        </h2>
        <ul className="space-y-2 text-neutral-400">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>
              Use different API keys for different environments (development,
              staging, production)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Rotate your API keys regularly to maintain security</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Never expose API keys in client-side code or public repositories</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>
              Use environment variables to store API keys in your applications
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>
              Monitor API key usage and revoke keys that show suspicious
              activity
            </span>
          </li>
        </ul>
      </div>
import { motion } from 'framer-motion';
import { Key } from 'lucide-react';

export default function API_KeysPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <Key className="w-10 h-10 text-purple-400" />
            API Keys
          </h1>
          <p className="text-slate-400">Manage your API keys</p>
        </motion.div>
        <div className="mt-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
          <p className="text-slate-300">Page content coming soon...</p>
        </div>
      </div>
    </div>
  );
}
