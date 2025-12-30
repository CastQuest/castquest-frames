"use client";
import { useEffect, useState } from "react";
import { GlowCard } from "../components/GlowCard";

interface BrainEvent {
  timestamp: string;
  type: string;
  detail?: string;
}

export function BrainActivityGraph({ path }: { path: string }) {
  const [events, setEvents] = useState<BrainEvent[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(path);
        const json = await res.json();
        setEvents(json || []);
      } catch (e) {
        setEvents([]);
      }
    };

    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [path]);

  return (
    <GlowCard>
      <h3 className="text-sm font-semibold text-emerald-400 mb-2">Brain Activity</h3>
      <ul className="space-y-1 text-xs text-neutral-300 max-h-64 overflow-y-auto">
        {events.map((e, idx) => (
          <li key={idx} className="flex justify-between gap-2">
            <span className="text-neutral-500">{new Date(e.timestamp).toLocaleTimeString()}</span>
            <span className="font-medium">{e.type}</span>
            {e.detail && <span className="text-neutral-400 truncate">{e.detail}</span>}
          </li>
        ))}
      </ul>
    </GlowCard>
  );
}
