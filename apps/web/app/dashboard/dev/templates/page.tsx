"use client";

import { neo } from "@castquest/neo-ux-core";

export default function TemplatesPage() {
  const templates = [
    {
      id: "1",
      name: "Welcome Frame",
      description: "Simple welcome message with action buttons",
      preview: "🖼️",
      category: "starter",
    },
    {
      id: "2",
      name: "NFT Gallery",
      description: "Display your NFT collection",
      preview: "🎨",
      category: "showcase",
    },
    {
      id: "3",
      name: "Quest Board",
      description: "Interactive quest tracking interface",
      preview: "🎯",
      category: "interactive",
    },
    {
      id: "4",
      name: "Mint Button",
      description: "One-click NFT minting frame",
      preview: "⚡",
      category: "utility",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
          Remix Templates 🎨
        </h1>
        <p className={`text-lg ${neo.colors.text.secondary}`}>
          Pre-built frame templates to kickstart your development.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} hover:${neo.colors.border.glow} hover:${neo.glow.idle} transition-all`}
          >
            <div className="text-5xl mb-4 text-center">{template.preview}</div>
            <h3 className={`text-lg font-bold ${neo.colors.text.primary} mb-2`}>
              {template.name}
            </h3>
            <p className={`text-sm ${neo.colors.text.secondary} mb-3`}>
              {template.description}
            </p>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400`}>
                {template.category}
              </span>
              <button className={`px-3 py-1 rounded text-sm font-semibold ${neo.colors.text.accent} hover:bg-emerald-500/10 transition-all`}>
                Use →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
