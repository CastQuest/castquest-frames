// apps/admin/app/quests/new/page.tsx
"use client";

import { useState } from "react";

export default function NewQuestPage() {
  const [title, setTitle] = useState("");
  const [xp, setXp] = useState(10);

  const createQuest = () => {
    console.log("Creating quest:", { title, xp });
    alert("Quest created (mock).");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Create New Quest</h1>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm mb-1">Quest Title</label>
          <input
            className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter quest title"
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

        <button
          onClick={createQuest}
          className="px-4 py-2 bg-green-600 text-white rounded text-sm"
        >
          Create Quest
        </button>
      </div>
    </div>
  );
}