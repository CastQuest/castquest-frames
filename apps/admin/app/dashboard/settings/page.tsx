import { Metadata } from 'next';
import Link from 'next/link';
import { User, Shield, Bell, Settings as SettingsIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings | CastQuest',
  description: 'Application settings',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-neutral-400">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/settings/profile" className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors">
          <User className="text-primary mb-3" size={24} />
          <h3 className="text-lg font-bold text-white mb-2">Profile</h3>
          <p className="text-sm text-neutral-400">Manage your profile and wallet</p>
        </Link>
        
        <Link href="/dashboard/settings/security" className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors">
          <Shield className="text-success mb-3" size={24} />
          <h3 className="text-lg font-bold text-white mb-2">Security</h3>
          <p className="text-sm text-neutral-400">Security and privacy settings</p>
        </Link>
        
        <Link href="/dashboard/settings/notifications" className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors">
          <Bell className="text-warning mb-3" size={24} />
          <h3 className="text-lg font-bold text-white mb-2">Notifications</h3>
          <p className="text-sm text-neutral-400">Notification preferences</p>
        </Link>
      </div>
    </div>
  );
}
