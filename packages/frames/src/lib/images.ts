/**
 * Frame Image Generation Utilities
 * Generates SVG images for frame displays
 */

import type { CASTProtocolStats, MarketSignal, TokenMetrics } from '../types';
import { formatLargeNumber, formatPercentChange, formatPrice } from './api';

const FRAME_WIDTH = 1200;
const FRAME_HEIGHT = 630;

/**
 * Generate SVG for tiny market signal
 */
export function generateTinySignalSVG(signal: MarketSignal): string {
  const priceFormatted = formatPrice(signal.currentPrice);
  const changeFormatted = formatPercentChange(signal.priceChange24h);
  
  // Status indicator color
  const statusColor = signal.status === 'green' ? '#00FF00' : 
                     signal.status === 'red' ? '#FF0000' : '#888888';
  
  return `
    <svg width="${FRAME_WIDTH}" height="${FRAME_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bg)"/>
      
      <!-- Border -->
      <rect x="20" y="20" width="${FRAME_WIDTH - 40}" height="${FRAME_HEIGHT - 40}" 
            fill="none" stroke="${statusColor}" stroke-width="3" rx="12"/>
      
      <!-- Status Indicator -->
      <circle cx="80" cy="80" r="25" fill="${statusColor}" opacity="0.3"/>
      <circle cx="80" cy="80" r="15" fill="${statusColor}"/>
      
      <!-- Ticker -->
      <text x="140" y="95" font-family="monospace" font-size="48" font-weight="bold" 
            fill="#ffffff">$${signal.ticker}</text>
      
      <!-- Price -->
      <text x="80" y="${FRAME_HEIGHT / 2 + 20}" font-family="monospace" font-size="64" 
            font-weight="bold" fill="#ffffff">${priceFormatted}</text>
      
      <!-- 24h Change -->
      <text x="80" y="${FRAME_HEIGHT / 2 + 90}" font-family="monospace" font-size="48" 
            fill="${changeFormatted.color}">${changeFormatted.text} 24h</text>
      
      <!-- CastQuest Logo -->
      <text x="${FRAME_WIDTH - 250}" y="${FRAME_HEIGHT - 50}" font-family="monospace" 
            font-size="24" fill="#666666">CastQuest</text>
    </svg>
  `.trim();
}

/**
 * Generate SVG for detailed token frame
 */
export function generateTokenDetailSVG(metrics: TokenMetrics): string {
  const priceFormatted = formatPrice(metrics.currentPrice);
  const changeFormatted = formatPercentChange(metrics.priceChange24h);
  const volumeFormatted = formatLargeNumber(metrics.volume24h);
  const holdersFormatted = formatLargeNumber(metrics.holders);
  const mcapFormatted = formatLargeNumber(metrics.marketCap);
  
  return `
    <svg width="${FRAME_WIDTH}" height="${FRAME_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="detailBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a1a2a;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#detailBg)"/>
      
      <!-- Header -->
      <rect x="0" y="0" width="100%" height="100" fill="#1a1a2a"/>
      <text x="40" y="65" font-family="monospace" font-size="42" font-weight="bold" 
            fill="#ffffff">$${metrics.ticker} - ${metrics.name}</text>
      
      <!-- Price Section -->
      <text x="40" y="180" font-family="monospace" font-size="28" fill="#888888">Price</text>
      <text x="40" y="235" font-family="monospace" font-size="56" font-weight="bold" 
            fill="#ffffff">${priceFormatted}</text>
      <text x="40" y="285" font-family="monospace" font-size="36" 
            fill="${changeFormatted.color}">${changeFormatted.text}</text>
      
      <!-- Metrics Grid -->
      <g transform="translate(40, 340)">
        <!-- Volume -->
        <text x="0" y="0" font-family="monospace" font-size="22" fill="#888888">24h Volume</text>
        <text x="0" y="40" font-family="monospace" font-size="32" font-weight="bold" 
              fill="#ffffff">${volumeFormatted} ETH</text>
        
        <!-- Market Cap -->
        <text x="350" y="0" font-family="monospace" font-size="22" fill="#888888">Market Cap</text>
        <text x="350" y="40" font-family="monospace" font-size="32" font-weight="bold" 
              fill="#ffffff">$${mcapFormatted}</text>
        
        <!-- Holders -->
        <text x="700" y="0" font-family="monospace" font-size="22" fill="#888888">Holders</text>
        <text x="700" y="40" font-family="monospace" font-size="32" font-weight="bold" 
              fill="#ffffff">${holdersFormatted}</text>
      </g>
      
      <!-- Footer -->
      <text x="40" y="${FRAME_HEIGHT - 40}" font-family="monospace" font-size="24" 
            fill="#666666">Tap to trade on CastQuest</text>
    </svg>
  `.trim();
}

