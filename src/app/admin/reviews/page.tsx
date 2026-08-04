import pool from '@/lib/db';
import ReviewsClient from './ReviewsClient';

export const dynamic = 'force-dynamic';

export default async function AdminReviews() {
  let reviews = [];
  
  try {
    const [revRows] = await pool.query('SELECT r.*, p.name as product_name FROM reviews r LEFT JOIN products p ON r.product_id = p.id ORDER BY r.created_at DESC') as any[];
    reviews = revRows;
  } catch (e) {
    console.error(e);
  }

  const pendingCount = reviews.filter((r: any) => r.is_approved === 0).length;

  return (
    <div>
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 mb-6 flex-wrap gap-4">
            <h2 className="text-xl font-bold text-slate-800 m-0">Product Reviews Manager</h2>
            <div className="flex gap-3">
              <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold border border-slate-200">Pending Approvals: <span className="text-teal-600">{pendingCount}</span></span>
            </div>
        </div>

        <ReviewsClient initialReviews={reviews} />
    </div>
  );
}
