import { Metadata } from 'next';
import Link from 'next/link';
import { User, Shield, Bell, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings | CastQuest',
  description: 'Manage your account settings and preferences',
};

export default function SettingsPage() {
  const settingsSections = [
    {
      title: 'Profile',
      description: 'Manage your personal information and profile settings',
      icon: User,
      href: '/dashboard/settings/profile',
      color: 'text-primary',
    },
    {
      title: 'Security',
      description: 'Password, two-factor authentication, and connected accounts',
      icon: Shield,
      href: '/dashboard/settings/security',
      color: 'text-success',
    },
    {
      title: 'Notifications',
      description: 'Configure email, push, and in-app notification preferences',
      icon: Bell,
      href: '/dashboard/settings/notifications',
      color: 'text-warning',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-neutral-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg ${section.color} bg-current/10 flex items-center justify-center`}
                >
                  <Icon className={section.color} size={24} />
                </div>
                <ArrowRight
                  className="text-neutral-600 group-hover:text-primary transition-colors"
                  size={20}
                />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {section.title}
              </h3>
              <p className="text-sm text-neutral-400">{section.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Info */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Account Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-neutral-400 mb-1">Account Type</div>
            <div className="text-lg font-medium text-white">Administrator</div>
          </div>
          <div>
            <div className="text-sm text-neutral-400 mb-1">Member Since</div>
            <div className="text-lg font-medium text-white">
              January 1, 2024
            </div>
          </div>
          <div>
            <div className="text-sm text-neutral-400 mb-1">Email Status</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-white">Verified</span>
              <span className="px-2 py-0.5 text-xs rounded bg-success/10 text-success border border-success/30">
                Active
              </span>
            </div>
          </div>
          <div>
            <div className="text-sm text-neutral-400 mb-1">2FA Status</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-white">Enabled</span>
              <span className="px-2 py-0.5 text-xs rounded bg-success/10 text-success border border-success/30">
                Protected
              </span>
            </div>
          </div>
'use client';

import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <Settings className="w-10 h-10 text-purple-400" />
            Settings
          </h1>
          <p className="text-slate-400">Configure your account preferences</p>
        </motion.div>
        <div className="mt-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
          <p className="text-slate-300">Page content coming soon...</p>
        </div>
      </div>
    </div>
  );
}
