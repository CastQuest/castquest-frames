#!/usr/bin/env bash
set -euo pipefail

echo "[UPLOAD→FRAME→MINT MODULE] Starting…"

# ----------------------------------------
# 1. Ensure data folder + media.json
# ----------------------------------------
mkdir -p data

if [ ! -f data/media.json ]; then
  echo "[SAFE] Creating data/media.json"
  cat > data/media.json << 'EOF'
[]
EOF
else
  echo "[SAFE] data/media.json exists — skipping"
fi

# ----------------------------------------
# 2. Create API route: /api/media
# ----------------------------------------
mkdir -p apps/web/app/api/media

if [ ! -f apps/web/app/api/media/route.ts ]; then
  echo "[SAFE] Creating apps/web/app/api/media/route.ts"
  cat > apps/web/app/api/media/route.ts << 'EOF'
import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "data", "media.json");

export async function POST(req: Request) {
  const body = await req.json();

  const dbRaw = fs.readFileSync(DB_PATH, "utf8");
  const db = JSON.parse(dbRaw);

  const item = {
    id: Date.now().toString(),
    name: body.name,
    description: body.description,
    ticker: body.ticker,
    imageUrl: body.imageUrl,
    createdAt: new Date().toISOString()
  };

  db.push(item);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

  return NextResponse.json({ ok: true, item });
}

export async function GET() {
  const dbRaw = fs.readFileSync(DB_PATH, "utf8");
  const db = JSON.parse(dbRaw);
  return NextResponse.json(db);
}
EOF
else
  echo "[SAFE] apps/web/app/api/media/route.ts exists — skipping"
fi

# ----------------------------------------
# 3. Create Upload Page: /upload
# ----------------------------------------
mkdir -p apps/web/app/upload

if [ ! -f apps/web/app/upload/page.tsx ]; then
  echo "[SAFE] Creating apps/web/app/upload/page.tsx"
  cat > apps/web/app/upload/page.tsx << 'EOF'
"use client";

import { useState } from "react";

export default function UploadPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ticker, setTicker] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const submit = async () => {
    await fetch("/api/media", {
      method: "POST",
      body: JSON.stringify({ name, description, ticker, imageUrl })
    });

    alert("Uploaded!");
    setName("");
    setDescription("");
    setTicker("");
    setImageUrl("");
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "600px" }}>
      <h1>Upload Media</h1>

      <div style={{ marginTop: "1rem" }}>
        <label>Name</label>
        <input
          style={{ width: "100%", padding: "8px" }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Description</label>
        <textarea
          style={{ width: "100%", padding: "8px" }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Ticker</label>
        <input
          style={{ width: "100%", padding: "8px" }}
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Image URL</label>
        <input
          style={{ width: "100%", padding: "8px" }}
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <button
        onClick={submit}
        style={{
          marginTop: "1.5rem",
          padding: "10px 20px",
          background: "#2563eb",
          color: "white",
          borderRadius: "6px"
        }}
      >
        Upload
      </button>
    </main>
  );
}
EOF
else
  echo "[SAFE] apps/web/app/upload/page.tsx exists — skipping"
fi

echo "[UPLOAD→FRAME→MINT MODULE] Complete."
