"use server";

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function saveBrandAction(formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    
    if (!name) return { error: 'Name is required' };
    
    try {
        let logoPath = formData.get('existing_logo') as string || '';
        const file = formData.get('logo') as File;
        
        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const ext = path.extname(file.name) || '.jpg';
            const filename = 'brand_' + Date.now() + ext;
            const dest = path.join(process.cwd(), 'public', 'backend-media', 'images', filename);
            await writeFile(dest, buffer);
            logoPath = 'images/' + filename;
        }

        if (id) {
            await pool.query('UPDATE brands SET name = ?, logo = ? WHERE id = ?', [name, logoPath, id]);
        } else {
            await pool.query('INSERT INTO brands (name, logo) VALUES (?, ?)', [name, logoPath]);
        }
        revalidatePath('/admin/brands');
        return { success: true };
    } catch (e: any) {
        console.error("Error saving brand:", e);
        return { error: 'Database error' };
    }
}

export async function deleteBrandAction(id: number) {
    try {
        await pool.query('DELETE FROM brands WHERE id = ?', [id]);
        revalidatePath('/admin/brands');
        return { success: true };
    } catch (e: any) {
        if (e.code === 'ER_ROW_IS_REFERENCED_2') {
            return { error: 'Cannot delete brand because it has products attached.' };
        }
        return { error: 'Database error' };
    }
}
