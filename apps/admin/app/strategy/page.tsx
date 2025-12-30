"use client";

import { useEffect, useState } from "react";

type LogEntry = {
  id: string;
  level: string;
  message: string;
  time: string;
};

export default function StrategyDashboardPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/strategy/logs");
        const json = await res.json();
        setLogs(json.logs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Strategy Dashboard</h1>
        <span className="text-xs text-zinc-500">
          Auto-refreshing every 5s
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">Worker</div>
          <div className="text-lg font-semibold text-green-400">Online (mock)</div>
        </div>

        <div className="p-4 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">Last Run</div>
          <div className="text-lg font-semibold">
            {logs[0]?.time || "—"}
          </div>
        </div>

        <div className="p-4 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">Total Events</div>
          <div className="text-lg font-semibold">{logs.length}</div>
        </div>
      </div>

      <div className="border border-zinc-700 rounded overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700 bg-zinc-900/50">
          <div className="text-sm font-semibold">Recent Events</div>
        </div>

        <div className="max-h-[400px] overflow-auto text-sm">
          {loading && (
            <div className="p-4 text-zinc-500">Loading logs…</div>
          )}
          {!loading && logs.length === 0 && (
            <div className="p-4 text-zinc-500">No logs yet.</div>
          )}
          {logs.map((log) => (
            <div
              key={log.id}
              className="px-4 py-2 border-b border-zinc-800 flex items-start gap-3"
            >
              <span
                className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                  log.level === "error"
                    ? "bg-red-900/40 text-red-300"
                    : log.level === "warn"
                    ? "bg-yellow-900/40 text-yellow-200"
                    : "bg-emerald-900/40 text-emerald-200"
                }`}
              >
                {log.level}
              </span>
              <div className="flex-1">
                <div className="text-xs text-zinc-500">{log.time}</div>
                <div>{log.message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
