"use client";
import { useEffect, useState } from "react";
import { GlowCard } from "../components/GlowCard";

export function DataSurface({ path }: { path: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(path);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setData({ error: "Failed to load data surface", path });
      }
    };

    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [path]);

  return (
    <GlowCard>
      <pre className="text-xs text-neutral-300 whitespace-pre-wrap">
        {JSON.stringify(data, null, 2)}
      </pre>
    </GlowCard>
  );
}
