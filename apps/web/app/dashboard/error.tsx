"use client";

import { neo } from "@castquest/neo-ux-core";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className={`max-w-md p-8 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} text-center`}>
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-2`}>
          Something went wrong!
        </h2>
        <p className={`${neo.colors.text.secondary} mb-6`}>
          {error.message || "An unexpected error occurred in the dashboard."}
        </p>
        <button
          onClick={reset}
          className={`px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all`}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
