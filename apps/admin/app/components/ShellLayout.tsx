"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/media", label: "Media" },
  { href: "/frames", label: "Frames" },
  { href: "/mints", label: "Mints" },
  { href: "/quests", label: "Quests" },
  { href: "/strategy", label: "Strategy" }
];

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex">
      <aside className="hidden md:flex md:flex-col w-56 border-r border-zinc-800 bg-zinc-950">
        <div className="px-4 py-3 border-b border-zinc-800 font-semibold text-sm">
          CastQuest Admin
        </div>
        <nav className="flex-1 px-2 py-4 flex flex-col gap-1 text-sm">
          {links.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 py-1.5 rounded ${
                  active
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950">
          <div className="font-semibold text-sm">CastQuest Admin</div>
          <button
            onClick={() => setOpen((x) => !x)}
            className="px-2 py-1 text-xs border border-zinc-600 rounded"
          >
            {open ? "Close" : "Menu"}
          </button>
        </header>

        {open && (
          <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-2 py-2 space-y-1 text-sm">
            {links.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-2 py-1 rounded ${
                    active
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}

        <main className="flex-1 px-4 py-4 md:px-8 md:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
