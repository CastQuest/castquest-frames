"use client";

import { neo } from "@castquest/neo-ux-core";
import { Activity, TrendingUp, Users, Zap } from "lucide-react";

export default function DashboardPage() {
  // Demo data - replace with actual API calls in production
  const stats = [
    { name: "Total Users", value: "12,543", change: "+12.3%", icon: Users, color: neo.glow.success },
    { name: "Active Quests", value: "89", change: "+4.1%", icon: Activity, color: neo.glow.active },
    { name: "Treasury Value", value: "$2.4M", change: "+8.2%", icon: TrendingUp, color: neo.glow.purple },
    { name: "AI Agents", value: "24", change: "100%", icon: Zap, color: neo.glow.warning },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-3xl font-bold ${neo.colors.text.primary} mb-2`}>
          Dashboard Overview
        </h1>
        <p className={neo.colors.text.secondary}>
          Welcome to CastQuest Nexus - Your unified control center
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`${neo.colors.bg.tertiary} rounded-lg p-6 border ${neo.colors.border.glow} ${stat.color} transition-all hover:scale-105`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${neo.colors.text.secondary}`}>{stat.name}</p>
                <p className={`text-2xl font-bold ${neo.colors.text.primary} mt-2`}>
                  {stat.value}
                </p>
                <p className={`text-sm ${neo.colors.text.success} mt-1`}>{stat.change}</p>
              </div>
              <stat.icon className={`h-12 w-12 ${neo.colors.text.accent}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className={`${neo.colors.bg.tertiary} rounded-lg p-6 border ${neo.colors.border.glow} ${neo.glow.idle}`}>
        <h2 className={`text-xl font-bold ${neo.colors.text.primary} mb-4`}>
          Recent Activity
        </h2>
        <div className="space-y-4">
          {/* Demo activity data - replace with actual API calls in production */}
          {[
            { user: "Alice", action: "completed Quest #42", time: "2 min ago" },
            { user: "Bob", action: "minted new Frame", time: "5 min ago" },
            { user: "Carol", action: "joined Treasury Pool", time: "12 min ago" },
            { user: "Dave", action: "deployed AI Agent", time: "23 min ago" },
          ].map((activity, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-4 ${neo.colors.bg.secondary} rounded-lg border ${neo.colors.border.default}`}
            >
              <div>
                <span className={`font-medium ${neo.colors.text.primary}`}>
                  {activity.user}
                </span>
                <span className={neo.colors.text.secondary}> {activity.action}</span>
              </div>
              <span className={`text-sm ${neo.colors.text.tertiary}`}>
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className={`${neo.colors.bg.tertiary} rounded-lg p-6 border ${neo.colors.border.glow} hover:${neo.glow.active} transition-all text-left`}>
          <h3 className={`text-lg font-bold ${neo.colors.text.primary} mb-2`}>
            Create Quest
          </h3>
          <p className={neo.colors.text.secondary}>
            Launch a new quest for your community
          </p>
        </button>
        
        <button className={`${neo.colors.bg.tertiary} rounded-lg p-6 border ${neo.colors.border.glow} hover:${neo.glow.active} transition-all text-left`}>
          <h3 className={`text-lg font-bold ${neo.colors.text.primary} mb-2`}>
            Deploy Frame
          </h3>
          <p className={neo.colors.text.secondary}>
            Build and deploy a new Farcaster Frame
          </p>
        </button>
        
        <button className={`${neo.colors.bg.tertiary} rounded-lg p-6 border ${neo.colors.border.glow} hover:${neo.glow.active} transition-all text-left`}>
          <h3 className={`text-lg font-bold ${neo.colors.text.primary} mb-2`}>
            Configure AI
          </h3>
          <p className={neo.colors.text.secondary}>
            Set up Smart Brain AI agents
          </p>
        </button>
      </div>
    </div>
  );
}
