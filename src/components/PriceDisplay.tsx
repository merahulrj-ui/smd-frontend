"use client";

import { useUI } from '@/context/UIContext';

export default function PriceDisplay({ price, mrp, className = "" }: { price: number, mrp?: number, className?: string }) {
  const { formatPrice } = useUI();
  
  if (!price || price <= 0) {
    return <span className={`text-blue-700 font-bold ${className}`}>Ask for Price</span>;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-blue-700 font-bold">{formatPrice(price)}</span>
      {mrp && mrp > price && (
        <span className="text-slate-500 text-sm line-through">{formatPrice(mrp)}</span>
      )}
    </div>
  );
}
