import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    await pool.query('UPDATE reviews SET is_approved = 1 WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Review approved successfully' });
  } catch (error) {
    console.error('Error approving review:', error);
    return NextResponse.json({ success: false, message: 'Failed to approve review' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete review' }, { status: 500 });
  }
}
