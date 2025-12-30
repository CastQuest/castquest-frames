"use client";

import { useState } from "react";
import { neo } from "@castquest/neo-ux-core";
import { DashboardGrid, DashboardStat } from "@castquest/neo-ux-core";

export default function DeveloperPortal() {
  const [selectedTab, setSelectedTab] = useState<"overview" | "sdk" | "contracts" | "templates">("overview");
  const [selectedSDKExample, setSelectedSDKExample] = useState<"frame" | "mint" | "ai">("frame");

  // Mock data
  const stats = {
    apiCalls: "2.4M",
    activeKeys: 156,
    uptime: "99.9%",
    avgLatency: "45ms",
  };

  const contractsData = [
    {
      id: "1",
      name: "FrameFactory",
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7",
      chain: "Base",
      functions: ["createFrame", "updateFrame", "validateFrame"],
    },
    {
      id: "2",
      name: "QuestManager",
      address: "0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf",
      chain: "Base",
      functions: ["createQuest", "completeQuest", "claimReward"],
    },
    {
      id: "3",
      name: "TreasuryVault",
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      chain: "Ethereum",
      functions: ["deposit", "withdraw", "getBalance"],
    },
    {
      id: "4",
      name: "NFTMinter",
      address: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
      chain: "Zora",
      functions: ["mint", "burn", "transfer"],
    },
  ];

  const templatesData = [
    {
      id: "1",
      name: "Welcome Frame",
      description: "Simple welcome message with action buttons",
      preview: "🖼️",
      category: "starter",
    },
    {
      id: "2",
      name: "NFT Gallery",
      description: "Display your NFT collection",
      preview: "🎨",
      category: "showcase",
    },
    {
      id: "3",
      name: "Quest Board",
      description: "Interactive quest tracking interface",
      preview: "🎯",
      category: "interactive",
    },
    {
      id: "4",
      name: "Mint Button",
      description: "One-click NFT minting frame",
      preview: "⚡",
      category: "utility",
    },
  ];

  const sdkExamples = {
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

// Validate frame structure
const validation = await framesClient.validateFrame(frame.id);
console.log('Frame validation:', validation);

// Publish frame
await framesClient.publishFrame(frame.id);`,
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

console.log('Transaction hash:', mintResult.transactionHash);
console.log('Token ID:', mintResult.tokenId);

// Query treasury balance
const treasuryData = await oracle.getTreasuryBalance({
  chain: 'base',
  token: 'ETH'
});

console.log('Treasury balance:', treasuryData.balance);`,
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

console.log('AI-generated frame:', aiResponse.frameData);
console.log('Confidence:', aiResponse.confidence);

// Optimize existing frame with AI
const optimized = await ai.optimizeFrame({
  frameId: 'frame_123',
  goals: ['increase engagement', 'improve conversion']
});

console.log('Optimization suggestions:', optimized.suggestions);`,
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className={`relative overflow-hidden rounded-2xl p-8 border ${neo.colors.border.glow} bg-gradient-to-br from-purple-500/10 via-black to-cyan-500/10 ${neo.glow.active}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(6,182,212,0.15),transparent_50%)]" />
        <div className="relative z-10">
          <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
            💻 Developer Portal
          </h1>
          <p className={`text-lg ${neo.colors.text.secondary} mb-6`}>
            Build on CastQuest with our comprehensive API, SDKs, and deployment tools.
          </p>
          <div className="flex gap-3">
            <button className={`px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold ${neo.glow.success} hover:scale-105 transition-all`}>
              📚 View API Docs
            </button>
            <button className={`px-6 py-3 rounded-lg border ${neo.colors.border.glow} ${neo.colors.text.accent} font-bold hover:bg-emerald-500/10 transition-all`}>
              🔑 Generate API Key
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardGrid columns={4}>
        <DashboardStat
          label="API Calls"
          value={stats.apiCalls}
          trend="up"
          icon="📊"
          subtitle="Last 30 days"
        />
        <DashboardStat
          label="Active Keys"
          value={stats.activeKeys}
          trend="up"
          icon="🔑"
          subtitle="+12 this month"
        />
        <DashboardStat
          label="Uptime"
          value={stats.uptime}
          trend="up"
          icon="🟢"
          subtitle="99.9% SLA"
        />
        <DashboardStat
          label="Avg Latency"
          value={stats.avgLatency}
          trend="neutral"
          icon="⚡"
          subtitle="Global average"
        />
      </DashboardGrid>

      {/* Tab Navigation */}
      <div className="flex gap-4 overflow-x-auto">
        {[
          { id: "overview", label: "📚 API Overview", key: "overview" },
          { id: "sdk", label: "🔧 SDK Examples", key: "sdk" },
          { id: "contracts", label: "📝 Smart Contracts", key: "contracts" },
          { id: "templates", label: "🎨 Remix Templates", key: "templates" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.key as any)}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
              selectedTab === tab.key
                ? `${neo.colors.text.primary} bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border ${neo.colors.border.glow} ${neo.glow.active}`
                : `${neo.colors.text.tertiary} border ${neo.colors.border.default} hover:${neo.colors.text.secondary}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* API Overview */}
      {selectedTab === "overview" && (
        <div className="space-y-6">
          <div className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary}`}>
            <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4`}>
              Interactive API Documentation
            </h2>
            <p className={`${neo.colors.text.secondary} mb-6`}>
              Explore our comprehensive REST API with interactive examples and live testing.
            </p>
            <div className={`p-4 rounded-lg ${neo.colors.bg.tertiary} border ${neo.colors.border.default} font-mono text-sm`}>
              <div className={`${neo.colors.text.tertiary} mb-2`}>Base URL:</div>
              <div className={`${neo.colors.text.accent}`}>https://api.castquest.io/v1</div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                service: "FramesClient",
                description: "Create, validate, and manage Farcaster frames",
                endpoints: ["GET /frames", "POST /frames", "PUT /frames/{id}", "POST /frames/{id}/validate"],
              },
              {
                service: "PermissionsService",
                description: "RBAC and user access control management",
                endpoints: ["GET /permissions/users/{id}/roles", "POST /permissions/users/{id}/roles"],
              },
              {
                service: "SmartBrainEngine",
                description: "AI-powered frame generation and optimization",
                endpoints: ["POST /ai/agents", "POST /ai/optimize"],
              },
              {
                service: "OracleDBService",
                description: "On-chain data queries and treasury management",
                endpoints: ["GET /oracle/treasury", "GET /oracle/contracts/{address}"],
              },
              {
                service: "Markets",
                description: "NFT marketplace and minting operations",
                endpoints: ["GET /markets/nfts", "POST /markets/mint"],
              },
              {
                service: "Media Valet",
                description: "Media asset storage and management",
                endpoints: ["GET /media/assets", "POST /media/assets"],
              },
            ].map((service) => (
              <div
                key={service.service}
                className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} hover:${neo.colors.border.glow} transition-all`}
              >
                <h3 className={`text-lg font-bold ${neo.colors.text.primary} mb-2`}>
                  {service.service}
                </h3>
                <p className={`text-sm ${neo.colors.text.secondary} mb-4`}>
                  {service.description}
                </p>
                <div className="space-y-1">
                  {service.endpoints.map((endpoint) => (
                    <div
                      key={endpoint}
                      className={`text-xs font-mono ${neo.colors.text.tertiary} px-2 py-1 rounded ${neo.colors.bg.tertiary}`}
                    >
                      {endpoint}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={`p-6 rounded-lg border ${neo.colors.border.glow} bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 ${neo.glow.idle}`}>
            <div className="flex items-start gap-4">
              <div className="text-3xl">📄</div>
              <div>
                <h3 className={`text-lg font-bold ${neo.colors.text.primary} mb-1`}>
                  OpenAPI Specification
                </h3>
                <p className={`text-sm ${neo.colors.text.secondary} mb-3`}>
                  Download our complete OpenAPI 3.0 specification for automatic SDK generation and integration.
                </p>
                <a
                  href="/docs/openapi.yaml"
                  download
                  className={`inline-block px-4 py-2 rounded-lg border ${neo.colors.border.glow} ${neo.colors.text.accent} font-semibold hover:bg-emerald-500/10 transition-all`}
                >
                  Download OpenAPI Spec
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SDK Examples */}
      {selectedTab === "sdk" && (
        <div className="space-y-6">
          <div className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary}`}>
            <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4`}>
              SDK Code Examples
            </h2>
            <p className={`${neo.colors.text.secondary} mb-4`}>
              TypeScript/JavaScript examples for common CastQuest operations.
            </p>

            <div className="flex gap-3 mb-6">
              {[
                { id: "frame", label: "📦 Frame Creation" },
                { id: "mint", label: "⛏️ On-Chain Minting" },
                { id: "ai", label: "🤖 AI Interaction" },
              ].map((example) => (
                <button
                  key={example.id}
                  onClick={() => setSelectedSDKExample(example.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedSDKExample === example.id
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
                <code>{sdkExamples[selectedSDKExample]}</code>
              </pre>
            </div>

            <div className="flex gap-3 mt-4">
              <button className={`px-4 py-2 rounded-lg border ${neo.colors.border.glow} ${neo.colors.text.accent} font-semibold hover:bg-emerald-500/10 transition-all`}>
                📋 Copy Code
              </button>
              <button className={`px-4 py-2 rounded-lg border ${neo.colors.border.default} ${neo.colors.text.tertiary} hover:${neo.colors.text.secondary} transition-all`}>
                🚀 Run in Sandbox
              </button>
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${neo.colors.border.glow} bg-gradient-to-br from-purple-500/5 to-cyan-500/5 ${neo.glow.idle}`}>
            <h3 className={`text-lg font-bold ${neo.colors.text.primary} mb-3`}>
              Installation
            </h3>
            <div className={`p-4 rounded-lg ${neo.colors.bg.tertiary} border ${neo.colors.border.default} font-mono text-sm ${neo.colors.text.secondary} mb-3`}>
              npm install @castquest/sdk
            </div>
            <p className={`text-sm ${neo.colors.text.tertiary}`}>
              Full documentation available at{" "}
              <a href="/docs" className={`${neo.colors.text.accent} hover:underline`}>
                docs.castquest.io
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Smart Contracts Table */}
      {selectedTab === "contracts" && (
        <div className={`rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} overflow-hidden`}>
          <div className="p-6 border-b border-neutral-800">
            <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-2`}>
              Available Smart Contracts
            </h2>
            <p className={`text-sm ${neo.colors.text.secondary}`}>
              Verified contracts deployed across supported chains
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${neo.colors.bg.tertiary}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Contract Name
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Address
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Chain
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Functions
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {contractsData.map((contract) => (
                  <tr key={contract.id} className="hover:bg-neutral-900 transition-colors">
                    <td className={`px-6 py-4 ${neo.colors.text.primary} font-semibold`}>
                      {contract.name}
                    </td>
                    <td className={`px-6 py-4 font-mono text-sm ${neo.colors.text.secondary}`}>
                      {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400`}>
                        {contract.chain}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {contract.functions.map((func) => (
                          <span
                            key={func}
                            className={`px-2 py-0.5 rounded text-xs font-mono ${neo.colors.bg.tertiary} ${neo.colors.text.tertiary}`}
                          >
                            {func}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className={`px-3 py-1 rounded text-sm font-semibold ${neo.colors.text.accent} hover:bg-emerald-500/10 transition-all`}>
                        View ABI
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Remix Templates */}
      {selectedTab === "templates" && (
        <div className="space-y-6">
          <div className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary}`}>
            <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-2`}>
              Remix Templates
            </h2>
            <p className={`${neo.colors.text.secondary}`}>
              Pre-built frame templates to kickstart your development
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {templatesData.map((template) => (
              <div
                key={template.id}
                className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} hover:${neo.colors.border.glow} hover:${neo.glow.idle} transition-all`}
              >
                <div className="text-5xl mb-4 text-center">{template.preview}</div>
                <h3 className={`text-lg font-bold ${neo.colors.text.primary} mb-2`}>
                  {template.name}
                </h3>
                <p className={`text-sm ${neo.colors.text.secondary} mb-3`}>
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400`}>
                    {template.category}
                  </span>
                  <button className={`px-3 py-1 rounded text-sm font-semibold ${neo.colors.text.accent} hover:bg-emerald-500/10 transition-all`}>
                    Use →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deployment Tools */}
      <div className={`p-8 rounded-lg border ${neo.colors.border.glow} bg-gradient-to-br from-purple-500/10 to-cyan-500/10 ${neo.glow.active}`}>
        <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4`}>
          🚀 Deployment Tools
        </h2>
        <p className={`${neo.colors.text.secondary} mb-6`}>
          Test and deploy your frames with our Foundry-style deployment suite
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <button className={`p-6 rounded-lg ${neo.colors.bg.secondary} border ${neo.colors.border.default} hover:${neo.colors.border.glow} transition-all text-left group`}>
            <div className="text-3xl mb-3">🧪</div>
            <div className={`text-lg font-bold ${neo.colors.text.primary} mb-1`}>Test Frame</div>
            <div className={`text-sm ${neo.colors.text.tertiary} group-hover:${neo.colors.text.secondary} transition-colors`}>
              Validate frame locally before deployment
            </div>
          </button>
          <button className={`p-6 rounded-lg ${neo.colors.bg.secondary} border ${neo.colors.border.default} hover:${neo.colors.border.glow} transition-all text-left group`}>
            <div className="text-3xl mb-3">🌍</div>
            <div className={`text-lg font-bold ${neo.colors.text.primary} mb-1`}>Deploy Testnet</div>
            <div className={`text-sm ${neo.colors.text.tertiary} group-hover:${neo.colors.text.secondary} transition-colors`}>
              Deploy to staging environment
            </div>
          </button>
          <button className={`p-6 rounded-lg ${neo.colors.bg.secondary} border ${neo.colors.border.default} hover:${neo.colors.border.glow} transition-all text-left group`}>
            <div className="text-3xl mb-3">🚀</div>
            <div className={`text-lg font-bold ${neo.colors.text.primary} mb-1`}>Deploy Mainnet</div>
            <div className={`text-sm ${neo.colors.text.tertiary} group-hover:${neo.colors.text.secondary} transition-colors`}>
              Go live on production chains
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
