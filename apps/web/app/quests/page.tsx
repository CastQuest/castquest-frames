import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

type Quest = {
  id: string;
  name: string;
  description?: string;
};

export default function QuestsPage() {
  const questsPath = path.join(process.cwd(), "data", "quests.json");
  const raw = fs.readFileSync(questsPath, "utf8");
  const quests: Quest[] = JSON.parse(raw);

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-3">Quests</h1>
      <p className="text-sm text-zinc-500 mb-4">
        Discover quests powered by CastQuest. (Mock viewer)
      </p>

      {quests.length === 0 && (
        <p className="text-sm text-zinc-500">No quests yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {quests.map((q) => (
          <Link
            key={q.id}
            href={`/quests/${q.id}`}
            className="border border-zinc-800 rounded px-3 py-2 hover:bg-zinc-900"
          >
            <div className="font-semibold text-sm">{q.name}</div>
            {q.description && (
              <div className="text-xs text-zinc-500 mt-1">
                {q.description}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
