"use client";
import { GlowCard } from "../components/GlowCard";
import { GlowDivider } from "../components/GlowDivider";

export function DashboardStat({
  label,
  value
}: {
  label: string;
  value: string | number;
}) {
  return (
    <GlowCard>
      <div className="text-xs text-neutral-400">{label}</div>
      <div className="text-2xl font-semibold text-emerald-400 mt-1">{value}</div>
    </GlowCard>
  );
}

export function DashboardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function DashboardSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <h2 className="text-sm font-semibold text-neutral-300 mb-2">{title}</h2>
      <GlowDivider />
      {children}
    </section>
  );
}
