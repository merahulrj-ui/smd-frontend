"use client";
import Link from 'next/link';
import Image from 'next/image';
import InquireButton from './InquireButton';
import { useUI } from '@/context/UIContext';

interface ProductCardProps {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  mrp: number;
  image: string;
  isNew?: boolean;
}

export default function ProductCard({ id, slug, name, price, mrp, image, isNew }: ProductCardProps) {
  const { addToCatalog, formatPrice } = useUI();
  const discount = mrp > price && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <div className="border border-slate-200 rounded-xl p-3 flex flex-col hover:border-blue-500 transition-colors bg-white h-full relative group shrink-0">
      {/* Discount Badge */}
      {discount > 0 && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10 shadow-sm">
          {discount}% OFF
        </span>
      )}
      
      {/* Image */}
      <Link href={`/product/${slug}`} className="flex items-center justify-center mb-3 outline-none relative overflow-hidden group-hover:scale-105 transition-transform duration-300 h-[150px] w-full shrink-0">
        <Image 
          src={image ? (image.startsWith('http') || image.startsWith('/') ? image : `/backend-media/${image}`) : '/placeholder-product.png'} 
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-contain"
        />
      </Link>
      
      {/* Title */}
      <div className="mb-2 shrink-0">
        <Link href={`/product/${slug}`} className="outline-none">
          <h5 className="text-[13px] text-slate-700 font-semibold leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[36px]">
            {name}
          </h5>
        </Link>
      </div>
      
      {/* Bottom Section (Pricing + Actions) */}
      <div className="mt-auto flex flex-col gap-3">
        {/* Pricing */}
        <div className="flex items-center gap-2 min-h-[20px]">
          {price > 0 ? (
            <>
              <span className="text-blue-700 font-bold text-sm">{formatPrice(price)}</span>
              {mrp > price && (
                <span className="text-slate-500 text-xs line-through">{formatPrice(mrp)}</span>
              )}
            </>
          ) : (
            <span className="text-blue-700 font-bold text-sm">Price on Request</span>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 w-full">
          <div className="flex-1">
            <InquireButton productName={name} />
          </div>
          <button 
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all active:scale-95"
            onClick={(e) => {
              e.preventDefault();
              addToCatalog({ id, name, price, mrp, image, slug });
            }}
            title="Add to Catalog"
          >
            <i className="fas fa-folder-plus text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
