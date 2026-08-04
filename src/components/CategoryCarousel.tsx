"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  image?: string;
  productImage?: string;
}

export default function CategoryCarousel({ subcategories, categorySlug, currentSubcatSlug }: { subcategories: Subcategory[], categorySlug: string, currentSubcatSlug?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const colors = ['bg-teal-600', 'bg-blue-500', 'bg-red-500', 'bg-amber-500', 'bg-violet-500', 'bg-emerald-500', 'bg-pink-500', 'bg-indigo-500', 'bg-rose-500', 'bg-teal-500'];

  const manageArrows = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollWidth > clientWidth && scrollLeft > 0);
    setShowRight(scrollWidth > clientWidth && Math.round(scrollLeft) < (scrollWidth - clientWidth - 1));
  };

  useEffect(() => {
    manageArrows();
    window.addEventListener('resize', manageArrows);
    return () => window.removeEventListener('resize', manageArrows);
  }, [subcategories]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .carousel-container {
          position: relative;
          display: flex;
          align-items: center;
          margin: 0 auto;
          max-width: 1400px;
          padding: 0 40px;
        }
        .category-block-container {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scrollbar-width: none;
          scroll-behavior: smooth;
          padding: 5px;
        }
        .category-block-container::-webkit-scrollbar { display: none; }
        
        .scroll-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          color: #64748b;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          z-index: 10;
          transition: all 0.2s;
        }
        .scroll-arrow:hover {
          background: #f8fafc;
          color: #2563eb;
          border-color: #bfdbfe;
          transform: translateY(-50%) scale(1.05);
        }
        .left-arrow { left: 5px; }
        .right-arrow { right: 5px; }
        
        .category-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          color: #475569;
          font-size: 0.875rem;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
          text-decoration: none;
        }
        .category-chip:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #2563eb;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .category-chip.active {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #2563eb;
        }
        .chip-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          overflow: hidden;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      `}} />
      <div className="carousel-container">
        {showLeft && (
          <button className="scroll-arrow left-arrow" onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}>
            <i className="fas fa-chevron-left"></i>
          </button>
        )}
        
        <div className="category-block-container" ref={scrollRef} onScroll={manageArrows}>
          {subcategories.map((subcat) => {
            const catImg = subcat.image ? `/backend-media/uploads/subcategories/${subcat.image}` : (subcat.productImage ? `/backend-media/${subcat.productImage}` : null);
            const isActive = currentSubcatSlug === subcat.slug;
            
            return (
              <Link key={subcat.id} href={`/category/${categorySlug}/${subcat.slug}`} className={`category-chip ${isActive ? 'active' : ''}`}>
                {catImg && (
                  <div className="chip-icon relative border border-slate-200">
                    <Image src={catImg} alt={subcat.name} fill sizes="24px" className="object-cover" />
                  </div>
                )}
                <span>{subcat.name}</span>
              </Link>
            );
          })}
        </div>

        {showRight && (
          <button className="scroll-arrow right-arrow" onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}>
            <i className="fas fa-chevron-right"></i>
          </button>
        )}
      </div>
    </>
  );
}
