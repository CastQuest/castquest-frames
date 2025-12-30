/**
 * CastQuest Core Services API Client
 * Fetches market data from Core Services backend
 */

const API_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:4000/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Fetch market signal data for a token
 */
export async function fetchMarketSignal(tokenAddress: string) {
  try {
    const response = await fetch(`${API_URL}/markets/${tokenAddress}`);
    const json: ApiResponse<any> = await response.json();
    
    if (!json.success || !json.data) {
      throw new Error(json.error?.message || 'Failed to fetch market signal');
    }
    
    const market = json.data.market;
    
    // Determine status based on 24h change
    let status: 'green' | 'red' | 'neutral' = 'neutral';
    const change = parseFloat(market.priceChange24h || '0');
    if (change >= 10) status = 'green';
    else if (change <= -10) status = 'red';
    
    return {
      tokenAddress: market.tokenAddress,
      ticker: market.ticker,
      name: market.ticker, // Use ticker as fallback
      currentPrice: market.currentPrice,
      priceChange24h: market.priceChange24h,
      volume24h: market.volume24h,
      marketCap: market.marketCap,
      holders: market.holders,
      status,
    };
  } catch (error) {
    console.error('Error fetching market signal:', error);
    throw error;
  }
}

/**
 * Fetch detailed token metrics
 */
export async function fetchTokenMetrics(tokenAddress: string) {
  try {
    const response = await fetch(`${API_URL}/media/by-address/${tokenAddress}`);
    const json: ApiResponse<any> = await response.json();
    
    if (!json.success || !json.data) {
      throw new Error(json.error?.message || 'Failed to fetch token metrics');
    }
    
    const media = json.data.media;
    
    return {
      tokenAddress: media.tokenAddress,
      ticker: media.ticker,
      name: media.name,
      description: media.description,
      mediaUrl: media.mediaUrl,
      thumbnailUrl: media.thumbnailUrl,
      currentPrice: media.currentPrice || '0',
      priceChange24h: '0', // Will be fetched from markets endpoint
      volume24h: '0',
      marketCap: media.marketCap || '0',
      totalSupply: media.totalSupply || '0',
      holders: 0,
      liquidity: '0',
      riskFlags: media.riskFlags || [],
      status: media.status,
    };
  } catch (error) {
    console.error('Error fetching token metrics:', error);
    throw error;
  }
}

/**
 * Fetch CAST protocol statistics
 */
export async function fetchCASTStats() {
  try {
    const response = await fetch(`${API_URL}/markets/signals?limit=1`);
    const json: ApiResponse<any> = await response.json();
    
    if (!json.success) {
      throw new Error(json.error?.message || 'Failed to fetch CAST stats');
    }
    
    // For now, return mock data - will be replaced with actual stats endpoint
    return {
      price: '0.05', // ETH
      marketCap: '5000000', // $5M
      totalSupply: '100000000',
      holders: 1250,
      totalFeesCollected: '50000', // ETH
      fees24h: '125',
      activeTokens: 5600,
      totalVolume24h: '1500000',
    };
  } catch (error) {
    console.error('Error fetching CAST stats:', error);
    throw error;
  }
}

/**
 * Format price from wei to readable ETH
 */
export function formatPrice(weiPrice: string): string {
  try {
    const eth = BigInt(weiPrice) / BigInt(10 ** 15); // Convert to milliETH
    return `${Number(eth) / 1000} ETH`;
  } catch {
    return '0 ETH';
  }
}

/**
 * Format large numbers with K/M/B suffixes
 */
export function formatLargeNumber(num: string | number): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  
  if (n >= 1_000_000_000) {
    return `${(n / 1_000_000_000).toFixed(2)}B`;
  } else if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(2)}M`;
  } else if (n >= 1_000) {
    return `${(n / 1_000).toFixed(2)}K`;
  }
  
  return n.toFixed(2);
}

/**
 * Format percentage change with sign and color
 */
export function formatPercentChange(change: string): { text: string; color: string } {
  const num = parseFloat(change || '0');
  const sign = num >= 0 ? '+' : '';
  
  let color = '#888888'; // neutral gray
  if (num >= 10) color = '#00FF00'; // green
  else if (num <= -10) color = '#FF0000'; // red
  else if (num > 0) color = '#88FF88'; // light green
  else if (num < 0) color = '#FF8888'; // light red
  
  return {
    text: `${sign}${num.toFixed(2)}%`,
    color,
  };
}
