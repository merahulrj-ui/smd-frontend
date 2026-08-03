"use server";

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';

import { isAdmin } from '@/lib/adminAuth';

export async function updateProductStatusAction(ids: number[], status: 'in_stock' | 'out_of_stock') {
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
    if (!ids || ids.length === 0) return { error: 'No products selected' };

    try {
        const quantity = status === 'in_stock' ? 100 : 0; // simple fallback stock quantities
        
        // Use IN clause to update multiple IDs
        const placeholders = ids.map(() => '?').join(',');
        await pool.query(`UPDATE products SET stock_quantity = ? WHERE id IN (${placeholders})`, [quantity, ...ids]);
        
        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        console.error("Error updating status:", e);
        return { error: 'Database update failed' };
    }
}

export async function updateProductCategoryAction(ids: number[], category: string) {
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
    if (!ids || ids.length === 0 || !category) return { error: 'Invalid input' };

    try {
        const placeholders = ids.map(() => '?').join(',');
        await pool.query(`UPDATE products SET category = ? WHERE id IN (${placeholders})`, [category, ...ids]);
        
        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        console.error("Error updating category:", e);
        return { error: 'Database update failed' };
    }
}

export async function deleteProductsAction(ids: number[]) {
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
    if (!ids || ids.length === 0) return { error: 'No products selected' };

    try {
        const placeholders = ids.map(() => '?').join(',');
        await pool.query(`DELETE FROM products WHERE id IN (${placeholders})`, [...ids]);
        
        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        console.error("Error deleting products:", e);
        return { error: 'Database delete failed' };
    }
}

import { writeFile } from 'fs/promises';
import path from 'path';

export async function saveProductAction(formData: FormData) {
    if (!(await isAdmin())) return { error: 'Unauthorized access' };

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const brand = formData.get('brand') as string;
    const category = formData.get('category') as string;
    const sub_category_id = formData.get('sub_category_id') as string;
    const mrp = formData.get('mrp') as string;
    const price = formData.get('price') as string;
    const stock_quantity = formData.get('stock_quantity') as string;
    const description = formData.get('description') as string;
    
    // New Text Fields
    const features = formData.get('features') as string;
    const usage = formData.get('usage') as string;
    const packaging = formData.get('packaging') as string;
    const shelf_life = formData.get('shelf_life') as string;
    const warranty = formData.get('warranty') as string;
    const specification = formData.get('specification') as string;

    if (!name || !price) {
        return { error: 'Name and Price are required' };
    }

    try {
        const uploadFile = async (field: string) => {
            let existingPath = formData.get('existing_' + field) as string || '';
            const file = formData.get(field) as File;
            if (file && file.size > 0) {
                const ext = path.extname(file.name).toLowerCase();
                if (field === 'catalogue_pdf') {
                    if (ext !== '.pdf') throw new Error('Catalogue must be a PDF file.');
                } else {
                    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                        throw new Error('Images must be JPG, PNG, or WEBP.');
                    }
                }
                const buffer = Buffer.from(await file.arrayBuffer());
                const filename = field + '_' + Date.now() + ext;
                // Save locally to smd-frontend
                const dest = path.join(process.cwd(), 'public', 'backend-media', 'images', filename);
                await writeFile(dest, buffer);
                return 'images/' + filename;
            }
            return existingPath;
        };

        const imagePath = await uploadFile('image');
        const image2Path = await uploadFile('image2');
        const image3Path = await uploadFile('image3');
        const pdfPath = await uploadFile('catalogue_pdf');

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const subCatIdInt = sub_category_id ? parseInt(sub_category_id) : null;

        if (id) {
            // Update
            await pool.query(
                "UPDATE products SET name=?, brand=?, category=?, sub_category_id=?, mrp=?, price=?, stock_quantity=?, description=?, features=?, `usage`=?, packaging=?, shelf_life=?, warranty=?, specification=?, image=?, image2=?, image3=?, catalogue_pdf=?, slug=? WHERE id=?",
                [
                    name, brand, category, subCatIdInt, mrp || 0, price, 
                    stock_quantity || 0, description || '', features || '', usage || '', packaging || '', 
                    shelf_life || '', warranty || '', specification || '[]', 
                    imagePath, image2Path, image3Path, pdfPath, slug, id
                ]
            );
        } else {
            // Insert
            await pool.query(
                "INSERT INTO products (name, brand, category, sub_category_id, mrp, price, stock_quantity, description, features, `usage`, packaging, shelf_life, warranty, specification, image, image2, image3, catalogue_pdf, slug, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'live')",
                [
                    name, brand, category, subCatIdInt, mrp || 0, price, 
                    stock_quantity || 0, description || '', features || '', usage || '', packaging || '', 
                    shelf_life || '', warranty || '', specification || '[]', 
                    imagePath, image2Path, image3Path, pdfPath, slug
                ]
            );
        }

        revalidatePath('/admin');
        return { success: true };
    } catch (e: any) {
        console.error("Error saving product:", e);
        return { error: e.message || 'Database save failed' };
    }
}

