"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewsClient({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const router = useRouter();

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'PATCH' });
      if (res.ok) {
        setReviews(reviews.map(r => r.id === id ? { ...r, is_approved: 1 } : r));
        router.refresh();
      } else {
        alert('Failed to approve review');
      }
    } catch (e) {
      alert('Error approving review');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(reviews.filter(r => r.id !== id));
        router.refresh();
      } else {
        alert('Failed to delete review');
      }
    } catch (e) {
      alert('Error deleting review');
    }
  };

  return (
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
            {reviews.map((rev) => (
              <tr key={rev.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-5 whitespace-nowrap text-xs text-slate-500">
                  {new Date(rev.created_at).toLocaleDateString('en-GB')}
                </td>
                <td className="py-4 px-5">
                  <div className="font-bold text-slate-800">{rev.name}</div>
                </td>
                <td className="py-4 px-5 font-bold text-sm">
                  {rev.product_name || `Product #${rev.product_id}`}
                </td>
                <td className="py-4 px-5">
                  <div className="text-amber-400 text-sm mb-1">
                    {Array(5).fill(0).map((_, i) => (
                      <i key={i} className={`fas fa-star ${i < rev.rating ? 'text-amber-400' : 'text-slate-200'}`}></i>
                    ))}
                  </div>
                  <div className="text-xs text-slate-600 max-w-sm">{rev.review_text}</div>
                </td>
                <td className="py-4 px-5">
                  {rev.is_approved === 1 ? (
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-emerald-200">Approved</span>
                  ) : (
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-amber-200">Pending</span>
                  )}
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex justify-end gap-2">
                    {rev.is_approved !== 1 && (
                      <button 
                        onClick={() => handleApprove(rev.id)}
                        className="bg-emerald-50 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-emerald-100 transition-all shadow-sm" 
                        title="Approve"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(rev.id)}
                      className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm" 
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
