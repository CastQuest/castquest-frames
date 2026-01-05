"use client";

import { neo } from "@castquest/neo-ux-core";

export default function ActivityPage() {
  const activities = [
    { id: "1", type: "frame", action: "Created", title: "Welcome Frame", time: "2 hours ago", icon: "🖼️" },
    { id: "2", type: "quest", action: "Completed", title: "Mint NFT on Zora", time: "5 hours ago", icon: "✅" },
    { id: "3", type: "like", action: "Liked", title: "Interactive Poll Frame", time: "1 day ago", icon: "❤️" },
    { id: "4", type: "mint", action: "Minted", title: "CastQuest Badge #234", time: "2 days ago", icon: "⚡" },
    { id: "5", type: "reward", action: "Earned", title: "50 XP from quest completion", time: "3 days ago", icon: "⭐" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
          Activity Feed 📈
        </h1>
        <p className={`text-lg ${neo.colors.text.secondary}`}>
          Track all your actions and interactions across the platform.
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {["All", "Frames", "Quests", "NFTs", "Rewards"].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              filter === "All"
                ? `${neo.colors.text.accent} bg-emerald-500/20 border ${neo.colors.border.glow}`
                : `${neo.colors.text.tertiary} border ${neo.colors.border.default} hover:${neo.colors.text.secondary}`
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} hover:${neo.colors.border.glow} transition-all`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{activity.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-semibold ${neo.colors.text.primary}`}>
                    {activity.action}
                  </span>
                  <span className={neo.colors.text.secondary}>{activity.title}</span>
                </div>
                <div className={`text-sm ${neo.colors.text.tertiary}`}>{activity.time}</div>
              </div>
              <button
                className={`px-3 py-1 rounded text-sm font-semibold ${neo.colors.text.accent} border ${neo.colors.border.glow} hover:bg-emerald-500/10 transition-all`}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
