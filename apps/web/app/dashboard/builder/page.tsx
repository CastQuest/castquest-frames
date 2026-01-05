"use client";

import { neo } from "@castquest/neo-ux-core";

export default function AIBuilderPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
          AI Builder 🤖
        </h1>
        <p className={`text-lg ${neo.colors.text.secondary}`}>
          Generate frames with AI-powered tools and smart templates.
        </p>
      </div>

      <div
        className={`p-8 rounded-lg border ${neo.colors.border.glow} bg-gradient-to-br from-purple-500/10 to-cyan-500/10 ${neo.glow.active}`}
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✨</div>
          <h2 className={`text-3xl font-bold ${neo.colors.text.primary} mb-2`}>
            AI Frame Generator
          </h2>
          <p className={neo.colors.text.secondary}>
            Describe your frame idea and let AI bring it to life
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <textarea
            placeholder="E.g., 'Create an interactive poll frame for choosing the next community event with a futuristic purple theme and emoji reactions...'"
            className={`w-full h-40 bg-black/20 border ${neo.colors.border.default} rounded-lg p-4 ${neo.colors.text.primary} placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-all resize-none`}
          />
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg border ${neo.colors.border.default} ${neo.colors.text.secondary} hover:${neo.colors.text.primary} transition-all`}
              >
                📷 Add Image
              </button>
              <button
                className={`px-4 py-2 rounded-lg border ${neo.colors.border.default} ${neo.colors.text.secondary} hover:${neo.colors.text.primary} transition-all`}
              >
                🎨 Style Preset
              </button>
            </div>
            <button
              className={`px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all ${neo.glow.active}`}
            >
              ✨ Generate Frame
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { icon: "🎨", title: "Smart Design", desc: "AI-powered color schemes and layouts" },
          { icon: "💡", title: "Content Ideas", desc: "Get AI suggestions for engaging content" },
          { icon: "⚡", title: "Quick Templates", desc: "Start with pre-built AI templates" },
        ].map((feature) => (
          <div
            key={feature.title}
            className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} hover:${neo.colors.border.glow} transition-all`}
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className={`text-lg font-bold ${neo.colors.text.primary} mb-2`}>
              {feature.title}
            </h3>
            <p className={`text-sm ${neo.colors.text.secondary}`}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
