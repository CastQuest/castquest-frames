/**
 * Token Detail Frame
 * Full metrics view with charts, volume, holders, and trading actions
 */

import { fetchMarketSignal, fetchTokenMetrics } from '@/lib/api';
import { generateTokenDetailSVG, svgToDataURL } from '@/lib/images';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenAddress = searchParams.get('token');
  
  if (!tokenAddress) {
    return NextResponse.json(
      { error: 'Token address required' },
      { status: 400 }
    );
  }
  
  try {
    // Fetch detailed metrics and market data
    const [metrics, marketData] = await Promise.all([
      fetchTokenMetrics(tokenAddress),
      fetchMarketSignal(tokenAddress),
    ]);
    
    // Merge data
    const fullMetrics = {
      ...metrics,
      priceChange24h: marketData.priceChange24h,
      volume24h: marketData.volume24h,
      holders: marketData.holders || 0,
    };
    
    // Generate frame image
    const svg = generateTokenDetailSVG(fullMetrics);
    const imageUrl = svgToDataURL(svg);
    
    // Generate frame HTML
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>$${metrics.ticker} - ${metrics.name}</title>
          
          <!-- Open Graph -->
          <meta property="og:title" content="$${metrics.ticker} - ${metrics.name}">
          <meta property="og:description" content="${metrics.description || 'CastQuest token details'}">
          <meta property="og:image" content="${imageUrl}">
          
          <!-- Farcaster Frame -->
          <meta property="fc:frame" content="vNext">
          <meta property="fc:frame:image" content="${imageUrl}">
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1">
          <meta property="fc:frame:button:1" content="Buy">
          <meta property="fc:frame:button:1:action" content="link">
          <meta property="fc:frame:button:1:target" content="https://castquest.xyz/trade/${tokenAddress}?action=buy">
          <meta property="fc:frame:button:2" content="Sell">
          <meta property="fc:frame:button:2:action" content="link">
          <meta property="fc:frame:button:2:target" content="https://castquest.xyz/trade/${tokenAddress}?action=sell">
          <meta property="fc:frame:button:3" content="Explorer">
          <meta property="fc:frame:button:3:action" content="link">
          <meta property="fc:frame:button:3:target" content="https://basescan.org/token/${tokenAddress}">
          <meta property="fc:frame:button:4" content="Back">
          <meta property="fc:frame:button:4:action" content="post">
          <meta property="fc:frame:button:4:target" content="${request.nextUrl.origin}/api/frames/tiny-signal?token=${tokenAddress}">
        </head>
        <body style="margin:0;padding:20px;font-family:monospace;background:#0a0a0a;color:#fff;">
          <h1>$${metrics.ticker} - ${metrics.name}</h1>
          <p>${metrics.description}</p>
          <div style="margin-top:20px;">
            <p><strong>Price:</strong> ${fullMetrics.currentPrice}</p>
            <p><strong>24h Change:</strong> ${fullMetrics.priceChange24h}%</p>
            <p><strong>Volume:</strong> ${fullMetrics.volume24h}</p>
            <p><strong>Market Cap:</strong> ${fullMetrics.marketCap}</p>
            <p><strong>Holders:</strong> ${fullMetrics.holders}</p>
          </div>
          <img src="${imageUrl}" alt="Token Details" style="max-width:100%;border-radius:8px;margin-top:20px;">
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=120', // Cache for 2 minutes
      },
    });
  } catch (error) {
    console.error('Error generating token detail frame:', error);
    
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Error</title>
        </head>
        <body style="margin:0;padding:20px;font-family:monospace;background:#0a0a0a;color:#f00;">
          <h1>Error Loading Token Details</h1>
          <p>Token address: ${tokenAddress}</p>
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
  // Handle frame button clicks - redirect to appropriate page
  const { searchParams } = new URL(request.url);
  const buttonIndex = searchParams.get('buttonIndex');
  
  if (buttonIndex === '4') {
    // Back button - return to tiny signal
    return GET(request);
  }
  
  // For other buttons, return the same frame (links handle navigation)
  return GET(request);
}
