import { neo } from "@castquest/neo-ux-core";

interface StatusBadgeProps {
  status: "live" | "active" | "draft" | "completed" | "upcoming";
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const sizeClasses = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1";
  
  const statusConfig = {
    live: {
      color: "text-emerald-400",
      glow: neo.glow.success,
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      label: "LIVE"
    },
    active: {
      color: "text-cyan-400",
      glow: neo.glow.active,
      border: "border-cyan-500/30",
      bg: "bg-cyan-500/10",
      label: "ACTIVE"
    },
    draft: {
      color: "text-neutral-500",
      glow: "",
      border: "border-neutral-700/30",
      bg: "bg-neutral-800/10",
      label: "DRAFT"
    },
    completed: {
      color: "text-purple-400",
      glow: neo.glow.purple,
      border: "border-purple-500/30",
      bg: "bg-purple-500/10",
      label: "COMPLETED"
    },
    upcoming: {
      color: "text-yellow-400",
      glow: neo.glow.warning,
      border: "border-yellow-500/30",
      bg: "bg-yellow-500/10",
      label: "UPCOMING"
    }
  };

  const config = statusConfig[status];

  return (
    <span 
      className={`inline-flex items-center ${sizeClasses} rounded-full border font-bold uppercase ${config.color} ${config.border} ${config.bg} ${config.glow}`}
    >
      {config.label}
    </span>
  );
}

interface TokenBadgeProps {
  ticker: string;
  price: string;
  size?: "sm" | "md";
}

export function TokenBadge({ ticker, price, size = "md" }: TokenBadgeProps) {
  const sizeClasses = size === "sm" 
    ? "text-[10px] px-2 py-0.5" 
    : "text-xs px-3 py-1.5";

  return (
    <div 
      className={`inline-flex items-center gap-1.5 ${sizeClasses} rounded-lg border ${neo.colors.border.glow} bg-gradient-to-r from-purple-500/10 to-cyan-500/10 ${neo.glow.idle}`}
    >
      <span className="text-purple-400 font-bold">${ticker}</span>
      <span className={neo.colors.text.tertiary}>•</span>
      <span className="text-cyan-400 font-semibold">{price}</span>
    </div>
  );
}

interface IntegrationBadgeProps {
  platform: "farcaster" | "zora" | "remix" | "twitter" | "solana" | "base";
  size?: "sm" | "md";
}

export function IntegrationBadge({ platform, size = "sm" }: IntegrationBadgeProps) {
  const sizeClasses = size === "sm" ? "w-5 h-5 text-[10px]" : "w-6 h-6 text-xs";
  
  const platformConfig = {
    farcaster: { icon: "🎭", color: "text-purple-400", label: "Farcaster" },
    zora: { icon: "⚡", color: "text-cyan-400", label: "Zora" },
    remix: { icon: "🎵", color: "text-pink-400", label: "Remix" },
    twitter: { icon: "🐦", color: "text-blue-400", label: "Twitter" },
    solana: { icon: "◎", color: "text-emerald-400", label: "Solana" },
    base: { icon: "🔵", color: "text-blue-500", label: "BASE" }
  };

  const config = platformConfig[platform];

  return (
    <div 
      className={`inline-flex items-center justify-center ${sizeClasses} rounded ${config.color} bg-neutral-800/50 border ${neo.colors.border.default}`}
      title={config.label}
    >
      {config.icon}
    </div>
  );
}

interface EngagementStatsProps {
  casts?: number;
  recasts?: number;
  likes?: number;
  compact?: boolean;
}

export function EngagementStats({ casts = 0, recasts = 0, likes = 0, compact = false }: EngagementStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const stats = [
    { label: "Cast", value: casts, icon: "📤" },
    { label: "ReCast", value: recasts, icon: "🔁" },
    { label: "Likes", value: likes, icon: "❤️" }
  ];

  return (
    <div className={`flex ${compact ? "gap-2" : "gap-4"} text-xs ${neo.colors.text.tertiary}`}>
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-1">
          <span>{stat.icon}</span>
          <span className={neo.colors.text.secondary}>{formatNumber(stat.value)}</span>
        </div>
      ))}
    </div>
  );
}
