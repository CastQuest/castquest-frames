"use client";

import { useState } from "react";
import { neo } from "@castquest/neo-ux-core";
import { DashboardGrid, DashboardStat } from "@castquest/neo-ux-core";

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState<"users" | "quests" | "logs">("users");

  // Mock data
  const stats = {
    totalUsers: 1245,
    activeUsers: 856,
    totalQuests: 48,
    systemHealth: "99.8%",
  };

  const usersData = [
    { id: "1", username: "creator_alpha", email: "alpha@example.com", role: "user", status: "active", joined: "2024-01-15" },
    { id: "2", username: "dev_beta", email: "beta@example.com", role: "developer", status: "active", joined: "2024-02-20" },
    { id: "3", username: "admin_gamma", email: "gamma@example.com", role: "admin", status: "active", joined: "2024-03-10" },
    { id: "4", username: "user_delta", email: "delta@example.com", role: "user", status: "suspended", joined: "2024-04-05" },
  ];

  const questsData = [
    { id: "1", title: "Create First Frame", participants: 543, completions: 412, status: "active" },
    { id: "2", title: "Mint NFT on Zora", participants: 289, completions: 156, status: "active" },
    { id: "3", title: "Join DAO Governance", participants: 678, completions: 234, status: "active" },
    { id: "4", title: "Legacy Quest", participants: 89, completions: 89, status: "archived" },
  ];

  const logsData = [
    { id: "1", timestamp: "2024-12-30 17:30:45", level: "info", message: "User authentication successful", user: "creator_alpha" },
    { id: "2", timestamp: "2024-12-30 17:29:12", level: "warning", message: "Rate limit approaching for API key", user: "dev_beta" },
    { id: "3", timestamp: "2024-12-30 17:28:33", level: "info", message: "Quest completed", user: "user_epsilon" },
    { id: "4", timestamp: "2024-12-30 17:27:55", level: "error", message: "Failed transaction on BASE", user: "creator_zeta" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div>
        <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
          Admin Control Center ⚡
        </h1>
        <p className={`text-lg ${neo.colors.text.secondary}`}>
          Manage users, quests, and monitor system health across the CastQuest ecosystem.
        </p>
      </div>

      {/* Stats Grid */}
      <DashboardGrid columns={4}>
        <DashboardStat
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          trend="up"
          icon="👥"
          subtitle="+42 this week"
        />
        <DashboardStat
          label="Active Users"
          value={stats.activeUsers.toLocaleString()}
          trend="up"
          icon="🟢"
          subtitle="68% online rate"
        />
        <DashboardStat
          label="Total Quests"
          value={stats.totalQuests}
          trend="neutral"
          icon="🎯"
          subtitle="12 pending review"
        />
        <DashboardStat
          label="System Health"
          value={stats.systemHealth}
          trend="up"
          icon="💚"
          subtitle="All systems operational"
        />
      </DashboardGrid>

      {/* RBAC Quick Actions */}
      <div className={`p-6 rounded-lg border ${neo.colors.border.glow} bg-gradient-to-br from-purple-500/10 to-cyan-500/10 ${neo.glow.active}`}>
        <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4`}>
          🔐 RBAC Quick Actions
        </h2>
        <div className="grid gap-3 md:grid-cols-4">
          <button className={`p-4 rounded-lg ${neo.colors.bg.secondary} border ${neo.colors.border.default} hover:${neo.colors.border.glow} transition-all text-left`}>
            <div className="text-2xl mb-2">👤</div>
            <div className={`text-sm font-semibold ${neo.colors.text.primary}`}>Assign Roles</div>
            <div className={`text-xs ${neo.colors.text.tertiary}`}>Manage user permissions</div>
          </button>
          <button className={`p-4 rounded-lg ${neo.colors.bg.secondary} border ${neo.colors.border.default} hover:${neo.colors.border.glow} transition-all text-left`}>
            <div className="text-2xl mb-2">🔒</div>
            <div className={`text-sm font-semibold ${neo.colors.text.primary}`}>Access Control</div>
            <div className={`text-xs ${neo.colors.text.tertiary}`}>Configure permissions</div>
          </button>
          <button className={`p-4 rounded-lg ${neo.colors.bg.secondary} border ${neo.colors.border.default} hover:${neo.colors.border.glow} transition-all text-left`}>
            <div className="text-2xl mb-2">📊</div>
            <div className={`text-sm font-semibold ${neo.colors.text.primary}`}>Analytics</div>
            <div className={`text-xs ${neo.colors.text.tertiary}`}>View detailed reports</div>
          </button>
          <button className={`p-4 rounded-lg ${neo.colors.bg.secondary} border ${neo.colors.border.default} hover:${neo.colors.border.glow} transition-all text-left`}>
            <div className="text-2xl mb-2">⚙️</div>
            <div className={`text-sm font-semibold ${neo.colors.text.primary}`}>Settings</div>
            <div className={`text-xs ${neo.colors.text.tertiary}`}>System configuration</div>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4">
        <button
          onClick={() => setSelectedTab("users")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedTab === "users"
              ? `${neo.colors.text.primary} bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border ${neo.colors.border.glow} ${neo.glow.active}`
              : `${neo.colors.text.tertiary} border ${neo.colors.border.default} hover:${neo.colors.text.secondary}`
          }`}
        >
          👥 User Management
        </button>
        <button
          onClick={() => setSelectedTab("quests")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedTab === "quests"
              ? `${neo.colors.text.primary} bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border ${neo.colors.border.glow} ${neo.glow.active}`
              : `${neo.colors.text.tertiary} border ${neo.colors.border.default} hover:${neo.colors.text.secondary}`
          }`}
        >
          🎯 Quest Management
        </button>
        <button
          onClick={() => setSelectedTab("logs")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedTab === "logs"
              ? `${neo.colors.text.primary} bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border ${neo.colors.border.glow} ${neo.glow.active}`
              : `${neo.colors.text.tertiary} border ${neo.colors.border.default} hover:${neo.colors.text.secondary}`
          }`}
        >
          📋 System Logs
        </button>
      </div>

      {/* Users Table */}
      {selectedTab === "users" && (
        <div className={`rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} overflow-hidden`}>
          <div className="p-6 border-b border-neutral-800">
            <h3 className={`text-xl font-bold ${neo.colors.text.primary}`}>User Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${neo.colors.bg.tertiary}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    User
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Email
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Role
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Joined
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {usersData.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-900 transition-colors">
                    <td className={`px-6 py-4 ${neo.colors.text.primary} font-medium`}>
                      {user.username}
                    </td>
                    <td className={`px-6 py-4 ${neo.colors.text.secondary}`}>
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-500/20 text-purple-400"
                          : user.role === "developer"
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.status === "active"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${neo.colors.text.tertiary} text-sm`}>
                      {user.joined}
                    </td>
                    <td className="px-6 py-4">
                      <button className={`px-3 py-1 rounded text-sm font-semibold ${neo.colors.text.accent} hover:bg-emerald-500/10 transition-all`}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quests Management Table */}
      {selectedTab === "quests" && (
        <div className={`rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} overflow-hidden`}>
          <div className="p-6 border-b border-neutral-800">
            <h3 className={`text-xl font-bold ${neo.colors.text.primary}`}>Quest Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${neo.colors.bg.tertiary}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Quest Title
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Participants
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Completions
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Completion Rate
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {questsData.map((quest) => {
                  const completionRate = Math.round((quest.completions / quest.participants) * 100);
                  return (
                    <tr key={quest.id} className="hover:bg-neutral-900 transition-colors">
                      <td className={`px-6 py-4 ${neo.colors.text.primary} font-medium`}>
                        {quest.title}
                      </td>
                      <td className={`px-6 py-4 ${neo.colors.text.secondary}`}>
                        {quest.participants.toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 ${neo.colors.text.secondary}`}>
                        {quest.completions.toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 ${neo.colors.text.accent}`}>
                        {completionRate}%
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          quest.status === "active"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-neutral-700 text-neutral-400"
                        }`}>
                          {quest.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className={`px-3 py-1 rounded text-sm font-semibold ${neo.colors.text.accent} hover:bg-emerald-500/10 transition-all`}>
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* System Logs */}
      {selectedTab === "logs" && (
        <div className={`rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} overflow-hidden`}>
          <div className="p-6 border-b border-neutral-800">
            <h3 className={`text-xl font-bold ${neo.colors.text.primary}`}>System Logs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${neo.colors.bg.tertiary}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Timestamp
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Level
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Message
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    User
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {logsData.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-900 transition-colors">
                    <td className={`px-6 py-4 ${neo.colors.text.tertiary} text-sm font-mono`}>
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        log.level === "error"
                          ? "bg-red-500/20 text-red-400"
                          : log.level === "warning"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {log.level}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${neo.colors.text.primary}`}>
                      {log.message}
                    </td>
                    <td className={`px-6 py-4 ${neo.colors.text.secondary}`}>
                      {log.user}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Platform Analytics */}
      <div className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary}`}>
        <h3 className={`text-xl font-bold ${neo.colors.text.primary} mb-4`}>Platform Analytics</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className={`text-sm font-semibold ${neo.colors.text.secondary} mb-3`}>User Growth (7 Days)</h4>
            <div className="flex items-end gap-2" style={{ height: "120px" }}>
              {[45, 60, 55, 75, 85, 70, 90].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end" style={{ height: "100px" }}>
                    <div
                      className={`w-full bg-gradient-to-t from-purple-500 to-cyan-500 rounded-t ${neo.glow.active}`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className={`text-xs ${neo.colors.text.tertiary}`}>
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className={`text-sm font-semibold ${neo.colors.text.secondary} mb-3`}>Quest Completions (7 Days)</h4>
            <div className="flex items-end gap-2" style={{ height: "120px" }}>
              {[70, 55, 80, 65, 90, 75, 85].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end" style={{ height: "100px" }}>
                    <div
                      className={`w-full bg-gradient-to-t from-emerald-500 to-cyan-500 rounded-t ${neo.glow.success}`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className={`text-xs ${neo.colors.text.tertiary}`}>
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
