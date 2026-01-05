"use client";

import { neo } from "@castquest/neo-ux-core";

export default function UserManagementPage() {
  const users = [
    { id: "1", username: "creator_alpha", email: "alpha@example.com", role: "user", status: "active", joined: "2024-01-15" },
    { id: "2", username: "dev_beta", email: "beta@example.com", role: "developer", status: "active", joined: "2024-02-20" },
    { id: "3", username: "admin_gamma", email: "gamma@example.com", role: "admin", status: "active", joined: "2024-03-10" },
    { id: "4", username: "user_delta", email: "delta@example.com", role: "user", status: "suspended", joined: "2024-04-05" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
            User Management 👥
          </h1>
          <p className={`text-lg ${neo.colors.text.secondary}`}>
            Manage user accounts, roles, and permissions.
          </p>
        </div>
        <button
          className={`px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all ${neo.glow.active}`}
        >
          + Add User
        </button>
      </div>

      <div className={`rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} overflow-hidden`}>
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
              {users.map((user) => (
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
    </div>
  );
}
