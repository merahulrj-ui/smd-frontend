"use client";

import { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useUI } from '@/context/UIContext';
import InquireButton from '@/components/InquireButton';
import AddToCartButton from '@/components/AddToCartButton';

interface FeatureCard {
  title: string;
  description: string;
  icon: string;
}

function getIconForText(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('heart') || lower.includes('ecg') || lower.includes('cardiac') || lower.includes('arrhythmia') || lower.includes('pulse') || lower.includes('rate')) return 'fas fa-heartbeat text-rose-500';
  if (lower.includes('battery') || lower.includes('power') || lower.includes('recharge') || lower.includes('charge') || lower.includes('backup') || lower.includes('lithium')) return 'fas fa-battery-full text-emerald-500';
  if (lower.includes('screen') || lower.includes('display') || lower.includes('tft') || lower.includes('lcd') || lower.includes('touch') || lower.includes('monitor') || lower.includes('waveform') || lower.includes('colored')) return 'fas fa-desktop text-blue-500';
  if (lower.includes('oxygen') || lower.includes('o2') || lower.includes('respiratory') || lower.includes('ventil') || lower.includes('breath') || lower.includes('fio2') || lower.includes('lung') || lower.includes('apnea')) return 'fas fa-lungs text-sky-500';
  if (lower.includes('safety') || lower.includes('alarm') || lower.includes('protect') || lower.includes('secure') || lower.includes('iso') || lower.includes('ce') || lower.includes('accurate') || lower.includes('precision') || lower.includes('reading')) return 'fas fa-shield-alt text-indigo-500';
  if (lower.includes('fast') || lower.includes('quick') || lower.includes('speed') || lower.includes('instant') || lower.includes('real-time') || lower.includes('measure')) return 'fas fa-bolt text-amber-500';
  if (lower.includes('print') || lower.includes('record') || lower.includes('storage') || lower.includes('memory') || lower.includes('history') || lower.includes('data') || lower.includes('interpret') || lower.includes('diagnos')) return 'fas fa-file-waveform text-purple-500';
  if (lower.includes('portable') || lower.includes('compact') || lower.includes('lightweight') || lower.includes('transport') || lower.includes('hand-held') || lower.includes('mobile')) return 'fas fa-suitcase-medical text-teal-500';
  if (lower.includes('compressor') || lower.includes('motor') || lower.includes('pump') || lower.includes('noise')) return 'fas fa-fan text-cyan-500';
  if (lower.includes('mode') || lower.includes('channel') || lower.includes('lead') || lower.includes('select') || lower.includes('control') || lower.includes('blender') || lower.includes('servo')) return 'fas fa-sliders-h text-blue-600';
  if (lower.includes('nebuliz') || lower.includes('humidif') || lower.includes('filter') || lower.includes('trap')) return 'fas fa-wind text-teal-600';
  return 'fas fa-check-circle text-blue-600';
}

function cleanHtmlContent(rawHtml: string): string {
  if (!rawHtml) return '';
  return rawHtml
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>')
    .replace(/<\s*([a-zA-Z0-9]+)(\s+[^>]*)?>/g, '<$1$2>');
}

