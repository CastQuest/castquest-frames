"use client";

type Quest = {
  id: string;
  caster: string;
  handle: string;
  title: string;
  body: string;
  xp: number;
  chain: "EVM" | "SOL";
};

const QUESTS: Quest[] = [
  {
    id: "q1",
    caster: "Operator",
    handle: "@castquest",
    title: "Boot the Operator Signal",
    body: "Connect wallets, sync Smart Brain, and broadcast your first CastQuest signal.",
    xp: 120,
    chain: "EVM"
  },
  {
    id: "q2",
    caster: "Explorer",
    handle: "@explorer",
    title: "Frame Online",
    body: "Trigger the Farcaster Frame and complete an onchain response.",
    xp: 180,
    chain: "SOL"
  },
  {
    id: "q3",
    caster: "Archivist",
    handle: "@archive",
    title: "Mint the Trailhead Badge",
    body: "Claim your Zora badge for completing the opening protocol loop.",
    xp: 240,
    chain: "EVM"
  }
];

export default function HomePage() {
  return (
    <div className="cq-grid">
      <section className="cq-panel">
        <div className="cq-panel-inner">
          <div className="cq-hero">
            <div>
              <div className="cq-hero-title">Onchain quest feed</div>
              <div className="cq-hero-sub">
                Frames → actions → mints → XP. Every move leaves a visible trail.
              </div>
            </div>
            <div className="cq-hero-metrics">
              <div className="cq-chip">LIVE SIGNALS: 3</div>
              <div className="cq-chip">ACTIVE CHAINS: EVM + SOL</div>
              <div className="cq-chip">SMART BRAIN: STANDBY</div>
            </div>
          </div>

          <div className="cq-quest-list">
            {QUESTS.map((q) => (
              <article key={q.id} className="cq-quest-card">
                <div className="cq-quest-main">
                  <div className="cq-quest-heading">
                    <div className="cq-quest-title">{q.title}</div>
                    <div className="cq-quest-handle">
                      {q.caster} · {q.handle}
                    </div>
                  </div>
                  <div className="cq-quest-body">{q.body}</div>
                  <div className="cq-quest-footer">
                    <div className="cq-quest-actions">
                      <button className="cq-quest-btn">Open Frame</button>
                      <button className="cq-quest-btn">Mint Badge</button>
                      <button className="cq-quest-btn">View Quest</button>
                    </div>
                    <div className="cq-quest-meta">
                      +{q.xp} XP · {q.chain}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <aside className="cq-sidebar">
        <div className="cq-sidebar-card">
          <div className="cq-sidebar-title">Wallet status</div>
          <div className="cq-sidebar-sub">
            EVM + Solana wallets will light up here once connected.
          </div>
          <div className="cq-sidebar-pill-row">
            <div className="cq-sidebar-pill">EVM: DISCONNECTED</div>
            <div className="cq-sidebar-pill">SOL: DISCONNECTED</div>
          </div>
          <button className="cq-sidebar-button-primary">
            Connect wallets (soon)
          </button>
          <div className="cq-sidebar-badge">BRIDGE: OFFLINE</div>
        </div>

        <div className="cq-sidebar-card cq-sidebar-card--brain">
          <div className="cq-sidebar-title">Smart Brain</div>
          <div className="cq-sidebar-sub">
            When wired, this surface will route quests, frames, and mints based on your onchain trail.
          </div>
          <div className="cq-sidebar-pill-row">
            <div className="cq-sidebar-pill">MODE: SPECTATOR</div>
            <div className="cq-sidebar-pill">AURA: IDLE</div>
          </div>
        </div>
      </aside>
    </div>
  );
}