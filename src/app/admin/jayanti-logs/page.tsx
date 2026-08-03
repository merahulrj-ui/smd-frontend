import React, { Suspense } from 'react';
import { getJayantiLogsAction } from './actions';
import JayantiLogsClient from './JayantiLogsClient';

export default async function JayantiLogsPage({ searchParams }: { searchParams: { page?: string } }) {
    const page = parseInt(searchParams.page || '1', 10);
    const { success, logs, pagination, message } = await getJayantiLogsAction(page);

    if (!success) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
                <i className="fas fa-exclamation-triangle text-4xl text-rose-500 mb-4"></i>
                <h2 className="text-xl font-bold text-slate-800">Error Loading Logs</h2>
                <p className="text-slate-500 mt-2">{message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Suspense fallback={<div className="p-8 text-center text-slate-500"><i className="fas fa-spinner fa-spin mr-2"></i> Loading logs...</div>}>
                <JayantiLogsClient initialLogs={logs} initialPagination={pagination} />
            </Suspense>
        </div>
    );
}
