"use client";

import { useState } from "react";
import { 
  Wallet, 
  Brain, 
  Vault, 
  Bot, 
  Sparkles, 
  Zap, 
  TrendingUp,
  PlayCircle,
  Copy,
  Sliders,
  Box,
  Activity,
  Clock,
  DollarSign,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { neo } from "@castquest/neo-ux-core";

// Mock data for placeholder hooks
const useTreasuryData = () => ({
  balance: "12,450.50",
  iqRanking: "Top 15%",
  treasuryTotal: "$45,320.80",
  aiUptime: "99.8%"
});

const useUserQuests = () => ({
  quests: [
    { 
      id: "1", 
      name: "DeFi Hunter", 
      ticker: "$HUNT", 
      status: "active", 
      states: 3, 
      rewardsPaid: "$1,250", 
      aiEngine: "GPT-4" 
    },
    { 
      id: "2", 
      name: "NFT Explorer", 
      ticker: "$NFX", 
      status: "completed", 
      states: 5, 
      rewardsPaid: "$2,100", 
      aiEngine: "Claude" 
    },
    { 
      id: "3", 
      name: "Meme Caster", 
      ticker: "$MEME", 
      status: "pending", 
      states: 2, 
      rewardsPaid: "$0", 
      aiEngine: "Gemini" 
    },
    { 
      id: "4", 
      name: "Social Graph", 
      ticker: "$SOCIAL", 
      status: "active", 
      states: 4, 
      rewardsPaid: "$875", 
      aiEngine: "GPT-4" 
    }
  ]
});

const useActivityData = () => ({
  data: [
    { time: "Mon", earnings: 120 },
    { time: "Tue", earnings: 250 },
    { time: "Wed", earnings: 180 },
    { time: "Thu", earnings: 420 },
    { time: "Fri", earnings: 380 },
    { time: "Sat", earnings: 520 },
    { time: "Sun", earnings: 450 }
  ]
});

const useFrameAssets = () => ({
  assets: [
    { id: "1", title: "Hologram #1", type: "3D", preview: "🎨" },
    { id: "2", title: "Neon Grid", type: "Pattern", preview: "🌐" },
    { id: "3", title: "Cyber Punk", type: "Theme", preview: "⚡" },
    { id: "4", title: "Glitch Art", type: "Effect", preview: "✨" },
    { id: "5", title: "Space Scene", type: "BG", preview: "🌌" },
    { id: "6", title: "Matrix Rain", type: "Animation", preview: "💫" }
  ]
});

export default function UserDashboard() {
  const { balance, iqRanking, treasuryTotal, aiUptime } = useTreasuryData();
  const { quests } = useUserQuests();
  const { data: activityData } = useActivityData();
  const { assets } = useFrameAssets();
  const [remixTicker, setRemixTicker] = useState("");
  const [difficulty, setDifficulty] = useState(50);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "completed": return "text-blue-400 border-blue-500/30 bg-blue-500/10";
      case "pending": return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
      default: return "text-neutral-400 border-neutral-500/30 bg-neutral-500/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Activity className="w-3 h-3" />;
      case "completed": return <CheckCircle2 className="w-3 h-3" />;
      case "pending": return <Clock className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            User Dashboard
          </h1>
          <p className="text-neutral-400">
            Track your quests, earnings, and build AI-powered frames
          </p>
        </div>

        {/* Hero Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* CAST Balance */}
          <div className={`${neo.colors.bg.secondary} border border-purple-500/30 rounded-xl p-6 ${neo.glow.purple} hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <Wallet className="w-5 h-5 text-purple-400" />
              </div>
              <div className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-1">${balance}</div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider">$CAST Balance</div>
          </div>

          {/* IQ Ranking */}
          <div className={`${neo.colors.bg.secondary} border border-cyan-500/30 rounded-xl p-6 shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                <Brain className="w-5 h-5 text-cyan-400" />
              </div>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-cyan-400 mb-1">{iqRanking}</div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider">User IQ Ranking</div>
          </div>

          {/* Treasury Total */}
          <div className={`${neo.colors.bg.secondary} border border-blue-500/30 rounded-xl p-6 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
                <Vault className="w-5 h-5 text-blue-400" />
              </div>
              <DollarSign className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-1">{treasuryTotal}</div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider">Treasury Total</div>
          </div>

          {/* AI Uptime */}
          <div className={`${neo.colors.bg.secondary} border border-emerald-500/30 rounded-xl p-6 ${neo.glow.emerald} hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-400 mb-1">{aiUptime}</div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider">AI Agent Uptime</div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Quest Frames Table */}
            <div className={`${neo.colors.bg.secondary} border ${neo.colors.border.glow} rounded-xl p-6 shadow-[0_0_20px_rgba(168,85,247,0.2)]`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-100">Active Quest Frames</h2>
                <button className="px-4 py-2 text-sm font-semibold rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-all">
                  View All
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Name / Ticker</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">States</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Rewards Paid</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">AI Engine</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quests.map((quest) => (
                      <tr key={quest.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-semibold text-neutral-100">{quest.name}</div>
                          <div className="text-sm text-purple-400">{quest.ticker}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(quest.status)}`}>
                            {getStatusIcon(quest.status)}
                            <span className="capitalize">{quest.status}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-neutral-300">{quest.states}</td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-emerald-400">{quest.rewardsPaid}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs text-cyan-400">
                            <Bot className="w-3 h-3" />
                            {quest.aiEngine}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {quest.status === "active" ? (
                              <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all">
                                Join
                              </button>
                            ) : (
                              <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-all">
                                Remix
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity Graph */}
            <div className={`${neo.colors.bg.secondary} border ${neo.colors.border.glow} rounded-xl p-6 shadow-[0_0_20px_rgba(168,85,247,0.2)]`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-100">Recent Activity</h2>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Activity className="w-4 h-4" />
                  <span>Last 7 days</span>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={activityData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#9ca3af" 
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      boxShadow: '0 0 20px rgba(168,85,247,0.3)'
                    }}
                    labelStyle={{ color: '#e5e7eb' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#a855f7" 
                    strokeWidth={3}
                    dot={{ fill: '#a855f7', r: 4 }}
                    activeDot={{ r: 6, fill: '#06b6d4' }}
                    filter="drop-shadow(0 0 8px rgba(168,85,247,0.6))"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* AI Builder Section */}
            <div className={`${neo.colors.bg.secondary} border border-purple-500/30 rounded-xl p-6 shadow-[0_0_25px_rgba(168,85,247,0.3)]`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-100">AI Frame Builder</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left - Controls */}
                <div className="space-y-6">
                  {/* Remix Ticker Input */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">
                      Remix Ticker / Quest Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={remixTicker}
                        onChange={(e) => setRemixTicker(e.target.value)}
                        placeholder="e.g., $CAST, QUEST-XYZ"
                        className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-neutral-100 placeholder-neutral-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                      <Copy className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 cursor-pointer hover:text-purple-400 transition-colors" />
                    </div>
                  </div>

                  {/* Human IQ Difficulty Slider */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2 flex items-center justify-between">
                      <span>Human IQ Difficulty</span>
                      <span className="text-cyan-400 font-bold">{difficulty}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={difficulty}
                      onChange={(e) => setDifficulty(parseInt(e.target.value))}
                      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer slider-thumb"
                      style={{
                        background: `linear-gradient(to right, #a855f7 0%, #06b6d4 ${difficulty}%, #1f2937 ${difficulty}%, #1f2937 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-neutral-500 mt-1">
                      <span>Easy</span>
                      <span>Genius</span>
                    </div>
                  </div>

                  {/* Deploy Button */}
                  <button className="w-full py-4 px-6 font-bold text-lg rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600 shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:shadow-[0_0_40px_rgba(168,85,247,0.8)] transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5" />
                      <span>Deploy to Base & Cast</span>
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </button>
                </div>

                {/* Right - 3D Preview Placeholder */}
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-neutral-900 to-black border border-purple-500/30 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(168,85,247,0.3)]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Box className="w-16 h-16 text-purple-400/30 mx-auto mb-4 animate-pulse" />
                        <p className="text-neutral-400 text-sm">3D Frame Preview</p>
                        <p className="text-neutral-600 text-xs mt-1">Real-time rendering</p>
                      </div>
                    </div>
                    {/* Holographic Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-cyan-500/10 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Frames Browser Sidebar */}
          <div className="lg:col-span-1">
            <div className={`${neo.colors.bg.secondary} border ${neo.colors.border.glow} rounded-xl p-6 shadow-[0_0_20px_rgba(168,85,247,0.2)] sticky top-8`}>
              <div className="flex items-center gap-3 mb-6">
                <ImageIcon className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-neutral-100">Frames Browser</h2>
              </div>

              <p className="text-sm text-neutral-400 mb-4">
                Browse and remix NFT/media assets for your frames
              </p>

              <div className="space-y-3">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="group relative p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg hover:border-purple-500/50 hover:bg-neutral-800 cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{asset.preview}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-neutral-100 text-sm">{asset.title}</div>
                        <div className="text-xs text-neutral-500">{asset.type}</div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 transition-all">
                        <PlayCircle className="w-4 h-4 text-purple-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 px-4 font-semibold rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all">
                Browse All Assets
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #a855f7, #06b6d4);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.8);
          transition: all 0.2s ease;
        }
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 20px rgba(168, 85, 247, 1);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #a855f7, #06b6d4);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.8);
          border: none;
          transition: all 0.2s ease;
        }
        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 20px rgba(168, 85, 247, 1);
        }
      `}</style>
    </div>
  );
}