function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseClinicalDossier(descRaw: string, featRaw: string) {
  const isHtml = /<[a-z][\s\S]*>/i.test(descRaw || '');
  let rawHtml = '';
  let intro = '';
  let rawAccessories: string[] = [];
  let rawFeatureItems: string[] = [];

  if (isHtml) {
    rawHtml = cleanHtmlContent(descRaw);
    const textOnly = stripHtmlTags(rawHtml);
    if (/Standard Accessories:?/i.test(textOnly)) {
      const accParts = textOnly.split(/Standard Accessories:?/i);
      const rawAcc = accParts[1].trim();
      rawAccessories = rawAcc
        .split(/(?<=\w)\s+(?=[A-Z])|(?<=\w),\s*|(?<=\w);\s*/)
        .map(s => s.trim().replace(/\.$/, ''))
        .filter(s => s.length > 2);
    }
  } else {
    let desc = (descRaw || '')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\.([A-Z])/g, '. $1')
      .replace(/^Product Description:\s*/i, '');

    if (/Standard Accessories:?/i.test(desc)) {
      const accParts = desc.split(/Standard Accessories:?/i);
      desc = accParts[0].trim();
      const rawAcc = accParts[1].trim();
      rawAccessories = rawAcc
        .split(/(?<=\w)\s+(?=[A-Z])|(?<=\w),\s*|(?<=\w);\s*/)
        .map(s => s.trim().replace(/\.$/, ''))
        .filter(s => s.length > 2);
    }

    if (/Key Features:?/i.test(desc)) {
      const featParts = desc.split(/Key Features:?/i);
      intro = featParts[0].trim();
      const rawFeats = featParts[1].trim();
      const splitFeats = rawFeats
        .split(/(?<=\.)\s+(?=[A-Z0-9])|(?<=\w)\.\s*(?=[A-Z])|(?<=[a-z])\s+(?=[A-Z][a-z]+(?:\s+[a-z]+){1,5})/)
        .map(f => f.trim().replace(/\.$/, ''))
        .filter(f => f.length > 4);
      rawFeatureItems.push(...splitFeats);
    } else {
      intro = desc.trim();
    }
  }

  // Features parsing
  if (featRaw) {
    const cleanFeats = featRaw
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\.([A-Z])/g, '. $1');

    const featSentences = cleanFeats
      .split(/(?<=\.)\s+(?=[A-Z0-9])|(?<=\w)\.\s*(?=[A-Z])/)
      .map(s => s.trim().replace(/\.$/, ''))
      .filter(s => s.length > 5);

    rawFeatureItems.push(...featSentences);
  }

  // Feature cards
  const cards: FeatureCard[] = [];
  const seenTitles = new Set<string>();

  for (let item of rawFeatureItems) {
    let cleaned = stripHtmlTags(item)
      .replace(/^Yes,\s+(the\s+)?/i, '')
      .replace(/^[A-Za-z0-9\s-]+\s+(supports|features|includes|provides|is designed with|can record and store|features an?)\s+/i, '')
      .trim();

    let title = '';
    let descText = '';

    if (cleaned.includes(' - ')) {
      const parts = cleaned.split(' - ');
      title = parts[0].trim();
      descText = parts.slice(1).join(' - ').trim();
    } else if (cleaned.includes(': ') && cleaned.indexOf(': ') < 35) {
      const parts = cleaned.split(': ');
      title = parts[0].trim();
      descText = parts.slice(1).join(': ').trim();
    } else {
      const words = cleaned.split(/\s+/);
      if (words.length <= 4) {
        title = cleaned;
        descText = 'Engineered for clinical precision and reliable performance.';
      } else {
        title = words.slice(0, 4).join(' ');
        descText = cleaned;
      }
    }

    title = title.charAt(0).toUpperCase() + title.slice(1);
    title = title.replace(/[.:]+$/, '');

    const key = title.toLowerCase().substring(0, 15);
    if (!seenTitles.has(key) && title.length > 2 && !title.toLowerCase().startsWith('the ')) {
      seenTitles.add(key);
      cards.push({
        title,
        description: descText || 'Clinical grade hospital standard performance.',
        icon: getIconForText(title + ' ' + descText)
      });
    }
  }

  return { isHtml, rawHtml, intro, accessories: rawAccessories, cards };
}

