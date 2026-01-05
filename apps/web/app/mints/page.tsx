import { neo } from "@castquest/neo-ux-core";

export default function MintsPage() {
  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold ${neo.colors.text.primary} mb-4`}>
            NFT Mints ⚡
          </h1>
          <p className={`text-xl ${neo.colors.text.secondary}`}>
            Discover and mint exclusive NFTs across multiple chains.
          </p>
        </div>

        <div className={`p-12 rounded-2xl border ${neo.colors.border.glow} bg-gradient-to-br from-purple-500/10 to-cyan-500/10 ${neo.glow.active} text-center`}>
          <div className="text-6xl mb-6">🎨</div>
          <h2 className={`text-3xl font-bold ${neo.colors.text.primary} mb-4`}>
            NFT Marketplace Coming Soon
          </h2>
          <p className={`text-lg ${neo.colors.text.secondary} max-w-2xl mx-auto`}>
            Mint, collect, and trade NFTs on Base, Zora, and Ethereum. Stay tuned for our marketplace launch.
          </p>
        </div>
      </div>
    </div>
  );
}
