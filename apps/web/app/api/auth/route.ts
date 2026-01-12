import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@castquest/core-services';

// Lazy initialization to avoid build-time errors
let authService: AuthService | null = null;

function getAuthService(): AuthService {
  if (!authService) {
    authService = new AuthService();
  }
  return authService;
}

/**
 * POST /api/auth/login - Login user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.walletAddress) {
      return NextResponse.json(
        {
          success: false,
          error: 'Wallet address is required',
        },
        { status: 400 }
      );
    }

    const result = await getAuthService().authenticateWallet(body.walletAddress);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to login',
      },
      { status: 500 }
    );
  }
}
