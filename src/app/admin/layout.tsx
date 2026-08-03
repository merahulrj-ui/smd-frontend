"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from './login/actions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarActive, setSidebarActive] = useState(false);

  // Skip admin layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/admin', icon: 'fa-box', label: 'Products Manager', exact: true },
    { href: '/admin/categories', icon: 'fa-tags', label: 'Categories Manager' },
    { href: '/admin/brands', icon: 'fa-copyright', label: 'Brands Manager' },
    { href: '/admin/enquiries', icon: 'fa-envelope-open-text', label: 'Enquiries & Logs' },
    { href: '/admin/blogs', icon: 'fa-newspaper', label: 'Blogs Manager' },
    { href: '/admin/reviews', icon: 'fa-star-half-alt', label: 'Reviews List' },
    { href: '/admin/jayanti-logs', icon: 'fa-robot', label: 'Jayanti Logs' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased flex">
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

        {/* Mobile Overlay */}
        {sidebarActive && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarActive(false)}></div>
        )}

        {/* Sidebar */}
        <aside className={`w-64 bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col fixed top-4 bottom-4 left-4 z-50 rounded-2xl transition-transform duration-300 ${sidebarActive ? 'translate-x-0' : 'max-lg:-translate-x-[150%]'}`} style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
          <div className="p-6 flex justify-between items-center border-b border-slate-100/50 mb-2">
            <Link href="/" className="block w-full text-center">
              <img src="/images/img_68ae826eb6cc47.12112340_logo.webp" alt="SMD MEDICARE" className="w-full h-auto max-h-12 object-contain" />
            </Link>
          </div>
          <ul className="flex flex-col gap-1 px-3 list-none m-0 overflow-y-auto pb-4">
            {navItems.map(item => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarActive(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold no-underline transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 text-blue-600 border border-blue-100/50 shadow-sm'
                        : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/50'
                    }`}
                  >
                    <i className={`fas ${item.icon} w-5 text-center text-lg ${isActive ? 'text-blue-600' : 'text-slate-400'}`}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="lg:ml-[19rem] flex-1 p-6 lg:p-8 min-w-0 w-full" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
          <header className="flex justify-between items-center mb-8 bg-white/70 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/50 sticky top-4 z-40 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button className="lg:hidden text-slate-500 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition-colors bg-transparent border-0" onClick={() => setSidebarActive(!sidebarActive)}>
                <i className="fas fa-bars text-xl"></i>
              </button>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">Admin Dashboard</h1>
                <p className="text-sm font-medium text-slate-500 mt-1 m-0">Welcome back, Administrator</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-white shadow-sm border border-slate-100 text-sm font-bold text-slate-700">
                <i className="fas fa-user-shield text-blue-600 text-lg"></i>
                <span>Administrator</span>
              </div>
              <form action={logoutAction}>
                <button type="submit" className="bg-rose-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-rose-700 shadow-sm shadow-rose-500/20"><i className="fas fa-sign-out-alt"></i></button>
              </form>
            </div>
          </header>

          {children}
        </main>
    </div>
  );
}

