"use server";

import pool from '@/lib/db';
import { isAdmin } from '@/lib/adminAuth';
import { revalidatePath } from 'next/cache';

export async function getJayantiLogsAction(page = 1, limit = 20) {
    if (!isAdmin()) {
        throw new Error('Unauthorized');
    }

    try {
        const offset = (page - 1) * limit;
        
        // Fetch logs
        const [logs]: any = await pool.query(
            'SELECT id, question, answer, created_at FROM jayanti_qa_caches ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );

        // Fetch total count for pagination
        const [countResult]: any = await pool.query('SELECT COUNT(*) as total FROM jayanti_qa_caches');
        const total = countResult[0].total;
        
        return { 
            success: true, 
            logs, 
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            } 
        };
    } catch (error) {
        console.error('Error fetching Jayanti logs:', error);
        return { success: false, message: 'Failed to fetch logs' };
    }
}

export async function deleteJayantiLogAction(id: number) {
    if (!isAdmin()) {
        throw new Error('Unauthorized');
    }

    try {
        await pool.query('DELETE FROM jayanti_qa_caches WHERE id = ?', [id]);
        revalidatePath('/admin/jayanti-logs');
        return { success: true };
    } catch (error) {
        console.error('Error deleting Jayanti log:', error);
        return { success: false, message: 'Failed to delete log' };
    }
}

export async function clearAllJayantiLogsAction() {
    if (!isAdmin()) {
        throw new Error('Unauthorized');
    }

    try {
        await pool.query('TRUNCATE TABLE jayanti_qa_caches');
        revalidatePath('/admin/jayanti-logs');
        return { success: true };
    } catch (error) {
        console.error('Error clearing Jayanti logs:', error);
        return { success: false, message: 'Failed to clear logs' };
    }
}
