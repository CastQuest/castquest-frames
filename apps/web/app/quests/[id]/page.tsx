import fs from "node:fs";
import path from "node:path";

type Quest = {
  id: string;
  name: string;
  description?: string;
};

type Step = {
  id: string;
  questId: string;
  title: string;
  description?: string;
  type: string;
};

function loadJson(file: string) {
  const p = path.join(process.cwd(), "data", file);
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

export default function QuestDetailPage({ params }: { params: { id: string } }) {
  const quests: Quest[] = loadJson("quests.json");
  const steps: Step[] = loadJson("quest-steps.json");

  const quest = quests.find((q) => q.id === params.id);
  const questSteps = steps.filter((s) => s.questId === params.id);

  if (!quest) {
    return (
      <div className="px-4 py-4 max-w-xl mx-auto text-sm text-red-400">
        Quest not found.
      </div>
    );
  }

  return (
    <div className="px-4 py-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">{quest.name}</h1>
      {quest.description && (
        <p className="text-sm text-zinc-400 mb-3">{quest.description}</p>
      )}
      <p className="text-xs text-zinc-500 mb-4">
        This is a mock quest viewer. Real user progress would connect to auth.
      </p>

      <div className="flex flex-col gap-2">
        {questSteps.length === 0 && (
          <div className="text-sm text-zinc-500">No steps yet.</div>
        )}
        {questSteps.map((s) => (
          <div
            key={s.id}
            className="border border-zinc-800 rounded px-3 py-2 text-sm flex flex-col gap-1"
          >
            <div className="font-semibold text-xs">{s.title}</div>
            {s.description && (
              <div className="text-[11px] text-zinc-500">
                {s.description}
              </div>
            )}
            <div className="text-[10px] text-zinc-600">
              type: {s.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
