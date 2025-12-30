"use client";

import { ReactNode, useState, useEffect } from "react";
import { neo } from "@castquest/neo-ux-core";
import {
  Menu,
  X,
  Home,
  Trophy,
  Image as ImageIcon,
  Upload,
  Wallet,
  TrendingUp,
  Activity,
  Users,
  CheckSquare,
  Settings,
  FileText,
  Shield,
  Book,
  Code,
  Boxes,
  Eye,
  Layers,
  Rocket,
  Search,
  Bell,
  User,
  LogOut,
} from "lucide-react";

// Role types
type Role = "User" | "Admin" | "Developer";

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

// Navigation items by role
const navigationByRole: Record<Role, NavItem[]> = {
  User: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Quests", href: "/quests", icon: Trophy },
    { name: "Frames Browser", href: "/frames", icon: Boxes },
    { name: "Media Upload", href: "/upload", icon: Upload },
    { name: "Wallet", href: "/wallet", icon: Wallet },
    { name: "Treasury Stats", href: "/treasury", icon: TrendingUp },
    { name: "AI Agent Status", href: "/ai-status", icon: Activity },
  ],
  Admin: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Quest/Frame Approval", href: "/admin/approval", icon: CheckSquare },
    { name: "Treasury Controls", href: "/admin/treasury", icon: TrendingUp },
    { name: "KYC/Compliance", href: "/admin/kyc", icon: Shield },
    { name: "System Logs", href: "/admin/logs", icon: FileText },
    { name: "RBAC Permissions", href: "/admin/rbac", icon: Settings },
    { name: "Audit Logs", href: "/admin/audit", icon: Eye },
  ],
  Developer: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "API Docs", href: "/dev/api-docs", icon: Book },
    { name: "SDK Exports", href: "/dev/sdk", icon: Code },
    { name: "Frames Builder", href: "/dev/frames-builder", icon: Boxes },
    { name: "Contract Viewer", href: "/dev/contracts", icon: FileText },
    { name: "Remix Templates", href: "/dev/templates", icon: Layers },
    { name: "Deployment Tools", href: "/dev/deploy", icon: Rocket },
  ],
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("User");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Detect role from query params or context
    const params = new URLSearchParams(window.location.search);
    const urlRole = params.get("role") as Role;
    if (urlRole && ["User", "Admin", "Developer"].includes(urlRole)) {
      setRole(urlRole);
    }
  }, []);

  const navigation = navigationByRole[role];

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className={`min-h-screen ${neo.colors.bg.primary} ${neo.colors.text.primary}`}>
      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${neo.colors.bg.secondary} border-b ${neo.colors.border.glow}`}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo and Menu Toggle */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`mr-4 p-2 rounded-lg ${neo.colors.bg.tertiary} hover:${neo.glow.active} transition-all`}
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <h1 className={`text-2xl font-bold ${neo.colors.text.accent} ${neo.glow.idle}`}>
                CastQuest Nexus
              </h1>
            </div>

            {/* Center: Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className={`relative w-full ${neo.glow.idle}`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className={`w-full pl-10 pr-4 py-2 ${neo.colors.bg.tertiary} border ${neo.colors.border.glow} rounded-lg focus:outline-none focus:${neo.glow.active} transition-all`}
                />
              </div>
            </div>

            {/* Right: Notifications, Wallet, Role Switcher */}
            <div className="flex items-center space-x-4">
              <button className={`p-2 rounded-lg ${neo.colors.bg.tertiary} hover:${neo.glow.active} transition-all relative`}>
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-emerald-500 rounded-full"></span>
              </button>
              
              <button className={`px-4 py-2 rounded-lg ${neo.colors.bg.tertiary} border ${neo.colors.border.glow} hover:${neo.glow.active} transition-all`}>
                <Wallet className="inline h-5 w-5 mr-2" />
                Connect
              </button>

              {/* Role Switcher (Admin only in production) */}
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className={`px-4 py-2 rounded-lg ${neo.colors.bg.tertiary} border ${neo.colors.border.glow} focus:outline-none hover:${neo.glow.active} transition-all`}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Developer">Developer</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-16 z-40 w-64 ${neo.colors.bg.secondary} border-r ${neo.colors.border.glow} transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 overflow-y-auto`}
      >
        <div className="p-4 space-y-2">
          <div className={`mb-4 pb-4 border-b ${neo.colors.border.default}`}>
            <h2 className={`text-sm font-semibold ${neo.colors.text.secondary} uppercase tracking-wider`}>
              {role} Navigation
            </h2>
          </div>
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg ${neo.colors.bg.tertiary} hover:${neo.glow.active} transition-all group`}
            >
              <item.icon className={`h-5 w-5 mr-3 ${neo.colors.text.accent}`} />
              <span className="text-sm font-medium">{item.name}</span>
            </a>
          ))}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className={`pt-16 pb-16 transition-all duration-300 lg:pl-64`}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Content with glowing cards */}
          <div className={`rounded-lg ${neo.colors.bg.secondary} border ${neo.colors.border.glow} p-6 ${neo.glow.idle}`}>
            {children}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 ${neo.colors.bg.secondary} border-t ${neo.colors.border.glow} lg:pl-64`}>
        <div className="flex items-center justify-around h-16 px-4">
          <a href="/" className={`flex flex-col items-center hover:${neo.glow.active} transition-all p-2 rounded`}>
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </a>
          <a href="/profile" className={`flex flex-col items-center hover:${neo.glow.active} transition-all p-2 rounded`}>
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </a>
          <a href="/settings" className={`flex flex-col items-center hover:${neo.glow.active} transition-all p-2 rounded`}>
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Settings</span>
          </a>
          <button className={`flex flex-col items-center hover:${neo.glow.error} transition-all p-2 rounded`}>
            <LogOut className="h-6 w-6" />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
