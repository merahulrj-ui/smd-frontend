"use client";

import Link from 'next/link';
import { useUI } from '@/context/UIContext';
import { useState, useEffect } from 'react';

export default function MobileDrawer() {
  const { isMobileDrawerOpen, setMobileDrawerOpen, setSellerModalOpen } = useUI();
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error(err));
  }, []);

  const closeDrawer = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${isMobileDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={closeDrawer}
      ></div>
      
      <aside 
        className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[9999] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
          <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <Link href="/" onClick={closeDrawer}>
                  <img src="/images/img_68ae826eb6cc47.12112340_logo.webp" alt="SMD MEDICARE" className="h-[45px] w-auto object-contain" />
              </Link>
              <button 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors" 
                onClick={closeDrawer}
              >
                <i className="fas fa-times text-lg"></i>
              </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              <ul className="flex flex-col gap-2 list-none m-0 p-0">
                  <li>
                      <Link href="/" onClick={closeDrawer} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-teal-50 hover:text-teal-600 font-medium transition-colors">
                          <i className="fas fa-home w-5 text-center"></i> <span>Home</span>
                      </Link>
                  </li>
                  
                  <li className="flex flex-col border border-slate-100 rounded-xl overflow-hidden bg-slate-50">
                      <button 
                        className={`flex items-center justify-between px-4 py-3 text-slate-700 font-medium transition-colors ${isCatOpen ? 'text-teal-600 bg-teal-50/50' : 'hover:bg-slate-100'}`} 
                        onClick={() => setIsCatOpen(!isCatOpen)}
                      >
                          <span className="flex items-center gap-3"><i className="fas fa-tags w-5 text-center" aria-hidden="true"></i> <span>Categories</span></span>
                          <i className={`fas fa-chevron-down transition-transform duration-300 ${isCatOpen ? 'rotate-180' : ''}`} aria-hidden="true"></i>
                      </button>
                      <div className={`flex-col px-4 pt-1 pb-4 gap-2 border-t border-slate-200/60 bg-white ${isCatOpen ? 'flex' : 'hidden'}`}>
                          <Link href="/categories" className="text-teal-600 font-semibold py-2">All Categories</Link>
                          {categories.map((cat: any) => (
                            <Link key={cat.id} href={`/category/${cat.slug}`} onClick={closeDrawer} className="text-[13px] py-1.5 text-slate-500 hover:text-teal-600 transition-colors flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> {cat.name}
                            </Link>
                          ))}
                          <Link href="/categories" onClick={closeDrawer} className="text-teal-500 text-sm font-semibold mt-2 hover:text-teal-600 flex items-center gap-1">
                              View All Categories <i className="fas fa-arrow-right text-[0.8em]"></i>
                          </Link>
                      </div>
                  </li>

                  <li>
                      <Link href="/about" onClick={closeDrawer} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-teal-50 hover:text-teal-600 font-medium transition-colors">
                          <i className="fas fa-info-circle w-5 text-center"></i> <span>About Us</span>
                      </Link>
                  </li>
                  <li>
                      <Link href="/contact" onClick={closeDrawer} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-teal-50 hover:text-teal-600 font-medium transition-colors">
                          <i className="fas fa-headset w-5 text-center"></i> <span>Contact Us</span>
                      </Link>
                  </li>
                  <li>
                      <Link href="/blog" onClick={closeDrawer} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-teal-50 hover:text-teal-600 font-medium transition-colors">
                          <i className="fas fa-newspaper w-5 text-center"></i> <span>Blogs & News</span>
                      </Link>
                  </li>
              </ul>

              <div className="mt-8">
                  <button 
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-[0_4px_15px_rgba(13,148,136,0.3)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.4)] transition-all" 
                    onClick={() => {
                        closeDrawer();
                        setSellerModalOpen(true);
                    }}
                  >
                      <i className="fas fa-handshake" aria-hidden="true"></i> Become a Seller
                  </button>
              </div>

              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                  <p className="text-slate-500 font-semibold mb-2 flex items-center justify-center gap-2"><i className="fas fa-phone-alt text-teal-500"></i> Quick Assistance</p>
                  <a href="tel:+919555422455" className="text-xl font-bold text-slate-800 hover:text-teal-600 block mb-1">+91 95554 22455</a>
                  <p className="text-slate-500 text-sm"><i className="fas fa-envelope"></i> info@smdmedicare.com</p>
              </div>
          </div>
      </aside>
    </>
  );
}
