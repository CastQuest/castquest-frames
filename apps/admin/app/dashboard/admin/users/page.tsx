import { Metadata } from 'next';
import Link from 'next/link';
import { Search, Filter, UserCheck, UserX } from 'lucide-react';
import { formatDate, getStatusColor } from '../../../../lib/utils';

export const metadata: Metadata = {
  title: 'User Management | CastQuest Admin',
  description: 'Manage all users on the platform',
};

export default function AdminUsersPage() {
  // Placeholder data
  const users = [
    {
      id: '1',
      address: '0x1234...5678',
      username: 'alice.eth',
      email: 'alice@example.com',
      status: 'active',
      role: 'user',
      joinedAt: '2024-01-01T00:00:00Z',
      questsCompleted: 12,
      framesCreated: 5,
    },
    {
      id: '2',
      address: '0x8765...4321',
      username: 'bob.eth',
      email: 'bob@example.com',
      status: 'active',
      role: 'creator',
      joinedAt: '2024-01-05T00:00:00Z',
      questsCompleted: 8,
      framesCreated: 23,
    },
    {
      id: '3',
      address: '0x9999...1111',
      username: 'charlie.eth',
      email: 'charlie@example.com',
      status: 'suspended',
      role: 'user',
      joinedAt: '2024-01-10T00:00:00Z',
      questsCompleted: 3,
      framesCreated: 1,
    },
    {
      id: '4',
      address: '0x2222...3333',
      username: 'david.eth',
      email: 'david@example.com',
      status: 'active',
      role: 'moderator',
      joinedAt: '2024-01-03T00:00:00Z',
      questsCompleted: 15,
      framesCreated: 7,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="mt-2 text-neutral-400">
            View and manage all platform users
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search users by name, email, or address..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white hover:border-neutral-700 transition-colors">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">1,247</div>
          <div className="text-sm text-neutral-400">Total Users</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-success">1,189</div>
          <div className="text-sm text-neutral-400">Active</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-warning">45</div>
          <div className="text-sm text-neutral-400">Pending Verification</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-error">13</div>
          <div className="text-sm text-neutral-400">Suspended</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-900 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-neutral-900 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-white">
                        {user.username}
                      </div>
                      <div className="text-sm text-neutral-400 font-mono">
                        {user.address}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-300 capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getStatusColor(
                        user.status === 'suspended' ? 'inactive' : user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-300">
                      {user.questsCompleted} quests
                    </div>
                    <div className="text-sm text-neutral-400">
                      {user.framesCreated} frames
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-400">
                      {formatDate(user.joinedAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/admin/users/${user.id}`}
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-success text-black rounded-lg hover:bg-success/90 transition-colors font-medium">
          <UserCheck size={18} />
          Bulk Approve
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors font-medium">
          <UserX size={18} />
          Bulk Suspend
        </button>
      </div>
'use client';

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function User_ManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <Users className="w-10 h-10 text-purple-400" />
            User Management
          </h1>
          <p className="text-slate-400">Manage platform users</p>
        </motion.div>
        <div className="mt-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
          <p className="text-slate-300">Page content coming soon...</p>
        </div>
      </div>
    </div>
  );
}
