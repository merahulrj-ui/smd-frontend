"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUI } from '@/context/UIContext';

interface SidebarFilterProps {
  subcategories?: { id: number; name: string; slug: string }[];
  brands?: string[];
  isSearch?: boolean;
}

export default function SidebarFilter({ subcategories = [], brands = [], isSearch = false }: SidebarFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currencySymbol } = useUI();

  // Local state for mobile toggle and search filters
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [subcatSearch, setSubcatSearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');

  // Local state for controlled inputs
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');

  // Current Selections from URL
  const currentSortBy = searchParams.get('sort_by') || 'relevance';
  const currentDiscount = searchParams.get('discount') || '';
  const currentSelections = isSearch 
    ? (searchParams.get('cats') ? searchParams.get('cats')?.split(',') || [] : [])
    : (searchParams.get('subcats') ? searchParams.get('subcats')?.split(',') || [] : []);
  const currentBrands = searchParams.get('brands') ? searchParams.get('brands')?.split(',') || [] : [];

  const applyFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset page on filter change
    params.delete('page');

    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(window.location.pathname);
  };

  const handleCheckboxChange = (type: 'subcats' | 'brands' | 'cats', value: string, isChecked: boolean) => {
    const current = type === 'subcats' ? currentSelections : currentBrands;
    let next;
    if (isChecked) {
      next = [...current, value];
    } else {
      next = current.filter(item => item !== value);
    }
    applyFilters({ [type]: next.length > 0 ? next.join(',') : null });
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="lg:hidden w-full bg-white border border-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-xl shadow-sm mb-4 flex items-center justify-between transition-colors hover:bg-slate-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <span className="flex items-center gap-2">
          <i className="fas fa-filter text-blue-600"></i> Filters
        </span>
        <i className={`fas fa-chevron-${isMobileOpen ? 'up' : 'down'} text-slate-400`}></i>
      </button>

      <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-5 ${isMobileOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <i className="fas fa-sliders-h text-blue-600"></i> Filters
          </h3>
          <button onClick={clearFilters} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            Clear All
          </button>
        </div>

        {/* Sort By Filter */}
        <div className="mb-6 pb-5 border-b border-slate-100">
          <h4 className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-sort-amount-down text-blue-500/70"></i> Sort By
          </h4>
          <select 
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer hover:bg-white"
            value={currentSortBy}
            onChange={(e) => applyFilters({ sort_by: e.target.value })}
          >
            <option value="relevance">Relevance</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>

        {/* Price Filter */}
        <div className="mb-6 pb-5 border-b border-slate-100">
          <h4 className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-rupee-sign text-blue-500/70"></i> Price Range
          </h4>
          <div className="flex items-center gap-2 mb-3">
            <input 
              type="number" 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 hover:bg-white" 
              placeholder={`Min ${currencySymbol}`} 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="text-slate-400 font-medium">-</span>
            <input 
              type="number" 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 hover:bg-white" 
              placeholder={`Max ${currencySymbol}`} 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <button 
            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg text-sm transition-colors border border-blue-100"
            onClick={() => applyFilters({ min_price: minPrice || null, max_price: maxPrice || null })}
          >
            Apply Price
          </button>
        </div>

        {/* Discount Filter */}
        <div className="mb-6 pb-5 border-b border-slate-100">
          <h4 className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-tags text-blue-500/70"></i> Discount
          </h4>
          <select 
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer hover:bg-white"
            value={currentDiscount}
            onChange={(e) => applyFilters({ discount: e.target.value })}
          >
            <option value="">Any Discount</option>
            <option value="10">10% or more</option>
            <option value="20">20% or more</option>
            <option value="30">30% or more</option>
            <option value="50">50% or more</option>
          </select>
        </div>

        {/* Subcategories Filter (Only show if not empty) */}
        {subcategories && subcategories.length > 0 && (
          <div className="mb-6 pb-5 border-b border-slate-100">
            <h4 className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fas fa-list-ul text-blue-500/70"></i> 
              {isSearch ? 'Categories' : 'Sub Categories'}
            </h4>
            
            {subcategories.length > 5 && (
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 mb-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:bg-white"
                value={subcatSearch}
                onChange={(e) => setSubcatSearch(e.target.value)}
              />
            )}

            <div className="max-h-[180px] overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
              {subcategories
                .filter(sub => sub.name.toLowerCase().includes(subcatSearch.toLowerCase()))
                .map(sub => {
                  const paramValue = isSearch ? sub.id.toString() : sub.slug;
                  return (
                    <label key={sub.id} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="peer appearance-none w-4 h-4 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
                          checked={currentSelections.includes(paramValue)}
                          onChange={(e) => handleCheckboxChange(isSearch ? 'cats' : 'subcats', paramValue, e.target.checked)}
                        />
                        <i className="fas fa-check absolute text-[10px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></i>
                      </div>
                      <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors line-clamp-1">{sub.name}</span>
                    </label>
                  );
              })}
            </div>
          </div>
        )}

        {/* Brands Filter */}
        {brands && brands.length > 0 && (
          <div className="mb-2">
            <h4 className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fas fa-copyright text-blue-500/70"></i> Brands
            </h4>

            {brands.length > 5 && (
              <input 
                type="text" 
                placeholder="Search Brand..." 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 mb-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:bg-white"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
              />
            )}

            <div className="max-h-[180px] overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
              {brands
                .filter(brand => brand.toLowerCase().includes(brandSearch.toLowerCase()))
                .map((brand, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-4 h-4 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
                        checked={currentBrands.includes(brand)}
                        onChange={(e) => handleCheckboxChange('brands', brand, e.target.checked)}
                      />
                      <i className="fas fa-check absolute text-[10px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></i>
                    </div>
                    <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors line-clamp-1">{brand}</span>
                  </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </>
  );
}
