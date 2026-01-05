"use client";

import { useState } from "react";
import { neo } from "@castquest/neo-ux-core";
import { DashboardGrid, DashboardStat } from "@castquest/neo-ux-core";

export default function UserDashboard() {
  const [selectedTab, setSelectedTab] = useState<"quests" | "frames">("quests");

  // Mock data
  const stats = {
    totalFrames: 24,
    activeQuests: 8,
    completedQuests: 15,
    treasuryValue: "12.5K",
  };

  const questsData = [
    { id: "1", title: "Create First Frame", status: "completed", reward: "100 CAST", progress: 100 },
    { id: "2", title: "Mint NFT on Zora", status: "active", reward: "250 CAST", progress: 60 },
    { id: "3", title: "Complete 5 Interactions", status: "active", reward: "150 CAST", progress: 40 },
    { id: "4", title: "Join DAO Governance", status: "pending", reward: "500 CAST", progress: 0 },
  ];

  const framesData = [
    { id: "1", title: "Welcome Frame", views: 1234, interactions: 89, status: "live" },
    { id: "2", title: "NFT Showcase", views: 856, interactions: 45, status: "live" },
    { id: "3", title: "Quest Board", views: 2103, interactions: 156, status: "live" },
    { id: "4", title: "Draft Frame", views: 0, interactions: 0, status: "draft" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div>
        <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
          Welcome Back, Creator 🚀
        </h1>
        <p className={`text-lg ${neo.colors.text.secondary}`}>
          Your CastQuest journey continues. Create frames, complete quests, and earn rewards.
        </p>
      </div>

      {/* Stats Grid */}
      <DashboardGrid columns={4}>
        <DashboardStat
          label="Total Frames"
          value={stats.totalFrames}
          trend="up"
          icon="🖼️"
          subtitle="+3 this week"
        />
        <DashboardStat
          label="Active Quests"
          value={stats.activeQuests}
          trend="neutral"
          icon="🎯"
          subtitle="2 expiring soon"
        />
        <DashboardStat
          label="Completed"
          value={stats.completedQuests}
          trend="up"
          icon="✅"
          subtitle="+5 this month"
        />
        <DashboardStat
          label="Treasury Value"
          value={stats.treasuryValue}
          trend="up"
          icon="💎"
          subtitle="CAST tokens"
        />
      </DashboardGrid>

      {/* AI Builder Remix Tool */}
      <div className={`p-6 rounded-lg border ${neo.colors.border.glow} bg-gradient-to-br from-purple-500/10 to-cyan-500/10 ${neo.glow.active}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-1`}>
              🤖 AI Frame Builder
            </h2>
            <p className={`text-sm ${neo.colors.text.secondary}`}>
              Create custom frames with AI assistance
            </p>
          </div>
          <button className={`px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold ${neo.glow.success} hover:scale-105 transition-all`}>
            Start Building
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className={`p-4 rounded-lg ${neo.colors.bg.secondary} border ${neo.colors.border.default}`}>
            <div className="text-2xl mb-2">🎨</div>
            <div className={`text-sm font-semibold ${neo.colors.text.primary} mb-1`}>Templates</div>
            <div className={`text-xs ${neo.colors.text.tertiary}`}>12 pre-built designs</div>
          </div>
          <div className={`p-4 rounded-lg ${neo.colors.bg.secondary} border ${neo.colors.border.default}`}>
            <div className="text-2xl mb-2">⚡</div>
            <div className={`text-sm font-semibold ${neo.colors.text.primary} mb-1`}>Quick Deploy</div>
            <div className={`text-xs ${neo.colors.text.tertiary}`}>Live in 60 seconds</div>
          </div>
          <div className={`p-4 rounded-lg ${neo.colors.bg.secondary} border ${neo.colors.border.default}`}>
            <div className="text-2xl mb-2">🔗</div>
            <div className={`text-sm font-semibold ${neo.colors.text.primary} mb-1`}>Multi-Chain</div>
            <div className={`text-xs ${neo.colors.text.tertiary}`}>Base, Zora, Solana</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4">
        <button
          onClick={() => setSelectedTab("quests")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedTab === "quests"
              ? `${neo.colors.text.primary} bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border ${neo.colors.border.glow} ${neo.glow.active}`
              : `${neo.colors.text.tertiary} border ${neo.colors.border.default} hover:${neo.colors.text.secondary}`
          }`}
        >
          🎯 My Quests
        </button>
        <button
          onClick={() => setSelectedTab("frames")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedTab === "frames"
              ? `${neo.colors.text.primary} bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border ${neo.colors.border.glow} ${neo.glow.active}`
              : `${neo.colors.text.tertiary} border ${neo.colors.border.default} hover:${neo.colors.text.secondary}`
          }`}
        >
          🖼️ My Frames
        </button>
      </div>

      {/* Quests Table */}
      {selectedTab === "quests" && (
        <div className={`rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} overflow-hidden`}>
          <div className="p-6 border-b border-neutral-800">
            <h3 className={`text-xl font-bold ${neo.colors.text.primary}`}>Active Quests</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${neo.colors.bg.tertiary}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Quest
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Progress
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Reward
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {questsData.map((quest) => (
                  <tr key={quest.id} className="hover:bg-neutral-900 transition-colors">
                    <td className={`px-6 py-4 ${neo.colors.text.primary} font-medium`}>
                      {quest.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        quest.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : quest.status === "active"
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-neutral-700 text-neutral-400"
                      }`}>
                        {quest.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            style={{ width: `${quest.progress}%` }}
                          />
                        </div>
                        <span className={`text-xs ${neo.colors.text.tertiary}`}>{quest.progress}%</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${neo.colors.text.accent} font-semibold`}>
                      {quest.reward}
                    </td>
                    <td className="px-6 py-4">
                      <button className={`px-4 py-2 rounded-lg text-sm font-semibold border ${neo.colors.border.glow} ${neo.colors.text.accent} hover:bg-emerald-500/10 transition-all`}>
                        {quest.status === "completed" ? "Claim" : "Continue"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Frames Table */}
      {selectedTab === "frames" && (
        <div className={`rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} overflow-hidden`}>
          <div className="p-6 border-b border-neutral-800">
            <h3 className={`text-xl font-bold ${neo.colors.text.primary}`}>My Frames</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${neo.colors.bg.tertiary}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Frame
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Views
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Interactions
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {framesData.map((frame) => (
                  <tr key={frame.id} className="hover:bg-neutral-900 transition-colors">
                    <td className={`px-6 py-4 ${neo.colors.text.primary} font-medium`}>
                      {frame.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        frame.status === "live"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-neutral-700 text-neutral-400"
                      }`}>
                        {frame.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${neo.colors.text.secondary}`}>
                      {frame.views.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 ${neo.colors.text.secondary}`}>
                      {frame.interactions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button className={`px-4 py-2 rounded-lg text-sm font-semibold border ${neo.colors.border.glow} ${neo.colors.text.accent} hover:bg-emerald-500/10 transition-all`}>
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

      {/* Activity Chart */}
      <div className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary}`}>
        <h3 className={`text-xl font-bold ${neo.colors.text.primary} mb-4`}>Activity Chart</h3>
        <div className="grid gap-4 md:grid-cols-7">
          {[65, 85, 45, 95, 70, 80, 90].map((height, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center" style={{ height: "100px" }}>
                <div
                  className={`w-full bg-gradient-to-t from-emerald-500 to-cyan-500 rounded-t ${neo.glow.success}`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className={`text-xs ${neo.colors.text.tertiary}`}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
