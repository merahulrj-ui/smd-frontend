import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({
    db_host: process.env.DB_HOST || 'not set',
    db_user: process.env.DB_USER || process.env.DB_USERNAME || 'not set',
    db_name: process.env.DB_NAME || process.env.DB_DATABASE || 'not set'
  });
}
