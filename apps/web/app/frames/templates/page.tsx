import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

type FrameTemplate = {
  id: string;
  name: string;
  description?: string;
};

function loadTemplates(): FrameTemplate[] {
  const p = path.join(process.cwd(), "data", "frame-templates.json");
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

export default function FrameTemplatesGalleryPage() {
  const templates = loadTemplates();

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-3">Frame Templates</h1>
      <p className="text-sm text-zinc-500 mb-4">
        Mock gallery of frame templates available in CastQuest.
      </p>

      {templates.length === 0 && (
        <p className="text-sm text-zinc-500">No templates yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {templates.map((t) => (
          <Link
            key={t.id}
            href={`/frames/templates/${t.id}`}
            className="border border-zinc-800 rounded px-3 py-2 hover:bg-zinc-900"
          >
            <div className="font-semibold text-sm">{t.name}</div>
            {t.description && (
              <div className="text-xs text-zinc-500 mt-1">
                {t.description}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
