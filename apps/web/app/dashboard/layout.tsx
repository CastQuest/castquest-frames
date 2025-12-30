"use client";

import { ReactNode, useState } from "react";
import { neo } from "@castquest/neo-ux-core";

interface DashboardLayoutProps {
  children: ReactNode;
}

type UserRole = "user" | "admin" | "developer";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // In a real app, this would come from authentication context
  const [currentRole, setCurrentRole] = useState<UserRole>("user");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const userMenuItems = [
    { label: "Overview", icon: "📊", href: "/dashboard", active: true },
    { label: "My Quests", icon: "🎯", href: "/dashboard/quests" },
    { label: "My Frames", icon: "🖼️", href: "/dashboard/frames" },
    { label: "AI Builder", icon: "🤖", href: "/dashboard/builder" },
    { label: "Treasury", icon: "💎", href: "/dashboard/treasury" },
    { label: "Activity", icon: "📈", href: "/dashboard/activity" },
  ];

  const adminMenuItems = [
    { label: "Admin Overview", icon: "⚡", href: "/dashboard/admin", active: true },
    { label: "User Management", icon: "👥", href: "/dashboard/admin/users" },
    { label: "Quest Management", icon: "🎯", href: "/dashboard/admin/quests" },
    { label: "RBAC Controls", icon: "🔐", href: "/dashboard/admin/rbac" },
    { label: "System Logs", icon: "📋", href: "/dashboard/admin/logs" },
    { label: "Analytics", icon: "📊", href: "/dashboard/admin/analytics" },
  ];

  const devMenuItems = [
    { label: "Dev Portal", icon: "💻", href: "/dashboard/dev", active: true },
    { label: "API Docs", icon: "📚", href: "/dashboard/dev/docs" },
    { label: "SDK Examples", icon: "🔧", href: "/dashboard/dev/sdk" },
    { label: "Contracts", icon: "📝", href: "/dashboard/dev/contracts" },
    { label: "Templates", icon: "🎨", href: "/dashboard/dev/templates" },
    { label: "Deployment", icon: "🚀", href: "/dashboard/dev/deploy" },
  ];

  const getMenuItems = () => {
    switch (currentRole) {
      case "admin":
        return adminMenuItems;
      case "developer":
        return devMenuItems;
      default:
        return userMenuItems;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "developer":
        return "Developer";
      default:
        return "User";
    }
  };

  return (
    <div className={`min-h-screen ${neo.colors.bg.primary}`}>
      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b ${neo.colors.border.default} bg-black/80 backdrop-blur-sm`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg border ${neo.colors.border.default} ${neo.colors.text.secondary} hover:${neo.colors.text.primary} transition-all`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <a href="/" className={`text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent`}>
              CastQuest Nexus
            </a>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-3">
            <div className={`flex gap-2 p-1 rounded-lg ${neo.colors.bg.secondary} border ${neo.colors.border.default}`}>
              {(["user", "admin", "developer"] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setCurrentRole(role)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    currentRole === role
                      ? `${neo.colors.text.accent} bg-emerald-500/20 ${neo.glow.success}`
                      : `${neo.colors.text.tertiary} hover:${neo.colors.text.secondary}`
                  }`}
                >
                  {getRoleLabel(role)}
                </button>
              ))}
            </div>
            <button className={`px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border ${neo.colors.border.glow} ${neo.colors.text.accent} hover:from-purple-500/30 hover:to-cyan-500/30 transition-all ${neo.glow.idle}`}>
              Connect Wallet
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] border-r ${neo.colors.border.default} ${neo.colors.bg.primary} transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-0"
          } overflow-hidden`}
        >
          <div className="p-4">
            <div className={`mb-6 p-3 rounded-lg ${neo.colors.bg.secondary} border ${neo.colors.border.glow} ${neo.glow.idle}`}>
              <div className={`text-xs font-medium ${neo.colors.text.tertiary} uppercase tracking-wide mb-1`}>
                Current Role
              </div>
              <div className={`text-lg font-bold ${neo.colors.text.accent}`}>
                {getRoleLabel(currentRole)}
              </div>
            </div>

            <nav className="space-y-1">
              {getMenuItems().map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    item.active
                      ? `${neo.colors.text.primary} bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border ${neo.colors.border.glow} ${neo.glow.active}`
                      : `${neo.colors.text.tertiary} hover:${neo.colors.text.secondary} hover:bg-neutral-900`
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <div className="p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
