"use client";

import { useUI } from '@/context/UIContext';

export default function InquireButton({ productName }: { productName: string }) {
  const { openInquiryModal } = useUI();

  return (
    <button 
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 rounded-lg transition-colors shadow-sm hover:shadow-md" 
      onClick={(e) => { 
        e.preventDefault(); 
        openInquiryModal(productName, 'Product Inquiry');
      }} 
    >
      Get Best Price
    </button>
  );
}
