"use client";

import { useUI } from '@/context/UIContext';

export default function InquireButton({ productName, className }: { productName: string, className?: string }) {
  const { openInquiryModal } = useUI();

  return (
    <button 
      className={className || "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 rounded-lg transition-colors shadow-sm hover:shadow-md"} 
      onClick={(e) => { 
        e.preventDefault(); 
        openInquiryModal(productName, 'Product Inquiry');
      }} 
    >
      <i className="fas fa-paper-plane mr-2"></i> Get Best Price
    </button>
  );
}
