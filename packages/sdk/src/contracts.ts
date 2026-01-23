/**
 * CastQuest V3 Contract Configuration
 * 
 * This module provides contract addresses and ABIs for all CastQuest V3 contracts
 * across different networks.
 */

// Contract addresses by chain ID
export const CONTRACT_ADDRESSES = {
  // Base Mainnet (8453)
  8453: {
    CASTToken: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    SponsorToken: '0x0000000000000000000000000000000000000000',
    MediaRegistry: '0x0000000000000000000000000000000000000000',
    MediaTokenFactory: '0x0000000000000000000000000000000000000000',
    FeeManagerV3: '0x0000000000000000000000000000000000000000',
    FeeRouter: '0x0000000000000000000000000000000000000000',
    MediaMarket: '0x0000000000000000000000000000000000000000',
    Marketplace: '0x0000000000000000000000000000000000000000',
    QuestToken: '0x0000000000000000000000000000000000000000',
    GameToken: '0x0000000000000000000000000000000000000000',
    CodeToken: '0x0000000000000000000000000000000000000000',
    GovernanceV2: '0x0000000000000000000000000000000000000000',
  },
  // Base Sepolia (84532)
  84532: {
    CASTToken: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    SponsorToken: '0x0000000000000000000000000000000000000000',
    MediaRegistry: '0x0000000000000000000000000000000000000000',
    MediaTokenFactory: '0x0000000000000000000000000000000000000000',
    FeeManagerV3: '0x0000000000000000000000000000000000000000',
    FeeRouter: '0x0000000000000000000000000000000000000000',
    MediaMarket: '0x0000000000000000000000000000000000000000',
    Marketplace: '0x0000000000000000000000000000000000000000',
    QuestToken: '0x0000000000000000000000000000000000000000',
    GameToken: '0x0000000000000000000000000000000000000000',
    CodeToken: '0x0000000000000000000000000000000000000000',
    GovernanceV2: '0x0000000000000000000000000000000000000000',
  },
  // Optimism Mainnet (10)
  10: {
    CASTToken: '0x0000000000000000000000000000000000000000',
    SponsorToken: '0x0000000000000000000000000000000000000000',
    MediaRegistry: '0x0000000000000000000000000000000000000000',
    MediaTokenFactory: '0x0000000000000000000000000000000000000000',
    FeeManagerV3: '0x0000000000000000000000000000000000000000',
    FeeRouter: '0x0000000000000000000000000000000000000000',
    MediaMarket: '0x0000000000000000000000000000000000000000',
    Marketplace: '0x0000000000000000000000000000000000000000',
    QuestToken: '0x0000000000000000000000000000000000000000',
    GameToken: '0x0000000000000000000000000000000000000000',
    CodeToken: '0x0000000000000000000000000000000000000000',
    GovernanceV2: '0x0000000000000000000000000000000000000000',
  },
  // Local (31337)
  31337: {
    CASTToken: '0x0000000000000000000000000000000000000000',
    SponsorToken: '0x0000000000000000000000000000000000000000',
    MediaRegistry: '0x0000000000000000000000000000000000000000',
    MediaTokenFactory: '0x0000000000000000000000000000000000000000',
    FeeManagerV3: '0x0000000000000000000000000000000000000000',
    FeeRouter: '0x0000000000000000000000000000000000000000',
    MediaMarket: '0x0000000000000000000000000000000000000000',
    Marketplace: '0x0000000000000000000000000000000000000000',
    QuestToken: '0x0000000000000000000000000000000000000000',
    GameToken: '0x0000000000000000000000000000000000000000',
    CodeToken: '0x0000000000000000000000000000000000000000',
    GovernanceV2: '0x0000000000000000000000000000000000000000',
  },
} as const;

export type ChainId = keyof typeof CONTRACT_ADDRESSES;
export type ContractName = keyof typeof CONTRACT_ADDRESSES[ChainId];

/**
 * Get contract address for a specific chain and contract name
 */
export function getContractAddress(
  chainId: ChainId,
  contractName: ContractName
): string {
  const addresses = CONTRACT_ADDRESSES[chainId];
  if (!addresses) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  
  const address = addresses[contractName as keyof typeof addresses];
  if (!address || address === '0x0000000000000000000000000000000000000000') {
    throw new Error(`Contract ${contractName} not deployed on chain ${chainId}`);
  }
  
  return address;
}

/**
 * Check if a contract is deployed on a specific chain
 */
export function isContractDeployed(
  chainId: ChainId,
  contractName: ContractName
): boolean {
  try {
    const address = getContractAddress(chainId, contractName);
    return address !== '0x0000000000000000000000000000000000000000';
  } catch {
    return false;
  }
}

/**
 * Get all contract addresses for a chain
 */
export function getChainContracts(chainId: ChainId) {
  return CONTRACT_ADDRESSES[chainId];
}

/**
 * Supported chain IDs
 */
export const SUPPORTED_CHAINS = Object.keys(CONTRACT_ADDRESSES).map(Number);

/**
 * Chain names
 */
export const CHAIN_NAMES: Record<ChainId, string> = {
  8453: 'Base',
  84532: 'Base Sepolia',
  10: 'Optimism',
  31337: 'Local',
};

/**
 * Get chain name
 */
export function getChainName(chainId: ChainId): string {
  return CHAIN_NAMES[chainId] || 'Unknown';
}
