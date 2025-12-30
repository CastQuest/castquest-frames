import React from "react";
import { neo } from "../theme";

interface SystemHealthCardProps {
  title: string;
  status: "ok" | "warn" | "error";
  subtitle?: string;
}

export function SystemHealthCard({ title, status, subtitle }: SystemHealthCardProps) {
  const statusColors = {
    ok: "text-emerald-400",
    warn: "text-yellow-400",
    error: "text-red-400"
  };

  const statusLabels = {
    ok: "✓ Healthy",
    warn: "⚠ Warning",
    error: "✗ Error"
  };

  return (
    <div className={`p-4 rounded-lg bg-neutral-900 border border-neutral-800 ${neo.glow.idle} hover:${neo.glow.active} transition-all`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-neutral-200">{title}</h3>
        <span className={`text-sm font-medium ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      </div>
      {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
    </div>
  );
}

interface OperatorNotesProps {
  notes: Array<{
    id: string;
    content: string;
    timestamp: string;
    author?: string;
  }>;
}

export function OperatorNotes({ notes }: OperatorNotesProps) {
  return (
    <div className={`p-4 rounded-lg bg-neutral-900 border border-neutral-800 ${neo.glow.idle}`}>
      <h3 className="font-semibold text-neutral-200 mb-4">Operator Notes</h3>
      <div className="space-y-3">
        {notes.length === 0 ? (
          <p className="text-sm text-neutral-500">No notes yet</p>
        ) : (
          notes.map(note => (
            <div key={note.id} className="border-l-2 border-emerald-500 pl-3">
              <p className="text-sm text-neutral-300">{note.content}</p>
              <p className="text-xs text-neutral-500 mt-1">
                {note.author && `${note.author} • `}{note.timestamp}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

interface QuickLinksProps {
  links: Array<{
    id: string;
    label: string;
    href: string;
    description?: string;
  }>;
}

export function QuickLinks({ links }: QuickLinksProps) {
  return (
    <div className={`p-4 rounded-lg bg-neutral-900 border border-neutral-800 ${neo.glow.idle}`}>
      <h3 className="font-semibold text-neutral-200 mb-4">Quick Links</h3>
      <div className="space-y-2">
        {links.map(link => (
          <a
            key={link.id}
            href={link.href}
            className={`block p-3 rounded-lg bg-neutral-800 hover:bg-neutral-750 transition-all ${neo.glow.idle} hover:${neo.glow.active}`}
          >
            <div className="font-medium text-neutral-200 text-sm">{link.label}</div>
            {link.description && (
              <div className="text-xs text-neutral-500 mt-1">{link.description}</div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
