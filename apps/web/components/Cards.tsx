import { neo } from "@castquest/neo-ux-core";
import { StatusBadge, TokenBadge, IntegrationBadge, EngagementStats } from "./Badges";

interface Frame {
  id: string;
  title: string;
  description: string;
  mediaType: string;
  mediaUrl: string;
  status: "live" | "active" | "draft";
  casts: number;
  recasts: number;
  likes: number;
  tokenTicker: string;
  tokenPrice: string;
  tags: string[];
  integrations: string[];
  createdAt: string;
}

interface FrameCardProps {
  frame: Frame;
  onCast?: () => void;
  onView?: () => void;
}

export function FrameCard({ frame, onCast, onView }: FrameCardProps) {
  const glowClass = frame.status === "live" 
    ? neo.glow.success 
    : frame.status === "active" 
    ? neo.glow.active 
    : "";

  return (
    <div 
      className={`${neo.colors.bg.secondary} border ${neo.colors.border.glow} rounded-lg overflow-hidden ${glowClass} transition-all duration-300 hover:scale-[1.02]`}
    >
      {/* Media Preview */}
      <div className="relative h-48 bg-neutral-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20" />
        <div className="absolute top-3 left-3 flex gap-2">
          <StatusBadge status={frame.status} size="sm" />
          <TokenBadge ticker={frame.tokenTicker} price={frame.tokenPrice} size="sm" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-30">
            {frame.mediaType === "video" ? "🎥" : frame.mediaType === "audio" ? "🎵" : frame.mediaType === "interactive" ? "🎮" : "🖼️"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`${neo.spacing.card} space-y-3`}>
        <div>
          <h3 className={`font-bold ${neo.colors.text.primary} line-clamp-1`}>
            {frame.title}
          </h3>
          <p className={`text-xs ${neo.colors.text.tertiary} mt-1 line-clamp-2`}>
            {frame.description}
          </p>
        </div>

        {/* Engagement */}
        <EngagementStats 
          casts={frame.casts} 
          recasts={frame.recasts} 
          likes={frame.likes} 
          compact 
        />

        {/* Integrations */}
        <div className="flex items-center gap-1.5">
          {frame.integrations.map((platform) => (
            <IntegrationBadge 
              key={platform} 
              platform={platform as any} 
              size="sm" 
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-neutral-800">
          <button
            onClick={onView}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded ${neo.colors.text.accent} hover:${neo.colors.text.primary} border ${neo.colors.border.glow} hover:${neo.glow.active} transition-all`}
          >
            View Frame
          </button>
          <button
            onClick={onCast}
            className={`py-2 px-4 text-xs font-semibold rounded ${neo.colors.text.primary} bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 ${neo.glow.success} transition-all`}
          >
            Cast
          </button>
        </div>
      </div>
    </div>
  );
}

interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "easy" | "intermediate" | "advanced";
  status: "active" | "upcoming" | "completed";
  reward: string;
  participants: number;
  completed: number;
  steps: number;
  estimatedTime: string;
  tags: string[];
}

interface QuestCardProps {
  quest: Quest;
  onStart?: () => void;
}

export function QuestCard({ quest, onStart }: QuestCardProps) {
  const difficultyColor = {
    beginner: "text-green-400",
    easy: "text-cyan-400",
    intermediate: "text-yellow-400",
    advanced: "text-red-400"
  }[quest.difficulty];

  const completionRate = quest.participants > 0 
    ? Math.round((quest.completed / quest.participants) * 100) 
    : 0;

  return (
    <div 
      className={`${neo.colors.bg.secondary} border ${neo.colors.border.glow} rounded-lg ${neo.spacing.card} ${neo.glow.idle} hover:${neo.glow.active} transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`font-bold ${neo.colors.text.primary} mb-1`}>
            {quest.title}
          </h3>
          <p className={`text-xs ${neo.colors.text.tertiary} line-clamp-2`}>
            {quest.description}
          </p>
        </div>
        <StatusBadge status={quest.status} size="sm" />
      </div>

      {/* Quest Metadata */}
      <div className="grid grid-cols-2 gap-3 py-3 border-y border-neutral-800">
        <div>
          <div className={`text-[10px] ${neo.colors.text.tertiary} uppercase mb-1`}>
            Difficulty
          </div>
          <div className={`text-sm font-semibold ${difficultyColor} capitalize`}>
            {quest.difficulty}
          </div>
        </div>
        <div>
          <div className={`text-[10px] ${neo.colors.text.tertiary} uppercase mb-1`}>
            Reward
          </div>
          <div className={`text-sm font-semibold ${neo.colors.text.accent}`}>
            {quest.reward}
          </div>
        </div>
        <div>
          <div className={`text-[10px] ${neo.colors.text.tertiary} uppercase mb-1`}>
            Steps
          </div>
          <div className={`text-sm font-semibold ${neo.colors.text.secondary}`}>
            {quest.steps} steps
          </div>
        </div>
        <div>
          <div className={`text-[10px] ${neo.colors.text.tertiary} uppercase mb-1`}>
            Time
          </div>
          <div className={`text-sm font-semibold ${neo.colors.text.secondary}`}>
            {quest.estimatedTime}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span className={neo.colors.text.tertiary}>Completion Rate</span>
          <span className={neo.colors.text.secondary}>{completionRate}%</span>
        </div>
        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r from-purple-500 to-cyan-500 ${neo.glow.active}`}
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className={`text-xs ${neo.colors.text.tertiary} mt-1`}>
          {quest.completed.toLocaleString()} / {quest.participants.toLocaleString()} completed
        </div>
      </div>

      {/* Action */}
      <button
        onClick={onStart}
        disabled={quest.status !== "active"}
        className={`w-full mt-4 py-2.5 px-4 text-sm font-semibold rounded ${neo.colors.text.primary} ${
          quest.status === "active" 
            ? `bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 border ${neo.colors.border.glow} ${neo.glow.active}` 
            : "bg-neutral-800 border border-neutral-700 opacity-50 cursor-not-allowed"
        } transition-all`}
      >
        {quest.status === "active" ? "Start Quest" : quest.status === "upcoming" ? "Coming Soon" : "Completed"}
      </button>
    </div>
  );
}

interface Media {
  id: string;
  title: string;
  type: string;
  url: string;
  thumbnail: string;
  duration?: string;
  views: number;
  tags: string[];
}

interface MediaCardProps {
  media: Media;
  onPlay?: () => void;
}

export function MediaCard({ media, onPlay }: MediaCardProps) {
  return (
    <div 
      className={`${neo.colors.bg.secondary} border ${neo.colors.border.default} rounded-lg overflow-hidden hover:border-emerald-500/30 ${neo.glow.idle} hover:${neo.glow.active} transition-all duration-300 cursor-pointer`}
      onClick={onPlay}
    >
      <div className="relative h-40 bg-neutral-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl opacity-20">
            {media.type === "video" ? "▶️" : media.type === "interactive" ? "🎮" : "🖼️"}
          </span>
        </div>
        {media.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded text-xs text-neutral-300">
            {media.duration}
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className={`text-sm font-semibold ${neo.colors.text.primary} mb-1 line-clamp-1`}>
          {media.title}
        </h4>
        <div className={`text-xs ${neo.colors.text.tertiary}`}>
          {media.views.toLocaleString()} views
        </div>
      </div>
    </div>
  );
}
