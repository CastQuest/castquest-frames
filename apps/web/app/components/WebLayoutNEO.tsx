"use client";
import { neo } from "../neo/theme";

export default function WebLayoutNEO({ children }) {
  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <header className="p-4 border-b border-neutral-800">
        <h1 className="text-lg font-semibold text-emerald-400">
          CastQuest Web • NEO GLOW
        </h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
