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
