"use client";

import { neo } from "@castquest/neo-ux-core";

export default function SystemLogsPage() {
  const logs = [
    { id: "1", timestamp: "2024-12-30 17:30:45", level: "info", message: "User authentication successful", user: "creator_alpha" },
    { id: "2", timestamp: "2024-12-30 17:29:12", level: "warning", message: "Rate limit approaching for API key", user: "dev_beta" },
    { id: "3", timestamp: "2024-12-30 17:28:33", level: "info", message: "Quest completed", user: "user_epsilon" },
    { id: "4", timestamp: "2024-12-30 17:27:55", level: "error", message: "Failed transaction on BASE", user: "creator_zeta" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
          System Logs 📋
        </h1>
        <p className={`text-lg ${neo.colors.text.secondary}`}>
          Monitor system events, errors, and important activities.
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {["All", "Info", "Warning", "Error"].map((filter) => (
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

      <div className={`rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} overflow-hidden`}>
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
              {logs.map((log) => (
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
    </div>
  );
}
