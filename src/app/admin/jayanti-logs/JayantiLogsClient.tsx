"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { deleteJayantiLogAction, clearAllJayantiLogsAction } from './actions';
import Swal from 'sweetalert2';

export default function JayantiLogsClient({ initialLogs, initialPagination }: any) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isDeleting, setIsDeleting] = useState(false);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const handleDelete = async (id: number) => {
        const res = await Swal.fire({
            title: 'Delete this log?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, delete it!'
        });

        if (res.isConfirmed) {
            const result = await deleteJayantiLogAction(id);
            if (result.success) {
                Swal.fire('Deleted!', 'Log has been deleted.', 'success');
            } else {
                Swal.fire('Error', result.message || 'Failed to delete log', 'error');
            }
        }
    };

    const handleClearAll = async () => {
        const res = await Swal.fire({
            title: 'Clear ALL Chat Logs?',
            text: "This will delete every single chatbot log permanently. Are you sure?",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, clear all!'
        });

        if (res.isConfirmed) {
            setIsDeleting(true);
            const result = await clearAllJayantiLogsAction();
            setIsDeleting(false);
            if (result.success) {
                Swal.fire('Cleared!', 'All logs have been erased.', 'success');
            } else {
                Swal.fire('Error', result.message || 'Failed to clear logs', 'error');
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
            {/* Header Section */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                        <i className="fas fa-robot text-indigo-500"></i>
                        Jayanti AI Chat Logs
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Review user interactions with the virtual procurement assistant</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => router.refresh()} 
                        className="px-4 py-2 bg-white text-slate-700 text-sm font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
                    >
                        <i className="fas fa-sync-alt"></i> Refresh
                    </button>
                    <button 
                        onClick={handleClearAll}
                        disabled={isDeleting || initialLogs.length === 0}
                        className="px-4 py-2 bg-rose-50 text-rose-600 text-sm font-semibold rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        <i className="fas fa-trash-alt"></i> Clear All
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100 text-sm">
                            <th className="py-4 px-6 font-semibold text-slate-600 w-1/5">Time</th>
                            <th className="py-4 px-6 font-semibold text-slate-600 w-1/3">User Question</th>
                            <th className="py-4 px-6 font-semibold text-slate-600">Bot Answer (Cached)</th>
                            <th className="py-4 px-6 font-semibold text-slate-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {initialLogs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-slate-400">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <i className="fas fa-inbox text-4xl text-slate-200"></i>
                                        <p className="text-sm font-medium">No chat logs found yet. Once users start asking questions, they will appear here.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            initialLogs.map((log: any) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-4 px-6 align-top">
                                        <div className="text-sm font-medium text-slate-700">
                                            {new Date(log.created_at).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            {new Date(log.created_at).toLocaleTimeString('en-IN', {
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 align-top">
                                        <div className="text-sm font-semibold text-slate-800 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50 break-words">
                                            "{log.question}"
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 align-top">
                                        <div 
                                            className="text-sm text-slate-600 max-h-40 overflow-y-auto pr-2 chat-log-answer scrollbar-thin scrollbar-thumb-slate-200"
                                            dangerouslySetInnerHTML={{ __html: log.answer }}
                                        />
                                    </td>
                                    <td className="py-4 px-6 align-top text-right">
                                        <button 
                                            onClick={() => handleDelete(log.id)}
                                            className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            title="Delete Log"
                                        >
                                            <i className="fas fa-trash-alt text-xs"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {initialPagination.totalPages > 1 && (
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-sm text-slate-500 font-medium">
                        Showing page {initialPagination.page} of {initialPagination.totalPages} ({initialPagination.total} total logs)
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(initialPagination.page - 1)}
                            disabled={initialPagination.page <= 1}
                            className="w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                        >
                            <i className="fas fa-chevron-left text-xs"></i>
                        </button>
                        <div className="flex gap-1">
                            {[...Array(initialPagination.totalPages)].map((_, i) => {
                                const p = i + 1;
                                // Basic pagination logic
                                if (
                                    p === 1 || 
                                    p === initialPagination.totalPages || 
                                    (p >= initialPagination.page - 1 && p <= initialPagination.page + 1)
                                ) {
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => handlePageChange(p)}
                                            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                                                p === initialPagination.page 
                                                ? 'bg-indigo-600 text-white shadow-sm' 
                                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                } else if (
                                    p === initialPagination.page - 2 || 
                                    p === initialPagination.page + 2
                                ) {
                                    return <span key={p} className="w-9 h-9 flex items-center justify-center text-slate-400">...</span>;
                                }
                                return null;
                            })}
                        </div>
                        <button
                            onClick={() => handlePageChange(initialPagination.page + 1)}
                            disabled={initialPagination.page >= initialPagination.totalPages}
                            className="w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                        >
                            <i className="fas fa-chevron-right text-xs"></i>
                        </button>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{__html: `
                .chat-log-answer a.chat-link { color: #4f46e5; text-decoration: underline; font-weight: 500; }
                .chat-log-answer strong { color: #1e293b; }
                .jayanti-carousel-container { display: none; } /* Hide the carousel HTML clutter in logs */
            `}} />
        </div>
    );
}
