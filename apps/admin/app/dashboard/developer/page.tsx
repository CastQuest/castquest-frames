import { Metadata } from 'next';
import Link from 'next/link';
import { Code, Key, FileText, PlayCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Developer Dashboard | CastQuest',
  description: 'Developer tools and API management',
};

export default function DeveloperPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Developer Dashboard</h1>
        <p className="mt-2 text-neutral-400">
          API tools and developer resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/dashboard/developer/api-keys" className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors">
          <Key className="text-primary mb-3" size={24} />
          <h3 className="text-lg font-bold text-white mb-2">API Keys</h3>
          <p className="text-sm text-neutral-400">Manage authentication keys</p>
        </Link>
        
        <Link href="/dashboard/developer/logs" className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors">
          <FileText className="text-success mb-3" size={24} />
          <h3 className="text-lg font-bold text-white mb-2">API Logs</h3>
          <p className="text-sm text-neutral-400">View request logs</p>
        </Link>
        
        <Link href="/dashboard/developer/sandbox" className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors">
          <PlayCircle className="text-secondary mb-3" size={24} />
          <h3 className="text-lg font-bold text-white mb-2">Sandbox</h3>
          <p className="text-sm text-neutral-400">Test API endpoints</p>
        </Link>
        
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
          <Code className="text-warning mb-3" size={24} />
          <h3 className="text-lg font-bold text-white mb-2">Documentation</h3>
          <p className="text-sm text-neutral-400">API reference docs</p>
        </div>
      </div>
    </div>
  );
}
