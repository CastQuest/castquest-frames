"use client";

import { useEffect } from "react";

export default function GitHubRedirect() {
  useEffect(() => {
    window.location.href = "https://github.com/CastQuest/castquest-frames";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="text-6xl mb-4">🚀</div>
        <p className="text-neutral-400">Redirecting to GitHub...</p>
      </div>
    </div>
  );
}
