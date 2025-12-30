"use client";

import Link from "next/link";

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border border-neutral-800 rounded-lg p-4 bg-black/40 space-y-2">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {subtitle && (
            <p className="text-xs text-neutral-500">{subtitle}</p>
          )}
        </div>
      </header>
      {children && <div className="pt-1">{children}</div>}
    </section>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Operator Dashboard</h1>
        <p className="text-sm text-neutral-500">
          High-level view of CastQuest protocol health, worker status, and Smart Brain activity.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {/* System Health Panel */}
        <Card
          title="System Health"
          subtitle="Core surfaces & modules"
        >
          <ul className="text-xs space-y-1 text-neutral-300">
            <li>• Admin: <span className="text-emerald-400">reachable</span> (UI loaded)</li>
            <li>• Strategy Worker: <span className="text-amber-400">manual trigger</span></li>
            <li>• Smart Brain: <span className="text-sky-400">API available</span></li>
            <li>• Data JSON: <span className="text-emerald-400">file-based</span></li>
          </ul>
        </Card>

        {/* Worker Monitor */}
        <Card
          title="Worker Monitor"
          subtitle="Strategy runs & automation"
        >
          <ul className="text-xs space-y-1 text-neutral-300">
            <li>• Last run: <span className="text-neutral-400">n/a (mock)</span></li>
            <li>• Suggested action: trigger <code>/api/strategy/worker/run</code></li>
          </ul>
          <div className="pt-2">
            <Link
              href="/worker"
              className="inline-flex items-center px-2 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-500"
            >
              Open Worker Console
            </Link>
          </div>
        </Card>

        {/* Brain Activity Feed */}
        <Card
          title="Brain Activity"
          subtitle="Smart Brain decisions"
        >
          <ul className="text-xs space-y-1 text-neutral-300">
            <li>• Recent events: check <code>brain-events.json</code></li>
            <li>• Suggestions: check <code>brain-suggestions.json</code></li>
          </ul>
          <div className="pt-2">
            <Link
              href="/brain"
              className="inline-flex items-center px-2 py-1 text-xs rounded bg-purple-600 hover:bg-purple-500"
            >
              Open Brain Console
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="Quick Links"
          subtitle="Jump to protocol surfaces"
        >
          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href="/media"
              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
            >
              Media
            </Link>
            <Link
              href="/templates"
              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
            >
              Templates
            </Link>
            <Link
              href="/frames"
              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
            >
              Frames
            </Link>
            <Link
              href="/mints"
              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
            >
              Mints
            </Link>
            <Link
              href="/quests"
              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
            >
              Quests
            </Link>
          </div>
        </Card>

        <Card
          title="Operator Notes"
          subtitle="Dashboard is a high-level view only"
        >
          <p className="text-xs text-neutral-400">
            System health, worker status, and Brain activity are read from file-based state and
            mock endpoints. For real-time behavior, wire Strategy Worker and Brain APIs into
            your automation scripts and onchain surfaces.
          </p>
        </Card>
      </div>
    </div>
  );
}
