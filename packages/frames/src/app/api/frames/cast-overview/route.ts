/**
 * CAST Protocol Overview Frame
 * Shows main protocol token stats, fees, and governance links
 */

import { fetchCASTStats } from '@/lib/api';
import { generateCASTOverviewSVG, svgToDataURL } from '@/lib/images';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Fetch protocol stats
    const stats = await fetchCASTStats();
    
    // Generate frame image
    const svg = generateCASTOverviewSVG(stats);
    const imageUrl = svgToDataURL(svg);
    
    // Generate frame HTML
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>$CAST Protocol Overview</title>
          
          <!-- Open Graph -->
          <meta property="og:title" content="$CAST Protocol - Decentralized Media Tokenization">
          <meta property="og:description" content="Price: ${stats.price} ETH | Market Cap: $${stats.marketCap}">
          <meta property="og:image" content="${imageUrl}">
          
          <!-- Farcaster Frame -->
          <meta property="fc:frame" content="vNext">
          <meta property="fc:frame:image" content="${imageUrl}">
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1">
          <meta property="fc:frame:button:1" content="Buy $CAST">
          <meta property="fc:frame:button:1:action" content="link">
          <meta property="fc:frame:button:1:target" content="https://castquest.xyz/trade/cast">
          <meta property="fc:frame:button:2" content="View Fees">
          <meta property="fc:frame:button:2:action" content="link">
          <meta property="fc:frame:button:2:target" content="https://castquest.xyz/protocol/fees">
          <meta property="fc:frame:button:3" content="Governance">
          <meta property="fc:frame:button:3:action" content="link">
          <meta property="fc:frame:button:3:target" content="https://castquest.xyz/governance">
          <meta property="fc:frame:button:4" content="Learn More">
          <meta property="fc:frame:button:4:action" content="link">
          <meta property="fc:frame:button:4:target" content="https://castquest.xyz/about">
        </head>
        <body style="margin:0;padding:20px;font-family:monospace;background:#1a0a2a;color:#fff;">
          <h1>$CAST Protocol Overview</h1>
          <div style="margin-top:20px;">
            <h2>Token Stats</h2>
            <p><strong>Price:</strong> ${stats.price} ETH</p>
            <p><strong>Market Cap:</strong> $${stats.marketCap}</p>
            <p><strong>Holders:</strong> ${stats.holders}</p>
          </div>
          <div style="margin-top:20px;">
            <h2>Protocol Metrics</h2>
            <p><strong>24h Fees Collected:</strong> ${stats.fees24h} ETH</p>
            <p><strong>24h Volume:</strong> $${stats.totalVolume24h}</p>
            <p><strong>Active Tokens:</strong> ${stats.activeTokens}</p>
          </div>
          <img src="${imageUrl}" alt="CAST Protocol" style="max-width:100%;border-radius:8px;margin-top:20px;">
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Error generating CAST overview frame:', error);
    
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Error</title>
        </head>
        <body style="margin:0;padding:20px;font-family:monospace;background:#1a0a2a;color:#f00;">
          <h1>Error Loading $CAST Protocol Stats</h1>
          <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
        </body>
      </html>
    `;
    
    return new NextResponse(errorHtml, {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

export async function POST(request: NextRequest) {
  // All buttons are links, so just return the same frame
  return GET(request);
}