export async function quickAddBrandAction(formData: FormData) {
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
    const name = formData.get('name') as string;
    
    if (!name) {
        return { error: 'Brand name is required' };
    }

    try {
        let logoPath = '';
        const file = formData.get('logo') as File;
        if (file && file.size > 0) {
            const ext = path.extname(file.name).toLowerCase();
            if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                return { error: 'Images must be JPG, PNG, or WEBP.' };
            }
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = 'brands/brand_' + Date.now() + ext;
            const dest = path.join(process.cwd(), 'public', 'backend-media', 'images', filename);
            await writeFile(dest, buffer);
            logoPath = 'images/' + filename;
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        await pool.query(
            "INSERT INTO brands (name, slug, logo) VALUES (?, ?, ?)",
            [name, slug, logoPath]
        );

        revalidatePath('/admin');
        return { success: true, brandName: name };
    } catch (e: any) {
        console.error("Error creating brand:", e);
        return { error: e.message || 'Database save failed' };
    }
}

export async function quickAddCategoryAction(formData: FormData) {
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
    const name = formData.get('name') as string;
    
    if (!name) {
        return { error: 'Category name is required' };
    }

    try {
        let imagePath = '';
        const file = formData.get('image') as File;
        if (file && file.size > 0) {
            const ext = path.extname(file.name).toLowerCase();
            if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                return { error: 'Images must be JPG, PNG, or WEBP.' };
            }
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = 'categories/cat_' + Date.now() + ext;
            const dest = path.join(process.cwd(), 'public', 'backend-media', 'images', filename);
            await writeFile(dest, buffer);
            imagePath = 'images/' + filename;
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        await pool.query(
            "INSERT INTO categories (name, slug, image, status) VALUES (?, ?, ?, 1)",
            [name, slug, imagePath]
        );

        revalidatePath('/admin');
        return { success: true, categoryName: name };
    } catch (e: any) {
        console.error("Error creating category:", e);
        return { error: e.message || 'Database save failed' };
    }
}

export async function quickAddSubCategoryAction(formData: FormData) {
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
    const name = formData.get('name') as string;
    const category_id = formData.get('category_id') as string;
    
    if (!name || !category_id) {
        return { error: 'Subcategory name and parent category are required' };
    }

    try {
        let imagePath = '';
        const file = formData.get('image') as File;
        if (file && file.size > 0) {
            const ext = path.extname(file.name).toLowerCase();
            if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                return { error: 'Images must be JPG, PNG, or WEBP.' };
            }
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = 'categories/subcat_' + Date.now() + ext;
            const dest = path.join(process.cwd(), 'public', 'backend-media', 'images', filename);
            await writeFile(dest, buffer);
            imagePath = 'images/' + filename;
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const [result] = await pool.query(
            "INSERT INTO sub_categories (name, slug, category_id, image, status) VALUES (?, ?, ?, ?, 1)",
            [name, slug, parseInt(category_id), imagePath]
        ) as any[];

        revalidatePath('/admin');
        return { success: true, subCategoryId: result.insertId, subCategoryName: name };
    } catch (e: any) {
        console.error("Error creating sub category:", e);
        return { error: e.message || 'Database save failed' };
    }
}

export async function quickDeleteBrandAction(name: string) {
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
    try {
        await pool.query("DELETE FROM brands WHERE name = ?", [name]);
        revalidatePath('/admin');
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function quickDeleteCategoryAction(name: string) {
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
    try {
        await pool.query("DELETE FROM categories WHERE name = ?", [name]);
        revalidatePath('/admin');
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function quickDeleteSubCategoryAction(id: number) {
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
    try {
        await pool.query("DELETE FROM sub_categories WHERE id = ?", [id]);
        revalidatePath('/admin');
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}
