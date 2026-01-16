"use client";

import React from "react";

export function Topbar() {
  return (
    <header className="cq-topbar border-b border-slate-800 fx-glass px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Dashboard</h1>
          <p className="text-xs text-slate-500">V3 Autonomous Creative Economy</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm rounded-lg border border-slate-700 text-slate-300 hover:border-emerald-500/30 hover:text-emerald-400 transition-all">
            Connect Wallet
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-xs font-bold text-slate-900">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
