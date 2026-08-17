"use server";

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import path from 'path';
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

        let imagePath = (formData.get('image_path') as string) || (formData.get('existing_image') as string) || 'images/blog_hospital_furniture_guide.jpg';
        const file = (formData.get('blog_image') as File) || (formData.get('image') as File);
        
        if (file && file.size > 0 && typeof file.arrayBuffer === 'function') {
            try {
                const ext = path.extname(file.name).toLowerCase() || '.jpg';
                const buffer = Buffer.from(await file.arrayBuffer());
                const filename = 'blog_' + Date.now() + ext;
                const dest = path.join(process.cwd(), 'public', 'backend-media', 'images', filename);
                await writeFile(dest, buffer);
                imagePath = 'images/' + filename;
            } catch (fsErr) {
                console.warn('Serverless read-only filesystem (EROFS), using bundled image fallback:', fsErr);
                // On Vercel, use the bundled image path
                imagePath = (formData.get('image_path') as string) || 'images/blog_hospital_furniture_guide.jpg';
            }
        }

        if (id) {
            try {
                await pool.query(
                    'UPDATE blog SET title=?, slug=?, author_name=?, blog_image=?, content=? WHERE id=?',
                    [title, slug, author, imagePath, content, id]
                );
            } catch (err) {
                try {
                    await pool.query(
                        'UPDATE blog SET title=?, slug=?, author_name=?, image=?, content=? WHERE id=?',
                        [title, slug, author, imagePath, content, id]
                    );
                } catch (err2) {
                    await pool.query(
                        'UPDATE blog SET title=?, slug=?, content=? WHERE id=?',
                        [title, slug, content, id]
                    );
                }
            }
        } else {
            try {
                await pool.query(
                    'INSERT INTO blog (title, slug, author_name, blog_image, content, status, read_time, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
                    [title, slug, author, imagePath, content, 'published', '5']
                );
            } catch (err: any) {
                console.error('Insert with blog_image failed, trying image column:', err);
                try {
                    await pool.query(
                        'INSERT INTO blog (title, slug, author_name, image, content, status, read_time, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
                        [title, slug, author, imagePath, content, 'published', '5']
                    );
                } catch (err2: any) {
                    try {
                        await pool.query(
                            'INSERT INTO blog (title, slug, author_name, content, status, read_time, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
                            [title, slug, author, content, 'published', '5']
                        );
                    } catch (err3: any) {
                        await pool.query(
                            'INSERT INTO blog (title, slug, content, status) VALUES (?, ?, ?, ?)',
                            [title, slug, content, 'published']
                        );
                    }
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
