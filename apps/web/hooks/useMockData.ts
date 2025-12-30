import { useState, useEffect } from "react";
import webContent from "../data/web-content.json";

/**
 * Type definitions for mock data
 */
interface Stats {
  totalFrames: number;
  liveFrames: number;
  activeQuests: number;
  totalParticipants: number;
  totalRewards: string;
  averageEngagement: string;
}

/**
 * useMockFrames Hook
 * 
 * Returns mock frame data for the WebFront UI.
 * 
 * INTEGRATION POINTS:
 * 
 * 1. Farcaster Integration:
 *    - Replace with Farcaster Frames API
 *    - Fetch frames from Farcaster protocol
 *    - Example: const { data } = useFarcasterFrames()
 * 
 * 2. Zora Integration:
 *    - Connect to Zora NFT marketplace
 *    - Fetch NFT collections and mints
 *    - Example: const { nfts } = useZoraNFTs()
 * 
 * 3. Onchain Data:
 *    - Use wagmi/viem for onchain queries
 *    - Fetch token balances, ownership data
 *    - Example: const { data } = useContractRead({ ... })
 * 
 * 4. Real-time Updates:
 *    - Replace with WebSocket connection
 *    - Subscribe to live frame updates
 *    - Example: useWebSocket('/api/frames/subscribe')
 */
export function useMockFrames() {
  const [frames, setFrames] = useState(webContent.frames as any);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Simulate API call
  useEffect(() => {
    setLoading(true);
    // In production: fetch('/api/frames')
    setTimeout(() => {
      setFrames(webContent.frames as any);
      setLoading(false);
    }, 300);
  }, []);

  const refetch = () => {
    setLoading(true);
    // In production: refetch from API
    setTimeout(() => {
      setFrames(webContent.frames as any);
      setLoading(false);
    }, 300);
  };

  return {
    frames,
    loading,
    error,
    refetch
  };
}

/**
 * useMockQuests Hook
 * 
 * Returns mock quest data for the WebFront UI.
 * 
 * INTEGRATION POINTS:
 * 
 * 1. CastQuest Protocol:
 *    - Connect to /api/quests endpoint
 *    - Fetch user progress and rewards
 *    - Example: const { quests } = useCastQuestAPI()
 * 
 * 2. Smart Contract Quests:
 *    - Read quest state from onchain contracts
 *    - Track completion and rewards
 *    - Example: const { questState } = useQuestContract(questId)
 * 
 * 3. User Progress:
 *    - Track authenticated user progress
 *    - Store completion state
 *    - Example: const { progress } = useUserProgress(userId)
 * 
 * 4. Reward Distribution:
 *    - Trigger token/NFT rewards on completion
 *    - Example: const { claimReward } = useRewardClaim()
 */
export function useMockQuests() {
  const [quests, setQuests] = useState(webContent.quests as any);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    // In production: fetch('/api/quests')
    setTimeout(() => {
      setQuests(webContent.quests as any);
      setLoading(false);
    }, 300);
  }, []);

  const startQuest = async (questId: string) => {
    // In production: POST /api/quests/:id/start
    console.log("Starting quest:", questId);
    // Return: { success: true, userQuestId: '...' }
  };

  const submitProgress = async (questId: string, step: number) => {
    // In production: POST /api/quests/:id/progress
    console.log("Submitting progress:", questId, step);
    // Return: { success: true, nextStep: number }
  };

  return {
    quests,
    loading,
    error,
    startQuest,
    submitProgress
  };
}

/**
 * useMockMedia Hook
 * 
 * Returns mock media data for the WebFront UI.
 * 
 * INTEGRATION POINTS:
 * 
 * 1. IPFS/Arweave:
 *    - Fetch media from decentralized storage
 *    - Example: const { mediaUrl } = useIPFS(cid)
 * 
 * 2. Streaming Services:
 *    - Integrate with video streaming platforms
 *    - Example: const { streamUrl } = useVideoStream(mediaId)
 * 
 * 3. NFT Metadata:
 *    - Parse NFT metadata for media assets
 *    - Example: const { metadata } = useNFTMetadata(tokenId)
 */
export function useMockMedia() {
  const [media, setMedia] = useState(webContent.media as any);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // In production: fetch('/api/media')
    setTimeout(() => {
      setMedia(webContent.media as any);
      setLoading(false);
    }, 300);
  }, []);

  return {
    media,
    loading
  };
}

/**
 * useMockStats Hook
 * 
 * Returns protocol statistics.
 * 
 * INTEGRATION POINTS:
 * 
 * 1. Analytics:
 *    - Connect to analytics service
 *    - Track real-time metrics
 *    - Example: const { stats } = useAnalytics()
 * 
 * 2. Onchain Metrics:
 *    - Query blockchain for TVL, volume, etc.
 *    - Example: const { tvl } = useTVL()
 */
export function useMockStats() {
  const [stats, setStats] = useState<Stats>(webContent.stats as Stats);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // In production: fetch('/api/stats')
    setTimeout(() => {
      setStats(webContent.stats as Stats);
      setLoading(false);
    }, 300);
  }, []);

  return {
    stats,
    loading
  };
}

/**
 * INTEGRATION DOCUMENTATION
 * 
 * This file provides mock data hooks for development.
 * 
 * FOR PRODUCTION:
 * 
 * 1. Replace mock data with real API calls
 * 2. Add authentication (JWT, wallet signatures)
 * 3. Implement error handling and retries
 * 4. Add caching with React Query or SWR
 * 5. Connect to blockchain providers (wagmi, ethers)
 * 6. Implement WebSocket for real-time updates
 * 
 * EXTERNAL SERVICES:
 * 
 * - Farcaster: https://docs.farcaster.xyz/
 * - Zora: https://docs.zora.co/
 * - Remix: Custom integration
 * - Twitter API: https://developer.twitter.com/
 * - Solana Web3.js: https://solana-labs.github.io/solana-web3.js/
 * - BASE (Coinbase L2): https://docs.base.org/
 * 
 * ONCHAIN INTEGRATION:
 * 
 * ```typescript
 * import { useContractRead, useContractWrite } from 'wagmi';
 * 
 * // Read quest state
 * const { data: questState } = useContractRead({
 *   address: QUEST_CONTRACT_ADDRESS,
 *   abi: QuestABI,
 *   functionName: 'getQuestState',
 *   args: [questId]
 * });
 * 
 * // Start quest onchain
 * const { write: startQuest } = useContractWrite({
 *   address: QUEST_CONTRACT_ADDRESS,
 *   abi: QuestABI,
 *   functionName: 'startQuest',
 *   args: [questId]
 * });
 * ```
 * 
 * FARCASTER FRAMES:
 * 
 * ```typescript
 * import { fetchFrames } from '@farcaster/frames-sdk';
 * 
 * const frames = await fetchFrames({
 *   filter: { status: 'live' },
 *   sort: 'trending'
 * });
 * ```
 * 
 * ZORA NFT MINTING:
 * 
 * ```typescript
 * import { useZoraMint } from '@zoralabs/zora-minting';
 * 
 * const { mint, status } = useZoraMint({
 *   contractAddress: COLLECTION_ADDRESS,
 *   tokenId: 1
 * });
 * ```
 */
