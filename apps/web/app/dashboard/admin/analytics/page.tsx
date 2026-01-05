"use client";

import { neo } from "@castquest/neo-ux-core";
import { DashboardGrid, DashboardStat } from "@castquest/neo-ux-core";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
          Analytics 📊
        </h1>
        <p className={`text-lg ${neo.colors.text.secondary}`}>
          Platform-wide analytics and performance metrics.
        </p>
      </div>

      <DashboardGrid columns={4}>
        <DashboardStat
          label="Total Users"
          value="1,245"
          trend="up"
          icon="👥"
          subtitle="+42 this week"
        />
        <DashboardStat
          label="Active Users"
          value="856"
          trend="up"
          icon="🟢"
          subtitle="68% online"
        />
        <DashboardStat
          label="Total Frames"
          value="3,421"
          trend="up"
          icon="🖼️"
          subtitle="+156 this month"
        />
        <DashboardStat
          label="Revenue"
          value="$12.4K"
          trend="up"
          icon="💰"
          subtitle="+18% this month"
        />
      </DashboardGrid>

      <div className="grid gap-6 md:grid-cols-2">
        <div className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary}`}>
          <h3 className={`text-xl font-bold ${neo.colors.text.primary} mb-4`}>
            User Growth (7 Days)
          </h3>
          <div className="flex items-end gap-2" style={{ height: "200px" }}>
            {[45, 60, 55, 75, 85, 70, 90].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end" style={{ height: "180px" }}>
                  <div
                    className={`w-full bg-gradient-to-t from-purple-500 to-cyan-500 rounded-t ${neo.glow.active}`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className={`text-xs ${neo.colors.text.tertiary}`}>
                  Day {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary}`}>
          <h3 className={`text-xl font-bold ${neo.colors.text.primary} mb-4`}>
            Quest Completions (7 Days)
          </h3>
          <div className="flex items-end gap-2" style={{ height: "200px" }}>
            {[70, 55, 80, 65, 90, 75, 85].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end" style={{ height: "180px" }}>
                  <div
                    className={`w-full bg-gradient-to-t from-emerald-500 to-cyan-500 rounded-t ${neo.glow.success}`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className={`text-xs ${neo.colors.text.tertiary}`}>
                  Day {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
