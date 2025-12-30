// apps/admin/app/quests/[id]/page.tsx
"use client";

import { useState } from "react";

type Status = "draft" | "live" | "archived";

export default function QuestDetailPage({ params }: { params: { id: string } }) {
  const questId = params.id;

  const [title, setTitle] = useState("Sample Quest");
  const [xp, setXp] = useState(10);
  const [status, setStatus] = useState<Status>("draft");

  const saveQuest = () => {
    console.log("Saving quest:", { questId, title, xp, status });
    alert("Quest saved (mock).");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Quest #{questId}</h1>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm mb-1">Quest Title</label>
          <input
            className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">XP Reward</label>
          <input
            type="number"
            className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded text-sm"
            value={xp}
            onChange={(e) => setXp(Number(e.target.value) || 0)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Status</label>
          <select
            className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option value="draft">Draft</option>
            <option value="live">Live</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <button
          onClick={saveQuest}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
        >
          Save Quest
        </button>
      </div>
    </div>
  );
}