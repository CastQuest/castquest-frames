import { NextResponse } from 'next/server';
import { openApiSpec } from '../../../lib/openapi/spec';

export async function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
