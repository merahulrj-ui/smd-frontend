'use client';

import { useUI } from '@/context/UIContext';

export default function HeroPartnerButton() {
  const { setSellerModalOpen } = useUI();

  return (
    <button 
      onClick={() => setSellerModalOpen(true)} 
      className="px-5 py-2.5 md:px-8 md:py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm md:text-base font-semibold rounded-lg md:rounded-xl transition-all flex items-center gap-2 flex-1 md:flex-none justify-center whitespace-nowrap cursor-pointer"
    >
      <i className="fas fa-handshake"></i> Partner
    </button>
  );
}
