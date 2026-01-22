import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/auth';

/**
 * GET /api/admin/fees - Get protocol fee configuration
 */
export async function GET(request: NextRequest) {
  try {
    // Admin authentication check
    const authCheck = requireAdmin(request);
    if (!authCheck.authorized) {
      return NextResponse.json(authCheck.error, { status: 403 });
    }
    
    // TODO: Store fees in database configuration table
    
    const fees = {
      protocolFee: {
        percentage: 2.5,
        recipient: '0x1234...5678',
        enabled: true,
      },
      creatorRoyalty: {
        percentage: 5.0,
        enabled: true,
      },
      platformFee: {
        percentage: 1.0,
        recipient: '0xabcd...efgh',
        enabled: true,
      },
      mintingFee: {
        baseAmount: '0.001 ETH',
        enabled: true,
      },
    };

    return NextResponse.json({
      success: true,
      data: fees,
    });
  } catch (error: any) {
    console.error('Error getting fees:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get fees',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/fees - Update protocol fee configuration
 */
export async function PUT(request: NextRequest) {
  try {
    // Admin authentication check
    const authCheck = requireAdmin(request);
    if (!authCheck.authorized) {
      return NextResponse.json(authCheck.error, { status: 403 });
    }
    
    const body = await request.json();
    
    // Validate fee values
    if (body.protocolFee?.percentage !== undefined) {
      const pct = parseFloat(body.protocolFee.percentage);
      if (isNaN(pct) || pct < 0 || pct > 100) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid protocol fee percentage',
          },
          { status: 400 }
        );
      }
    }
    
    // TODO: Validate and store fee updates in database
    
    return NextResponse.json({
      success: true,
      data: body,
      message: 'Fees updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating fees:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update fees',
      },
      { status: 500 }
    );
  }
}
