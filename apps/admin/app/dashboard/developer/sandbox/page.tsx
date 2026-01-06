'use client';

import { useState } from 'react';
import { Play, Code, Copy, CheckCircle } from 'lucide-react';

export default function SandboxPage() {
  const [endpoint, setEndpoint] = useState('/api/quests');
  const [method, setMethod] = useState('GET');
  const [requestBody, setRequestBody] = useState('{\n  "name": "Test Quest",\n  "description": "A test quest"\n}');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const endpoints = [
    { value: '/api/quests', label: 'GET /api/quests - List all quests' },
    { value: '/api/quests/:id', label: 'GET /api/quests/:id - Get quest details' },
    { value: '/api/frames', label: 'GET /api/frames - List all frames' },
    { value: '/api/frames/:id', label: 'GET /api/frames/:id - Get frame details' },
    { value: '/api/users/profile', label: 'GET /api/users/profile - Get user profile' },
  ];

  const handleExecute = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockResponse = {
        success: true,
        data: {
          id: '1',
          name: 'Test Quest',
          description: 'A test quest',
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      };
      setResponse(JSON.stringify(mockResponse, null, 2));
      setLoading(false);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCurl = () => {
    let curl = `curl -X ${method} https://api.castquest.xyz${endpoint}`;
    curl += ` \\\n  -H "Authorization: Bearer YOUR_API_KEY"`;
    curl += ` \\\n  -H "Content-Type: application/json"`;
    if (method !== 'GET' && requestBody) {
      curl += ` \\\n  -d '${requestBody}'`;
    }
    return curl;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">API Sandbox</h1>
        <p className="mt-2 text-neutral-400">
          Test API endpoints in a safe sandbox environment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Builder */}
        <div className="space-y-6">
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Request Builder
            </h2>

            <div className="space-y-4">
              {/* Method */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  HTTP Method
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>

              {/* Endpoint */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Endpoint
                </label>
                <select
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                >
                  {endpoints.map((ep) => (
                    <option key={ep.value} value={ep.value}>
                      {ep.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Request Body */}
              {method !== 'GET' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Request Body (JSON)
                  </label>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
              )}

              {/* Execute Button */}
              <button
                onClick={handleExecute}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
              >
                <Play size={18} />
                {loading ? 'Executing...' : 'Execute Request'}
              </button>
            </div>
          </div>

          {/* Code Snippet */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Code className="text-primary" size={20} />
                <h2 className="text-xl font-bold text-white">cURL Command</h2>
              </div>
              <button
                onClick={() => copyToClipboard(generateCurl())}
                className="p-2 text-neutral-400 hover:text-primary transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckCircle size={18} className="text-success" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
            <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-neutral-300 font-mono">
                {generateCurl()}
              </code>
            </pre>
          </div>
        </div>

        {/* Response */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Response</h2>
          {response ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-sm text-neutral-400">
                    200 OK • 123ms
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(response)}
                  className="p-2 text-neutral-400 hover:text-primary transition-colors"
                  title="Copy response"
                >
                  <Copy size={16} />
                </button>
              </div>
              <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 overflow-x-auto max-h-[600px]">
                <code className="text-sm text-neutral-300 font-mono">
                  {response}
                </code>
              </pre>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-neutral-500">
              <div className="text-center">
                <Play size={48} className="mx-auto mb-2 opacity-50" />
                <p>Execute a request to see the response</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Tips</h2>
        <ul className="space-y-2 text-neutral-400">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>
              The sandbox uses test data and won't affect your production
              environment
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>
              All requests are authenticated using your test API key
              automatically
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>
              Use the cURL command to test endpoints from your terminal or
              integrate with your application
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>
              Check the API documentation for detailed information about request
              parameters and response formats
            </span>
          </li>
        </ul>
import { motion } from 'framer-motion';
import { Boxes } from 'lucide-react';

export default function Developer_SandboxPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <Boxes className="w-10 h-10 text-purple-400" />
            Developer Sandbox
          </h1>
          <p className="text-slate-400">Test and experiment</p>
        </motion.div>
        <div className="mt-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
          <p className="text-slate-300">Page content coming soon...</p>
        </div>
      </div>
    </div>
  );
}
