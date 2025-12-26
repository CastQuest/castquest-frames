"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuestCreatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/quests/create", {
      method: "POST",
      body: JSON.stringify({ name, description }),
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    if (json.ok) {
      router.push(`/quests/${json.quest.id}`);
    } else {
      alert("Failed to create quest");
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Create Quest</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-300">Name</label>
          <input
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Quest name"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-300">Description</label>
          <textarea
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm min-h-[80px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this quest about?"
          />
        </div>
        <button
          type="submit"
          className="self-start px-3 py-1.5 bg-emerald-600 text-sm rounded text-white"
        >
          Create
        </button>
      </form>
    </div>
  );
}
