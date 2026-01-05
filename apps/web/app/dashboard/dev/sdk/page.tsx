"use client";

import { neo } from "@castquest/neo-ux-core";
import { useState } from "react";

export default function SDKExamplesPage() {
  const [selectedExample, setSelectedExample] = useState<"frame" | "mint" | "ai">("frame");

  const examples = {
    frame: `import { FramesClient } from '@castquest/sdk';

// Initialize the Frames client
const framesClient = new FramesClient({
  apiKey: process.env.CASTQUEST_API_KEY,
  network: 'base'
});

// Create a new frame
const frame = await framesClient.createFrame({
  title: 'My First Frame',
  description: 'Welcome to CastQuest!',
  imageUrl: 'https://example.com/image.png',
  buttons: [
    { label: 'Get Started', action: 'post' },
    { label: 'Learn More', action: 'link', target: '/docs' }
  ]
});

console.log('Frame created:', frame.id);`,
    mint: `import { OracleDBService } from '@castquest/sdk';

// Initialize Oracle service
const oracle = new OracleDBService({
  apiKey: process.env.CASTQUEST_API_KEY
});

// Mint NFT on-chain
const mintResult = await oracle.mintNFT({
  chain: 'base',
  metadata: {
    name: 'CastQuest NFT',
    description: 'Commemorative NFT',
    image: 'ipfs://...'
  },
  recipient: '0x...'
});

console.log('Transaction hash:', mintResult.transactionHash);`,
    ai: `import { SmartBrainEngine } from '@castquest/sdk';

// Initialize AI engine
const ai = new SmartBrainEngine({
  apiKey: process.env.CASTQUEST_API_KEY
});

// Generate frame content with AI
const aiResponse = await ai.generateFrame({
  prompt: 'Create a quest frame for NFT collectors',
  style: 'cyberpunk',
  context: {
    targetAudience: 'web3 enthusiasts',
    primaryAction: 'mint'
  }
});

console.log('AI-generated frame:', aiResponse.frameData);`,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
          SDK Examples 🔧
        </h1>
        <p className={`text-lg ${neo.colors.text.secondary}`}>
          TypeScript/JavaScript examples for common CastQuest operations.
        </p>
      </div>

      <div className="flex gap-3 mb-6">
        {[
          { id: "frame", label: "📦 Frame Creation" },
          { id: "mint", label: "⛏️ On-Chain Minting" },
          { id: "ai", label: "🤖 AI Interaction" },
        ].map((example) => (
          <button
            key={example.id}
            onClick={() => setSelectedExample(example.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedExample === example.id
                ? `${neo.colors.text.accent} bg-emerald-500/20 border ${neo.colors.border.glow}`
                : `${neo.colors.text.tertiary} border ${neo.colors.border.default} hover:${neo.colors.text.secondary}`
            }`}
          >
            {example.label}
          </button>
        ))}
      </div>

      <div className={`p-6 rounded-lg ${neo.colors.bg.tertiary} border ${neo.colors.border.default} overflow-x-auto`}>
        <pre className={`text-sm ${neo.colors.text.secondary} font-mono`}>
          <code>{examples[selectedExample]}</code>
        </pre>
      </div>

      <div className="flex gap-3">
        <button className={`px-4 py-2 rounded-lg border ${neo.colors.border.glow} ${neo.colors.text.accent} font-semibold hover:bg-emerald-500/10 transition-all`}>
          📋 Copy Code
        </button>
        <button className={`px-4 py-2 rounded-lg border ${neo.colors.border.default} ${neo.colors.text.tertiary} hover:${neo.colors.text.secondary} transition-all`}>
          🚀 Run in Sandbox
        </button>
      </div>

      <div className={`p-6 rounded-lg border ${neo.colors.border.glow} bg-gradient-to-br from-purple-500/5 to-cyan-500/5 ${neo.glow.idle}`}>
        <h3 className={`text-lg font-bold ${neo.colors.text.primary} mb-3`}>
          Installation
        </h3>
        <div className={`p-4 rounded-lg ${neo.colors.bg.tertiary} border ${neo.colors.border.default} font-mono text-sm ${neo.colors.text.secondary}`}>
          npm install @castquest/sdk
        </div>
      </div>
    </div>
  );
}
