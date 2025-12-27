"use client";
import { useEffect, useState } from "react";
import { GlowCard } from "../components/GlowCard";

interface WorkerEvent {
  timestamp: string;
  type: string;
  jobId?: string;
}

export function WorkerTimeline({ path }: { path: string }) {
  const [events, setEvents] = useState<WorkerEvent[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(path);
        const json = await res.json();
        setEvents(json || []);
      } catch {
        setEvents([]);
      }
    };

    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [path]);

  return (
    <GlowCard>
      <h3 className="text-sm font-semibold text-purple-400 mb-2">Worker Timeline</h3>
      <ul className="space-y-1 text-xs text-neutral-300 max-h-64 overflow-y-auto">
        {events.map((e, idx) => (
          <li key={idx} className="flex justify-between gap-2">
            <span className="text-neutral-500">
              {new Date(e.timestamp).toLocaleTimeString()}
            </span>
            <span className="font-medium">{e.type}</span>
            {e.jobId && <span className="text-neutral-400 truncate">{e.jobId}</span>}
          </li>
        ))}
      </ul>
    </GlowCard>
  );
}
