"use client";

import React, { useState, useTransition } from 'react';
import { deleteEnquiryAction, replyEnquiryAction } from './actions';

export default function EnquiriesClient({ enquiries, totalVisits }: { enquiries: any[], totalVisits: number }) {
    const [isPending, startTransition] = useTransition();

    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [replyingTo, setReplyingTo] = useState<any>(null);

    const handleOpenReply = (enq: any) => {
        setReplyingTo(enq);
        setIsReplyOpen(true);
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this enquiry?')) return;
        startTransition(async () => {
            const res = await deleteEnquiryAction(id);
            if (res.error) alert(res.error);
        });
    };

    const handleSendReply = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (replyingTo) formData.append('id', replyingTo.id);
        
        startTransition(async () => {
            const res = await replyEnquiryAction(formData);
            if (res.error) {
                alert(res.error);
            } else {
                alert('Reply sent successfully!');
                setIsReplyOpen(false);
            }
        });
    };

    return (
        <div className={isPending ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 mb-6 flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-slate-800 m-0">Customer Enquiries & Leads</h2>
                <div className="bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-xl font-bold border border-emerald-100 shadow-sm flex items-center gap-3">
                  <i className="fas fa-chart-line text-lg"></i>
                  Total Website Visits: {totalVisits}
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-x-auto w-full mb-6">
                <table className="w-full text-left text-sm text-slate-600 border-collapse min-w-[1000px]">
                    <thead>
                        <tr>
                            <th className="bg-slate-50/80 font-semibold py-4 px-6 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500 w-[15%]">Date</th>
                            <th className="bg-slate-50/80 font-semibold py-4 px-6 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500 w-[20%]">Customer Info</th>
                            <th className="bg-slate-50/80 font-semibold py-4 px-6 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500 w-[20%]">Contact Details</th>
                            <th className="bg-slate-50/80 font-semibold py-4 px-6 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500 w-[15%]">Type / Target</th>
                            <th className="bg-slate-50/80 font-semibold py-4 px-6 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500">Message / Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enquiries.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-12 text-slate-400 font-medium">No enquiries found.</td></tr>
                        )}
                        {enquiries.map((enq: any) => (
                            <tr key={enq.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                <td className="py-5 px-6 whitespace-nowrap text-slate-500 font-medium">{new Date(enq.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                                <td className="py-5 px-6">
                                  <div className="font-extrabold text-slate-800 text-base">{enq.name}</div>
                                </td>
                                <td className="py-5 px-6">
                                    <a href={`mailto:${enq.email}`} className="text-teal-600 font-medium hover:underline flex items-center gap-2"><i className="fas fa-envelope opacity-70"></i> {enq.email}</a>
                                    <a href={`tel:${enq.phone}`} className="font-semibold text-slate-700 mt-2 hover:text-teal-600 flex items-center gap-2"><i className="fas fa-phone-alt opacity-70"></i> {enq.phone}</a>
                                </td>
                                <td className="py-5 px-6">
                                    <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider inline-block ${
                                      enq.type === 'get_price' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                      enq.type === 'partner' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                      'bg-teal-100 text-teal-700 border border-teal-200'
                                    }`}>{enq.type}</span>
                                    {enq.product_id && <div className="mt-2 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block"><i className="fas fa-box-open mr-1"></i> Prod ID: #{enq.product_id}</div>}
                                </td>
                                <td className="py-5 px-6">
                                    <div className="text-sm text-slate-600 leading-relaxed max-w-md mb-4">
                                        {enq.message}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleOpenReply(enq)} className="bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"><i className="fas fa-reply"></i> Reply Via Email</button>
                                        <button onClick={() => handleDelete(enq.id)} className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"><i className="fas fa-trash"></i> Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isReplyOpen && replyingTo && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10005] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white m-0">Reply to {replyingTo.name}</h2>
                                <p className="text-teal-100 text-sm mt-1">{replyingTo.email}</p>
                            </div>
                            <button onClick={() => setIsReplyOpen(false)} className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleSendReply} className="p-6 space-y-4">
                            <input type="hidden" name="email" value={replyingTo.email} />
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                                <input type="text" name="subject" required defaultValue={`Re: Your enquiry regarding ${replyingTo.type === 'get_price' ? 'Product Pricing' : 'Partnership'}`} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
                                <textarea name="message" required rows={6} placeholder="Type your reply here..." className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white"></textarea>
                                <p className="text-xs text-slate-400 mt-2"><i className="fas fa-info-circle"></i> This email will be sent via SMTP configured in .env.local</p>
                            </div>
                            <button type="submit" disabled={isPending} className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 shadow-md flex items-center justify-center gap-2 disabled:opacity-50">
                                {isPending ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                                {isPending ? 'Sending...' : 'Send Reply'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
