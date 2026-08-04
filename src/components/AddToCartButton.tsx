"use client";
import { useUI } from '@/context/UIContext';

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCatalog, catalog } = useUI();
  const isAdded = catalog.some(p => p.id === product.id);

  return (
    <button 
      onClick={() => addToCatalog(product)}
      disabled={isAdded}
      className={`flex-1 py-4 px-5 text-[1.1rem] font-bold rounded-xl text-white transition-all shadow-md flex items-center justify-center gap-2 ${isAdded ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'}`}
    >
      <i className="fas fa-shopping-cart"></i> {isAdded ? 'Added to Quote' : 'Add to Quote'}
    </button>
  );
}
