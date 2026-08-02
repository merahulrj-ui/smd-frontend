"use client";

import React, { useState, useTransition } from 'react';
import { saveBrandAction, deleteBrandAction } from './actions';

export default function BrandsClient({ dbBrands }: { dbBrands: any[] }) {
    const [isPending, startTransition] = useTransition();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<any>(null);

    const handleOpen = (brand: any = null) => {
        setEditingBrand(brand);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (editingBrand) {
            formData.append('id', editingBrand.id);
            if (editingBrand.logo) formData.append('existing_logo', editingBrand.logo);
        }
        
        startTransition(async () => {
            const res = await saveBrandAction(formData);
            if (res.error) alert(res.error);
            else setIsModalOpen(false);
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this brand?')) return;
        startTransition(async () => {
            const res = await deleteBrandAction(id);
            if (res.error) alert(res.error);
        });
    };

    return (
        <div className={isPending ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 mb-6 flex-wrap gap-4">
                <h2 className="text-xl font-bold text-slate-800 m-0">Brands Manager</h2>
                <button onClick={() => handleOpen()} className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 shadow-sm shadow-teal-500/20 transition-all"><i className="fas fa-plus"></i> Add Brand</button>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 m-0"><i className="fas fa-copyright text-teal-500 mr-2"></i> All Brands</h3>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{dbBrands.length} Total</span>
                </div>
                
                <div className="overflow-x-auto w-full rounded-2xl border border-slate-100">
                    <table className="w-full text-left text-sm text-slate-600 border-collapse">
                        <thead>
                            <tr>
                                <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500 w-[10%]">ID</th>
                                <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500">Logo</th>
                                <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500">Brand Name</th>
                                <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500 text-right w-[20%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dbBrands.length === 0 && (
                                <tr><td colSpan={4} className="text-center py-10 text-slate-400 font-medium">No brands found.</td></tr>
                            )}
                            {dbBrands.map((brand: any) => (
                                <tr key={brand.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                    <td className="py-4 px-5 font-bold text-slate-400">#{brand.id}</td>
                                    <td className="py-4 px-5">
                                        <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center">
                                          {brand.logo ? (
                                            <img src={`/backend-media/${brand.logo}`} className="max-w-full max-h-full object-contain" />
                                          ) : (
                                            <i className="fas fa-image text-slate-300 text-xl"></i>
                                          )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-5 font-extrabold text-slate-800 text-base">{brand.name}</td>
                                    <td className="py-4 px-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleOpen(brand)} className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center hover:bg-teal-50 hover:text-teal-600 transition-all shadow-sm"><i className="fas fa-edit"></i></button>
                                            <button onClick={() => handleDelete(brand.id)} className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm"><i className="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Brand Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10005] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white m-0">{editingBrand ? 'Edit Brand' : 'Add Brand'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Brand Name</label>
                                <input type="text" name="name" required defaultValue={editingBrand?.name || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Brand Logo</label>
                                {editingBrand?.logo && (
                                    <div className="mb-2 w-12 h-12 rounded border p-1"><img src={`/backend-media/${editingBrand.logo}`} className="max-w-full max-h-full" /></div>
                                )}
                                <input type="file" name="logo" accept="image/*" className="w-full text-sm" />
                            </div>
                            <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 shadow-md">Save Brand</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
