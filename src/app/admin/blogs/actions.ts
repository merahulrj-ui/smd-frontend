"use server";

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/adminAuth';

export async function deleteBlogAction(id: number) {
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
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
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
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
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const author = (formData.get('author') as string) || 'SMD Team';
    const slug = (formData.get('slug') as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
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
            try {
                await pool.query(
                    'UPDATE blog SET title=?, slug=?, author_name=?, content=? WHERE id=?',
                    [title, slug, author, content, id]
                );
            } catch (err) {
                await pool.query(
                    'UPDATE blog SET title=?, slug=?, content=? WHERE id=?',
                    [title, slug, content, id]
                );
            }
        } else {
            try {
                await pool.query(
                    'INSERT INTO blog (title, slug, author_name, content, status, read_time, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
                    [title, slug, author, content, 'published', '5']
                );
            } catch (err: any) {
                console.error('Insert with author_name failed, trying minimal columns:', err);
                try {
                    await pool.query(
                        'INSERT INTO blog (title, slug, author, content, status) VALUES (?, ?, ?, ?, ?)',
                        [title, slug, author, content, 'published']
                    );
                } catch (err2: any) {
                    await pool.query(
                        'INSERT INTO blog (title, slug, content, status) VALUES (?, ?, ?, ?)',
                        [title, slug, content, 'published']
                    );
                }
            }
        }
        
        revalidatePath('/admin/blogs');
        revalidatePath('/blog');
        return { success: true };
    } catch (e: any) {
        console.error("Error saving blog:", e);
        return { error: e.message || 'Database error' };
    }
}
