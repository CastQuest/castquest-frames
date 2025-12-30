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
