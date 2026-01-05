"use client";

import { useEffect } from "react";

export default function DiscordRedirect() {
  useEffect(() => {
    // Replace with actual Discord invite link when available
    window.location.href = "https://discord.gg/castquest";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="text-6xl mb-4">💬</div>
        <p className="text-neutral-400">Redirecting to Discord...</p>
      </div>
    </div>
  );
}
