#!/usr/bin/env bash
set -euo pipefail

echo "[MODULE 6 — FRAME TEMPLATE ENGINE MEGA] Starting…"

ADMIN_APP_DIR="apps/admin/app"
WEB_APP_DIR="apps/web/app"

mkdir -p data

# ----------------------------------------
# 1. JSON DB for frame templates
# ----------------------------------------
echo "[TEMPLATES] Ensuring JSON DB file…"

if [ ! -f data/frame-templates.json ]; then
  echo "[TEMPLATES] Creating data/frame-templates.json"
  cat > data/frame-templates.json << 'JSON'
[]
JSON
else
  echo "[TEMPLATES][SKIP] data/frame-templates.json exists"
fi

# ----------------------------------------
# 2. ADMIN — FRAME TEMPLATE PAGES
# ----------------------------------------
echo "[ADMIN] Creating frame template admin pages…"

mkdir -p "$ADMIN_APP_DIR/frame-templates"
mkdir -p "$ADMIN_APP_DIR/frame-templates/create"
mkdir -p "$ADMIN_APP_DIR/frame-templates/[id]"

# /frame-templates (list)
if [ ! -f "$ADMIN_APP_DIR/frame-templates/page.tsx" ]; then
  cat > "$ADMIN_APP_DIR/frame-templates/page.tsx" << 'EOF_TSX'
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
EOF_TSX
  echo "[ADMIN] Created: $ADMIN_APP_DIR/frame-templates/page.tsx"
else
  echo "[ADMIN][SKIP] $ADMIN_APP_DIR/frame-templates/page.tsx"
fi

# /frame-templates/create
if [ ! -f "$ADMIN_APP_DIR/frame-templates/create/page.tsx" ]; then
  cat > "$ADMIN_APP_DIR/frame-templates/create/page.tsx" << 'EOF_TSX'
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FrameTemplateCreatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [baseMediaId, setBaseMediaId] = useState("");
  const [primaryText, setPrimaryText] = useState("");
  const [secondaryText, setSecondaryText] = useState("");
  const [ctaLabel, setCtaLabel] = useState("Mint");
  const [ctaAction, setCtaAction] = useState("mint");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/frame-templates/create", {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        baseMediaId,
        layout: {
          primaryText,
          secondaryText,
          cta: {
            label: ctaLabel,
            action: ctaAction
          }
        }
      }),
      headers: { "Content-Type": "application/json" }
    });
    const json = await res.json();
    if (json.ok) {
      router.push(`/frame-templates/${json.template.id}`);
    } else {
      alert("Failed to create template");
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Create Frame Template</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-300">Name</label>
          <input
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Template name"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-300">Description</label>
          <textarea
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm min-h-[60px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this template's purpose"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-300">Base Media ID (optional)</label>
          <input
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
            value={baseMediaId}
            onChange={(e) => setBaseMediaId(e.target.value)}
            placeholder="Link to a media item ID"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-300">Primary Text</label>
            <input
              className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
              value={primaryText}
              onChange={(e) => setPrimaryText(e.target.value)}
              placeholder="Big title text"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-300">Secondary Text</label>
            <input
              className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
              value={secondaryText}
              onChange={(e) => setSecondaryText(e.target.value)}
              placeholder="Smaller supporting text"
            />
          </div>
        </div>

        <div className="border border-zinc-700 rounded p-3 flex flex-col gap-2">
          <div className="text-xs text-zinc-400 uppercase">
            Default CTA
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-300">Label</label>
            <input
              className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              placeholder="Mint, Join, Claim, etc."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-300">Action Key</label>
            <input
              className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
              value={ctaAction}
              onChange={(e) => setCtaAction(e.target.value)}
              placeholder="mint, join_quest, view, etc."
            />
          </div>
        </div>

        <button
          type="submit"
          className="self-start px-3 py-1.5 bg-emerald-600 text-sm rounded text-white"
        >
          Create Template
        </button>
      </form>
    </div>
  );
}
EOF_TSX
  echo "[ADMIN] Created: $ADMIN_APP_DIR/frame-templates/create/page.tsx"
else
  echo "[ADMIN][SKIP] $ADMIN_APP_DIR/frame-templates/create/page.tsx"
