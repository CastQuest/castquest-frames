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
