import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminReviews() {
  let reviews = [];
  
  try {
    const [revRows] = await pool.query('SELECT r.*, p.name as product_name FROM reviews r LEFT JOIN products p ON r.product_id = p.id ORDER BY r.created_at DESC') as any[];
    reviews = revRows;
  } catch (e) {
    // If table doesn't exist yet, it will just show empty state
    console.error(e);
  }

  return (
    <div>
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 mb-6 flex-wrap gap-4">
            <h2 className="text-xl font-bold text-slate-800 m-0">Product Reviews Manager</h2>
            <div className="flex gap-3">
              <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold border border-slate-200">Pending Approvals: <span className="text-teal-600">0</span></span>
            </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 m-0"><i className="fas fa-star-half-alt text-amber-500 mr-2"></i> All Reviews</h3>
            </div>
            
            <div className="overflow-x-auto w-full rounded-2xl border border-slate-100">
                <table className="w-full text-left text-sm text-slate-600 border-collapse">
                    <thead>
                        <tr>
                            <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500">Date</th>
                            <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500">Customer Info</th>
                            <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500">Product</th>
                            <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500">Rating & Review</th>
                            <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500">Status</th>
                            <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-10 text-slate-400 font-medium">No reviews found.</td></tr>
                        )}
                        {reviews.map((rev: any) => (
                            <tr key={rev.id} className="border-b border-slate-50 hover:bg-slate-50/80:bg-slate-700/30 transition-colors">
                                <td className="py-4 px-5 whitespace-nowrap text-xs text-slate-500">{new Date(rev.created_at).toLocaleDateString()}</td>
                                <td className="py-4 px-5">
                                    <div className="font-bold text-slate-800">{rev.user_name}</div>
                                    <div className="text-xs text-teal-600 mt-1">{rev.user_email}</div>
                                </td>
                                <td className="py-4 px-5 font-bold text-sm">{rev.product_name || `Product #${rev.product_id}`}</td>
                                <td className="py-4 px-5">
                                    <div className="text-amber-400 text-sm mb-1">
                                      {Array(5).fill(0).map((_, i) => (
                                        <i key={i} className={`fas fa-star ${i < rev.rating ? 'text-amber-400' : 'text-slate-200'}`}></i>
                                      ))}
                                    </div>
                                    <div className="text-xs text-slate-600 max-w-sm">{rev.comment}</div>
                                </td>
                                <td className="py-4 px-5">
                                    {rev.status === 'approved' ? (
                                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-emerald-200">Approved</span>
                                    ) : (
                                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-amber-200">Pending</span>
                                    )}
                                </td>
                                <td className="py-4 px-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        {rev.status !== 'approved' && (
                                            <button className="bg-emerald-50 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-emerald-100 transition-all shadow-sm" title="Approve"><i className="fas fa-check"></i></button>
                                        )}
                                        <button className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm" title="Delete"><i className="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}
