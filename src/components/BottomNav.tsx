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
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-[90] lg:hidden flex justify-around items-end px-1 pb-2 pt-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] select-none">
        <Link href="/" prefetch={true} className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${isActive('/') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-500'}`}>
            <i className="fas fa-home text-[20px]"></i>
            <span className="text-[10px] font-medium">Home</span>
        </Link>
        
        <Link href="/categories" prefetch={true} className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${isActive('/categories') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-500'}`}>
            <i className="fas fa-layer-group text-[20px]"></i>
            <span className="text-[10px] font-medium truncate max-w-full">Category</span>
        </Link>
        
        <button 
            className="flex-1 flex flex-col items-center justify-center relative group"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
        >
            <div className="absolute -top-7 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white group-hover:bg-blue-700 transition-colors">
                <i className="fas fa-search text-[18px]"></i>
            </div>
            <span className="text-[10px] font-medium text-slate-500 mt-6">Search</span>
        </button>
        
        <Link href="/contact" className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${isActive('/contact') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-500'}`}>
            <i className="fas fa-headset text-[20px]"></i>
            <span className="text-[10px] font-medium">Contact</span>
        </Link>
        
        <button className="flex-1 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-blue-500 transition-colors" onClick={openDrawer}>
            <i className="fas fa-bars text-[20px]"></i>
            <span className="text-[10px] font-medium">Menu</span>
        </button>
    </nav>
  );
}