fi

# /frame-templates/[id]
if [ ! -f "$ADMIN_APP_DIR/frame-templates/[id]/page.tsx" ]; then
  cat > "$ADMIN_APP_DIR/frame-templates/[id]/page.tsx" << 'EOF_TSX'
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

type CTAConfig = {
  label: string;
  action: string;
};

type LayoutConfig = {
  primaryText?: string;
  secondaryText?: string;
  cta?: CTAConfig;
};

type FrameTemplate = {
  id: string;
  name: string;
  description?: string;
  baseMediaId?: string;
  layout?: LayoutConfig;
  createdAt?: string;
};

function loadTemplates(): FrameTemplate[] {
  const p = path.join(process.cwd(), "data", "frame-templates.json");
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

export default function FrameTemplateDetailPage({ params }: { params: { id: string } }) {
  const templates = loadTemplates();
  const template = templates.find((t) => t.id === params.id);

  if (!template) {
    return (
      <div className="text-sm text-red-400">
        Template not found.
      </div>
    );
  }

  const layout = template.layout || {};
  const cta = layout.cta || { label: "", action: "" };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="text-xs text-zinc-500 mb-1">
          <Link href="/frame-templates" className="hover:underline">
            ← Back to templates
          </Link>
        </div>
        <h1 className="text-2xl font-semibold">{template.name}</h1>
        {template.description && (
          <p className="text-sm text-zinc-400 mt-1">
            {template.description}
          </p>
        )}
        {template.createdAt && (
          <p className="text-xs text-zinc-500 mt-1">
            Created at: {template.createdAt}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-3 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">Base Media</div>
          <div className="text-sm font-mono mt-1">
            {template.baseMediaId || "—"}
          </div>
        </div>
        <div className="p-3 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">Primary Text</div>
          <div className="text-sm mt-1">
            {layout.primaryText || "—"}
          </div>
        </div>
        <div className="p-3 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">CTA</div>
          <div className="text-sm mt-1">
            {cta.label || "—"}{" "}
            <span className="text-xs text-zinc-500">
              {cta.action ? `(${cta.action})` : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="border border-zinc-700 rounded overflow-hidden">
        <div className="px-3 py-2 border-b border-zinc-700 text-sm font-semibold">
          Mock Preview
        </div>
        <div className="p-4 bg-zinc-950 flex flex-col gap-2 text-sm">
          <div className="aspect-video w-full max-w-sm border border-zinc-800 rounded bg-zinc-900 flex items-center justify-center text-xs text-zinc-500">
            {template.baseMediaId
              ? `Media: ${template.baseMediaId}`
              : "No media linked"}
          </div>
          <div className="mt-2">
            <div className="text-sm font-semibold">
              {layout.primaryText || "Primary text"}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {layout.secondaryText || "Secondary supporting text"}
            </div>
          </div>
          <div className="mt-3">
            <button
              className="px-3 py-1.5 rounded bg-emerald-600 text-xs font-semibold"
              type="button"
            >
              {cta.label || "CTA"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="text-zinc-500">
          Use API <code>/api/frame-templates/apply</code> to generate frames from this template.
        </span>
      </div>
    </div>
  );
}
EOF_TSX
  echo "[ADMIN] Created: $ADMIN_APP_DIR/frame-templates/[id]/page.tsx"
else
  echo "[ADMIN][SKIP] $ADMIN_APP_DIR/frame-templates/[id]/page.tsx"
fi

# ----------------------------------------
# 3. ADMIN API — FRAME TEMPLATES
# ----------------------------------------
echo "[API] Creating frame template API routes…"

mkdir -p "$ADMIN_APP_DIR/api/frame-templates"
mkdir -p "$ADMIN_APP_DIR/api/frame-templates/create"
mkdir -p "$ADMIN_APP_DIR/api/frame-templates/update"
mkdir -p "$ADMIN_APP_DIR/api/frame-templates/delete"
mkdir -p "$ADMIN_APP_DIR/api/frame-templates/apply"

# shared fs utils for templates
mkdir -p "$ADMIN_APP_DIR/api/frame-templates/utils"
if [ ! -f "$ADMIN_APP_DIR/api/frame-templates/utils/fs-frame-templates.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/frame-templates/utils/fs-frame-templates.ts" << 'EOF_TS'
import fs from "node:fs";
import path from "node:path";

function readJson<T>(file: string): T {
  const p = path.join(process.cwd(), "data", file);
  if (!fs.existsSync(p)) return JSON.parse("[]");
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

function writeJson(file: string, data: any) {
  const p = path.join(process.cwd(), "data", file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

export function loadFrameTemplates() {
  return readJson<any[]>("frame-templates.json");
}

export function saveFrameTemplates(templates: any[]) {
  writeJson("frame-templates.json", templates);
}

export function loadFrames() {
  return readJson<any[]>("frames.json");
}

export function saveFrames(frames: any[]) {
  writeJson("frames.json", frames);
}
EOF_TS
  echo "[API] Created: fs-frame-templates.ts"
else
  echo "[API][SKIP] fs-frame-templates.ts"
fi

# /api/frame-templates/create
if [ ! -f "$ADMIN_APP_DIR/api/frame-templates/create/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/frame-templates/create/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";
import { loadFrameTemplates, saveFrameTemplates } from "../utils/fs-frame-templates";

export async function POST(req: Request) {
  const body = await req.json();
  const templates = loadFrameTemplates();

  const id = "tmpl_" + Date.now().toString();

  const template = {
    id,
    name: body.name,
    description: body.description || "",
    baseMediaId: body.baseMediaId || null,
    layout: body.layout || {},
    createdAt: new Date().toISOString()
  };

  templates.push(template);
  saveFrameTemplates(templates);

  return NextResponse.json({ ok: true, template });
}
EOF_TS
  echo "[API] Created: /api/frame-templates/create"
else
  echo "[API][SKIP] /api/frame-templates/create"
fi

# /api/frame-templates/update
if [ ! -f "$ADMIN_APP_DIR/api/frame-templates/update/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/frame-templates/update/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";
import { loadFrameTemplates, saveFrameTemplates } from "../utils/fs-frame-templates";

export async function POST(req: Request) {
  const body = await req.json();
  const { id, patch } = body;

  const templates = loadFrameTemplates();
  const idx = templates.findIndex((t: any) => t.id === id);

  if (idx === -1) {
    return NextResponse.json({ ok: false, error: "Template not found" }, { status: 404 });
  }

  templates[idx] = {
    ...templates[idx],
    ...patch,
    layout: {
      ...(templates[idx].layout || {}),
      ...(patch.layout || {})
    }
  };

  saveFrameTemplates(templates);

  return NextResponse.json({ ok: true, template: templates[idx] });
}
EOF_TS
  echo "[API] Created: /api/frame-templates/update"
else
  echo "[API][SKIP] /api/frame-templates/update"
fi

# /api/frame-templates/delete
if [ ! -f "$ADMIN_APP_DIR/api/frame-templates/delete/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/frame-templates/delete/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";
import { loadFrameTemplates, saveFrameTemplates } from "../utils/fs-frame-templates";

export async function POST(req: Request) {
  const body = await req.json();
  const { id } = body;

  const templates = loadFrameTemplates();
  const filtered = templates.filter((t: any) => t.id !== id);

  if (filtered.length === templates.length) {
    return NextResponse.json({ ok: false, error: "Template not found" }, { status: 404 });
  }

  saveFrameTemplates(filtered);
  return NextResponse.json({ ok: true });
}
EOF_TS
  echo "[API] Created: /api/frame-templates/delete"
else
  echo "[API][SKIP] /api/frame-templates/delete"
fi

# /api/frame-templates/apply
if [ ! -f "$ADMIN_APP_DIR/api/frame-templates/apply/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/frame-templates/apply/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";
import {
  loadFrameTemplates,
  loadFrames,
  saveFrames
} from "../utils/fs-frame-templates";

export async function POST(req: Request) {
  const body = await req.json();
  const { templateId, mediaId, overrides } = body;

  const templates = loadFrameTemplates();
  const frames = loadFrames();

  const template = templates.find((t: any) => t.id === templateId);

  if (!template) {
    return NextResponse.json({ ok: false, error: "Template not found" }, { status: 404 });
  }

  const id = "frame_" + Date.now().toString();

  const frame = {
    id,
    templateId: template.id,
    mediaId: mediaId || template.baseMediaId || null,
    layout: {
      ...(template.layout || {}),
      ...(overrides || {}),
      cta: {
        ...(template.layout?.cta || {}),
        ...(overrides?.cta || {})
      }
    },
    createdAt: new Date().toISOString()
  };

  frames.push(frame);
  saveFrames(frames);

  return NextResponse.json({ ok: true, frame });
}
EOF_TS
  echo "[API] Created: /api/frame-templates/apply"
else
  echo "[API][SKIP] /api/frame-templates/apply"
fi

# ----------------------------------------
# 4. WEB — FRAME TEMPLATE VIEWER
# ----------------------------------------
echo "[WEB] Creating frame template web viewer pages…"

mkdir -p "$WEB_APP_DIR/frames/templates"
mkdir -p "$WEB_APP_DIR/frames/templates/[id]"

# /frames/templates
if [ ! -f "$WEB_APP_DIR/frames/templates/page.tsx" ]; then
  cat > "$WEB_APP_DIR/frames/templates/page.tsx" << 'EOF_TSX'
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
EOF_TSX
  echo "[WEB] Created: $WEB_APP_DIR/frames/templates/page.tsx"
else
  echo "[WEB][SKIP] $WEB_APP_DIR/frames/templates/page.tsx"
fi

# /frames/templates/[id]
if [ ! -f "$WEB_APP_DIR/frames/templates/[id]/page.tsx" ]; then
  cat > "$WEB_APP_DIR/frames/templates/[id]/page.tsx" << 'EOF_TSX'
import fs from "node:fs";
import path from "node:path";

type CTAConfig = {
  label: string;
  action: string;
};

type LayoutConfig = {
  primaryText?: string;
  secondaryText?: string;
  cta?: CTAConfig;
};

type FrameTemplate = {
  id: string;
  name: string;
  description?: string;
  baseMediaId?: string;
  layout?: LayoutConfig;
};

function loadTemplates(): FrameTemplate[] {
  const p = path.join(process.cwd(), "data", "frame-templates.json");
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

export default function FrameTemplatePublicDetailPage({
  params
}: {
  params: { id: string };
}) {
  const templates = loadTemplates();
  const template = templates.find((t) => t.id === params.id);

  if (!template) {
    return (
      <div className="px-4 py-4 max-w-xl mx-auto text-sm text-red-400">
        Template not found.
      </div>
    );
  }

  const layout = template.layout || {};
  const cta = layout.cta || { label: "", action: "" };

  return (
    <div className="px-4 py-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">{template.name}</h1>
      {template.description && (
        <p className="text-sm text-zinc-400 mb-3">{template.description}</p>
      )}

      <div className="border border-zinc-800 rounded p-4 bg-zinc-950 flex flex-col gap-3 text-sm">
        <div className="aspect-video w-full border border-zinc-800 rounded bg-zinc-900 flex items-center justify-center text-xs text-zinc-500">
          {template.baseMediaId
            ? `Media: ${template.baseMediaId}`
            : "No media linked"}
        </div>
        <div>
          <div className="text-sm font-semibold">
            {layout.primaryText || "Primary text"}
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            {layout.secondaryText || "Secondary supporting text"}
          </div>
        </div>
        <div className="mt-2">
          <button className="px-3 py-1.5 rounded bg-emerald-600 text-xs font-semibold">
            {cta.label || "CTA"}
          </button>
        </div>
      </div>

      <p className="text-[11px] text-zinc-500 mt-3">
        This is a mock template viewer. Strategy + onchain integration can use this configuration
        to generate live frames and actions.
      </p>
    </div>
  );
}
EOF_TSX
  echo "[WEB] Created: $WEB_APP_DIR/frames/templates/[id]/page.tsx"
else
  echo "[WEB][SKIP] $WEB_APP_DIR/frames/templates/[id]/page.tsx"
fi

echo "[MODULE 6 — FRAME TEMPLATE ENGINE MEGA] Complete."
