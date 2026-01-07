'use client';

import { useState } from 'react';
import { Code2 } from 'lucide-react';

export default function SandboxPage() {
  const [endpoint, setEndpoint] = useState('/api/quests');
  const [method, setMethod] = useState('GET');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">API Sandbox</h1>
        <p className="mt-2 text-neutral-400">
          Test API endpoints in a safe environment
        </p>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Code2 className="text-primary" size={24} />
          <h2 className="text-xl font-bold text-white">API Tester</h2>
        </div>
        <p className="text-neutral-400">API sandbox coming soon...</p>
      </div>
    </div>
  );
}
