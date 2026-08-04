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
          max-width: 1000px;
          padding: 0 40px;
        }
        .category-block-container {
          display: flex;
          gap: 15px;
          overflow-x: auto;
          scrollbar-width: none;
          scroll-behavior: smooth;
          padding: 10px 5px;
        }
        .category-block-container::-webkit-scrollbar { display: none; }
        
        .scroll-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 35px;
          height: 35px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 20px;
          color: #475569;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          z-index: 10;
          transition: all 0.2s;
        }
        .scroll-arrow:hover {
          background: #f8fafc;
          color: var(--color-primary);
          border-color: var(--color-primary);
        }
        .left-arrow { left: 0; }
        .right-arrow { right: 0; }
        
        .category-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 85px;
          text-decoration: none;
          padding: 10px;
          border-radius: 12px;
          transition: 0.2s;
          border: 1px solid transparent;
        }
        .category-block:hover {
          background: #f8fafc;
        }
        .category-icon {
          width: 55px;
          height: 55px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          color: white;
          font-weight: bold;
          font-size: 1.2rem;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .category-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .category-name {
          font-size: 0.75rem;
          color: #475569;
          text-align: center;
          font-weight: 500;
          line-height: 1.2;
          white-space: normal;
        }
      `}} />
      <div className="carousel-container">
        {showLeft && (
          <button className="scroll-arrow left-arrow" onClick={() => scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}>
            &lsaquo;
          </button>
        )}
        
        <div className="category-block-container" ref={scrollRef} onScroll={manageArrows}>
          {subcategories.map((subcat, i) => {
            const catImg = subcat.image ? `/backend-media/uploads/subcategories/${subcat.image}` : (subcat.productImage ? `/backend-media/${subcat.productImage}` : null);
            const words = subcat.name.split(' ');
            const initials = words.length >= 2 ? (words[0][0] + words[1][0]).toUpperCase() : subcat.name.substring(0, 2).toUpperCase();
            const bgColor = colors[i % colors.length];
            const isActive = currentSubcatSlug === subcat.slug;
            
            return (
              <Link key={subcat.id} href={`/category/${categorySlug}/${subcat.slug}`} className={`category-block ${isActive ? 'border-primary bg-teal-50/50' : ''}`}>
                <div className={`category-icon relative overflow-hidden ${catImg ? 'bg-transparent border border-slate-200' : `${bgColor} text-white border-none`}`}>
                  {catImg ? <Image src={catImg} alt={subcat.name} fill sizes="60px" className="object-contain" /> : <span>{initials}</span>}
                </div>
                <div className={`category-name ${isActive ? 'text-primary font-bold' : ''}`}>
                  {subcat.name}
                </div>
              </Link>
            );
          })}
        </div>

        {showRight && (
          <button className="scroll-arrow right-arrow" onClick={() => scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}>
            &rsaquo;
          </button>
        )}
      </div>
    </>
  );
}
