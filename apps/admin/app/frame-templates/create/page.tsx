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
