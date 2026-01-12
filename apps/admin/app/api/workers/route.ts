import { NextRequest, NextResponse } from 'next/server';

const mockWorkers = [
  {
    id: 'worker-1',
    name: 'Frame Processor',
    type: 'processor',
    status: 'running',
    lastRun: new Date(Date.now() - 120000).toISOString(),
    nextRun: new Date(Date.now() + 300000).toISOString(),
    executionTime: 2500,
    successRate: 98.5,
  },
  {
    id: 'worker-2',
    name: 'Quest Validator',
    type: 'validator',
    status: 'idle',
    lastRun: new Date(Date.now() - 600000).toISOString(),
    nextRun: new Date(Date.now() + 600000).toISOString(),
    executionTime: 1800,
    successRate: 99.2,
  },
  {
    id: 'worker-3',
    name: 'Mint Notifier',
    type: 'notifier',
    status: 'running',
    lastRun: new Date(Date.now() - 30000).toISOString(),
    nextRun: new Date(Date.now() + 60000).toISOString(),
    executionTime: 500,
    successRate: 100,
  },
  {
    id: 'worker-4',
    name: 'Analytics Processor',
    type: 'analytics',
    status: 'idle',
    lastRun: new Date(Date.now() - 1800000).toISOString(),
    nextRun: new Date(Date.now() + 1800000).toISOString(),
    executionTime: 5200,
    successRate: 97.8,
  },
  {
    id: 'worker-5',
    name: 'Cleanup Worker',
    type: 'cleanup',
    status: 'idle',
    lastRun: new Date(Date.now() - 3600000).toISOString(),
    nextRun: new Date(Date.now() + 3600000).toISOString(),
    executionTime: 3100,
    successRate: 99.9,
  },
];

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: mockWorkers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch workers' },
      { status: 500 }
    );
  }
}
