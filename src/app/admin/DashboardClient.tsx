"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { updateProductStatusAction, updateProductCategoryAction, deleteProductsAction, saveProductAction, quickAddBrandAction, quickAddCategoryAction, quickAddSubCategoryAction, quickDeleteBrandAction, quickDeleteCategoryAction, quickDeleteSubCategoryAction } from './actions';

const inquiryData = [
  { name: 'Mon', inquiries: 4 },
  { name: 'Tue', inquiries: 7 },
  { name: 'Wed', inquiries: 5 },
  { name: 'Thu', inquiries: 12 },
  { name: 'Fri', inquiries: 8 },
  { name: 'Sat', inquiries: 3 },
  { name: 'Sun', inquiries: 9 },
];

const trafficData = [
  { name: 'Mon', visits: 120 },
  { name: 'Tue', visits: 150 },
  { name: 'Wed', visits: 180 },
  { name: 'Thu', visits: 240 },
  { name: 'Fri', visits: 210 },
  { name: 'Sat', visits: 90 },
  { name: 'Sun', visits: 110 },
];

export default function AdminDashboardClient({
  products,
  totalRows,
  stock,
  search,
  category,
  brand,
  allCategories,
  allBrands,
  allSubCategories = [],
  allCategoryObjects = [],
  page,
  totalPages
}: any) {
  const [viewMode, setViewMode] = useState('table');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isPending, startTransition] = React.useTransition();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [activeTab, setActiveTab] = useState('basic');
  const [specs, setSpecs] = useState<{name: string, description: string}[]>([]);
  const [filteredSubCats, setFilteredSubCats] = useState<any[]>([]);
  
  const [localBrands, setLocalBrands] = useState<string[]>(allBrands || []);
  const [localCategories, setLocalCategories] = useState<string[]>(allCategories || []);
  const [localAllSubCats, setLocalAllSubCats] = useState<any[]>(allSubCategories || []);
  
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
  const [isAddingBrand, setIsAddingBrand] = useState(false);

  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [isAddingCat, setIsAddingCat] = useState(false);

  const [isAddSubCatModalOpen, setIsAddSubCatModalOpen] = useState(false);
  const [isAddingSubCat, setIsAddingSubCat] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('adminProductsView');
    if (saved) setViewMode(saved);
  }, []);

  const handleViewChange = (mode: string) => {
    setViewMode(mode);
    localStorage.setItem('adminProductsView', mode);
    setSelectedIds([]);
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(products.map((p: any) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleUpdateCategory = () => {
    if (!selectedCategory || selectedIds.length === 0) return;
    startTransition(async () => {
      await updateProductCategoryAction(selectedIds, selectedCategory);
      setSelectedIds([]);
      setSelectedCategory('');
    });
  };

  const handleUpdateStatus = (newStatus: 'in_stock' | 'out_of_stock') => {
    if (selectedIds.length === 0) return;
    startTransition(async () => {
      await updateProductStatusAction(selectedIds, newStatus);
      setSelectedIds([]);
    });
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    if (!confirm('Are you sure you want to delete selected products?')) return;
    startTransition(async () => {
      await deleteProductsAction(selectedIds);
      setSelectedIds([]);
    });
  };

  const handleDeleteSingle = (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    startTransition(async () => {
      await deleteProductsAction([id]);
    });
  };

  
  const handleOpenEdit = (product: any) => {
      setEditingProduct(product);
      setActiveTab('basic');
      if (product.category) {
        setFilteredSubCats(localAllSubCats.filter((sc: any) => sc.category_name === product.category));
      } else {
        setFilteredSubCats([]);
      }
      try {
        setSpecs(JSON.parse(product.specification || '[]'));
      } catch(e) {
        setSpecs([]);
      }
      setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
      setEditingProduct(null);
      setActiveTab('basic');
      setSpecs([]);
      setFilteredSubCats([]);
      setIsModalOpen(true);
  };

  const handleCatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const cat = e.target.value;
      setFilteredSubCats(localAllSubCats.filter((sc: any) => sc.category_name === cat));
  };


  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSaving(true);
      const formData = new FormData(e.currentTarget);
      formData.append('specification', JSON.stringify(specs));
      if (editingProduct) {
          formData.append('id', editingProduct.id.toString());
          if (editingProduct.image) {
              formData.append('existing_image', editingProduct.image);
          }
      }
      
      startTransition(async () => {
          const res = await saveProductAction(formData);
          setIsSaving(false);
          if (res.error) {
              alert(res.error);
          } else {
              setIsModalOpen(false);
          }
      });
  };

  const handleQuickAddBrand = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsAddingBrand(true);
      const formData = new FormData(e.currentTarget);
      startTransition(async () => {
          const res = await quickAddBrandAction(formData);
          setIsAddingBrand(false);
          if (res.error) {
              alert(res.error);
          } else if (res.brandName) {
              setLocalBrands(prev => [...prev, res.brandName]);
              // Also update the selected brand in the editingProduct so the select gets it
              setEditingProduct((prev: any) => ({ ...prev, brand: res.brandName }));
              setIsAddBrandModalOpen(false);
          }
      });
  };

  const handleQuickAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsAddingCat(true);
      const formData = new FormData(e.currentTarget);
      startTransition(async () => {
          const res = await quickAddCategoryAction(formData);
          setIsAddingCat(false);
          if (res.error) {
              alert(res.error);
          } else if (res.categoryName) {
              setLocalCategories(prev => [...prev, res.categoryName]);
              setEditingProduct((prev: any) => ({ ...prev, category: res.categoryName }));
              setIsAddCatModalOpen(false);
          }
      });
  };


  const handleDeleteBrand = async () => {
      const brand = editingProduct?.brand;
      if (!brand) return;
      if (!confirm(`Delete brand '${brand}' permanently?`)) return;
      startTransition(async () => {
          await quickDeleteBrandAction(brand);
          setLocalBrands(prev => prev.filter(b => b !== brand));
          setEditingProduct((prev: any) => ({ ...prev, brand: '' }));
      });
  };

  const handleDeleteCategory = async () => {
      const cat = editingProduct?.category;
      if (!cat) return;
      if (!confirm(`Delete category '${cat}' permanently?`)) return;
      startTransition(async () => {
          await quickDeleteCategoryAction(cat);
          setLocalCategories(prev => prev.filter(c => c !== cat));
          setEditingProduct((prev: any) => ({ ...prev, category: '' }));
          setFilteredSubCats([]);
      });
  };

  const handleDeleteSubCategory = async () => {
      const subCatId = editingProduct?.sub_category_id;
      if (!subCatId) return;
      if (!confirm(`Delete this sub-category permanently?`)) return;
      startTransition(async () => {
          await quickDeleteSubCategoryAction(parseInt(subCatId));
          setLocalAllSubCats(prev => prev.filter(sc => sc.id != subCatId));
          setFilteredSubCats(prev => prev.filter(sc => sc.id != subCatId));
          setEditingProduct((prev: any) => ({ ...prev, sub_category_id: '' }));
      });
  };

  const handleQuickAddSubCategory = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const currentCat = editingProduct?.category;
      if (!currentCat) {
          alert('Please select a parent Category first!');
          return;
      }
      const catObj = allCategoryObjects.find((c: any) => c.name === currentCat);
      if (!catObj) {
          alert('Parent category ID not found. Ensure the category is saved in the database.');
          return;
      }

      setIsAddingSubCat(true);
      const formData = new FormData(e.currentTarget);
      formData.append('category_id', catObj.id.toString());
      
      startTransition(async () => {
          const res = await quickAddSubCategoryAction(formData);
          setIsAddingSubCat(false);
          if (res.error) {
              alert(res.error);
          } else if (res.subCategoryName) {
              const newSubCat = { id: res.subCategoryId, name: res.subCategoryName, category_name: currentCat };
              setLocalAllSubCats(prev => [...prev, newSubCat]);
              setFilteredSubCats(prev => [...prev, newSubCat]);
              setEditingProduct((prev: any) => ({ ...prev, sub_category_id: res.subCategoryId.toString() }));
              setIsAddSubCatModalOpen(false);
          }
      });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="chart-card">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-slate-800 m-0"><i className="fas fa-chart-line text-teal-600 mr-2"></i> 7-Day Inquiry Trend</h2>
              </div>
              <div className="w-full h-64 text-sm">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={inquiryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                              <linearGradient id="colorInq" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                          <Area type="monotone" dataKey="inquiries" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorInq)" />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>
          <div className="chart-card">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-slate-800 m-0"><i className="fas fa-globe text-emerald-500 mr-2"></i> 7-Day Website Traffic</h2>
              </div>
              <div className="w-full h-64 text-sm">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} cursor={{ fill: '#f1f5f9' }} />
                          <Bar dataKey="visits" fill="#10b981" radius={[6, 6, 0, 0]} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>
      </div>

      <div className="flex justify-between items-center bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 mb-6 flex-wrap gap-4">
          {stock === 'unlisted' ? (
              <h2 className="text-xl font-bold text-pink-600 m-0">⚠️ Unlisted Products - Awaiting Image Upload ({totalRows} items)</h2>
          ) : (
              <h2 className="text-xl font-bold text-slate-800 m-0">Live Listed Products ({totalRows} items active)</h2>
          )}
          <div className="flex gap-4 flex-wrap items-center">
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1 mr-2 border border-slate-200">
                  <button onClick={() => handleViewChange('table')} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${viewMode === 'table' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-teal-600'}`}><i className="fas fa-list"></i></button>
                  <button onClick={() => handleViewChange('grid')} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-teal-600'}`}><i className="fas fa-th-large"></i></button>
              </div>
              <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50:bg-slate-600 shadow-sm"><i className="fas fa-magic"></i> Link Auto-Importer</button>
              <button onClick={handleOpenCreate} className="px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 shadow-sm shadow-teal-500/20"><i className="fas fa-plus"></i> Add Single Product</button>
          </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 mb-6">
          <form method="GET" action="/admin" className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                  <input type="text" name="search" className="form-control" placeholder="🔍 Search product name..." defaultValue={search} />
              </div>
              <div>
                  <select name="category" className="form-control" defaultValue={category}>
                      <option value="">All Categories</option>
                      {allCategories.map((c: string) => <option key={c} value={c}>{c}</option>)}
                  </select>
              </div>
              <div>
                  <select name="brand" className="form-control" defaultValue={brand}>
                      <option value="">All Brands</option>
                      {allBrands.map((b: string) => <option key={b} value={b}>{b}</option>)}
                  </select>
              </div>
              <div>
                  <select name="stock" className="form-control" defaultValue={stock}>
                      <option value="">Live Completed Products</option>
                      <option value="unlisted">⚠️ Unlisted Products (Missing Images)</option>
                      <option value="in_stock">In Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="all">Show All Catalog Items</option>
                  </select>
              </div>
              <div className="flex gap-3 mt-2 md:mt-0">
                <button type="submit" className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 shadow-sm"><i className="fas fa-filter"></i> Filter</button>
                {(search || category || brand || stock) && (
                    <Link href="/admin" className="px-4 py-2.5 text-center bg-slate-500 text-white rounded-xl text-sm font-semibold hover:bg-slate-600 shadow-sm"><i className="fas fa-undo"></i></Link>
                )}
              </div>
          </form>
      </div>

      <div className={isPending ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
      {viewMode === 'table' ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-x-auto w-full mb-6 relative">
            <table className="w-full text-left text-sm text-slate-600 border-collapse min-w-[800px]">
                <thead>
                    <tr>
                        <th className="bg-slate-50/50 text-slate-500 font-bold py-4 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] text-center w-[5%]">
                          <input type="checkbox" onChange={toggleSelectAll} checked={products.length > 0 && selectedIds.length === products.length} className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                        </th>
                        <th className="bg-slate-50/50 text-slate-500 font-bold py-4 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] w-[8%]">ID</th>
                        <th className="bg-slate-50/50 text-slate-500 font-bold py-4 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] w-[8%]">Image</th>
                        <th className="bg-slate-50/50 text-slate-500 font-bold py-4 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] w-[32%]">Product Details</th>
                        <th className="bg-slate-50/50 text-slate-500 font-bold py-4 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] w-[20%]">Category</th>
                        <th className="bg-slate-50/50 text-slate-500 font-bold py-4 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] w-[15%]">Pricing</th>
                        <th className="bg-slate-50/50 text-slate-500 font-bold py-4 px-5 border-b border-slate-100 uppercase tracking-widest text-[11px] w-[12%]">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 && (
                        <tr>
                            <td colSpan={7} className="text-center py-10 text-slate-400">No products match your criteria.</td>
                        </tr>
                    )}
                    {products.map((prod: any) => (
                        <tr key={prod.id} className="border-b border-slate-50 hover:bg-slate-50/80:bg-slate-700/30 transition-colors">
                            <td className="py-4 px-5 text-center">
                              <input type="checkbox" checked={selectedIds.includes(prod.id)} onChange={() => toggleSelect(prod.id)} className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                            </td>
                            <td className="py-4 px-5 font-bold">#{prod.id}</td>
                            <td className="py-4 px-5">
                                <img src={prod.image ? `/backend-media/${prod.image}` : '/backend-media/images/placeholder.png'} className="w-12 h-12 rounded-lg object-contain border border-slate-200 bg-white p-0.5 shadow-sm hover:scale-110 transition-transform cursor-pointer" />
                            </td>
                            <td className="py-4 px-5">
                                <strong className="text-slate-800 text-base font-extrabold">{prod.name}</strong><br/>
                                <span className="text-slate-500 text-xs font-medium mt-1 inline-block">Brand: <strong className="text-slate-700">{prod.brand || 'Generic'}</strong></span>
                                {(!prod.image || prod.image === 'images/placeholder.png' || prod.image === 'images/Med.jpg') && (
                                    <div className="mt-1.5">
                                        <span className="bg-rose-100 text-rose-600 px-2.5 py-1 rounded-md text-[10px] font-bold inline-flex items-center gap-1.5"><i className="fas fa-eye-slash"></i> Unlisted</span>
                                    </div>
                                )}
                                {(prod.stock_quantity <= 0) && (
                                    <div className="mt-1.5 ml-2 inline-block">
                                        <span className="bg-amber-100 text-amber-600 px-2.5 py-1 rounded-md text-[10px] font-bold inline-flex items-center gap-1.5"><i className="fas fa-ban"></i> Out of Stock</span>
                                    </div>
                                )}
                            </td>
                            <td className="py-4 px-5">
                                {prod.category ? (
                                    <span className="bg-teal-50/80 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-teal-100/50"><i className="fas fa-tag opacity-70 mr-1"></i> {prod.category}</span>
                                ) : (
                                    <span className="text-xs text-slate-400 italic">Uncategorized</span>
                                )}
                            </td>
                            <td className="py-4 px-5">
                                <strong className="text-slate-800 text-lg font-extrabold">₹{prod.price}</strong><br/>
                                <span className="text-slate-400 text-xs font-medium line-through">MRP: ₹{prod.mrp}</span>
                            </td>
                            <td className="py-4 px-5">
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenEdit(prod)} className="bg-slate-100 text-slate-500 w-9 h-9 rounded-full flex items-center justify-center hover:bg-teal-50 hover:text-teal-600 transition-all cursor-pointer border-0 shadow-sm"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => handleDeleteSingle(prod.id)} className="bg-slate-100 text-slate-500 w-9 h-9 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer border-0 shadow-sm"><i className="fas fa-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-6 mt-6">
          {products.map((prod: any) => {
            const discount = prod.mrp > prod.price && prod.price > 0 ? Math.round(((prod.mrp - prod.price) / prod.mrp) * 100) : 0;
            return (
            <div key={prod.id} className="border border-slate-200 rounded-xl p-3 flex flex-col hover:border-teal-500 transition-colors bg-white h-full relative group shrink-0 shadow-sm hover:shadow-md">
              <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur rounded p-1 shadow-sm border border-slate-100">
                <input type="checkbox" checked={selectedIds.includes(prod.id)} onChange={() => toggleSelect(prod.id)} className="w-4 h-4 cursor-pointer m-0 block rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              </div>
              {discount > 0 && (
                <span className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10 shadow-sm">
                  {discount}% OFF
                </span>
              )}
              
              <div className="flex items-center justify-center mb-3 relative overflow-hidden group-hover:scale-105 transition-transform duration-300 h-[150px] w-full shrink-0 pt-6">
                <img src={prod.image ? `/backend-media/${prod.image}` : '/backend-media/images/placeholder.png'} className="w-full h-full object-contain" />
              </div>
              
              <div className="mb-2 shrink-0">
                <h5 className="text-[13px] text-slate-700 font-semibold leading-snug line-clamp-2 group-hover:text-teal-600 transition-colors min-h-[36px]">
                  {prod.name}
                </h5>
              </div>
              
              <div className="mt-auto flex flex-col gap-3">
                <div className="flex items-center gap-2 min-h-[20px]">
                  {prod.price > 0 ? (
                    <>
                      <span className="text-teal-700 font-bold text-sm">₹{prod.price}</span>
                      {prod.mrp > prod.price && (
                        <span className="text-slate-400 text-xs line-through">₹{prod.mrp}</span>
                      )}
                    </>
                  ) : (
                    <span className="text-teal-700 font-bold text-sm">Price on Request</span>
                  )}
                </div>
                
                <div className="flex gap-2 w-full mt-1">
                  <button onClick={() => handleOpenEdit(prod)} className="flex-1 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 font-semibold text-xs hover:text-teal-600 hover:border-teal-600 hover:bg-teal-50 transition-all active:scale-95">
                    <i className="fas fa-edit mr-1.5"></i> Edit
                  </button>
                  <button onClick={() => handleDeleteSingle(prod.id)} className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-600 hover:bg-rose-50 transition-all active:scale-95" title="Delete">
                    <i className="fas fa-trash text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          )})}
        </div>
      )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8 mb-12">
            {page > 1 && <Link href={`/admin?page=${page - 1}`} className="flex items-center justify-center min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-teal-600 shadow-sm no-underline"><i className="fas fa-angle-left mr-1"></i> Prev</Link>}
            <span className="flex items-center justify-center h-9 px-4 rounded-lg text-sm font-semibold bg-teal-600 text-white shadow-md shadow-teal-500/30">Page {page} of {totalPages}</span>
            {page < totalPages && <Link href={`/admin?page=${page + 1}`} className="flex items-center justify-center min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-teal-600 shadow-sm no-underline">Next <i className="fas fa-angle-right ml-1"></i></Link>}
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl text-white px-8 py-4 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-center gap-6 z-50 border border-slate-700/50 transition-all">
          <span className="font-bold flex items-center gap-2">
            <i className="fas fa-check-circle text-teal-400"></i> <span>{selectedIds.length}</span> Selected
          </span>
          <div className="flex items-center gap-3">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-slate-800 text-white border border-slate-600 rounded-lg px-3 py-1.5 text-sm outline-none">
              <option value="">Move Category...</option>
              {allCategories.map((c: string) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={handleUpdateCategory} disabled={!selectedCategory || isPending} className="bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"><i className="fas fa-folder"></i> Apply</button>
            <div className="w-px h-6 bg-slate-700 mx-1"></div>
            <button onClick={() => handleUpdateStatus('in_stock')} disabled={isPending} className="bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"><i className="fas fa-box-open"></i> In Stock</button>
            <button onClick={() => handleUpdateStatus('out_of_stock')} disabled={isPending} className="bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"><i className="fas fa-ban"></i> Out of Stock</button>
            <button onClick={handleDelete} disabled={isPending} className="bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ml-2 disabled:opacity-50"><i className="fas fa-trash-alt"></i> Delete</button>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10005] flex items-center justify-center p-4 transition-opacity duration-300 opacity-100 pointer-events-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden transition-all duration-300 transform flex flex-col max-h-[90vh] translate-y-0 scale-100"
          >
              <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-6 flex items-center justify-between shrink-0">
                  <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                          {editingProduct ? 'Edit Product' : 'Add New Product'}
                      </h2>
                      <p className="text-teal-100 text-sm">
                          {editingProduct ? `Updating ${editingProduct.name}` : 'Create a new product listing in your catalog.'}
                      </p>
                  </div>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                      <i className="fas fa-times text-xl"></i>
                  </button>
              </div>
              
              <div className="flex border-b border-slate-200 px-6 pt-2 bg-slate-50 shrink-0">
                  <button type="button" onClick={() => setActiveTab('basic')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'basic' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Basic Info</button>
                  <button type="button" onClick={() => setActiveTab('details')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'details' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Details & Specs</button>
                  <button type="button" onClick={() => setActiveTab('media')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'media' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Media</button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
                  <form id="productSaveForm" onSubmit={handleSave} className="space-y-6">
                      
                      <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
                              <div className="md:col-span-2">
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product Name*</label>
                                  <input type="text" name="name" required defaultValue={editingProduct?.name || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white" />
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between items-center">
                                    <span>Category</span>
                                    <div className="flex gap-3 items-center">
                                        {editingProduct?.category && <button type="button" onClick={handleDeleteCategory} disabled={isPending} className="text-xs text-rose-500 hover:text-rose-700 disabled:opacity-50"><i className="fas fa-trash-alt"></i></button>}
                                        <button type="button" onClick={() => setIsAddCatModalOpen(true)} className="text-xs text-teal-600 font-bold hover:underline">+ Add New</button>
                                    </div>
                                  </label>
                                  <select name="category" value={editingProduct?.category || ''} onChange={(e) => {
                                      handleCatChange(e);
                                      setEditingProduct((prev: any) => ({ ...prev, category: e.target.value, sub_category_id: '' }));
                                  }} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white">
                                      <option value="">Select Category...</option>
                                      {localCategories.map((c: string) => <option key={c} value={c}>{c}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between items-center">
                                    <span>Sub Category</span>
                                    <div className="flex gap-3 items-center">
                                        {editingProduct?.sub_category_id && <button type="button" onClick={handleDeleteSubCategory} disabled={isPending} className="text-xs text-rose-500 hover:text-rose-700 disabled:opacity-50"><i className="fas fa-trash-alt"></i></button>}
                                        <button type="button" onClick={() => {
                                            if(!editingProduct?.category) { alert('Please select a Category first'); return; }
                                            setIsAddSubCatModalOpen(true);
                                        }} className="text-xs text-teal-600 font-bold hover:underline">+ Add New</button>
                                    </div>
                                  </label>
                                  <select name="sub_category_id" value={editingProduct?.sub_category_id || ''} onChange={(e) => setEditingProduct((prev: any) => ({ ...prev, sub_category_id: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white">
                                      <option value="">Select Sub Category...</option>
                                      {filteredSubCats.map((sc: any) => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between items-center">
                                    <span>Brand</span>
                                    <div className="flex gap-3 items-center">
                                        {editingProduct?.brand && <button type="button" onClick={handleDeleteBrand} disabled={isPending} className="text-xs text-rose-500 hover:text-rose-700 disabled:opacity-50"><i className="fas fa-trash-alt"></i></button>}
                                        <button type="button" onClick={() => setIsAddBrandModalOpen(true)} className="text-xs text-teal-600 font-bold hover:underline">+ Add New</button>
                                    </div>
                                  </label>
                                  <div className="relative">
                                    <input type="text" name="brand" list="brands-list" value={editingProduct?.brand || ''} onChange={(e) => setEditingProduct((prev: any) => ({ ...prev, brand: e.target.value }))} placeholder="Type or select brand..." className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white" />
                                    <datalist id="brands-list">
                                        {localBrands.map((b: string) => <option key={b} value={b} />)}
                                    </datalist>
                                  </div>
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Stock Quantity*</label>
                                  <input type="number" name="stock_quantity" required defaultValue={editingProduct?.stock_quantity || '100'} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white" />
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Selling Price (₹)*</label>
                                  <input type="number" step="0.01" name="price" required defaultValue={editingProduct?.price || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white" />
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">MRP (₹)</label>
                                  <input type="number" step="0.01" name="mrp" defaultValue={editingProduct?.mrp || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white" />
                              </div>
                          </div>
                      </div>

                      <div className={activeTab === 'details' ? 'block' : 'hidden'}>
                          <div className="space-y-5 animate-fade-in">
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Short Description</label>
                                  <textarea name="description" rows={3} defaultValue={editingProduct?.description || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white"></textarea>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                  <div>
                                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Key Features</label>
                                      <textarea name="features" rows={3} defaultValue={editingProduct?.features || ''} placeholder="Feature 1\nFeature 2" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white"></textarea>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Usage Guidelines</label>
                                      <textarea name="usage" rows={3} defaultValue={editingProduct?.usage || ''} placeholder="Guideline 1\nGuideline 2" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white"></textarea>
                                  </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                  <div>
                                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Packaging</label>
                                      <input type="text" name="packaging" defaultValue={editingProduct?.packaging || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Shelf Life</label>
                                      <input type="text" name="shelf_life" defaultValue={editingProduct?.shelf_life || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Warranty</label>
                                      <input type="text" name="warranty" defaultValue={editingProduct?.warranty || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" />
                                  </div>
                              </div>
                              <div className="border-t border-slate-200 pt-5 mt-5">
                                  <div className="flex items-center justify-between mb-3">
                                      <h4 className="font-bold text-slate-800"><i className="fas fa-list-ul mr-2 text-teal-600"></i> Technical Specifications</h4>
                                      <button type="button" onClick={() => setSpecs([...specs, {name: '', description: ''}])} className="text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors">+ Add Row</button>
                                  </div>
                                  {specs.map((spec, i) => (
                                      <div key={i} className="flex gap-3 mb-2 items-center">
                                          <input type="text" placeholder="Property" value={spec.name} onChange={e => {const s=[...specs]; s[i].name=e.target.value; setSpecs(s);}} className="flex-1 px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
                                          <input type="text" placeholder="Value" value={spec.description} onChange={e => {const s=[...specs]; s[i].description=e.target.value; setSpecs(s);}} className="flex-[2] px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
                                          <button type="button" onClick={() => {const s=[...specs]; s.splice(i,1); setSpecs(s);}} className="w-9 h-9 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors shrink-0"><i className="fas fa-times"></i></button>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>

                      <div className={activeTab === 'media' ? 'block' : 'hidden'}>
                          <div className="space-y-6 animate-fade-in">
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                  <label className="block text-sm font-semibold text-slate-700 mb-2">Main Image*</label>
                                  {editingProduct?.image && <div className="mb-2"><img src={`/backend-media/${editingProduct.image}`} className="h-16 rounded border border-slate-200" /></div>}
                                  <input type="file" name="image" accept="image/*" className="w-full text-sm" />
                              </div>
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                  <label className="block text-sm font-semibold text-slate-700 mb-2">Image 2 (Optional)</label>
                                  {editingProduct?.image2 && <div className="mb-2"><img src={`/backend-media/${editingProduct.image2}`} className="h-16 rounded border border-slate-200" /></div>}
                                  <input type="file" name="image2" accept="image/*" className="w-full text-sm" />
                              </div>
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                  <label className="block text-sm font-semibold text-slate-700 mb-2">Image 3 (Optional)</label>
                                  {editingProduct?.image3 && <div className="mb-2"><img src={`/backend-media/${editingProduct.image3}`} className="h-16 rounded border border-slate-200" /></div>}
                                  <input type="file" name="image3" accept="image/*" className="w-full text-sm" />
                              </div>
                              <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                                  <label className="block text-sm font-semibold text-teal-800 mb-2">Catalogue PDF (Optional)</label>
                                  {editingProduct?.catalogue_pdf && <div className="mb-2 text-sm text-teal-700"><i className="fas fa-file-pdf mr-1"></i> {editingProduct.catalogue_pdf}</div>}
                                  <input type="file" name="catalogue_pdf" accept=".pdf" className="w-full text-sm" />
                              </div>
                          </div>
                      </div>

                      <div className="pt-6 border-t border-slate-200 shrink-0">
                          <button type="submit" disabled={isSaving} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50">
                              {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                              {isSaving ? 'Saving...' : 'Save Product'}
                          </button>
                      </div>
                  </form>
              </div>

              {/* Quick Add Brand Mini-Modal */}
              {isAddBrandModalOpen && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-[10010] flex items-center justify-center p-6 rounded-3xl animate-fade-in">
                      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden">
                          <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                              <h3 className="font-bold text-slate-800 m-0">Quick Add Brand</h3>
                              <button type="button" onClick={() => setIsAddBrandModalOpen(false)} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times"></i></button>
                          </div>
                          <form onSubmit={handleQuickAddBrand} className="p-5 space-y-4">
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Brand Name*</label>
                                  <input type="text" name="name" required placeholder="e.g. Philips" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" />
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Brand Logo (Optional)</label>
                                  <input type="file" name="logo" accept="image/*" className="w-full text-sm" />
                              </div>
                              <div className="pt-2">
                                  <button type="submit" disabled={isAddingBrand} className="w-full bg-slate-800 text-white font-bold py-2.5 rounded-xl hover:bg-slate-900 transition-colors disabled:opacity-50">
                                      {isAddingBrand ? 'Adding...' : 'Add Brand & Select'}
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              )}

              {/* Quick Add Category Mini-Modal */}
              {isAddCatModalOpen && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-[10010] flex items-center justify-center p-6 rounded-3xl animate-fade-in">
                      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden">
                          <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                              <h3 className="font-bold text-slate-800 m-0">Quick Add Category</h3>
                              <button type="button" onClick={() => setIsAddCatModalOpen(false)} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times"></i></button>
                          </div>
                          <form onSubmit={handleQuickAddCategory} className="p-5 space-y-4">
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category Name*</label>
                                  <input type="text" name="name" required placeholder="e.g. Defibrillators" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" />
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category Image (Optional)</label>
                                  <input type="file" name="image" accept="image/*" className="w-full text-sm" />
                              </div>
                              <div className="pt-2">
                                  <button type="submit" disabled={isAddingCat} className="w-full bg-slate-800 text-white font-bold py-2.5 rounded-xl hover:bg-slate-900 transition-colors disabled:opacity-50">
                                      {isAddingCat ? 'Adding...' : 'Add Category & Select'}
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              )}

              {/* Quick Add SubCategory Mini-Modal */}
              {isAddSubCatModalOpen && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-[10010] flex items-center justify-center p-6 rounded-3xl animate-fade-in">
                      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden">
                          <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                              <h3 className="font-bold text-slate-800 m-0">Quick Add Sub-Category</h3>
                              <button type="button" onClick={() => setIsAddSubCatModalOpen(false)} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times"></i></button>
                          </div>
                          <form onSubmit={handleQuickAddSubCategory} className="p-5 space-y-4">
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sub-Category Name*</label>
                                  <input type="text" name="name" required placeholder="e.g. ECG Machines" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" />
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Image (Optional)</label>
                                  <input type="file" name="image" accept="image/*" className="w-full text-sm" />
                              </div>
                              <div className="pt-2">
                                  <button type="submit" disabled={isAddingSubCat} className="w-full bg-slate-800 text-white font-bold py-2.5 rounded-xl hover:bg-slate-900 transition-colors disabled:opacity-50">
                                      {isAddingSubCat ? 'Adding...' : 'Add Sub-Category & Select'}
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              )}
          </div>
        </div>
      )}
    </>
  );
}