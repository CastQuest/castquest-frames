"use client";

import { neo } from "@castquest/neo-ux-core";
import { DashboardGrid, DashboardStat } from "@castquest/neo-ux-core";

export default function MyQuestsPage() {
  const mockQuests = [
    { id: "1", title: "Create First Frame", status: "completed", progress: 100, reward: "50 XP" },
    { id: "2", title: "Mint NFT on Zora", status: "in-progress", progress: 60, reward: "100 XP" },
    { id: "3", title: "Join DAO Governance", status: "available", progress: 0, reward: "75 XP" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
          My Quests 🎯
        </h1>
        <p className={`text-lg ${neo.colors.text.secondary}`}>
          Track your progress and complete quests to earn rewards.
        </p>
      </div>

      <DashboardGrid columns={3}>
        <DashboardStat
          label="Completed"
          value="12"
          trend="up"
          icon="✅"
          subtitle="+3 this week"
        />
        <DashboardStat
          label="In Progress"
          value="5"
          trend="neutral"
          icon="🔄"
          subtitle="Keep going!"
        />
        <DashboardStat
          label="Total XP"
          value="1,250"
          trend="up"
          icon="⭐"
          subtitle="Rank #234"
        />
      </DashboardGrid>

      <div className="space-y-4">
        {mockQuests.map((quest) => (
          <div
            key={quest.id}
            className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} hover:${neo.colors.border.glow} transition-all`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-xl font-bold ${neo.colors.text.primary}`}>
                  {quest.title}
                </h3>
                <p className={`text-sm ${neo.colors.text.tertiary}`}>Reward: {quest.reward}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  quest.status === "completed"
                    ? "bg-green-500/20 text-green-400"
                    : quest.status === "in-progress"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {quest.status}
              </span>
            </div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className={neo.colors.text.secondary}>Progress</span>
              <span className={neo.colors.text.primary}>{quest.progress}%</span>
            </div>
            <div className={`h-2 rounded-full ${neo.colors.bg.tertiary} overflow-hidden`}>
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                style={{ width: `${quest.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
