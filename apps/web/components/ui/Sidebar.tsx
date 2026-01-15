"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "User Dashboard", icon: "📊" },
  { href: "/admin", label: "Admin Dashboard", icon: "⚙️" },
  { href: "/dev", label: "Dev Dashboard", icon: "🔧" },
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/frames", label: "Frames", icon: "🖼️" },
  { href: "/quests", label: "Quests", icon: "🎯" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="cq-sidebar w-64 border-r border-slate-800 fx-glass">
      <div className="px-4 py-6 text-xl font-bold gradient-text">
        CASTQUEST V3
      </div>
      <nav className="flex flex-col gap-1 px-2 pb-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group rounded-lg px-3 py-2.5 text-sm transition-all ${
                active
                  ? "neo-border bg-slate-900/50 text-slate-50"
                  : "text-slate-400 hover:bg-slate-900/30 hover:text-slate-50"
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
              {active && (
                <div className="mt-1 h-0.5 w-full bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
