/**
 * Tiny Market Signal Frame
 * Compact frame showing token ticker, price, and 24h change
 * Color-coded: Green (+10%), Red (-10%), Neutral (between)
 */

import { fetchMarketSignal } from '@/lib/api';
import { generateTinySignalSVG, svgToDataURL } from '@/lib/images';
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
    // Fetch market signal data
    const signal = await fetchMarketSignal(tokenAddress);
    
    // Generate frame image
    const svg = generateTinySignalSVG(signal);
    const imageUrl = svgToDataURL(svg);
    
    // Generate frame HTML with meta tags
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>$${signal.ticker} Market Signal</title>
          
          <!-- Open Graph -->
          <meta property="og:title" content="$${signal.ticker} - ${signal.currentPrice}">
          <meta property="og:image" content="${imageUrl}">
          
          <!-- Farcaster Frame -->
          <meta property="fc:frame" content="vNext">
          <meta property="fc:frame:image" content="${imageUrl}">
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1">
          <meta property="fc:frame:button:1" content="View Details">
          <meta property="fc:frame:button:1:action" content="post">
          <meta property="fc:frame:button:1:target" content="${request.nextUrl.origin}/api/frames/token-detail?token=${tokenAddress}">
          <meta property="fc:frame:button:2" content="Refresh">
          <meta property="fc:frame:button:2:action" content="post">
          <meta property="fc:frame:button:2:target" content="${request.url}">
          <meta property="fc:frame:button:3" content="Open CastQuest">
          <meta property="fc:frame:button:3:action" content="link">
          <meta property="fc:frame:button:3:target" content="https://castquest.xyz/token/${tokenAddress}">
        </head>
        <body style="margin:0;padding:20px;font-family:monospace;background:#0a0a0a;color:#fff;">
          <h1>$${signal.ticker} Market Signal</h1>
          <p>Price: ${signal.currentPrice}</p>
          <p>24h Change: ${signal.priceChange24h}%</p>
          <p>Status: ${signal.status.toUpperCase()}</p>
          <img src="${imageUrl}" alt="Market Signal" style="max-width:100%;border-radius:8px;margin-top:20px;">
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
      },
    });
  } catch (error) {
    console.error('Error generating tiny signal frame:', error);
    
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Error</title>
        </head>
        <body style="margin:0;padding:20px;font-family:monospace;background:#0a0a0a;color:#f00;">
          <h1>Error Loading Market Signal</h1>
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
  // Handle frame button clicks - just refresh for now
  return GET(request);
}
