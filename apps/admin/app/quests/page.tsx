// apps/admin/app/quests/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

type Quest = {
  id: string;
  title: string;
  status: "draft" | "live" | "archived";
};

export default function QuestsPage() {
  const [quests] = useState<Quest[]>([
    { id: "1", title: "Welcome Quest", status: "live" },
    { id: "2", title: "Daily Check-In", status: "draft" }
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Quest Manager</h1>

      <div className="mb-4">
        <Link
          href="/quests/new"
          className="inline-block px-3 py-2 bg-green-600 text-white rounded text-sm"
        >
          + New Quest
        </Link>
      </div>

      <div className="space-y-3">
        {quests.map((q) => (
          <Link
            key={q.id}
            href={`/quests/${q.id}`}
            className="block p-4 bg-zinc-900 border border-zinc-800 rounded hover:border-zinc-600"
          >
            <div className="font-medium">{q.title}</div>
            <div className="text-xs text-zinc-400 mt-1">Status: {q.status}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}