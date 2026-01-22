import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

export default async function MediaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dbPath = path.join(process.cwd(), "data", "media.json");
  const raw = fs.readFileSync(dbPath, "utf8");
  const items = JSON.parse(raw);

  const item = items.find((i: any) => i.id === id);

  if (!item) {
    return <div>Media not found.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">{item.name}</h1>

      <div style={{ position: "relative", width: "300px", marginBottom: "1rem" }}>
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={300}
          height={300}
          style={{ borderRadius: "8px", objectFit: "contain" }}
          unoptimized
        />
      </div>

      <p className="text-zinc-300 mb-2">{item.description}</p>
      <p className="text-zinc-500 mb-4">Ticker: {item.ticker}</p>

      <div className="flex gap-4 mt-6">
        <form action="/api/admin/convert/frame" method="POST">
          <input type="hidden" name="id" value={id} />
          <button className="px-4 py-2 bg-blue-600 rounded text-white">
            Convert to Frame
          </button>
        </form>

        <form action="/api/admin/convert/mint" method="POST">
          <input type="hidden" name="id" value={id} />
          <button className="px-4 py-2 bg-green-600 rounded text-white">
            Convert to Mint
          </button>
        </form>

        <form action="/api/admin/convert/quest" method="POST">
          <input type="hidden" name="id" value={id} />
          <button className="px-4 py-2 bg-purple-600 rounded text-white">
            Convert to Quest
          </button>
        </form>
      </div>
    </div>
  );
}