/**
 * Generate SVG for CAST protocol overview
 */
export function generateCASTOverviewSVG(stats: CASTProtocolStats): string {
  const priceFormatted = formatPrice(stats.price);
  const mcapFormatted = formatLargeNumber(stats.marketCap);
  const holdersFormatted = formatLargeNumber(stats.holders);
  const volumeFormatted = formatLargeNumber(stats.totalVolume24h);
  const feesFormatted = formatLargeNumber(stats.fees24h);
  
  return `
    <svg width="${FRAME_WIDTH}" height="${FRAME_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="castBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a0a2a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0a0a1a;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#castBg)"/>
      
      <!-- Header -->
      <rect x="0" y="0" width="100%" height="120" fill="#2a1a3a" opacity="0.8"/>
      <text x="40" y="75" font-family="monospace" font-size="52" font-weight="bold" 
            fill="#FF00FF">$CAST Protocol</text>
      
      <!-- Main Stats -->
      <g transform="translate(40, 180)">
        <text x="0" y="0" font-family="monospace" font-size="28" fill="#888888">Token Price</text>
        <text x="0" y="50" font-family="monospace" font-size="48" font-weight="bold" 
              fill="#ffffff">${priceFormatted}</text>
        
        <text x="450" y="0" font-family="monospace" font-size="28" fill="#888888">Market Cap</text>
        <text x="450" y="50" font-family="monospace" font-size="48" font-weight="bold" 
              fill="#ffffff">$${mcapFormatted}</text>
      </g>
      
      <!-- Protocol Metrics -->
      <g transform="translate(40, 340)">
        <text x="0" y="0" font-family="monospace" font-size="24" fill="#888888">24h Fees</text>
        <text x="0" y="40" font-family="monospace" font-size="32" font-weight="bold" 
              fill="#00FF00">${feesFormatted} ETH</text>
        
        <text x="300" y="0" font-family="monospace" font-size="24" fill="#888888">24h Volume</text>
        <text x="300" y="40" font-family="monospace" font-size="32" font-weight="bold" 
              fill="#ffffff">$${volumeFormatted}</text>
        
        <text x="650" y="0" font-family="monospace" font-size="24" fill="#888888">Holders</text>
        <text x="650" y="40" font-family="monospace" font-size="32" font-weight="bold" 
              fill="#ffffff">${holdersFormatted}</text>
        
        <text x="900" y="0" font-family="monospace" font-size="24" fill="#888888">Active Tokens</text>
        <text x="900" y="40" font-family="monospace" font-size="32" font-weight="bold" 
              fill="#FF00FF">${formatLargeNumber(stats.activeTokens)}</text>
      </g>
      
      <!-- Footer -->
      <text x="40" y="${FRAME_HEIGHT - 40}" font-family="monospace" font-size="24" 
            fill="#666666">Learn more at castquest.xyz</text>
    </svg>
  `.trim();
}

/**
 * Convert SVG to data URL for frame image
 */
export function svgToDataURL(svg: string): string {
  const encoded = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${encoded}`;
}
