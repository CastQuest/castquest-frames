import { Metadata } from 'next';
import Link from 'next/link';
import { Users, Zap, Activity, Shield, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard | CastQuest',
  description: 'Administrator dashboard and system overview',
};

export default function AdminPage() {
  const stats = [
    { label: 'Total Users', value: '1,247', change: '+12%', icon: Users },
    { label: 'Active Quests', value: '24', change: '+5%', icon: Zap },
    { label: 'Total Frames', value: '156', change: '+18%', icon: Activity },
    { label: 'Moderation Queue', value: '8', change: '-3%', icon: Shield },
  ];

  const quickLinks = [
    {
      title: 'User Management',
      description: 'View and manage all users',
      href: '/dashboard/admin/users',
      icon: Users,
      color: 'text-primary',
    },
    {
      title: 'Quest Moderation',
      description: 'Review and moderate quests',
      href: '/dashboard/admin/quests',
      icon: Zap,
      color: 'text-success',
    },
    {
      title: 'Frame Moderation',
      description: 'Review and moderate frames',
      href: '/dashboard/admin/frames',
      icon: Activity,
      color: 'text-secondary',
    },
  ];

  const recentActions = [
    {
      id: '1',
      action: 'User suspended',
      user: 'admin@castquest.xyz',
      target: '0x1234...5678',
      timestamp: '5 minutes ago',
    },
    {
      id: '2',
      action: 'Quest approved',
      user: 'admin@castquest.xyz',
      target: 'Share Your Story',
      timestamp: '15 minutes ago',
    },
    {
      id: '3',
      action: 'Frame flagged',
      user: 'moderator@castquest.xyz',
      target: 'Frame #145',
      timestamp: '1 hour ago',
    },
    {
      id: '4',
      action: 'User verified',
      user: 'admin@castquest.xyz',
      target: '0x8765...4321',
      timestamp: '2 hours ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-2 text-neutral-400">
          System overview and administration tools
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-neutral-950 border border-neutral-800 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="text-primary" size={24} />
                <span className="text-sm text-success">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-neutral-400">{stat.label}</div>
            </div>
          );
        })}
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

      {/* Recent Admin Actions */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Recent Admin Actions
        </h2>
        <div className="space-y-3">
          {recentActions.map((action) => (
            <div
              key={action.id}
              className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg"
            >
              <div className="flex-1">
                <div className="text-white font-medium">{action.action}</div>
                <div className="flex items-center gap-2 mt-1 text-sm text-neutral-400">
                  <span>By {action.user}</span>
                  <span>•</span>
                  <span>Target: {action.target}</span>
                </div>
              </div>
              <span className="text-xs text-neutral-500 whitespace-nowrap">
                {action.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">API Status</h3>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <span className="text-neutral-400">All systems operational</span>
          </div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Database</h3>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <span className="text-neutral-400">Connected</span>
          </div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Smart Contracts</h3>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <span className="text-neutral-400">Synced</span>
          </div>
'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function Admin_OverviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <Shield className="w-10 h-10 text-purple-400" />
            Admin Overview
          </h1>
          <p className="text-slate-400">Administrative dashboard</p>
        </motion.div>
        <div className="mt-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
          <p className="text-slate-300">Page content coming soon...</p>
        </div>
      </div>
    </div>
  );
}
