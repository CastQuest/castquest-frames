"use client";
import { useEffect, useState } from "react";

export function useWorkerStatus() {
  const [status, setStatus] = useState<"idle" | "running" | "error">("idle");

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/data/worker-events");
      const events = await res.json();
      const last = events[events.length - 1];

      if (!last) return;

      if (last.type === "run-start") setStatus("running");
      else if (last.type === "run-end") setStatus("idle");
      else if (last.type === "error") setStatus("error");
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return status;
}
