// apps/admin/app/page.tsx (Overview)
export default function AdminOverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">CastQuest Operator Console</h1>
      <p className="text-sm text-zinc-400 mb-6">
        Manage quests, frames, mints, Smart Brain behavior, and system health.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/60">
          <h2 className="font-medium mb-1">Quests</h2>
          <p className="text-sm text-zinc-400">Configure and monitor quests.</p>
        </div>
        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/60">
          <h2 className="font-medium mb-1">Frames</h2>
          <p className="text-sm text-zinc-400">Build Farcaster frames.</p>
        </div>
        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/60">
          <h2 className="font-medium mb-1">Mints</h2>
          <p className="text-sm text-zinc-400">Configure Zora mints.</p>
        </div>
        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/60">
          <h2 className="font-medium mb-1">Smart Brain</h2>
          <p className="text-sm text-zinc-400">AI routing controls.</p>
        </div>
      </div>
    </div>
  );
}