export default function ProductClient({ 
  product, 
  relatedProducts,
  reviews = [],
  brandLogo,
  relatedBlogs = []
}: { 
  product: any;
  relatedProducts: any[];
  reviews?: any[];
  brandLogo: string | null;
  relatedBlogs?: any[];
}) {
  const { formatPrice } = useUI();
  
  // Image handling & Carousel state
  const mainImages: string[] = [];
  const addImage = (imgSrc: any) => {
    if (!imgSrc || typeof imgSrc !== 'string' || imgSrc.trim() === '') return;
    const clean = imgSrc.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      mainImages.push(clean);
    } else if (clean.startsWith('/')) {
      mainImages.push(clean);
    } else if (clean.startsWith('backend-media/')) {
      mainImages.push(`/${clean}`);
    } else {
      mainImages.push(`/backend-media/${clean}`);
    }
  };

  addImage(product.image);
  addImage(product.image2);
  addImage(product.image3);
  addImage(product.image4);
  addImage(product.image5);

  if (mainImages.length === 0) {
    mainImages.push('/backend-media/images/placeholder.png');
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = mainImages[activeImageIndex] || mainImages[0];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % mainImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + mainImages.length) % mainImages.length);
  };

  // Mobile Touch Swipe Support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  // Reviews state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, review_text: '' });
  const [reviewStatus, setReviewStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewStatus('submitting');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          ...reviewForm
        })
      });
      if (res.ok) {
        setReviewStatus('success');
        setReviewForm({ name: '', rating: 5, review_text: '' });
      } else {
        setReviewStatus('error');
      }
    } catch (err) {
      setReviewStatus('error');
    }
  };

  // Pricing & Discount
  const price = Number(product.price) || 0;
  const mrp = Number(product.mrp) || 0;
  const discount = (mrp > price && price > 0) ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const shareProduct = async () => {
    const shareData = {
      title: `${product.name} - SMD MEDICARE`,
      text: `Check out ${product.name} on SMD MEDICARE!`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Product link copied to clipboard!');
      }
    } catch (err) {}
  };

  const renderSpecs = () => {
    if (Array.isArray(product.specifications) && product.specifications.length > 0) {
      return product.specifications.map((spec: any, idx: number) => (
        <tr key={`spec-${idx}`} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
          <th className="py-3 px-3.5 sm:py-4 sm:px-6 font-bold text-slate-700 w-2/5 sm:w-1/4 bg-slate-50/60 rounded-l-lg text-xs sm:text-sm">{spec.name || spec.label}</th>
          <td className="py-3 px-3.5 sm:py-4 sm:px-6 text-slate-700 font-medium text-xs sm:text-sm">{spec.description || spec.value}</td>
        </tr>
      ));
    }
    if (typeof product.specification === 'string' && product.specification.trim() !== '') {
      return (
        <tr className="border-b border-slate-100">
          <td colSpan={2} className="py-3 px-3.5 sm:py-4 sm:px-6 text-slate-700 font-medium leading-relaxed text-xs sm:text-sm">
            <div dangerouslySetInnerHTML={{__html: product.specification.replace(/\n/g, '<br/>')}} />
          </td>
        </tr>
      );
    }
    return null;
  };

  const { isHtml, rawHtml, intro, accessories, cards } = parseClinicalDossier(product.description || '', product.features || '');

  return (
    <div className="bg-slate-50 min-h-screen pt-[70px] sm:pt-[76px] pb-24 lg:pb-16">
      
      {/* Unified Breadcrumbs Banner */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
        <div className="max-w-[1400px] mx-auto text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap custom-scrollbar pb-2 flex items-center">
          <Link href="/" className="hover:text-blue-600 transition-colors shrink-0">Home</Link>
          <span className="mx-2 text-slate-300">»</span>
          <Link href="/categories" className="hover:text-blue-600 transition-colors shrink-0">Categories</Link>
          <span className="mx-2 text-slate-300">»</span>
          <Link href={`/category/${(product.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="hover:text-blue-600 transition-colors shrink-0">{product.category}</Link>
          {product.sub_category_name && (
            <>
              <span className="mx-2 text-slate-300">»</span>
              <span className="text-slate-600 shrink-0 hover:text-blue-600 cursor-pointer transition-colors">{product.sub_category_name}</span>
            </>
          )}
          <span className="mx-2 text-slate-300">»</span>
          <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ZONE 1: UNIFIED TOP HERO FOLD (BALANCED SINGLE CANVAS)                    */}
      {/* ========================================================================= */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            
            {/* Left Column: Image Gallery with Clean Carousel + Thumbnails (5 Cols) */}
            <div className="lg:col-span-5 w-full flex flex-col items-center">
              <div 
                className="w-full relative rounded-2xl bg-slate-50/50 border border-slate-100 p-4 flex items-center justify-center min-h-[300px] sm:min-h-[360px] lg:min-h-[400px] select-none group"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Share Button */}
                <button 
                  onClick={shareProduct}
                  className="absolute top-3 right-3 w-8 h-8 sm:w-9 sm:h-9 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all z-20 shadow-sm text-xs cursor-pointer"
                  title="Share Product"
                >
                  <i className="fas fa-share-alt"></i>
                </button>

                {/* Previous Carousel Button (Appears smoothly on Hover) */}
                {mainImages.length > 1 && (
                  <button 
                    onClick={prevImage}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 border border-slate-200/90 shadow-lg text-slate-700 hover:text-blue-600 hover:scale-110 flex items-center justify-center transition-all duration-200 z-20 text-xs sm:text-sm cursor-pointer opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
                    aria-label="Previous Image"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                )}

                {/* Main Product Image */}
                <img 
                  src={activeImage} 
                  alt={`${product.name} - Image ${activeImageIndex + 1} | SMD MEDICARE`} 
                  className="max-w-full max-h-[280px] sm:max-h-[340px] lg:max-h-[380px] object-contain drop-shadow-sm transition-all duration-300"
                />

                {/* Next Carousel Button (Appears smoothly on Hover) */}
                {mainImages.length > 1 && (
                  <button 
                    onClick={nextImage}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 border border-slate-200/90 shadow-lg text-slate-700 hover:text-blue-600 hover:scale-110 flex items-center justify-center transition-all duration-200 z-20 text-xs sm:text-sm cursor-pointer opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
                    aria-label="Next Image"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                )}
              </div>
              
              {/* Synchronized Clickable Thumbnails */}
              {mainImages.length > 1 && (
                <div className="flex items-center justify-center gap-2 sm:gap-3 pt-3 sm:pt-4 w-full flex-wrap">
                  {mainImages.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl border-2 flex items-center justify-center p-1 transition-all bg-white cursor-pointer ${activeImageIndex === idx ? 'border-blue-600 shadow-md ring-2 ring-blue-100 scale-105' : 'border-slate-200 hover:border-blue-300 opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="max-w-full max-h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Official Brochure PDF link */}
              {product.catalogue_pdf && (
                <a 
                  href={product.catalogue_pdf.startsWith('http') ? product.catalogue_pdf : `/backend-media/${product.catalogue_pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-4 py-2 rounded-xl border border-slate-200 transition-all w-full text-center"
                >
                  <i className="fas fa-file-pdf text-red-500 text-sm"></i>
                  <span>Download Official Brochure (PDF)</span>
                </a>
              )}
            </div>

            {/* Right Column: Title, Pricing, Actions & Highlights (7 Cols) */}
            <div className="lg:col-span-7 w-full flex flex-col justify-between space-y-4 sm:space-y-5">
              
              {/* Badges Bar */}
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-2 sm:mb-2.5">
                  <div className="inline-flex px-2.5 sm:px-3 py-0.5 sm:py-1 bg-blue-50 text-blue-800 rounded-full font-bold text-[11px] sm:text-xs border border-blue-200/80 items-center gap-1">
                    <i className="fas fa-layer-group text-blue-600 text-[10px]"></i> {product.sub_category_name || product.category}
                  </div>
                  <div className="inline-flex px-2.5 sm:px-3 py-0.5 sm:py-1 bg-slate-100 text-slate-800 rounded-full font-bold text-[11px] sm:text-xs border border-slate-200 items-center gap-1 font-mono">
                    <span className="text-slate-500 font-sans font-semibold">SKU:</span> {product.sku || ('SMD-' + String(product.id).padStart(3, '0'))}
                  </div>
                  {product.brand && (
                    <div className="inline-flex px-2.5 sm:px-3 py-0.5 sm:py-1 bg-emerald-50 text-emerald-800 rounded-full font-bold text-[11px] sm:text-xs border border-emerald-200 items-center gap-1">
                      <i className="fas fa-shield-alt text-emerald-600 text-[10px]"></i> {product.brand}
                    </div>
                  )}
                  {brandLogo && (
                    <div className="ml-auto">
                      <img src={brandLogo} alt={product.brand || 'Brand'} className="h-5 sm:h-6 object-contain drop-shadow-sm" />
                    </div>
                  )}
                </div>

                {/* Product Title */}
                <h1 className="text-xl sm:text-2xl lg:text-[28px] font-extrabold text-slate-900 tracking-tight leading-snug sm:leading-tight mb-2 sm:mb-2.5">
                  {product.name}
                </h1>

                {/* Rating & Stock Status */}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm pb-3 border-b border-slate-100">
                  {reviews.length > 0 ? (
                    <div className="flex items-center text-amber-400 text-sm">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i key={star} className={`fas ${star <= Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) ? 'fa-star' : 'fa-star text-slate-300'}`}></i>
                      ))}
                      <span className="text-slate-800 font-bold ml-1.5 text-xs sm:text-sm">
                        {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                      </span>
                      <span className="text-slate-500 font-medium ml-1 text-xs">({reviews.length})</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-slate-600 text-xs font-semibold">
                      <span className="flex text-amber-400 text-xs">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </span>
                      <span className="text-slate-700 font-bold">Verified Clinical Standard</span>
                      <button onClick={() => setShowReviewModal(true)} className="text-blue-600 hover:underline ml-0.5 font-bold">
                        (Review)
                      </button>
                    </div>
                  )}
                  <span className="text-emerald-700 font-bold text-[11px] sm:text-xs bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <i className="fas fa-check-circle text-emerald-600 text-[10px]"></i> In Stock &bull; Pan-India Dispatch
                  </span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-100">
                {price > 0 ? (
                  <div>
                    <div className="flex items-baseline gap-2 sm:gap-3 mb-1 flex-wrap">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">{formatPrice(price)}</span>
                      {discount > 0 && (
                        <span className="text-sm sm:text-base text-slate-400 font-medium line-through">{formatPrice(mrp)}</span>
                      )}
                      {discount > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-bold text-[11px] sm:text-xs border border-red-200">
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-[11px] sm:text-xs font-medium">Institutional Wholesale Rate &bull; GST Input Tax Credit Applicable</p>
                  </div>
                ) : (
                  <div>
                    <span className="text-xl sm:text-2xl font-extrabold text-blue-600 tracking-tight">Price on Institutional Request</span>
                    <p className="text-slate-500 text-xs font-medium mt-1">Submit quotation request for hospital setup &amp; dealer pricing</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-4">
                  <AddToCartButton product={product} />
                  <div className="w-full">
                    <InquireButton 
                      productName={product.name} 
                      className="w-full py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold rounded-xl text-blue-700 bg-blue-50 border-2 border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm flex items-center justify-center gap-1.5"
                    />
                  </div>
                  <a
                    href={`https://wa.me/919555422455?text=Hello%20SMD%20Medicare,%20I%20want%20to%20get%20a%20wholesale%20quote%20for:%20${encodeURIComponent(product.name)}%20(SKU:%20${product.sku || product.id})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-3 sm:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap"
                  >
                    <i className="fab fa-whatsapp text-base sm:text-lg"></i>
                    <span>WhatsApp Quote</span>
                  </a>
                </div>
              </div>

              {/* Fast-Facts & Procurement Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-1">
                <div className="bg-slate-50/60 border border-slate-200/80 rounded-xl p-2.5 text-center">
                  <i className="fas fa-shield-alt text-base text-blue-600 mb-0.5 block"></i>
                  <p className="font-bold text-slate-800 text-[11px] sm:text-xs">{product.warranty || '1 Year Warranty'}</p>
                  <p className="text-[10px] text-slate-500">OEM Direct Cover</p>
                </div>
                <div className="bg-slate-50/60 border border-slate-200/80 rounded-xl p-2.5 text-center">
                  <i className="fas fa-truck-fast text-base text-emerald-600 mb-0.5 block"></i>
                  <p className="font-bold text-slate-800 text-[11px] sm:text-xs">24-48hr Dispatch</p>
                  <p className="text-[10px] text-slate-500">Insured Packaging</p>
                </div>
                <div className="bg-slate-50/60 border border-slate-200/80 rounded-xl p-2.5 text-center">
                  <i className="fas fa-file-invoice-dollar text-base text-indigo-600 mb-0.5 block"></i>
                  <p className="font-bold text-slate-800 text-[11px] sm:text-xs">GST Compliant</p>
                  <p className="text-[10px] text-slate-500">Full Tax Credit</p>
                </div>
                <a 
                  href="tel:+919555422455"
                  className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-2.5 text-center hover:bg-blue-100/60 transition-colors group block"
                >
                  <i className="fas fa-headset text-base text-blue-600 mb-0.5 block group-hover:scale-110 transition-transform"></i>
                  <p className="font-bold text-blue-900 text-[11px] sm:text-xs">095554 22455</p>
                  <p className="text-[10px] text-blue-600 font-medium">Sales Desk</p>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL-WIDTH B2B ASSURANCE STRIP (100% CONTAINER WIDTH)                     */}
      {/* ========================================================================= */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 mb-6 sm:mb-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-base sm:text-lg shrink-0">
              <i className="fas fa-certificate"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Medical Grade Standards</h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">ISO &amp; CE compliant certified clinical calibration</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base sm:text-lg shrink-0">
              <i className="fas fa-truck-fast"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Pan-India Insured Transit</h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">Damage-proof wooden crating with freight tracking</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-base sm:text-lg shrink-0">
              <i className="fas fa-wrench"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Biomedical Setup Support</h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">Pre-purchase consultation &amp; operational guidance</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base sm:text-lg shrink-0">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Direct Factory Warranty</h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">Strict B2B Policy with OEM technical claim support</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ZONE 2: CLINICAL OVERVIEW & VISUAL CAPABILITIES (100% CONTAINER WIDTH)    */}
      {/* ========================================================================= */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 mb-8 sm:mb-10 space-y-6 sm:space-y-8">
        
        {/* 1. Overview & Included Accessories */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 sm:gap-3 pb-3.5 sm:pb-4 mb-4 sm:mb-6 border-b border-slate-100">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base sm:text-lg shrink-0">
              <i className="fas fa-info-circle"></i>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Product Overview &amp; Clinical Scope</h2>
              <p className="text-[11px] sm:text-xs text-slate-500">Clinical workflow integration, diagnostic efficacy, and device utility</p>
            </div>
          </div>

          {isHtml && rawHtml ? (
            <div 
              className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base mb-4 sm:mb-6 font-normal leading-relaxed"
              dangerouslySetInnerHTML={{ __html: rawHtml }}
            />
          ) : intro ? (
            <p className="leading-relaxed text-slate-700 text-sm sm:text-base mb-4 sm:mb-6 font-normal">{intro}</p>
          ) : (
            <p className="text-slate-500 italic text-sm mb-4 sm:mb-6">Certified medical grade equipment for hospital and clinical deployments.</p>
          )}

          {/* Included Standard Accessories Grid */}
          {accessories.length > 0 && (
            <div className="pt-4 sm:pt-5 border-t border-slate-100">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2.5 sm:mb-3.5 flex items-center gap-1.5 sm:gap-2">
                <i className="fas fa-boxes text-teal-600"></i> Included Standard Accessories &amp; Components
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {accessories.map((acc, i) => (
                  <div key={i} className="flex items-center gap-2 bg-teal-50/60 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-teal-100/80 text-[11px] sm:text-xs font-semibold text-teal-900">
                    <i className="fas fa-cube text-teal-600 text-[10px] sm:text-xs shrink-0"></i>
                    <span>{acc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Visual Capability Cards Grid */}
        {cards.length > 0 && (
          <div>
            <div className="mb-3.5 sm:mb-5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Key Clinical Capabilities &amp; Features</h2>
              <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5">Core technical and clinical performance highlights</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {cards.map((card, i) => (
                <div key={i} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-start gap-3.5 sm:flex-col sm:gap-0 justify-between">
                  <div className="w-10 h-10 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-base sm:text-lg shrink-0 sm:mb-3.5">
                    <i className={card.icon}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1 sm:mb-2">{card.title}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Full Technical Specifications Table (100% Full Width) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 sm:gap-3 pb-3.5 sm:pb-4 mb-4 sm:mb-6 border-b border-slate-100">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base sm:text-lg shrink-0">
              <i className="fas fa-sliders-h"></i>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Technical Specifications</h2>
              <p className="text-[11px] sm:text-xs text-slate-500">Official OEM technical parameters and procurement specifications</p>
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-left border-collapse text-xs sm:text-sm md:text-base">
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <th className="py-3 px-3.5 sm:py-4 sm:px-6 font-bold text-slate-700 w-2/5 sm:w-1/4 bg-slate-50/60 rounded-l-lg text-xs sm:text-sm">Product SKU / Code</th>
                  <td className="py-3 px-3.5 sm:py-4 sm:px-6 text-slate-900 font-bold font-mono text-xs sm:text-sm">{product.sku || ('SMD-' + String(product.id).padStart(3, '0'))}</td>
                </tr>
                {product.brand && (
                  <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <th className="py-3 px-3.5 sm:py-4 sm:px-6 font-bold text-slate-700 w-2/5 sm:w-1/4 bg-slate-50/60 rounded-l-lg text-xs sm:text-sm">Brand / Manufacturer</th>
                    <td className="py-3 px-3.5 sm:py-4 sm:px-6 text-slate-800 font-semibold text-xs sm:text-sm">
                      {brandLogo ? (
                        <img src={brandLogo} alt={product.brand} className="max-h-5 sm:max-h-7 object-contain inline-block mr-2" />
                      ) : (
                        product.brand
                      )}
                    </td>
                  </tr>
                )}
                <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <th className="py-3 px-3.5 sm:py-4 sm:px-6 font-bold text-slate-700 w-2/5 sm:w-1/4 bg-slate-50/60 rounded-l-lg text-xs sm:text-sm">Medical Category</th>
                  <td className="py-3 px-3.5 sm:py-4 sm:px-6 text-slate-800 font-medium text-xs sm:text-sm">{product.category} {product.sub_category_name ? `(${product.sub_category_name})` : ''}</td>
                </tr>
                {product.packaging && (
                  <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <th className="py-3 px-3.5 sm:py-4 sm:px-6 font-bold text-slate-700 w-2/5 sm:w-1/4 bg-slate-50/60 rounded-l-lg text-xs sm:text-sm">Packaging</th>
                    <td className="py-3 px-3.5 sm:py-4 sm:px-6 text-slate-700 font-medium text-xs sm:text-sm">{product.packaging}</td>
                  </tr>
                )}
                {product.shelf_life && (
                  <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <th className="py-3 px-3.5 sm:py-4 sm:px-6 font-bold text-slate-700 w-2/5 sm:w-1/4 bg-slate-50/60 rounded-l-lg text-xs sm:text-sm">Shelf Life</th>
                    <td className="py-3 px-3.5 sm:py-4 sm:px-6 text-slate-700 font-medium text-xs sm:text-sm">{product.shelf_life}</td>
                  </tr>
                )}
                {product.warranty && (
                  <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <th className="py-3 px-3.5 sm:py-4 sm:px-6 font-bold text-slate-700 w-2/5 sm:w-1/4 bg-slate-50/60 rounded-l-lg text-xs sm:text-sm">Warranty</th>
                    <td className="py-3 px-3.5 sm:py-4 sm:px-6 text-slate-800 font-semibold text-xs sm:text-sm">{product.warranty}</td>
                  </tr>
                )}
                {renderSpecs()}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Clinical Usage & Protocols */}
        {product.usage && (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2.5 sm:gap-3 pb-3.5 sm:pb-4 mb-4 sm:mb-6 border-b border-slate-100">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-base sm:text-lg shrink-0">
                <i className="fas fa-stethoscope"></i>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Clinical Usage &amp; Operational Protocols</h2>
                <p className="text-[11px] sm:text-xs text-slate-500">Standard operating guidance for biomedical technicians and clinical staff</p>
              </div>
            </div>
            <div 
              className="prose prose-slate max-w-none text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.usage.replace(/\n/g, '<br/>') }} 
            />
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* ZONE 3: CUSTOMER REVIEWS & RATINGS (FULL WIDTH)                           */}
      {/* ========================================================================= */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 mb-10 sm:mb-16">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mb-1.5 sm:mb-2 tracking-tight">Verified Doctor &amp; Client Reviews</h2>
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-3xl sm:text-4xl font-black text-slate-800">
                  {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '5.0'}
                </span>
                <div>
                  <div className="text-amber-400 flex text-base sm:text-lg gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i key={star} className={`fas ${star <= (reviews.length > 0 ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 5) ? 'fa-star' : 'fa-star text-slate-300'}`}></i>
                    ))}
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Based on {reviews.length} customer feedback submissions</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowReviewModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95 text-xs sm:text-sm self-start md:self-auto"
            >
              <i className="fas fa-pen mr-1.5 sm:mr-2"></i> Write a Review
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-8 sm:py-10 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 text-slate-400 border border-slate-200">
                <i className="fas fa-comment-medical text-xl sm:text-2xl text-blue-500"></i>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1">No reviews published yet</h3>
              <p className="text-[11px] sm:text-xs text-slate-500 max-w-md mx-auto mb-3 sm:mb-4 px-2">Are you a healthcare professional or hospital staff using this device? Share your clinical experience.</p>
              <button 
                onClick={() => setShowReviewModal(true)}
                className="text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-colors"
              >
                Be the First to Review
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-3 sm:gap-5">
              {reviews.map((review, idx) => (
                <div key={idx} className="bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{review.name}</h4>
                      <div className="text-amber-400 flex gap-0.5 text-[11px] sm:text-xs mt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i key={star} className={`fas ${star <= review.rating ? 'fa-star' : 'fa-star text-slate-200'}`}></i>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-100">
                      {new Date(review.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] sm:text-xs italic">&ldquo;{review.review_text}&rdquo;</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ZONE 4: FAQS (2x2 BALANCED GRID) & FULL-WIDTH B2B PROJECT BANNER          */}
      {/* ========================================================================= */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 mb-10 sm:mb-16 space-y-6 sm:space-y-8">
        
        {/* FAQs Section */}
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">Frequently Asked Procurement Questions</h2>
              <p className="text-[11px] sm:text-xs text-slate-500">Key questions regarding warranty, logistics, GST billing, and clinical installation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-xs sm:text-sm">
                  <i className="fas fa-shield-alt"></i>
                </div>
                What warranty and support is provided with this equipment?
              </h4>
              <p className="text-slate-600 mt-2 text-[11px] sm:text-xs pl-9 sm:pl-11 leading-relaxed">
                All medical equipment carries official 1 to 2 Years OEM Manufacturer Warranty covering manufacturing defects and factory biomedical engineering evaluation.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-xs sm:text-sm">
                  <i className="fas fa-truck-fast"></i>
                </div>
                How is heavy hospital equipment packed and shipped?
              </h4>
              <p className="text-slate-600 mt-2 text-[11px] sm:text-xs pl-9 sm:pl-11 leading-relaxed">
                We use damage-proof wooden crate packaging and insured freight logistics delivering across all Indian states with real-time tracking within 3 to 7 business days.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 text-xs sm:text-sm">
                  <i className="fas fa-file-invoice-dollar"></i>
                </div>
                Do you provide official GST Invoices and Proforma Quotations?
              </h4>
              <p className="text-slate-600 mt-2 text-[11px] sm:text-xs pl-9 sm:pl-11 leading-relaxed">
                Yes, 100% compliant GST invoices with standard HSN codes are provided for hospitals, clinics, and dealers to claim full Input Tax Credit (ITC).
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 text-xs sm:text-sm">
                  <i className="fas fa-wrench"></i>
                </div>
                How is installation and clinical setup handled?
              </h4>
              <p className="text-slate-600 mt-2 text-[11px] sm:text-xs pl-9 sm:pl-11 leading-relaxed">
                We provide pre-installation technical checklists, complete user operating manuals, and video/on-site biomedical engineer guidance for seamless clinical deployment.
              </p>
            </div>
          </div>
        </div>

        {/* Full-Width Institutional & Tender Project Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl text-white relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-8 relative z-10">
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl sm:text-2xl shrink-0 border border-blue-400/20">
                <i className="fas fa-hospital-user"></i>
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 border border-blue-400/30">
                  Institutional Solutions
                </span>
                <h3 className="text-lg sm:text-2xl font-bold leading-tight">Complete ICU, OT, or Hospital Setup Project?</h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                  Get institutional project quotations, volume tender pricing, and priority dispatch from SMD Medicare.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0 flex-wrap sm:flex-nowrap">
              <a 
                href="tel:+919555422455" 
                className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-white px-4 sm:px-5 py-3 rounded-xl font-bold transition-all text-xs sm:text-sm border border-slate-700 whitespace-nowrap shadow-sm"
              >
                <i className="fas fa-phone-alt text-blue-400"></i>
                <span>095554 22455</span>
              </a>
              <Link 
                href="/contact" 
                className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 sm:px-6 py-3 rounded-xl font-bold transition-all text-xs sm:text-sm shadow-md hover:shadow-blue-500/20 whitespace-nowrap"
              >
                <span>Request Project Quote</span>
                <i className="fas fa-arrow-right text-xs"></i>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ZONE 5: RELATED PRODUCTS GRID (FULL WIDTH)                                */}
      {/* ========================================================================= */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="border-t border-slate-200 pt-8 sm:pt-12">
            <div className="mb-5 sm:mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Related Medical Equipment</h2>
                <p className="text-slate-500 text-[11px] sm:text-xs">Explore more certified devices from the {product.category} range</p>
              </div>
              <Link 
                href={`/category/${(product.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1"
              >
                <span>View Full Category</span>
                <i className="fas fa-chevron-right text-[10px]"></i>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {relatedProducts.slice(0, 5).map((p) => (
                <ProductCard 
                  key={p.id}
                  id={p.id}
                  slug={p.slug || p.id}
                  name={p.name}
                  image={p.image ? `/backend-media/${p.image}` : '/backend-media/images/placeholder.png'}
                  price={p.price}
                  mrp={p.mrp}
                  isNew={false}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ZONE 6: CLINICAL KNOWLEDGE BASE & BUYING GUIDES (INTERNAL CONTENT SEO)    */}
      {/* ========================================================================= */}
      {relatedBlogs && relatedBlogs.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 mb-8 sm:mb-10">
          <div className="bg-slate-50/80 rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600">Clinical Insights &amp; Research</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">Clinical Buying Guides &amp; Technical Articles</h2>
                <p className="text-[11px] sm:text-xs text-slate-500">Expert procurement checklists, operational protocols, and comparison guides for healthcare buyers</p>
              </div>
              <Link 
                href="/blog"
                className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1.5 shrink-0 self-start sm:self-auto group"
              >
                <span>Explore All Medical Articles</span>
                <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedBlogs.map((b: any) => {
                const blogImg = b.blog_image || b.image || 'images/blog_hospital_furniture_guide.jpg';
                const imgSrc = blogImg.startsWith('http') 
                  ? blogImg 
                  : (blogImg.startsWith('/') ? blogImg : `/backend-media/${blogImg}`);
                const dateStr = b.created_at ? new Date(b.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '2026';

                return (
                  <Link 
                    key={b.id} 
                    href={`/blog/${b.slug || b.id}`}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
                        <img 
                          src={imgSrc} 
                          alt={b.title} 
                          loading="eager"
                          decoding="sync"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e: any) => {
                            e.target.src = '/backend-media/images/blog_hospital_furniture_guide.jpg';
                          }}
                        />
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-blue-700 shadow-sm">
                          {b.category || 'Clinical Guide'}
                        </div>
                      </div>
                      
                      <div className="p-4 sm:p-5 pb-0">
                        <div className="flex items-center text-[10px] sm:text-[11px] text-slate-400 font-medium mb-2">
                          <span><i className="far fa-calendar-alt mr-1.5 text-blue-600"></i> Published: {dateStr}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 min-h-[2.75rem] group-hover:text-blue-600 transition-colors leading-snug">
                          {b.title}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-5 pt-3">
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                        <span>Read Clinical Protocol</span>
                        <i className="fas fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STICKY BOTTOM MOBILE ACTION BAR (HIGH-CONVERSION MOBILE COMMERCE UX)       */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 shadow-2xl flex items-center justify-between gap-2">
        <div className="flex flex-col">
          {price > 0 ? (
            <>
              <span className="text-base font-black text-slate-900 tracking-tight leading-none">{formatPrice(price)}</span>
              <span className="text-[10px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
                <i className="fas fa-check-circle text-[8px]"></i> In Stock
              </span>
            </>
          ) : (
            <span className="text-xs font-black text-blue-600 tracking-tight">On Request</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <a
            href={`https://wa.me/919555422455?text=Hello%20SMD%20Medicare,%20I%20want%20to%20get%20a%20wholesale%20quote%20for:%20${encodeURIComponent(product.name)}%20(SKU:%20${product.sku || product.id})`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center text-lg shadow-sm shrink-0"
            title="Chat on WhatsApp"
          >
            <i className="fab fa-whatsapp"></i>
          </a>
          
          <div className="flex-1 max-w-[170px]">
            <InquireButton 
              productName={product.name} 
              className="w-full py-2.5 px-3 text-xs font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm flex items-center justify-center gap-1.5"
            />
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">Write a Clinical Review</h3>
            <p className="text-slate-500 text-xs mb-4 sm:mb-5">Share your experience with this medical equipment for verified healthcare buyers.</p>
            
            {reviewStatus === 'success' ? (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
                <i className="fas fa-check-circle text-xl"></i>
                <span className="font-medium text-sm">Thank you! Your review has been submitted for verification.</span>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3.5 sm:space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Doctor / Healthcare Organization Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-xs sm:text-sm"
                    placeholder="e.g. Dr. Rajesh Sharma / LifeCare Hospital"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Rating *</label>
                  <div className="flex gap-2 text-xl sm:text-2xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className={`transition-colors ${star <= reviewForm.rating ? 'text-amber-400' : 'text-slate-200 hover:text-amber-200'}`}
                      >
                        <i className="fas fa-star"></i>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Review &amp; Operational Feedback *</label>
                  <textarea 
                    required 
                    rows={4}
                    value={reviewForm.review_text}
                    onChange={(e) => setReviewForm({...reviewForm, review_text: e.target.value})}
                    className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none text-xs sm:text-sm"
                    placeholder="Share clinical accuracy, build quality, ease of use..."
                  ></textarea>
                </div>
                {reviewStatus === 'error' && (
                  <p className="text-red-500 text-xs font-medium">Failed to submit review. Please try again.</p>
                )}
                <button 
                  type="submit" 
                  disabled={reviewStatus === 'submitting'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 sm:py-3 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-xs sm:text-sm"
                >
                  {reviewStatus === 'submitting' ? 'Submitting Review...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
