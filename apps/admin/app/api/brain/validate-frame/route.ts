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
    type: "validate-frame",
  });
  fs.writeFileSync(file, JSON.stringify(existing, null, 2), "utf-8");
}

function validateFrameShape(frame: any): string[] {
  const errors: string[] = [];
  if (!frame || typeof frame !== "object") {
    errors.push("Frame must be an object.");
    return errors;
  }
  if (!frame.id || typeof frame.id !== "string") {
    errors.push("Frame.id must be a string.");
  }
  if (!frame.templateId || typeof frame.templateId !== "string") {
    errors.push("Frame.templateId must be a string.");
  }
  if (!frame.mediaId || typeof frame.mediaId !== "string") {
    errors.push("Frame.mediaId must be a string.");
  }
  if (!frame.layout || typeof frame.layout !== "object") {
    errors.push("Frame.layout must be an object.");
  } else {
    const l = frame.layout;
    if (!l.primaryText || typeof l.primaryText !== "string") {
      errors.push("layout.primaryText must be a string.");
    }
    if (!l.secondaryText || typeof l.secondaryText !== "string") {
      errors.push("layout.secondaryText must be a string.");
    }
    if (!l.cta || typeof l.cta !== "object") {
      errors.push("layout.cta must be an object.");
    } else {
      if (!l.cta.label || typeof l.cta.label !== "string") {
        errors.push("layout.cta.label must be a string.");
      }
      if (!l.cta.action || typeof l.cta.action !== "string") {
        errors.push("layout.cta.action must be a string.");
      }
    }
  }
  return errors;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { frame } = body || {};

    const errors = validateFrameShape(frame);
    appendBrainEvent({ frame, errors });

    if (errors.length > 0) {
      return NextResponse.json(
        {
          valid: false,
          errors,
          message: "Frame is invalid.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        valid: true,
        errors: [],
        message: "Frame is valid.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to validate frame." },
      { status: 500 }
    );
  }
}
