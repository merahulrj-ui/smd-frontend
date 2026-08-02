"use server";

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveCategoryAction(formData: FormData) {
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
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const category_id = formData.get('category_id') as string;
    
    if (!name || !category_id) return { error: 'Name and Category are required' };
    
    try {
        if (id) {
            await pool.query('UPDATE sub_categories SET name = ?, category_id = ? WHERE id = ?', [name, category_id, id]);
        } else {
            await pool.query('INSERT INTO sub_categories (name, category_id) VALUES (?, ?)', [name, category_id]);
        }
        revalidatePath('/admin/categories');
        return { success: true };
    } catch (e: any) {
        console.error("Error saving sub-category:", e);
        return { error: 'Database error' };
    }
}

export async function deleteSubCategoryAction(id: number) {
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
