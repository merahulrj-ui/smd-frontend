"use client";
import Link from 'next/link';
import { useUI } from '@/context/UIContext';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const { setMobileDrawerOpen, setSearchOpen } = useUI();
  const pathname = usePathname();

  const openDrawer = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileDrawerOpen(true);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className="lg:hidden bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] select-none"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '70px',
        zIndex: 9999,
        transform: 'translateZ(0)',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div className="grid grid-cols-5 h-full w-full max-w-md mx-auto items-center px-1">
        {/* 1. Home */}
        <Link
          href="/"
          prefetch={true}
          className={`flex flex-col items-center justify-center h-full py-1.5 group transition-colors ${
            isActive('/') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'
          }`}
        >
          <div
            className={`w-12 h-8 rounded-full flex items-center justify-center transition-all ${
              isActive('/') ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <i className="fas fa-home text-[21px]"></i>
          </div>
          <span
            className={`text-[11px] tracking-tight leading-none mt-1 whitespace-nowrap ${
              isActive('/') ? 'font-bold text-blue-600' : 'font-medium'
            }`}
          >
            Home
          </span>
        </Link>

        {/* 2. Categories */}
        <Link
          href="/categories"
          prefetch={true}
          className={`flex flex-col items-center justify-center h-full py-1.5 group transition-colors ${
            isActive('/categories') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'
          }`}
        >
          <div
            className={`w-12 h-8 rounded-full flex items-center justify-center transition-all ${
              isActive('/categories') ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <i className="fas fa-layer-group text-[21px]"></i>
          </div>
          <span
            className={`text-[11px] tracking-tight leading-none mt-1 whitespace-nowrap ${
              isActive('/categories') ? 'font-bold text-blue-600' : 'font-medium'
            }`}
          >
            Categories
          </span>
        </Link>

        {/* 3. Search (Center Floating Round Blue FAB) */}
        <div className="flex flex-col items-center justify-center h-full relative">
          <button
            onClick={() => setSearchOpen(true)}
            className="absolute -top-5 w-[52px] h-[52px] rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border-4 border-white active:scale-95 transition-transform outline-none"
            aria-label="Search"
          >
            <i className="fas fa-search text-[19px]"></i>
          </button>
          <span className="text-[11px] font-semibold text-slate-500 tracking-tight leading-none mt-7 whitespace-nowrap">
            Search
          </span>
        </div>

        {/* 4. Contact */}
        <Link
          href="/contact"
          prefetch={true}
          className={`flex flex-col items-center justify-center h-full py-1.5 group transition-colors ${
            isActive('/contact') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'
          }`}
        >
          <div
            className={`w-12 h-8 rounded-full flex items-center justify-center transition-all ${
              isActive('/contact') ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <i className="fas fa-headset text-[21px]"></i>
          </div>
          <span
            className={`text-[11px] tracking-tight leading-none mt-1 whitespace-nowrap ${
              isActive('/contact') ? 'font-bold text-blue-600' : 'font-medium'
            }`}
          >
            Contact
          </span>
        </Link>

        {/* 5. Menu */}
        <button
          onClick={openDrawer}
          className="flex flex-col items-center justify-center h-full py-1.5 text-slate-500 hover:text-blue-600 group outline-none"
          aria-label="Menu"
        >
          <div className="w-12 h-8 rounded-full flex items-center justify-center group-active:scale-95 transition-transform">
            <i className="fas fa-bars text-[21px]"></i>
          </div>
          <span className="text-[11px] font-medium tracking-tight leading-none mt-1 whitespace-nowrap">
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
}
