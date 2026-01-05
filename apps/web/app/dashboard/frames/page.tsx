"use client";

import { neo } from "@castquest/neo-ux-core";
import { DashboardGrid, DashboardStat } from "@castquest/neo-ux-core";

export default function MyFramesPage() {
  const mockFrames = [
    { id: "1", title: "Welcome Frame", views: 1250, likes: 89, status: "active" },
    { id: "2", title: "NFT Gallery", views: 890, likes: 67, status: "active" },
    { id: "3", title: "Quest Board", views: 450, likes: 34, status: "draft" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
          My Frames 🖼️
        </h1>
        <p className={`text-lg ${neo.colors.text.secondary}`}>
          Create, manage, and share your Farcaster frames.
        </p>
      </div>

      <DashboardGrid columns={4}>
        <DashboardStat
          label="Total Frames"
          value="12"
          trend="up"
          icon="🖼️"
          subtitle="+2 this month"
        />
        <DashboardStat
          label="Total Views"
          value="8.5K"
          trend="up"
          icon="👁️"
          subtitle="+15% this week"
        />
        <DashboardStat
          label="Total Likes"
          value="645"
          trend="up"
          icon="❤️"
          subtitle="8.2% engagement"
        />
        <DashboardStat
          label="Active Frames"
          value="9"
          trend="neutral"
          icon="✅"
          subtitle="3 drafts"
        />
      </DashboardGrid>

      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${neo.colors.text.primary}`}>Your Frames</h2>
        <button
          className={`px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all ${neo.glow.active}`}
        >
          + Create New Frame
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockFrames.map((frame) => (
          <div
            key={frame.id}
            className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} hover:${neo.colors.border.glow} transition-all`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${neo.colors.text.primary}`}>
                {frame.title}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  frame.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {frame.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className={neo.colors.text.secondary}>
                👁️ {frame.views.toLocaleString()}
              </span>
              <span className={neo.colors.text.secondary}>
                ❤️ {frame.likes.toLocaleString()}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                className={`flex-1 px-3 py-2 rounded text-sm font-semibold ${neo.colors.text.accent} border ${neo.colors.border.glow} hover:bg-emerald-500/10 transition-all`}
              >
                Edit
              </button>
              <button
                className={`flex-1 px-3 py-2 rounded text-sm font-semibold ${neo.colors.text.secondary} border ${neo.colors.border.default} hover:${neo.colors.text.primary} transition-all`}
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
