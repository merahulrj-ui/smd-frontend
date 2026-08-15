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
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-[90] lg:hidden flex justify-around items-end px-1 pb-2 pt-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]" style={{ WebkitTapHighlightColor: 'transparent' }}>
        <Link href="/" prefetch={true} className={`flex flex-col items-center justify-center w-[20%] gap-1 transition-colors outline-none ${isActive('/') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-500'}`}>
            <i className="fas fa-home text-[20px] flex items-center justify-center h-[24px]"></i>
            <span className="text-[10px] font-medium whitespace-nowrap">Home</span>
        </Link>
        
        <Link href="/categories" prefetch={true} className={`flex flex-col items-center justify-center w-[20%] gap-1 transition-colors outline-none ${isActive('/categories') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-500'}`}>
            <i className="fas fa-layer-group text-[20px] flex items-center justify-center h-[24px]"></i>
            <span className="text-[10px] font-medium whitespace-nowrap tracking-tight">Categories</span>
        </Link>
        
        <button 
            className="flex flex-col items-center justify-center w-[20%] relative group outline-none"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
        >
            <div className="absolute -top-7 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white group-hover:bg-blue-700 transition-colors">
                <i className="fas fa-search text-[18px]"></i>
            </div>
            <span className="text-[10px] font-medium text-slate-500 mt-[28px] whitespace-nowrap">Search</span>
        </button>
        
        <Link href="/contact" className={`flex flex-col items-center justify-center w-[20%] gap-1 transition-colors outline-none ${isActive('/contact') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-500'}`}>
            <i className="fas fa-headset text-[20px] flex items-center justify-center h-[24px]"></i>
            <span className="text-[10px] font-medium whitespace-nowrap">Contact</span>
        </Link>
        
        <button className="flex flex-col items-center justify-center w-[20%] gap-1 text-slate-500 hover:text-blue-500 transition-colors outline-none" onClick={openDrawer}>
            <i className="fas fa-bars text-[20px] flex items-center justify-center h-[24px]"></i>
            <span className="text-[10px] font-medium whitespace-nowrap">Menu</span>
        </button>
    </nav>
  );
}
