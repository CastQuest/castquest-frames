"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuestCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [category, setCategory] = useState("daily");
  const [rewardType, setRewardType] = useState("points");
  const [rewardAmount, setRewardAmount] = useState("100");
  const [requirementType, setRequirementType] = useState("frames_created");
  const [requirementCount, setRequirementCount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate requirement count is a valid positive integer
      const parsedCount = parseInt(requirementCount, 10);
      if (isNaN(parsedCount) || parsedCount < 1) {
        setError("Requirement count must be a positive integer");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/quests/create", {
        method: "POST",
        body: JSON.stringify({ 
          title,
          description,
          difficulty,
          category,
          rewardType,
          rewardAmount: rewardAmount || undefined,
          requirementType,
          requirementData: {
            count: parsedCount,
          },
        }),
        headers: { "Content-Type": "application/json" },
      });
      
      const json = await res.json();
      
      if (json.ok && json.quest) {
        router.push(`/quests/${json.quest.id}`);
      } else {
        setError(json.error || "Failed to create quest");
      }
    } catch (err) {
      setError("Network error: Failed to create quest");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Create Quest</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-300">Title <span className="text-red-400">*</span></label>
          <input
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quest title"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-300">Description</label>
          <textarea
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm min-h-[80px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this quest about?"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-300">Difficulty <span className="text-red-400">*</span></label>
            <select
              className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-300">Category <span className="text-red-400">*</span></label>
            <select
              className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="special">Special</option>
              <option value="tutorial">Tutorial</option>
            </select>
          </div>
        </div>

        <div className="border border-zinc-700 rounded p-3 flex flex-col gap-2">
          <div className="text-xs text-zinc-400 uppercase">Reward Configuration</div>
          
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-300">Reward Type <span className="text-red-400">*</span></label>
              <select
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
                value={rewardType}
                onChange={(e) => setRewardType(e.target.value)}
                required
              >
                <option value="points">Points</option>
                <option value="tokens">Tokens</option>
                <option value="nft">NFT</option>
                <option value="badge">Badge</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-300">Reward Amount</label>
              <input
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                placeholder="100"
                type="text"
              />
            </div>
          </div>
        </div>

        <div className="border border-zinc-700 rounded p-3 flex flex-col gap-2">
          <div className="text-xs text-zinc-400 uppercase">Requirements</div>
          
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-300">Requirement Type <span className="text-red-400">*</span></label>
              <select
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
                value={requirementType}
                onChange={(e) => setRequirementType(e.target.value)}
                required
              >
                <option value="frames_created">Frames Created</option>
                <option value="frames_viewed">Frames Viewed</option>
                <option value="social_engagement">Social Engagement</option>
                <option value="quest_completion">Quest Completion</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-300">Count Required <span className="text-red-400">*</span></label>
              <input
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
                value={requirementCount}
                onChange={(e) => setRequirementCount(e.target.value)}
                placeholder="1"
                type="number"
                min="1"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="self-start px-3 py-1.5 bg-emerald-600 text-sm rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Quest'}
        </button>
      </form>
    </div>
  );
}
