"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Badge,
  Surface,
  Navbar,
} from "@castquest/neo-ux-core";

import {
  FrameCard,
  QuestCard,
  MediaCard
} from "../components/Cards";

import {
  useMockFrames,
  useMockQuests,
  useMockMedia,
  useMockStats
} from "../hooks/useMockData";

export default function WebFrontMega() {
  const { frames, loading: framesLoading } = useMockFrames();
  const { quests, loading: questsLoading } = useMockQuests();
  const { media, loading: mediaLoading } = useMockMedia();
  const { stats } = useMockStats();

  const [activeTab, setActiveTab] =
    useState<"frames" | "quests" | "media">("frames");

  return (
    <div className="min-h-screen bg-[var(--neo-bg)] text-[var(--neo-text-primary)]">

      {/* NAVBAR */}
      <Navbar
        logo={<span style={{ fontWeight: 700 }}>CastQuest</span>}
        links={[
          { label: "Home", href: "/", active: true },
          { label: "Dashboard", href: "/dashboard" },
          { label: "Agents", href: "/dashboard/agents" },
          { label: "Frames", href: "/dashboard/frames" }
        ]}
        rightSlot={<Badge label="V3" tone="accent" />}
      />

      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.1),transparent_50%)]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

          <div className="inline-block mb-6 px-4 py-2 rounded-full border border-[var(--neo-accent)] bg-[rgba(0,245,255,0.1)]">
            <span className="text-sm font-bold text-[var(--neo-accent)] uppercase tracking-wide">
              🚀 Decentralized Protocol Universe
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            CastQuest
          </h1>

          <p className="text-xl md:text-2xl text-[var(--neo-text-secondary)] mb-4 max-w-3xl mx-auto">
            Create, Cast, and Conquer in the Sovereign Web3 Media Hub
          </p>

          <p className="text-sm text-[var(--neo-text-muted)] mb-8 max-w-2xl mx-auto">
            Powered by Farcaster, Zora, Solana, BASE, and the Neo Glow Protocol.
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <Button variant="primary" onClick={() => window.location.href = "/dashboard"}>
              🎯 View Quests
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/admin/dashboard"}>
              ⚡ Operator Dashboard
            </Button>
          </div>

          {/* Stats */}
          <Surface elevated glow style={{ display: "inline-block" }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card title="Total Frames">{stats?.totalFrames ?? 0}</Card>
              <Card title="Live Frames">{stats?.liveFrames ?? 0}</Card>
              <Card title="Active Quests">{stats?.activeQuests ?? 0}</Card>
              <Card title="Participants">{stats?.totalParticipants?.toLocaleString() ?? 0}</Card>
            </div>
          </Surface>
        </div>
      </section>

      {/* TABS */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="flex justify-center gap-4 mb-12">
          {[
            { id: "frames", label: "🖼️ Frames", count: frames.length },
            { id: "quests", label: "🎯 Quests", count: quests.length },
            { id: "media", label: "📺 Media", count: media.length },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "primary" : "ghost"}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.label}
              <Badge
                label={String(tab.count)}
                tone={activeTab === tab.id ? "accent" : "neutral"}
              />
            </Button>
          ))}
        </div>

        {/* FRAMES */}
        {activeTab === "frames" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Featured Frames</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {frames.map((frame) => (
                <FrameCard key={frame.id} frame={frame} />
              ))}
            </div>
          </div>
        )}

        {/* QUESTS */}
        {activeTab === "quests" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Active Quests</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          </div>
        )}

        {/* MEDIA */}
        {activeTab === "media" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Protocol Media</h2>
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
              {media.map((item) => (
                <MediaCard key={item.id} media={item} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 mb-16">
        <Surface elevated glow style={{ textAlign: "center", padding: "48px" }}>
          <h2 className="text-3xl font-bold mb-4">Ready to Build on CastQuest?</h2>
          <p className="text-lg text-[var(--neo-text-secondary)] mb-8 max-w-2xl mx-auto">
            Join the decentralized protocol universe.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary">🚀 Get Started</Button>
            <Button variant="outline">📚 View Docs</Button>
          </div>
        </Surface>
      </section>
    </div>
  );
}
