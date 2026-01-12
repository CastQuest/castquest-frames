"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Brain,
  Layers,
  Boxes,
  Workflow,
  ChevronDown,
  ChevronRight,
  FileJson,
  Settings,
  Users,
  Activity,
  Zap,
  BarChart3,
  Shield,
  Database,
} from "lucide-react";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [openFrames, setOpenFrames] = useState(true);
  const [openQuests, setOpenQuests] = useState(false);
  const [openMints, setOpenMints] = useState(false);
  const [openWorkers, setOpenWorkers] = useState(false);
  const [openBrain, setOpenBrain] = useState(false);
  const [openUsers, setOpenUsers] = useState(false);
  const [openSystem, setOpenSystem] = useState(false);

  const NavItem = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: any;
  }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all
          ${active ? "bg-primary text-black font-semibold shadow-glow-primary" : "text-neutral-300 hover:bg-neutral-800 hover:text-primary"}
        `}
      >
        <Icon size={16} />
        <span>{label}</span>
      </Link>
    );
  };

  const SectionHeader = ({
    title,
    open,
    setOpen,
    icon: Icon,
  }: {
    title: string;
    open: boolean;
    setOpen: (v: boolean) => void;
    icon: any;
  }) => (
    <button
      onClick={() => setOpen(!open)}
      className="flex items-center justify-between w-full px-3 py-2 text-left text-neutral-400 hover:text-primary transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon size={14} />
        <span className="text-xs font-semibold tracking-wide">{title}</span>
      </div>
      {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
    </button>
  );

  return (
    <div className="flex h-screen bg-black text-neutral-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-neutral-800">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <LayoutDashboard size={20} className="text-primary" />
            CastQuest Admin
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Neo-Glow Dashboard
          </p>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          {/* Dashboard Home */}
          <div className="px-3">
            <NavItem
              href="/dashboard"
              label="Dashboard"
              icon={LayoutDashboard}
            />
          </div>

          {/* Frames Section */}
          <div>
            <SectionHeader
              title="FRAMES"
              open={openFrames}
              setOpen={setOpenFrames}
              icon={Boxes}
            />
            {openFrames && (
              <div className="space-y-1 pl-3">
                <NavItem href="/dashboard/frames" label="All Frames" icon={Boxes} />
                <NavItem href="/frames/create" label="Create Frame" icon={Boxes} />
                <NavItem href="/frame-templates" label="Templates" icon={Layers} />
              </div>
            )}
          </div>

          {/* Quests Section */}
          <div>
            <SectionHeader
              title="QUESTS"
              open={openQuests}
              setOpen={setOpenQuests}
              icon={Workflow}
            />
            {openQuests && (
              <div className="space-y-1 pl-3">
                <NavItem href="/quests" label="Active Quests" icon={Workflow} />
                <NavItem href="/quests/history" label="Quest History" icon={FileJson} />
                <NavItem href="/quests/analytics" label="Analytics" icon={BarChart3} />
              </div>
            )}
          </div>

          {/* Mints Section */}
          <div>
            <SectionHeader
              title="MINTS"
              open={openMints}
              setOpen={setOpenMints}
              icon={Zap}
            />
            {openMints && (
              <div className="space-y-1 pl-3">
                <NavItem href="/mints" label="Recent Mints" icon={Zap} />
                <NavItem href="/mints/claims" label="Claim Management" icon={Shield} />
              </div>
            )}
          </div>

          {/* Workers Section */}
          <div>
            <SectionHeader
              title="WORKERS"
              open={openWorkers}
              setOpen={setOpenWorkers}
              icon={Settings}
            />
            {openWorkers && (
              <div className="space-y-1 pl-3">
                <NavItem href="/worker" label="Worker Status" icon={Activity} />
                <NavItem href="/workers/queue" label="Job Queue" icon={FileJson} />
                <NavItem href="/workers/metrics" label="Performance" icon={BarChart3} />
              </div>
            )}
          </div>

          {/* Brain Engine Section */}
          <div>
            <SectionHeader
              title="BRAIN ENGINE"
              open={openBrain}
              setOpen={setOpenBrain}
              icon={Brain}
            />
            {openBrain && (
              <div className="space-y-1 pl-3">
                <NavItem href="/brain" label="Events Log" icon={FileJson} />
                <NavItem href="/brain/suggestions" label="Suggestions" icon={Brain} />
                <NavItem href="/brain/insights" label="ML Insights" icon={BarChart3} />
              </div>
            )}
          </div>

          {/* Users & Access Section */}
          <div>
            <SectionHeader
              title="USERS & ACCESS"
              open={openUsers}
              setOpen={setOpenUsers}
              icon={Users}
            />
            {openUsers && (
              <div className="space-y-1 pl-3">
                <NavItem href="/users" label="User Management" icon={Users} />
                <NavItem href="/users/roles" label="Roles & Permissions" icon={Shield} />
                <NavItem href="/users/activity" label="Activity Logs" icon={Activity} />
              </div>
            )}
          </div>

          {/* System Section */}
          <div>
            <SectionHeader
              title="SYSTEM"
              open={openSystem}
              setOpen={setOpenSystem}
              icon={Database}
            />
            {openSystem && (
              <div className="space-y-1 pl-3">
                <NavItem href="/systems" label="Health Monitoring" icon={Activity} />
                <NavItem href="/system/config" label="Configuration" icon={Settings} />
                <NavItem href="/system/logs" label="Logs" icon={FileJson} />
              </div>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-neutral-800 text-xs text-neutral-500">
          CastQuest Protocol • v0.1.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
