"use client";

import React, { useState, useTransition } from 'react';
import { deleteBlogAction, toggleBlogStatusAction, saveBlogAction } from './actions';

export default function BlogsClient({ dbBlogs }: { dbBlogs: any[] }) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<any>(null);

    const handleOpen = (blog: any = null) => {
        setEditingBlog(blog);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this article?')) return;
        startTransition(async () => {
            const res = await deleteBlogAction(id);
            if (res.error) alert(res.error);
        });
    };

    const handleToggleStatus = (id: number, currentStatus: string) => {
        startTransition(async () => {
            const res = await toggleBlogStatusAction(id, currentStatus);
            if (res.error) alert(res.error);
        });
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (editingBlog) formData.append('id', editingBlog.id);
        
        startTransition(async () => {
            const res = await saveBlogAction(formData);
            if (res.error) {
                alert(res.error);
            } else {
                setIsModalOpen(false);
            }
        });
    };

    return (
        <div className={isPending ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 mb-6 flex-wrap gap-4">
                <h2 className="text-xl font-bold text-slate-800 m-0">Blogs & Articles Manager</h2>
                <div className="flex gap-3">
                  <button className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-900 shadow-sm transition-all"><i className="fas fa-magic"></i> Auto-Generate</button>
                  <button onClick={() => handleOpen()} className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 shadow-sm shadow-teal-500/20 transition-all"><i className="fas fa-plus"></i> New Article</button>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 m-0"><i className="fas fa-newspaper text-teal-500 mr-2"></i> Published Articles</h3>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{dbBlogs.length} Total</span>
                </div>
                
                <div className="overflow-x-auto w-full rounded-2xl border border-slate-100">
                    <table className="w-full text-left text-sm text-slate-600 border-collapse">
                        <thead>
                            <tr>
                                <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500 w-[10%]">Date</th>
                                <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500 w-[15%]">Cover</th>
                                <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500 w-[45%]">Article Info</th>
                                <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500 w-[10%] text-center">Status</th>
                                <th className="bg-slate-50/80 font-semibold py-3 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-slate-500 text-right w-[20%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dbBlogs.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-10 text-slate-400 font-medium">No articles found.</td></tr>
                            )}
                            {dbBlogs.map((blog: any) => {
                                let coverImg = blog.blog_image || 'images/placeholder.svg';

                                return (
                                    <tr key={blog.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                        <td className="py-4 px-5 whitespace-nowrap text-xs font-medium text-slate-500">{new Date(blog.created_at).toLocaleDateString()}</td>
                                        <td className="py-4 px-5">
                                            <div className="w-20 h-14 rounded-lg bg-white border border-slate-200 overflow-hidden shadow-sm flex items-center justify-center">
                                                <img src={coverImg.startsWith('http') ? coverImg : (coverImg.includes('/') ? `/backend-media/${coverImg}` : `/backend-media/images/${coverImg}`)} className="w-full h-full object-cover" onError={(e: any) => e.target.src='/backend-media/images/placeholder.svg'} />
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="font-extrabold text-slate-800 text-base mb-1 line-clamp-1">{blog.title}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-3">
                                                <span><i className="fas fa-user-edit mr-1"></i> {blog.author || 'Admin'}</span>
                                                <span><i className="fas fa-link mr-1"></i> /{blog.slug}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5 text-center">
                                            {blog.status === 'published' ? (
                                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-200">Published</span>
                                            ) : (
                                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-slate-200">Draft</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleOpen(blog)} className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center hover:bg-teal-50 hover:text-teal-600 transition-all shadow-sm" title="Edit"><i className="fas fa-edit"></i></button>
                                                <button onClick={() => handleToggleStatus(blog.id, blog.status)} className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm" title="Toggle Status"><i className="fas fa-toggle-on"></i></button>
                                                <button onClick={() => handleDelete(blog.id)} className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm" title="Delete"><i className="fas fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Blog Modal (JSON Raw Editor for now) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10005] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-6 flex items-center justify-between shrink-0">
                            <h2 className="text-xl font-bold text-white m-0">{editingBlog ? 'Edit Article' : 'New Article'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Article Title</label>
                                    <input type="text" name="title" required defaultValue={editingBlog?.title || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Slug (Optional)</label>
                                    <input type="text" name="slug" defaultValue={editingBlog?.slug || ''} placeholder="Leave blank to auto-generate" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Author</label>
                                    <input type="text" name="author" defaultValue={editingBlog?.author || 'Admin'} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Content (JSON Blocks)</label>
                                    <p className="text-xs text-slate-400 mb-2">Since the old system uses a custom block editor, enter valid JSON here. A visual block editor will be implemented in a future phase.</p>
                                    <textarea name="content" required rows={12} defaultValue={editingBlog?.content || '[\n  {\n    "type": "paragraph",\n    "content": "Start writing here..."\n  }\n]'} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white font-mono text-xs"></textarea>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <button type="submit" disabled={isPending} className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 shadow-md">
                                    {isPending ? 'Saving...' : 'Save Article'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
