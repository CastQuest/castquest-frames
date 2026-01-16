"use client";

import React from "react";
import { Sidebar } from "../ui/Sidebar";
import { Topbar } from "../ui/Topbar";

export function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cq-shell flex h-screen bg-slate-950 text-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
