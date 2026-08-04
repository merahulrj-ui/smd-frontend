"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useUI, CURRENCIES, CurrencyCode } from '@/context/UIContext';
import { useTypewriterPlaceholder } from '@/hooks/useTypewriterPlaceholder';

export default function Navbar() {
  const { setSearchOpen, setSellerModalOpen, setMobileDrawerOpen, currency, setCurrency, currencySymbol } = useUI();
  const typewriterPlaceholder = useTypewriterPlaceholder();
  const [categories, setCategories] = useState<any[]>([]);
  const [hoveredCatId, setHoveredCatId] = useState<number | null>(null);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  useEffect(() => {
    // Fetch categories for the mega menu from Next.js API (MySQL)
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(err => console.error("Failed to load categories:", err));
  }, []);



  return (
    <header className="fixed top-0 left-0 w-full h-[76px] bg-white border-b border-slate-200 z-50 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto h-full flex justify-between items-center px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center">
          <Link href="/">
            <Image src="/images/img_68ae826eb6cc47.12112340_logo.webp" alt="SMD MEDICARE" width={121} height={69} className="h-[55px] w-auto transition-transform duration-300 hover:scale-[1.03]" priority />
          </Link>
        </div>

        <div className="hidden lg:flex flex-1 max-w-[450px] mx-10">
          <div 
            className="flex items-center bg-slate-50 rounded-full py-1 pl-4 pr-1.5 border border-slate-300 transition-all duration-300 cursor-text w-full hover:border-teal-400" 
            onClick={() => setSearchOpen(true)}
          >
            <input 
              type="text" 
              placeholder={typewriterPlaceholder || "Search for products, brands..."} 
              className="border-none bg-transparent outline-none flex-1 text-[0.95rem] text-slate-700 pr-2 pointer-events-none" 
              readOnly 
            />
            <button type="button" aria-label="Search" className="bg-blue-600 hover:bg-blue-700 text-white border-none w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-sm">
              <i className="fas fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <div className="flex items-center ml-auto">
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-2 list-none m-0 p-0">
              <li>
                <Link href="/" className="text-slate-700 font-medium text-[0.95rem] px-4 py-2 rounded-full hover:bg-teal-600/10 hover:text-teal-600 transition-colors">Home</Link>
              </li>
              
              <li className="group relative py-2">
                <Link href="/categories" className="text-slate-700 font-medium text-[0.95rem] px-4 py-2 rounded-full hover:bg-teal-600/10 hover:text-teal-600 transition-colors flex items-center gap-1 cursor-pointer">
                  Categories <i className="fas fa-chevron-down text-[0.7em]"></i>
                </Link>
                
                {/* Mega Menu Wrapper (bridges the hover gap) */}
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 transition-all duration-300 z-[1000]">
                  <div className="w-[550px] h-[450px] bg-white rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.1)] border border-slate-200 flex overflow-hidden">
                    
                    {/* Left Side: Categories */}
                    <div className="w-[40%] bg-white border-r border-slate-200 overflow-y-auto custom-scrollbar py-2">
                    <ul className="list-none m-0 p-0">
                      {categories.map((cat, index) => {
                        const isActive = hoveredCatId === null ? index === 0 : hoveredCatId === cat.id;
                        return (
                          <li 
                            key={cat.id} 
                            className="cursor-pointer transition-colors hover:bg-slate-50" 
                            onMouseEnter={() => setHoveredCatId(cat.id)}
                          >
                            <Link href={`/category/${cat.slug}`} className={`flex items-center justify-between px-5 py-3 text-[14px] ${isActive ? 'text-blue-600 font-semibold' : 'text-slate-700'}`}>
                              {cat.name} <i className={`fas fa-chevron-right text-[10px] ${isActive ? 'text-blue-600' : 'text-slate-400'}`}></i>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  
                  {/* Right Side: Subcategories */}
                  <div className="w-[60%] bg-slate-50 relative">
                    {categories.map((cat, index) => {
                      const isActive = hoveredCatId === null ? index === 0 : hoveredCatId === cat.id;
                      return (
                        <div key={cat.id} className={`absolute inset-0 p-6 overflow-y-auto custom-scrollbar transition-opacity duration-300 ${isActive ? 'opacity-100 visible z-10' : 'opacity-0 invisible pointer-events-none z-0'}`}>
                          <h4 className="text-sm font-bold text-slate-800 mb-4 pb-2">Sub Category</h4>
                          {cat.subcategories && cat.subcategories.length > 0 ? (
                            <ul className="flex flex-col gap-3 list-none m-0 p-0">
                              {cat.subcategories.map((subCat: any, sIdx: number) => (
                                <li key={sIdx}>
                                  <Link href={`/category/${cat.slug}/${subCat.slug}`} className="text-slate-600 text-[14px] hover:text-blue-600 transition-colors flex items-center gap-2">
                                    <i className="fas fa-chevron-right text-[9px] text-blue-500"></i> {subCat.name}
                                  </Link>
                                </li>
                              ))}
                              <li className="pt-2">
                                <Link href={`/category/${cat.slug}`} className="text-slate-500 text-[13px] hover:text-slate-800 transition-colors flex items-center gap-2">
                                  <i className="fas fa-arrow-right text-[10px]"></i> View all {cat.subcategories.length} subcategories
                                </Link>
                              </li>
                            </ul>
                          ) : (
                            <p className="text-slate-500 text-sm mt-3">No subcategories available.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                </div>
              </li>

              <li><Link href="/about" className="text-slate-700 font-medium text-[0.95rem] px-4 py-2 rounded-full hover:bg-teal-600/10 hover:text-teal-600 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-slate-700 font-medium text-[0.95rem] px-4 py-2 rounded-full hover:bg-teal-600/10 hover:text-teal-600 transition-colors">Contact</Link></li>
              <li><Link href="/blog" className="text-slate-700 font-medium text-[0.95rem] px-4 py-2 rounded-full hover:bg-teal-600/10 hover:text-teal-600 transition-colors">Blogs</Link></li>
              <li>
                <button onClick={() => setSellerModalOpen(true)} className="ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-2 rounded-full shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all">
                  Become a Seller
                </button>
              </li>
            </ul>
          </nav>
          
          <div className="flex items-center gap-3 lg:gap-4 ml-auto lg:ml-4 border-l-0 lg:border-l border-slate-200 pl-0 lg:pl-4 relative">
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsCurrencyOpen(!isCurrencyOpen); }}
                className="text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 rounded-full font-bold flex items-center gap-1 transition-colors py-1.5 shadow-sm border border-slate-200"
              >
                {currencySymbol} <i className={`fas fa-chevron-down text-[0.6em] transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`}></i>
              </button>
              
              {/* Overlay to close dropdown when clicking outside on mobile */}
              {isCurrencyOpen && (
                 <div className="fixed inset-0 z-40" onClick={() => setIsCurrencyOpen(false)}></div>
              )}

              <div className={`absolute top-[120%] right-0 mt-2 w-28 bg-white rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.15)] border border-slate-100 transition-all duration-200 z-50 overflow-hidden transform ${isCurrencyOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                <ul className="py-2 list-none m-0 p-0 flex flex-col gap-1">
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                    <li key={code}>
                      <button 
                        onClick={() => { setCurrency(code); setIsCurrencyOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors font-medium flex items-center gap-3 ${currency === code ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50 hover:text-teal-600'}`}
                      >
                        <span className={`w-5 text-center font-bold text-lg ${currency === code ? 'text-teal-700' : 'text-slate-800'}`}>{CURRENCIES[code].symbol}</span> 
                        {code}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex lg:hidden items-center gap-4">
              <button className="text-slate-600 text-xl hover:text-teal-600 transition-colors" aria-label="Open Search" onClick={() => setSearchOpen(true)}>
                <i className="fas fa-search" aria-hidden="true"></i>
              </button>
              <button className="text-slate-600 text-2xl hover:text-teal-600 transition-colors" aria-label="Open Navigation Menu" onClick={() => setMobileDrawerOpen(true)}>
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
