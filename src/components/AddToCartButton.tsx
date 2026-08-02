"use client";
import { useUI } from '@/context/UIContext';

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCatalog, catalog } = useUI();
  const isAdded = catalog.some(p => p.id === product.id);

  return (
    <button 
      onClick={() => addToCatalog(product)}
      disabled={isAdded}
      style={{
        flex: 1, padding: '15px 20px', fontSize: '1.1rem', fontWeight: 700, 
        borderRadius: '8px', 
        background: isAdded ? '#94a3b8' : 'var(--color-secondary)', 
        color: '#fff', border: 'none', cursor: isAdded ? 'not-allowed' : 'pointer', transition: '0.2s'
      }}
    >
      <i className="fas fa-shopping-cart"></i> {isAdded ? 'Added to Quote' : 'Add to Quote'}
    </button>
  );
}
