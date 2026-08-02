"use client";

import { useState } from 'react';
import Link from 'next/link';

interface Subcategory {
  id: number;
  name: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  subcategories: Subcategory[];
}

interface Props {
  categories: Category[];
}

const COLORS = [
  'bg-emerald-600', 'bg-blue-600', 'bg-violet-600', 'bg-rose-600', 'bg-amber-500', 'bg-teal-600', 'bg-indigo-600', 'bg-pink-600'
];

export default function CategoriesClient({ categories }: Props) {
  const [activeCategoryId, setActiveCategoryId] = useState<number>(categories[0]?.id || 0);

  const activeCategory = categories.find(c => c.id === activeCategoryId) || categories[0];

  const getInitials = (name: string) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-row max-w-[1400px] mx-auto bg-white min-h-[calc(100vh-160px)] md:min-h-[600px] shadow-sm border border-slate-200 md:mt-6 mb-20 md:rounded-xl overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-[35%] md:w-1/4 bg-slate-50 border-r border-slate-200 overflow-y-auto h-[calc(100vh-160px)] md:h-[800px] custom-scrollbar">
        <ul className="py-2 md:py-4">
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <li key={cat.id} className="relative">
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                )}
                <button
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`w-full text-left px-2 sm:px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row items-center md:gap-3 transition-colors ${isActive ? 'bg-white text-blue-600 font-bold shadow-[inset_0px_0px_10px_rgba(0,0,0,0.02)]' : 'text-slate-600 hover:bg-white hover:text-blue-500 font-medium'}`}
                >
                  <div className={`w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 mb-1 md:mb-0 ${isActive ? 'bg-blue-50/50 text-blue-600' : 'bg-transparent md:bg-slate-200 text-slate-400 md:text-slate-500'}`}>
                    {/* Using an image or a generic icon depending on what was there before. The screenshot shows images like a heart for cardiology, teeth for dental, etc. If we don't have images, a generic icon is fine. Let's use generic for now. */}
                    <img src={`/backend-media/category-icons/${cat.slug}.png`} onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling?.removeAttribute('hidden'); }} className="w-8 h-8 object-contain drop-shadow-sm" alt="" />
                    <i className="fas fa-layer-group text-sm" hidden></i>
                  </div>
                  <span className="text-[0.65rem] md:text-base text-center md:text-left leading-tight break-words whitespace-normal w-full md:truncate">{cat.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Content Area */}
      <div className="w-[65%] md:w-3/4 p-4 md:p-10 bg-white overflow-y-auto h-[calc(100vh-160px)] md:h-[800px] custom-scrollbar">
        {activeCategory ? (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">
              Explore {activeCategory.name}
            </h1>
            
            {activeCategory.subcategories && activeCategory.subcategories.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
                {activeCategory.subcategories.map((subcat, idx) => (
                  <Link 
                    href={`/category/${activeCategory.slug}/${subcat.slug}`} 
                    key={subcat.id}
                    className="flex flex-col items-center group text-center"
                  >
                    <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl ${COLORS[idx % COLORS.length]} flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold mb-4 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300`}>
                      {getInitials(subcat.name)}
                    </div>
                    <span className="text-slate-700 text-sm font-semibold group-hover:text-blue-600 transition-colors line-clamp-2">
                      {subcat.name}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-100 mb-10">
                <i className="fas fa-box-open text-4xl text-slate-300 mb-3"></i>
                <p className="text-slate-500 font-medium">No subcategories available for {activeCategory.name}.</p>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link 
                href={`/category/${activeCategory.slug}`}
                className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2 group w-max"
              >
                View All {activeCategory.name} Products 
                <i className="fas fa-arrow-right text-sm transform group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            Select a category to explore
          </div>
        )}
      </div>

    </div>
  );
}
