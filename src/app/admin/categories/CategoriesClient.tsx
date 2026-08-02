"use client";

import React, { useState, useTransition } from 'react';
import { saveCategoryAction, deleteCategoryAction, saveSubCategoryAction, deleteSubCategoryAction } from './actions';

export default function CategoriesClient({ dbCategories, dbSubCategories }: { dbCategories: any[], dbSubCategories: any[] }) {
    const [isPending, startTransition] = useTransition();

    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const [editingCat, setEditingCat] = useState<any>(null);

    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState<any>(null);

    const handleOpenCat = (cat: any = null) => {
        setEditingCat(cat);
        setIsCatModalOpen(true);
    };

    const handleOpenSub = (sub: any = null) => {
        setEditingSub(sub);
        setIsSubModalOpen(true);
    };

    const handleSaveCat = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (editingCat) formData.append('id', editingCat.id);
        
        startTransition(async () => {
            const res = await saveCategoryAction(formData);
            if (res.error) alert(res.error);
            else setIsCatModalOpen(false);
        });
    };

    const handleDeleteCat = (id: number) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        startTransition(async () => {
            const res = await deleteCategoryAction(id);
            if (res.error) alert(res.error);
        });
    };

    const handleSaveSub = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (editingSub) formData.append('id', editingSub.id);
        
        startTransition(async () => {
            const res = await saveSubCategoryAction(formData);
            if (res.error) alert(res.error);
            else setIsSubModalOpen(false);
        });
    };

    const handleDeleteSub = (id: number) => {
        if (!confirm('Are you sure you want to delete this sub-category?')) return;
        startTransition(async () => {
            const res = await deleteSubCategoryAction(id);
            if (res.error) alert(res.error);
        });
    };

    return (
        <div className={isPending ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 mb-6 flex-wrap gap-4">
                <h2 className="text-xl font-bold text-slate-800 m-0">Categories Manager</h2>
                <button onClick={() => handleOpenCat()} className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 shadow-sm shadow-teal-500/20 transition-all"><i className="fas fa-plus"></i> Add Category</button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Master Categories Box */}
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 self-start">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 m-0"><i className="fas fa-tags text-teal-500 mr-2"></i> Master Categories</h3>
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{dbCategories.length} Total</span>
                    </div>
                    
                    <div className="overflow-x-auto w-full rounded-2xl border border-slate-100">
                        <table className="w-full text-left text-sm text-slate-600 border-collapse">
                            <thead>
                                <tr>
                                    <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500 w-[10%]">ID</th>
                                    <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500">Category Name</th>
                                    <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500 text-right w-[30%]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dbCategories.map((cat: any) => (
                                    <tr key={cat.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                        <td className="py-4 px-5 font-bold text-slate-400">#{cat.id}</td>
                                        <td className="py-4 px-5 font-bold text-slate-800">{cat.name}</td>
                                        <td className="py-4 px-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleOpenCat(cat)} className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center hover:bg-teal-50 hover:text-teal-600 transition-all shadow-sm"><i className="fas fa-edit"></i></button>
                                                <button onClick={() => handleDeleteCat(cat.id)} className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm"><i className="fas fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sub Categories Box */}
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 self-start">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 m-0"><i className="fas fa-sitemap text-emerald-500 mr-2"></i> Sub-Categories</h3>
                        <div className="flex gap-3 items-center">
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{dbSubCategories.length} Total</span>
                            <button onClick={() => handleOpenSub()} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-all"><i className="fas fa-plus"></i> Add New</button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto w-full rounded-2xl border border-slate-100">
                        <table className="w-full text-left text-sm text-slate-600 border-collapse">
                            <thead>
                                <tr>
                                    <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500 w-[10%]">ID</th>
                                    <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500">Sub-Category</th>
                                    <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500">Parent</th>
                                    <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500 text-right w-[20%]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dbSubCategories.map((sub: any) => (
                                    <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                        <td className="py-4 px-5 font-bold text-slate-400">#{sub.id}</td>
                                        <td className="py-4 px-5 font-bold text-emerald-600">{sub.name}</td>
                                        <td className="py-4 px-5"><span className="bg-teal-50/50 text-teal-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-teal-100">{sub.category_name}</span></td>
                                        <td className="py-4 px-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleOpenSub(sub)} className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center hover:bg-teal-50 hover:text-teal-600 transition-all shadow-sm"><i className="fas fa-edit"></i></button>
                                                <button onClick={() => handleDeleteSub(sub.id)} className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm"><i className="fas fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Category Modal */}
            {isCatModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10005] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white m-0">{editingCat ? 'Edit Category' : 'Add Category'}</h2>
                            <button onClick={() => setIsCatModalOpen(false)} className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleSaveCat} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category Name</label>
                                <input type="text" name="name" required defaultValue={editingCat?.name || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" />
                            </div>
                            <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 shadow-md">Save Category</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Sub Category Modal */}
            {isSubModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10005] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white m-0">{editingSub ? 'Edit Sub-Category' : 'Add Sub-Category'}</h2>
                            <button onClick={() => setIsSubModalOpen(false)} className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleSaveSub} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sub-Category Name</label>
                                <input type="text" name="name" required defaultValue={editingSub?.name || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 focus:bg-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Parent Category</label>
                                <select name="category_id" required defaultValue={editingSub?.category_id || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 focus:bg-white">
                                    <option value="">Select Category...</option>
                                    {dbCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 shadow-md">Save Sub-Category</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
