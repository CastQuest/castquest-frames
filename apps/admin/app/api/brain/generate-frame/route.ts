import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");

function appendBrainEvent(event: any) {
  const file = path.join(DATA_DIR, "brain-events.json");
  let existing: any[] = [];
  try {
    existing = JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    existing = [];
  }
  existing.push({
    ...event,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    type: "generate-frame",
  });
  fs.writeFileSync(file, JSON.stringify(existing, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateId, mediaId, hint } = body || {};

    if (!templateId || !mediaId) {
      return NextResponse.json(
        { error: "templateId and mediaId are required." },
        { status: 400 }
      );
    }

    const frameId = `brain_${crypto.randomUUID()}`;

    const frame = {
      id: frameId,
      templateId,
      mediaId,
      layout: {
        primaryText: hint?.primaryText || "Welcome Back",
        secondaryText:
          hint?.secondaryText ||
          (typeof hint === "string"
            ? hint
            : "Continue your quest and claim rewards."),
        cta: {
          label: "Resume",
          action: "resume_quest",
        },
      },
    };

    appendBrainEvent({
      frame,
      templateId,
      mediaId,
      hint: typeof hint === "string" ? hint : null,
    });

    return NextResponse.json({ frame }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to generate frame." },
      { status: 500 }
    );
  }
}