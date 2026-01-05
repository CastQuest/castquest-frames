"use client";

import { neo } from "@castquest/neo-ux-core";

export default function QuestManagementPage() {
  const quests = [
    { id: "1", title: "Create First Frame", participants: 543, completions: 412, status: "active" },
    { id: "2", title: "Mint NFT on Zora", participants: 289, completions: 156, status: "active" },
    { id: "3", title: "Join DAO Governance", participants: 678, completions: 234, status: "active" },
    { id: "4", title: "Legacy Quest", participants: 89, completions: 89, status: "archived" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
            Quest Management 🎯
          </h1>
          <p className={`text-lg ${neo.colors.text.secondary}`}>
            Create and manage quests for the CastQuest community.
          </p>
        </div>
        <button
          className={`px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all ${neo.glow.active}`}
        >
          + Create Quest
        </button>
      </div>

      <div className={`rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} overflow-hidden`}>
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
                  Rate
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
              {quests.map((quest) => {
                const rate = Math.round((quest.completions / quest.participants) * 100);
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
                      {rate}%
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
    </div>
  );
}
