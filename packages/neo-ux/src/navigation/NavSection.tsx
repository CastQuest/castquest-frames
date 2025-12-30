"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export function NavSection({
  title,
  children,
  defaultOpen = true
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2 text-left text-neutral-400 hover:text-neutral-200"
      >
        <span className="text-xs font-semibold tracking-wide">{title}</span>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {open && <div className="pl-3 space-y-1">{children}</div>}
    </div>
  );
}
