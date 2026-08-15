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
      className="fixed bottom-0 left-0 w-full h-[65px] bg-white border-t border-slate-200 z-[90] lg:hidden flex shadow-[0_-4px_10px_rgba(0,0,0,0.05)]" 
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
        <Link href="/" prefetch={true} className={`flex flex-col items-center justify-center w-[20%] h-full gap-1 outline-none transition-none ${isActive('/') ? 'text-blue-600' : 'text-slate-500'}`}>
            <i className="fas fa-home text-[22px] leading-none mb-0.5"></i>
            <span className="text-[10px] font-medium leading-none">Home</span>
        </Link>
        
        <Link href="/categories" prefetch={true} className={`flex flex-col items-center justify-center w-[20%] h-full gap-1 outline-none transition-none ${isActive('/categories') ? 'text-blue-600' : 'text-slate-500'}`}>
            <i className="fas fa-layer-group text-[22px] leading-none mb-0.5"></i>
            <span className="text-[10px] font-medium leading-none">Categories</span>
        </Link>
        
        <div className="w-[20%] h-full relative flex flex-col items-center justify-center">
            <button 
                className="absolute -top-5 w-[50px] h-[50px] bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-[4px] border-white outline-none active:scale-95 transition-transform"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
            >
                <i className="fas fa-search text-[18px]"></i>
            </button>
            <span className="text-[10px] font-medium text-slate-500 absolute bottom-[10px] leading-none">Search</span>
        </div>
        
        <Link href="/contact" prefetch={true} className={`flex flex-col items-center justify-center w-[20%] h-full gap-1 outline-none transition-none ${isActive('/contact') ? 'text-blue-600' : 'text-slate-500'}`}>
            <i className="fas fa-headset text-[22px] leading-none mb-0.5"></i>
            <span className="text-[10px] font-medium leading-none">Contact</span>
        </Link>
        
        <button className="flex flex-col items-center justify-center w-[20%] h-full gap-1 text-slate-500 outline-none transition-none" onClick={openDrawer}>
            <i className="fas fa-bars text-[22px] leading-none mb-0.5"></i>
            <span className="text-[10px] font-medium leading-none">Menu</span>
        </button>
    </nav>
  );
}
