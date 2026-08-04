"use client";

import React, { useState, useTransition } from 'react';
import { saveCategoryAction, deleteCategoryAction, saveSubCategoryAction, deleteSubCategoryAction } from './actions';

export default function CategoriesClient({ dbCategories, dbSubCategories }: { dbCategories: any[], dbSubCategories: any[] }) {
    const [isPending, startTransition] = useTransition();

    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const [editingCat, setEditingCat] = useState<any>(null);

    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState<any>(null);
    const [faq, setFaq] = useState('');
    const [howToUse, setHowToUse] = useState('');

    const handleOpenCat = (cat: any = null) => {
        setEditingCat(cat);
        setIsCatModalOpen(true);
    };

    const handleOpenSub = (sub: any = null) => {
        setEditingSub(sub);
        setFaq(sub?.faq || '');
        setHowToUse(sub?.how_to_use || '');
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

    const [activeCatId, setActiveCatId] = useState<number | null>(dbCategories.length > 0 ? dbCategories[0].id : null);

    const activeCat = dbCategories.find(c => c.id === activeCatId);
    const filteredSubCats = dbSubCategories.filter(s => s.category_id === activeCatId);

    return (
        <div className={isPending ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 mb-6 flex-wrap gap-4">
                <h2 className="text-xl font-bold text-slate-800 m-0">Categories Manager</h2>
                <div className="flex gap-3">
                    <button onClick={() => handleOpenCat()} className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 shadow-sm shadow-teal-500/20 transition-all"><i className="fas fa-folder-plus mr-2"></i> Add Category</button>
                    {activeCatId && (
                        <button onClick={() => { handleOpenSub({ category_id: activeCatId }); }} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 shadow-sm shadow-emerald-500/20 transition-all"><i className="fas fa-sitemap mr-2"></i> Add Sub-Category</button>
                    )}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden min-h-[600px] mb-8">
                {/* Master Categories Pane (Left) */}
                <div className="w-full lg:w-1/3 border-r border-slate-100 bg-slate-50/50 flex flex-col">
                    <div className="p-5 border-b border-slate-100 bg-white/50 flex justify-between items-center sticky top-0">
                        <h3 className="text-base font-bold text-slate-800 m-0"><i className="fas fa-tags text-teal-500 mr-2"></i> Master Categories</h3>
                        <span className="bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">{dbCategories.length}</span>
                    </div>
                    
                    <div className="overflow-y-auto flex-1 p-3 flex flex-col gap-1 max-h-[70vh]">
                        {dbCategories.map((cat: any) => {
                            const isActive = activeCatId === cat.id;
                            return (
                                <div 
                                    key={cat.id} 
                                    onClick={() => setActiveCatId(cat.id)}
                                    className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${isActive ? 'bg-white shadow-sm border-l-4 border-teal-500 my-1' : 'hover:bg-slate-100 border-l-4 border-transparent'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isActive ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
                                            #{cat.id}
                                        </span>
                                        <span className={`font-semibold ${isActive ? 'text-teal-700' : 'text-slate-700 group-hover:text-slate-900'}`}>{cat.name}</span>
                                    </div>
                                    
                                    <div className={`flex items-center gap-1 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenCat(cat); }} className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-colors" title="Edit">
                                            <i className="fas fa-pen text-xs"></i>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteCat(cat.id); }} className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors" title="Delete">
                                            <i className="fas fa-trash text-xs"></i>
                                        </button>
                                        <i className={`fas fa-chevron-right text-xs ml-2 ${isActive ? 'text-teal-400' : 'text-slate-300'}`}></i>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sub Categories Pane (Right) */}
                <div className="w-full lg:w-2/3 flex flex-col bg-white">
                    {activeCatId ? (
                        <>
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 m-0 mb-1">{activeCat?.name}</h3>
                                    <p className="text-sm text-slate-500 m-0"><i className="fas fa-sitemap mr-1.5 text-emerald-500"></i> {filteredSubCats.length} Sub-categories</p>
                                </div>
                            </div>
                            
                            <div className="p-6 overflow-y-auto max-h-[70vh]">
                                {filteredSubCats.length === 0 ? (
                                    <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4 shadow-sm">
                                            <i className="fas fa-folder-open text-2xl"></i>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-700 m-0 mb-1">No Sub-categories</h4>
                                        <p className="text-sm text-slate-500 m-0 mb-6">This category doesn't have any sub-categories yet.</p>
                                        <button onClick={() => { handleOpenSub({ category_id: activeCatId }); }} className="px-5 py-2 bg-white text-emerald-600 border border-emerald-200 rounded-lg text-sm font-bold hover:bg-emerald-50 transition-colors shadow-sm">
                                            <i className="fas fa-plus mr-1.5"></i> Add First Sub-category
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {filteredSubCats.map((sub: any) => (
                                            <div key={sub.id} className="group p-4 rounded-xl border border-slate-100 bg-white hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                                        <i className="fas fa-cube"></i>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">ID: #{sub.id}</div>
                                                        <div className="font-bold text-slate-800">{sub.name}</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleOpenSub(sub)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-colors" title="Edit">
                                                        <i className="fas fa-pen text-xs"></i>
                                                    </button>
                                                    <button onClick={() => handleDeleteSub(sub.id)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-colors" title="Delete">
                                                        <i className="fas fa-trash text-xs"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 bg-slate-50/50">
                            <i className="fas fa-mouse-pointer text-4xl mb-4 opacity-50"></i>
                            <p className="font-medium">Select a master category from the left pane</p>
                        </div>
                    )}
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
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 flex items-center justify-between shrink-0">
                            <h2 className="text-xl font-bold text-white m-0">{editingSub?.id ? 'Edit Sub-Category' : 'Add Sub-Category'}</h2>
                            <button onClick={() => setIsSubModalOpen(false)} className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleSaveSub} className="p-6 space-y-4 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            </div>
                            
                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                                    <span>FAQ (Optional)</span>
                                    <span className="text-xs text-slate-400 font-normal">Supports HTML (e.g. &lt;b&gt;, &lt;ul&gt;)</span>
                                </label>
                                <textarea 
                                    name="faq" 
                                    value={faq} 
                                    onChange={(e) => setFaq(e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 focus:bg-white"
                                    placeholder="Enter FAQ content..."
                                ></textarea>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                                    <span>How to Use (Optional)</span>
                                    <span className="text-xs text-slate-400 font-normal">Supports HTML (e.g. &lt;b&gt;, &lt;ul&gt;)</span>
                                </label>
                                <textarea 
                                    name="how_to_use" 
                                    value={howToUse} 
                                    onChange={(e) => setHowToUse(e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 focus:bg-white"
                                    placeholder="Enter How to Use content..."
                                ></textarea>
                            </div>

                            <div className="pt-4 mt-4 border-t border-slate-100">
                                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 shadow-md">Save Sub-Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
