"use client";

import { useUI } from '@/context/UIContext';

export default function InquireButton({ productName, className }: { productName: string, className?: string }) {
  const { openInquiryModal } = useUI();

  return (
    <button 
      className={className || "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] sm:text-sm py-2 px-1 sm:px-2 rounded-lg transition-colors shadow-sm hover:shadow-md whitespace-nowrap flex items-center justify-center"} 
      onClick={(e) => { 
        e.preventDefault(); 
        openInquiryModal(productName, 'Product Inquiry');
      }} 
    >
      <i className="fas fa-paper-plane mr-1.5 shrink-0"></i> 
      <span className="truncate">Get Best Price</span>
    </button>
  );
}
