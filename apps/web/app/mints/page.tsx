import { ComingSoon } from "../../components/EmptyState";

export default function MintsPage() {
  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <ComingSoon
          feature="NFT Marketplace"
          description="Mint, collect, and trade NFTs on Base, Zora, and Ethereum. Stay tuned for our marketplace launch."
          icon="🎨"
        />
      </div>
    </div>
  );
}
