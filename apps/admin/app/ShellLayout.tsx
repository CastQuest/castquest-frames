"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  LayoutDashboard,
  Brain,
  ImageIcon,
  Layers,
  Boxes,
  Workflow,
  ChevronDown,
  ChevronRight,
  FileJson,
  Settings,
} from "lucide-react";

import modules from "./neo/modules.json";
import { neo } from "./neo/theme";
import { useWorkerStatus } from "./neo/useWorkerStatus";
import { useBrainActivity } from "./neo/useBrainActivity";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const worker = useWorkerStatus();
  const brainActive = useBrainActivity();

  const [openModules, setOpenModules] = useState(true);
  const [openData, setOpenData] = useState(false);

  const isActive = (href: string) => pathname === href;

  const Badge = ({ module }: { module: string }) => (
    <span className="px-2 py-0.5 text-[10px] rounded-full font-semibold uppercase tracking-wide bg-emerald-700 text-white">
      {modules[module] || "??"}
    </span>
  );

  const NavItem = ({ href, label, icon: Icon, module, description }: any) => (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
        isActive(href)
          ? `bg-emerald-600 text-white ${neo.glow.active}`
          : "text-neutral-300 hover:bg-neutral-800"
      }`}
    >
      <Icon size={18} className={isActive(href) ? neo.colors.primary : neo.colors.dim} />
      <div className="flex flex-col leading-tight">
        <span className="font-medium flex items-center gap-2">
          {label}
          {module && <Badge module={module} />}
        </span>
        {description && <span className="text-xs text-neutral-400">{description}</span>}
      </div>
    </Link>
  );

  const SectionHeader = ({ title, open, setOpen }: any) => (
    <button
      onClick={() => setOpen(!open)}
      className="flex items-center justify-between w-full px-3 py-2 text-left text-neutral-400 hover:text-neutral-200"
    >
      <span className="text-xs font-semibold tracking-wide">{title}</span>
      {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
    </button>
  );

  return (
    <div className="flex h-screen bg-black text-neutral-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col">

        {/* Header */}
        <div className="p-4 border-b border-neutral-800">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <LayoutDashboard size={20} className={neo.colors.primary} />
            CastQuest Admin
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Smart MEGA Brain NEO • Operator Console
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-2">

          {/* Dashboard */}
          <div className="px-3">
            <NavItem
              href="/"
              label="Dashboard"
              icon={LayoutDashboard}
              description="Overview & system status"
            />
          </div>

          {/* Modules */}
          <div>
            <SectionHeader title="MODULES" open={openModules} setOpen={setOpenModules} />
            {openModules && (
              <div className="space-y-1 pl-3">

                <NavItem href="/media" label="Media" icon={ImageIcon} module="media" />
                <NavItem href="/templates" label="Templates" icon={Layers} module="templates" />
                <NavItem href="/frames" label="Frames" icon={Boxes} module="frames" />
                <NavItem href="/mints" label="Mints" icon={Workflow} module="mints" />
                <NavItem href="/quests" label="Quests" icon={FileJson} module="quests" />
                <NavItem href="/worker" label="Worker" icon={Settings} module="worker" />
                <NavItem href="/brain" label="Brain" icon={Brain} module="brain" />

              </div>
            )}
          </div>

          {/* Data Surfaces */}
          <div>
            <SectionHeader title="DATA SURFACES" open={openData} setOpen={setOpenData} />
            {openData && (
              <div className="space-y-1 pl-3">
                <NavItem href="/data/media" label="media.json" icon={FileJson} />
                <NavItem href="/data/frames" label="frames.json" icon={FileJson} />
                <NavItem href="/data/mints" label="mints.json" icon={FileJson} />
                <NavItem href="/data/quests" label="quests.json" icon={FileJson} />
                <NavItem href="/data/worker-events" label="worker-events.json" icon={FileJson} />
                <NavItem href="/data/brain-events" label="brain-events.json" icon={FileJson} />
                <NavItem href="/data/brain-suggestions" label="brain-suggestions.json" icon={FileJson} />
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 text-xs text-neutral-500 space-y-2">

          {/* Worker Status */}
          <div className="flex items-center gap-2">
            Worker:
            {worker === "running" && <span className="text-emerald-400">● Running</span>}
            {worker === "idle" && <span className="text-neutral-400">● Idle</span>}
            {worker === "error" && <span className="text-red-500">● Error</span>}
          </div>

          {/* Brain Activity */}
          <div className="flex items-center gap-2">
            Brain:
            {brainActive ? (
              <span className="text-emerald-400">● Active</span>
            ) : (
              <span className="text-neutral-400">● Idle</span>
            )}
          </div>

          <div>CastQuest Protocol • Operator Mode</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
