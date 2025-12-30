"use client";
import { useEffect, useState } from "react";

export function useBrainActivity() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/data/brain-events");
      const events = await res.json();
      const last = events[events.length - 1];
      if (!last) return;

      const ts = new Date(last.timestamp).getTime();
      const now = Date.now();

      setActive(now - ts < 5000);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return active;
}
