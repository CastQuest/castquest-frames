import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

type FrameTemplate = {
  id: string;
  name: string;
  description?: string;
  baseMediaId?: string;
  createdAt?: string;
};

function loadTemplates(): FrameTemplate[] {
  const p = path.join(process.cwd(), "data", "frame-templates.json");
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

export default function FrameTemplatesAdminPage() {
  const templates = loadTemplates();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Frame Templates</h1>
        <Link
          href="/frame-templates/create"
          className="px-3 py-1.5 text-sm rounded bg-emerald-600 text-white"
        >
          New Template
        </Link>
      </div>

      {templates.length === 0 && (
        <p className="text-sm text-zinc-500">No templates yet. Create one.</p>
      )}

      <div className="flex flex-col gap-2">
        {templates.map((t) => (
          <Link
            key={t.id}
            href={`/frame-templates/${t.id}`}
            className="border border-zinc-700 rounded px-3 py-2 hover:bg-zinc-900"
          >
            <div className="font-semibold text-sm">{t.name}</div>
            {t.description && (
              <div className="text-xs text-zinc-500">{t.description}</div>
            )}
            <div className="text-[10px] text-zinc-600 mt-1">{t.id}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
