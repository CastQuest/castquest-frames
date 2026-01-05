"use client";

import { neo } from "@castquest/neo-ux-core";
import { DashboardGrid, DashboardStat } from "@castquest/neo-ux-core";

export default function RBACControlsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
          RBAC Controls 🔐
        </h1>
        <p className={`text-lg ${neo.colors.text.secondary}`}>
          Configure role-based access control and permissions across the platform.
        </p>
      </div>

      <DashboardGrid columns={4}>
        <DashboardStat
          label="Total Roles"
          value="12"
          trend="neutral"
          icon="🎭"
          subtitle="System-wide"
        />
        <DashboardStat
          label="Permissions"
          value="45"
          trend="up"
          icon="🔑"
          subtitle="Defined"
        />
        <DashboardStat
          label="Admin Users"
          value="8"
          trend="neutral"
          icon="👑"
          subtitle="Active"
        />
        <DashboardStat
          label="Access Logs"
          value="2.4K"
          trend="up"
          icon="📊"
          subtitle="Last 24h"
        />
      </DashboardGrid>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { role: "Admin", users: 8, permissions: ["all"], color: "purple" },
          { role: "Developer", users: 24, permissions: ["deploy", "contracts", "api"], color: "cyan" },
          { role: "User", users: 1213, permissions: ["create", "mint", "collect"], color: "emerald" },
        ].map((role) => (
          <div
            key={role.role}
            className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} hover:${neo.colors.border.glow} transition-all`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${neo.colors.text.primary}`}>{role.role}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${role.color}-500/20 text-${role.color}-400`}>
                {role.users} users
              </span>
            </div>
            <div className="space-y-2">
              <div className={`text-sm ${neo.colors.text.tertiary} mb-2`}>Permissions:</div>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((perm) => (
                  <span
                    key={perm}
                    className={`px-2 py-1 rounded text-xs ${neo.colors.bg.tertiary} ${neo.colors.text.secondary}`}
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>
            <button
              className={`mt-4 w-full px-4 py-2 rounded-lg border ${neo.colors.border.glow} ${neo.colors.text.accent} font-semibold hover:bg-emerald-500/10 transition-all`}
            >
              Configure
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
