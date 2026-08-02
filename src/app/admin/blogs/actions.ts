"use server";

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteBlogAction(id: number) {
    try {
        await pool.query('DELETE FROM blog WHERE id = ?', [id]);
        revalidatePath('/admin/blogs');
        return { success: true };
    } catch (e: any) {
        console.error("Error deleting blog:", e);
        return { error: 'Database error' };
    }
}

export async function toggleBlogStatusAction(id: number, currentStatus: string) {
    try {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        await pool.query('UPDATE blog SET status = ? WHERE id = ?', [newStatus, id]);
        revalidatePath('/admin/blogs');
        return { success: true };
    } catch (e: any) {
        console.error("Error toggling blog status:", e);
        return { error: 'Database error' };
    }
}

export async function saveBlogAction(formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const slug = formData.get('slug') as string || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const content = formData.get('content') as string; // JSON string
    
    if (!title || !content) return { error: 'Title and content are required' };

    try {
        // Basic validation for JSON content
        try {
            JSON.parse(content);
        } catch {
            return { error: 'Content must be a valid JSON array of blocks' };
        }

        if (id) {
            await pool.query(
                'UPDATE blog SET title=?, slug=?, author=?, content=? WHERE id=?',
                [title, slug, author || 'Admin', content, id]
            );
        } else {
            await pool.query(
                'INSERT INTO blog (title, slug, author, content, status) VALUES (?, ?, ?, ?, ?)',
                [title, slug, author || 'Admin', content, 'draft']
            );
        }
        
        revalidatePath('/admin/blogs');
        return { success: true };
    } catch (e: any) {
        console.error("Error saving blog:", e);
        return { error: 'Database error' };
    }
}
