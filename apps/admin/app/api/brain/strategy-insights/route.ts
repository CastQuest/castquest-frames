import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");

function appendSuggestion(suggestion: any) {
  const file = path.join(DATA_DIR, "brain-suggestions.json");
  let existing: any[] = [];
  try {
    existing = JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    existing = [];
  }
  existing.push({
    ...suggestion,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  });
  fs.writeFileSync(file, JSON.stringify(existing, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateId, mediaId } = body || {};

    const insightsLines: string[] = [];
    insightsLines.push(`Smart Brain Strategy Insights`);
    insightsLines.push(`- templateId: ${templateId || "n/a"}`);
    insightsLines.push(`- mediaId: ${mediaId || "n/a"}`);
    insightsLines.push("");
    insightsLines.push(`Suggested actions:`);
    insightsLines.push(`- Generate a welcome-back frame if user has active quests.`);
    insightsLines.push(`- Attach mint to the most recently active quest.`);
    insightsLines.push(`- Render a new frame variant with stronger CTA if engagement is low.`);
    insightsLines.push(`- Trigger worker scan to refresh quest progress.`);

    const insights = insightsLines.join("\n");

    appendSuggestion({
      templateId,
      mediaId,
      insights,
    });

    return NextResponse.json(
      {
        insights,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to generate insights." },
      { status: 500 }
    );
  }
}