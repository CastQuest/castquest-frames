import { NextRequest, NextResponse } from 'next/server';
import { RiskService } from '@castquest/core-services';

const riskService = new RiskService();

/**
 * GET /api/admin/risk - Get risk management data
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenAddress = searchParams.get('tokenAddress');

    if (tokenAddress) {
      // Get risk assessment for specific token
      const assessment = await riskService.getLatestAssessment(tokenAddress);
      
      return NextResponse.json({
        success: true,
        data: assessment,
      });
    }

    // Get overview of high-risk items
    const mockRiskOverview = {
      summary: {
        totalAssessed: 1523,
        highRisk: 34,
        mediumRisk: 156,
        lowRisk: 1333,
        pending: 89,
      },
      recentHighRisk: [
        {
          tokenAddress: '0x1234...5678',
          riskScore: 85,
          riskLevel: 'high',
          flags: ['suspicious_pattern', 'high_volatility'],
          assessedAt: new Date().toISOString(),
        },
        {
          tokenAddress: '0xabcd...efgh',
          riskScore: 78,
          riskLevel: 'high',
          flags: ['unusual_activity'],
          assessedAt: new Date().toISOString(),
        },
      ],
      aiAccuracy: {
        overall: 98.5,
        falsePositives: 1.2,
        falseNegatives: 0.3,
      },
    };

    return NextResponse.json({
      success: true,
      data: mockRiskOverview,
    });
  } catch (error: any) {
    console.error('Error getting risk data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get risk data',
      },
      { status: 500 }
    );
  }
}
