"use client";

import { useState } from "react";
import { GlowButton, DashboardGrid, DashboardStat } from "@castquest/neo-ux-core";
import { FrameCard, QuestCard, MediaCard } from "../components/Cards";
import { useMockFrames, useMockQuests, useMockMedia, useMockStats } from "../hooks/useMockData";
import { neo } from "@castquest/neo-ux-core";

export default function WebFrontMega() {
  const { frames, loading: framesLoading } = useMockFrames();
  const { quests, loading: questsLoading } = useMockQuests();
  const { media, loading: mediaLoading } = useMockMedia();
  const { stats, loading: _statsLoading } = useMockStats();
  const [activeTab, setActiveTab] = useState<"frames" | "quests" | "media">("frames");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className={`inline-block mb-6 px-4 py-2 rounded-full border ${neo.colors.border.glow} ${neo.glow.success} bg-emerald-500/10`}>
            <span className={`text-sm font-bold ${neo.colors.text.accent} uppercase tracking-wide`}>
              🚀 Decentralized Protocol Universe
            </span>
          </div>
          
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent ${neo.animation.pulse}`}>
            CastQuest
          </h1>
          
          <p className={`text-xl md:text-2xl ${neo.colors.text.secondary} mb-4 max-w-3xl mx-auto`}>
            Create, Cast, and Conquer in the Sovereign Web3 Media Hub
          </p>
          
          <p className={`text-sm ${neo.colors.text.tertiary} mb-8 max-w-2xl mx-auto`}>
            Powered by Farcaster, Zora, Solana, BASE, and the Neo Glow Protocol. 
            Build frames, complete quests, mint NFTs, and earn rewards in the decentralized ecosystem.
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <GlowButton onClick={() => window.location.href = "/dashboard"}>
              🎯 View Quests
            </GlowButton>
            <GlowButton onClick={() => window.location.href = "/admin/dashboard"}>
              ⚡ Operator Dashboard
            </GlowButton>
          </div>

          {/* Protocol Stats */}
          <div className={`inline-block border ${neo.colors.border.glow} rounded-lg p-6 bg-black/40 backdrop-blur-sm ${neo.glow.idle}`}>
            <DashboardGrid>
              <DashboardStat 
                label="Total Frames" 
                value={stats?.totalFrames.toString() || "0"} 
                trend="up"
              />
              <DashboardStat 
                label="Live Frames" 
                value={stats?.liveFrames.toString() || "0"} 
                trend="up"
              />
              <DashboardStat 
                label="Active Quests" 
                value={stats?.activeQuests.toString() || "0"} 
                trend="neutral"
              />
              <DashboardStat 
                label="Total Participants" 
                value={stats?.totalParticipants.toLocaleString() || "0"} 
                trend="up"
              />
            </DashboardGrid>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className={`${neo.animation.bounce} ${neo.colors.text.tertiary}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-12">
          {[
            { id: "frames", label: "🖼️ Frames", count: frames.length },
            { id: "quests", label: "🎯 Quests", count: quests.length },
            { id: "media", label: "📺 Media", count: media.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? `${neo.colors.text.primary} bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border ${neo.colors.border.glow} ${neo.glow.active}`
                  : `${neo.colors.text.tertiary} border border-neutral-800 hover:border-neutral-700`
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? "bg-emerald-500/20 text-emerald-400" : "bg-neutral-800 text-neutral-500"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Frames Grid */}
        {activeTab === "frames" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${neo.colors.text.primary}`}>
                Featured Frames
              </h2>
              <span className={`text-sm ${neo.colors.text.tertiary}`}>
                {framesLoading ? "Loading..." : `${frames.length} frames available`}
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {frames.map((frame) => (
                <FrameCard
                  key={frame.id}
                  frame={frame}
                  onView={() => console.log("View frame:", frame.id)}
                  onCast={() => console.log("Cast frame:", frame.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quests Grid */}
        {activeTab === "quests" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${neo.colors.text.primary}`}>
                Active Quests
              </h2>
              <span className={`text-sm ${neo.colors.text.tertiary}`}>
                {questsLoading ? "Loading..." : `${quests.filter(q => q.status === "active").length} active`}
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onStart={() => console.log("Start quest:", quest.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Media Grid */}
        {activeTab === "media" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${neo.colors.text.primary}`}>
                Protocol Media
              </h2>
              <span className={`text-sm ${neo.colors.text.tertiary}`}>
                {mediaLoading ? "Loading..." : `${media.length} items`}
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
              {media.map((item) => (
                <MediaCard
                  key={item.id}
                  media={item}
                  onPlay={() => console.log("Play media:", item.id)}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className={`max-w-5xl mx-auto px-6 py-16 mb-16`}>
        <div className={`border ${neo.colors.border.glow} rounded-2xl p-12 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 ${neo.glow.active} text-center`}>
          <h2 className={`text-3xl font-bold ${neo.colors.text.primary} mb-4`}>
            Ready to Build on CastQuest?
          </h2>
          <p className={`text-lg ${neo.colors.text.secondary} mb-8 max-w-2xl mx-auto`}>
            Join the decentralized protocol universe. Create frames, complete quests, 
            mint NFTs, and earn rewards across Farcaster, Zora, Solana, and BASE.
          </p>
          <div className="flex gap-4 justify-center">
            <GlowButton onClick={() => console.log("Get started")}>
              🚀 Get Started
            </GlowButton>
            <button className={`px-6 py-3 rounded-lg font-semibold border ${neo.colors.border.glow} ${neo.colors.text.secondary} hover:${neo.colors.text.primary} transition-all`}>
              📚 View Docs
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
