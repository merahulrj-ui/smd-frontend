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
    <nav className="fixed bottom-0 left-0 w-full h-[64px] bg-white border-t border-slate-200 z-[90] lg:hidden flex justify-around items-end px-1 pb-2 pt-1 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] select-none [-webkit-tap-highlight-color:transparent]">
        <Link href="/" prefetch={true} className={`flex-1 flex flex-col items-center justify-center gap-1 outline-none transition-none ${isActive('/') ? 'text-blue-600' : 'text-slate-500'}`}>
            <i className="fas fa-home text-[20px]"></i>
            <span className="text-[10px] font-medium whitespace-nowrap">Home</span>
        </Link>
        
        <Link href="/categories" prefetch={true} className={`flex-1 flex flex-col items-center justify-center gap-1 outline-none transition-none ${isActive('/categories') ? 'text-blue-600' : 'text-slate-500'}`}>
            <i className="fas fa-layer-group text-[20px]"></i>
            <span className="text-[10px] font-medium whitespace-nowrap">Category</span>
        </Link>
        
        <button 
            className="flex-1 flex flex-col items-center justify-center relative group outline-none"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
        >
            <div className="absolute -top-7 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white active:scale-95 transition-transform">
                <i className="fas fa-search text-[18px]"></i>
            </div>
            <span className="text-[10px] font-medium text-slate-500 mt-6 whitespace-nowrap">Search</span>
        </button>
        
        <Link href="/contact" className={`flex-1 flex flex-col items-center justify-center gap-1 outline-none transition-none ${isActive('/contact') ? 'text-blue-600' : 'text-slate-500'}`}>
            <i className="fas fa-headset text-[20px]"></i>
            <span className="text-[10px] font-medium whitespace-nowrap">Contact</span>
        </Link>
        
        <button className="flex-1 flex flex-col items-center justify-center gap-1 text-slate-500 outline-none transition-none" onClick={openDrawer}>
            <i className="fas fa-bars text-[20px]"></i>
            <span className="text-[10px] font-medium whitespace-nowrap">Menu</span>
        </button>
    </nav>
  );
}
