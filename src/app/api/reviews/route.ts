import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, name, rating, review_text } = body;

    if (!productId || !name || !rating || !review_text) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    await pool.query(
      'INSERT INTO reviews (product_id, name, rating, review_text, is_approved, created_at) VALUES (?, ?, ?, ?, 0, NOW())',
      [productId, name, rating, review_text]
    );

    return NextResponse.json({ success: true, message: 'Thank you! Your review has been submitted for approval.' });
  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit review' }, { status: 500 });
  }
}
