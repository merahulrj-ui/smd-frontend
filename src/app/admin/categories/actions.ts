"use server";

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/adminAuth';

export async function saveCategoryAction(formData: FormData) {
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    
    if (!name) return { error: 'Name is required' };
    
    try {
        if (id) {
            await pool.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
        } else {
            await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
        }
        revalidatePath('/admin/categories');
        return { success: true };
    } catch (e: any) {
        console.error("Error saving category:", e);
        return { error: 'Database error' };
    }
}

export async function deleteCategoryAction(id: number) {
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
    try {
        await pool.query('DELETE FROM categories WHERE id = ?', [id]);
        revalidatePath('/admin/categories');
        return { success: true };
    } catch (e: any) {
        if (e.code === 'ER_ROW_IS_REFERENCED_2') {
            return { error: 'Cannot delete category because it has sub-categories or products attached.' };
        }
        return { error: 'Database error' };
    }
}

export async function saveSubCategoryAction(formData: FormData) {
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const category_id = formData.get('category_id') as string;
    const faq = formData.get('faq') as string || null;
    const how_to_use = formData.get('how_to_use') as string || null;
    
    if (!name || !category_id) return { error: 'Name and Category are required' };
    
    try {
        if (id) {
            await pool.query('UPDATE sub_categories SET name = ?, category_id = ?, faq = ?, how_to_use = ? WHERE id = ?', [name, category_id, faq, how_to_use, id]);
        } else {
            // Need to generate a slug for new sub-category
            let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            // Simple uniqueness check (in real app, should be more robust)
            const [existing] = await pool.query('SELECT id FROM sub_categories WHERE slug = ?', [slug]) as any[];
            if (existing && existing.length > 0) slug = `${slug}-${Date.now()}`;

            await pool.query('INSERT INTO sub_categories (name, slug, category_id, faq, how_to_use) VALUES (?, ?, ?, ?, ?)', [name, slug, category_id, faq, how_to_use]);
        }
        revalidatePath('/admin/categories');
        return { success: true };
    } catch (e: any) {
        console.error("Error saving sub-category:", e);
        return { error: 'Database error' };
    }
}

export async function deleteSubCategoryAction(id: number) {
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
    try {
        await pool.query('DELETE FROM sub_categories WHERE id = ?', [id]);
        revalidatePath('/admin/categories');
        return { success: true };
    } catch (e: any) {
        if (e.code === 'ER_ROW_IS_REFERENCED_2') {
            return { error: 'Cannot delete sub-category because it has products attached.' };
        }
        return { error: 'Database error' };
    }
}
