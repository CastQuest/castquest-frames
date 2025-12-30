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

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [openModules, setOpenModules] = useState(true);
  const [openData, setOpenData] = useState(false);

  const NavItem = ({
    href,
    label,
    icon: Icon,
    description,
  }: {
    href: string;
    label: string;
    icon: any;
    description?: string;
  }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
          ${active ? "bg-emerald-600 text-white" : "text-neutral-300 hover:bg-neutral-800"}
        `}
      >
        <Icon size={18} />
        <div className="flex flex-col leading-tight">
          <span className="font-medium">{label}</span>
          {description && (
            <span className="text-xs text-neutral-400">{description}</span>
          )}
        </div>
      </Link>
    );
  };

  const SectionHeader = ({
    title,
    open,
    setOpen,
  }: {
    title: string;
    open: boolean;
    setOpen: (v: boolean) => void;
  }) => (
    <button
      onClick={() => setOpen(!open)}
      className="flex items-center justify-between w-full px-3 py-2 text-left text-neutral-400 hover:text-neutral-200"
    >
      <span className="text-xs font-semibold tracking-wide">{title}</span>
      {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span
      className={`px-2 py-0.5 text-[10px] rounded-full font-semibold uppercase tracking-wide ${color}`}
    >
      {label}
    </span>
  );

  return (
    <div className="flex h-screen bg-black text-neutral-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col">
        <div className="p-4 border-b border-neutral-800">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <LayoutDashboard size={20} />
            CastQuest Admin
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Sovereign Operator Console
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-2">

          {/* Core Navigation */}
          <div className="px-3">
            <NavItem
              href="/"
              label="Dashboard"
              icon={LayoutDashboard}
              description="Overview & system status"
            />
          </div>

          {/* Module Section */}
          <div>
            <SectionHeader
              title="MODULES"
              open={openModules}
              setOpen={setOpenModules}
            />
            {openModules && (
              <div className="space-y-1 pl-3">
                <NavItem
                  href="/media"
                  label="Media"
                  icon={ImageIcon}
                  description="Uploads & assets"
                />
                <div className="flex items-center gap-2 pl-3">
                  <Badge label="M6" color="bg-blue-700 text-white" />
                </div>

                <NavItem
                  href="/templates"
                  label="Templates"
                  icon={Layers}
                  description="Frame templates"
                />
                <div className="flex items-center gap-2 pl-3">
                  <Badge label="M6" color="bg-blue-700 text-white" />
                </div>

                <NavItem
                  href="/frames"
                  label="Frames"
                  icon={Boxes}
                  description="Generated frames"
                />
                <div className="flex items-center gap-2 pl-3">
                  <Badge label="M7B" color="bg-purple-700 text-white" />
                </div>

                <NavItem
                  href="/mints"
                  label="Mints"
                  icon={Workflow}
                  description="Mint actions & logs"
                />
                <div className="flex items-center gap-2 pl-3">
                  <Badge label="M7A" color="bg-purple-700 text-white" />
                </div>

                <NavItem
                  href="/quests"
                  label="Quests"
                  icon={FileJson}
                  description="Quest engine"
                />
                <div className="flex items-center gap-2 pl-3">
                  <Badge label="M5B" color="bg-amber-700 text-white" />
                </div>

                <NavItem
                  href="/worker"
                  label="Strategy Worker"
                  icon={Settings}
                  description="Automation engine"
                />
                <div className="flex items-center gap-2 pl-3">
                  <Badge label="M7C" color="bg-purple-700 text-white" />
                </div>

                <NavItem
                  href="/brain"
                  label="Brain"
                  icon={Brain}
                  description="Smart Brain runtime engine"
                />
                <div className="flex items-center gap-2 pl-3">
                  <Badge label="M8" color="bg-emerald-700 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Data Section */}
          <div>
            <SectionHeader
              title="DATA SURFACES"
              open={openData}
              setOpen={setOpenData}
            />
            {openData && (
              <div className="space-y-1 pl-3">
                <NavItem
                  href="/data/media"
                  label="media.json"
                  icon={FileJson}
                />
                <NavItem
                  href="/data/frames"
                  label="frames.json"
                  icon={FileJson}
                />
                <NavItem
                  href="/data/mints"
                  label="mints.json"
                  icon={FileJson}
                />
                <NavItem
                  href="/data/quests"
                  label="quests.json"
                  icon={FileJson}
                />
                <NavItem
                  href="/data/worker-events"
                  label="worker-events.json"
                  icon={FileJson}
                />
                <NavItem
                  href="/data/brain-events"
                  label="brain-events.json"
                  icon={FileJson}
                />
                <NavItem
                  href="/data/brain-suggestions"
                  label="brain-suggestions.json"
                  icon={FileJson}
                />
              </div>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-neutral-800 text-xs text-neutral-500">
          CastQuest Protocol • Operator Mode
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
