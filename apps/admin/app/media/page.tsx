import fs from "node:fs";
import path from "node:path";

export default function MediaListPage() {
  const dbPath = path.join(process.cwd(), "data", "media.json");
  const raw = fs.readFileSync(dbPath, "utf8");
  const items = JSON.parse(raw);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Uploaded Media</h1>

      {items.length === 0 && (
        <p className="text-zinc-400">No media uploaded yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {items.map((item: any) => (
          <a
            key={item.id}
            href={`/media/${item.id}`}
            className="p-4 border border-zinc-700 rounded hover:bg-zinc-900"
          >
            <div className="font-semibold">{item.name}</div>
            <div className="text-sm text-zinc-400">{item.description}</div>
            <div className="text-xs text-zinc-500 mt-1">
              {item.ticker} — {item.id}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
