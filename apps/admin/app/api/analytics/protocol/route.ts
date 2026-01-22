import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@castquest/core-services';

const analyticsService = new AnalyticsService();

/**
 * GET /api/analytics/protocol - Get protocol-level metrics
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30');

    const metrics = await analyticsService.getProtocolMetrics(days);
    
    // Add additional protocol-specific metrics
    const protocolData = {
      ...metrics,
      tokens: {
        cast: {
          price: '$0.42',
          marketCap: '$4.2M',
          volume24h: '$124K',
          holders: 1523,
        },
        pic: {
          price: '$1.25',
          marketCap: '$12.5M',
          volume24h: '$456K',
          holders: 3421,
        },
        vid: {
          price: '$0.88',
          marketCap: '$8.8M',
          volume24h: '$234K',
          holders: 2156,
        },
      },
      tvl: {
        total: '$25.5M',
        change24h: 5.2,
        breakdown: {
          cast: '$10M',
          pic: '$10M',
          vid: '$5.5M',
        },
      },
      volume: {
        total24h: '$814K',
        total7d: '$5.2M',
        total30d: '$18.4M',
        change24h: 12.3,
      },
      transactions: {
        total24h: 3421,
        total7d: 24567,
        total30d: 98234,
        avgGasPrice: '0.002 ETH',
      },
    };

    return NextResponse.json({
      success: true,
      data: protocolData,
    });
  } catch (error: any) {
    console.error('Error getting protocol metrics:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get protocol metrics',
      },
      { status: 500 }
    );
  }
}
