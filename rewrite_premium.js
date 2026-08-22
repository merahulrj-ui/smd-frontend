const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'wamp64', 'www', 'smd-frontend', 'src', 'app', '(shop)', 'product', '[slug]', 'ProductClient.tsx');

const content = `"use client";

import { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useUI } from '@/context/UIContext';
import InquireButton from '@/components/InquireButton';
import AddToCartButton from '@/components/AddToCartButton';
import Image from 'next/image';

export default function ProductClient({ 
  product, 
  relatedProducts,
  reviews = [],
  brandLogo
}: { 
  product: any;
  relatedProducts: any[];
  reviews?: any[];
  brandLogo: string | null;
}) {
  const { addToCatalog, formatPrice } = useUI();
  
  // Image handling
  const mainImages = [];
  if (product.image) mainImages.push(product.image.startsWith('http') || product.image.startsWith('/') ? product.image : \`/backend-media/\${product.image}\`);
  if (product.image2) mainImages.push(product.image2.startsWith('http') || product.image2.startsWith('/') ? product.image2 : \`/backend-media/\${product.image2}\`);
  if (product.image3) mainImages.push(product.image3.startsWith('http') || product.image3.startsWith('/') ? product.image3 : \`/backend-media/\${product.image3}\`);
  
  const [activeImage, setActiveImage] = useState(mainImages[0] || '/backend-media/images/placeholder.png');
  
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

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'specs'>('overview');

  const shareProduct = async () => {
    const shareData = {
      title: \`\${product.name} - SMD MEDICARE\`,
      text: \`Check out \${product.name} on SMD MEDICARE!\`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {}
  };

  const renderSpecs = () => {
    if (Array.isArray(product.specifications) && product.specifications.length > 0) {
      return product.specifications.map((spec: any, idx: number) => (
        <div key={\`spec-\${idx}\`} className="flex flex-col sm:flex-row py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors rounded-lg px-2">
          <div className="w-full sm:w-1/3 font-semibold text-slate-900 mb-1 sm:mb-0">{spec.name || spec.label}</div>
          <div className="w-full sm:w-2/3 text-slate-600">{spec.description || spec.value}</div>
        </div>
      ));
    }
    if (typeof product.specification === 'string' && product.specification.trim() !== '') {
      return (
        <div className="py-4 text-slate-600 leading-relaxed">
          <div dangerouslySetInnerHTML={{__html: product.specification.replace(/\\n/g, '<br/>')}} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white min-h-screen pt-[76px] pb-20 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Breadcrumbs - Ultra Minimal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center text-[13px] font-medium text-slate-500 whitespace-nowrap overflow-x-auto custom-scrollbar">
          <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
            <i className="fas fa-home text-[11px]"></i> Home
          </Link>
          <span className="mx-2.5 text-slate-300">/</span>
          <Link href="/categories" className="hover:text-slate-900 transition-colors">Categories</Link>
          <span className="mx-2.5 text-slate-300">/</span>
          <Link href={\`/category/\${(product.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}\`} className="hover:text-slate-900 transition-colors">
            {product.category}
          </Link>
          {product.sub_category_name && (
            <>
              <span className="mx-2.5 text-slate-300">/</span>
              <span className="text-slate-800">{product.sub_category_name}</span>
            </>
          )}
          <span className="mx-2.5 text-slate-300">/</span>
          <span className="text-slate-400 truncate max-w-[200px] sm:max-w-[300px]">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Column: Sticky Image Gallery */}
          <div className="w-full lg:w-[50%] xl:w-[55%] shrink-0">
            <div className="lg:sticky lg:top-[100px]">
              {/* Main Image Stage */}
              <div className="bg-[#f8fafc] rounded-[2rem] p-8 relative flex items-center justify-center group">
                <button 
                  onClick={shareProduct}
                  className="absolute top-6 right-6 w-11 h-11 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:scale-105 transition-all z-10 shadow-sm border border-white"
                  title="Share Product"
                >
                  <i className="fas fa-share-alt"></i>
                </button>
                
                <div className="aspect-[4/3] w-full relative flex items-center justify-center">
                  <img 
                    src={activeImage} 
                    alt={\`\${product.name} - SMD MEDICARE\`} 
                    className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {mainImages.length > 1 && (
                <div className="flex justify-center gap-4 mt-6">
                  {mainImages.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={\`w-20 h-20 rounded-2xl flex items-center justify-center p-2 transition-all bg-[#f8fafc] overflow-hidden \${activeImage === img ? 'ring-2 ring-slate-900 ring-offset-2' : 'hover:bg-slate-100 opacity-60 hover:opacity-100'}\`}
                    >
                      <img src={img} alt={\`Thumbnail \${idx + 1}\`} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Premium Details */}
          <div className="flex-1 w-full pt-2 lg:pt-6">
            
            {/* Badges & Title */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-bold text-[11px] uppercase tracking-widest">
                  {product.sub_category_name || product.category}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[11px] uppercase tracking-widest">
                  <i className="fas fa-certificate"></i> Premium Quality
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-slate-900 tracking-tight leading-[1.1] mb-5">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4">
                {reviews.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-slate-900 text-lg">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i key={star} className={\`fas \${star <= Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) ? 'fa-star' : 'fa-star text-slate-200'}\`}></i>
                      ))}
                    </div>
                    <span className="font-bold text-slate-900">
                      {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                    </span>
                    <span className="text-slate-500 font-medium">({reviews.length} reviews)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex text-slate-200 text-lg">
                      <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                    </div>
                    <span className="text-slate-400 font-medium">No reviews yet</span>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-slate-100 mb-8" />

            {/* Pricing Section - Minimalist */}
            <div className="mb-10">
              {price > 0 ? (
                <div>
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter">
                      {formatPrice(price)}
                    </span>
                    {discount > 0 && (
                      <span className="text-xl text-slate-400 font-bold line-through">
                        {formatPrice(mrp)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {discount > 0 && (
                      <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded-md font-extrabold text-[11px] uppercase tracking-wider">
                        Save {discount}%
                      </span>
                    )}
                    <span className="text-slate-500 text-sm font-medium">Inclusive of all taxes</span>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">Price on Request</span>
                  <p className="text-slate-500 mt-2 font-medium">Contact our sales team for the best quotation.</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex-1">
                <InquireButton 
                  productName={product.name} 
                  className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
                />
              </div>
              <div className="flex-1">
                <AddToCartButton product={product} />
              </div>
            </div>

            {/* Premium Trust Elements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-700 shrink-0">
                  <i className="fas fa-truck-fast"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Fast Delivery</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Nationwide shipping</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-700 shrink-0">
                  <i className="fas fa-shield-check"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">100% Genuine</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Authentic equipment</p>
                </div>
              </div>
            </div>

            {/* Need Help / Catalogue */}
            <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <i className="fas fa-headset text-lg"></i>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-0.5">Sales Support</p>
                  <a href="tel:+919555422455" className="text-slate-900 font-bold hover:text-blue-600 transition-colors">
                    +91 95554 22455
                  </a>
                </div>
              </div>
              
              {product.catalogue_pdf && (
                <div className="pl-6 border-l border-slate-100">
                  <a 
                    href={product.catalogue_pdf.startsWith('http') ? product.catalogue_pdf : \`/backend-media/\${product.catalogue_pdf}\`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center group"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-1 group-hover:bg-red-500 group-hover:text-white transition-colors">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-900">Brochure</span>
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Content Section (Tabs) - Apple Style Segmented Control */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-slate-100 p-1.5 rounded-full">
              <button 
                onClick={() => setActiveTab('overview')}
                className={\`px-6 sm:px-10 py-3 rounded-full font-bold text-sm transition-all \${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
              >
                Overview
              </button>
              {(product.features || product.usage) && (
                <button 
                  onClick={() => setActiveTab('features')}
                  className={\`px-6 sm:px-10 py-3 rounded-full font-bold text-sm transition-all \${activeTab === 'features' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                >
                  Features & Usage
                </button>
              )}
              <button 
                onClick={() => setActiveTab('specs')}
                className={\`px-6 sm:px-10 py-3 rounded-full font-bold text-sm transition-all \${activeTab === 'specs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
              >
                Specifications
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
            {activeTab === 'overview' && (
              <div className="prose prose-slate prose-lg max-w-none">
                <style dangerouslySetInnerHTML={{__html: \`
                  .prose p { color: #475569; line-height: 1.8; margin-bottom: 1.5em; }
                  .prose strong { color: #0f172a; font-weight: 700; }
                  .prose ul { color: #475569; }
                  .prose li::marker { color: #94a3b8; }
                \`}} />
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\\n/g, '<br/>') }} />
                ) : (
                  <p className="italic text-center text-slate-400">No detailed description available.</p>
                )}
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-12">
                {product.features && (
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <i className="fas fa-star"></i>
                      </div>
                      Key Features
                    </h3>
                    <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.features.replace(/\\n/g, '<br/>') }} />
                  </div>
                )}
                {product.usage && (
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <i className="fas fa-hands-helping"></i>
                      </div>
                      Usage Guidelines
                    </h3>
                    <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.usage.replace(/\\n/g, '<br/>') }} />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row py-4 border-b border-slate-100 rounded-lg px-2 hover:bg-slate-50/50 transition-colors">
                  <div className="w-full sm:w-1/3 font-semibold text-slate-900 mb-1 sm:mb-0">SKU / Reference</div>
                  <div className="w-full sm:w-2/3 text-slate-600">{(product.slug || '').split('-').slice(-2).join('-').toUpperCase()}</div>
                </div>
                {product.brand && (
                  <div className="flex flex-col sm:flex-row py-4 border-b border-slate-100 rounded-lg px-2 hover:bg-slate-50/50 transition-colors">
                    <div className="w-full sm:w-1/3 font-semibold text-slate-900 mb-1 sm:mb-0 items-center flex">Brand</div>
                    <div className="w-full sm:w-2/3 text-slate-600">
                      {brandLogo ? (
                        <img src={brandLogo} alt={product.brand} className="max-h-8 object-contain" />
                      ) : (
                        product.brand
                      )}
                    </div>
                  </div>
                )}
                {product.packaging && (
                  <div className="flex flex-col sm:flex-row py-4 border-b border-slate-100 rounded-lg px-2 hover:bg-slate-50/50 transition-colors">
                    <div className="w-full sm:w-1/3 font-semibold text-slate-900 mb-1 sm:mb-0">Packaging</div>
                    <div className="w-full sm:w-2/3 text-slate-600">{product.packaging}</div>
                  </div>
                )}
                {renderSpecs()}
              </div>
            )}
          </div>
        </div>

        {/* Review & FAQ Grid */}
        <div className="mt-24 mb-16 grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          
          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Reviews</h2>
              <button 
                onClick={() => setShowReviewModal(true)}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
              >
                Write a Review <i className="fas fa-arrow-right"></i>
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-[#f8fafc] rounded-3xl p-8 text-center border border-slate-100">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                  <i className="fas fa-comment-alt text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No reviews yet</h3>
                <p className="text-slate-500 text-sm">Be the first to review {product.name}.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.slice(0,3).map((review, idx) => (
                  <div key={idx} className="bg-[#f8fafc] p-6 rounded-3xl border border-slate-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-slate-900">{review.name}</h4>
                        <div className="text-slate-900 flex gap-0.5 text-xs mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i key={star} className={\`fas \${star <= review.rating ? 'fa-star' : 'fa-star text-slate-200'}\`}></i>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-400">
                        {new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">"{review.review_text}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FAQs */}
          <div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">FAQ</h2>
             <div className="space-y-4">
               <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                 <h4 className="font-bold text-slate-900">What is the warranty period?</h4>
                 <p className="text-slate-500 mt-2 text-sm leading-relaxed">The warranty period is based on the manufacturing company's policy for this specific product.</p>
               </div>
               <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                 <h4 className="font-bold text-slate-900">How fast is the delivery?</h4>
                 <p className="text-slate-500 mt-2 text-sm leading-relaxed">We process and dispatch the delivery within 24 hours of successful payment confirmation.</p>
               </div>
               <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                 <h4 className="font-bold text-slate-900">Do you provide installation support?</h4>
                 <p className="text-slate-500 mt-2 text-sm leading-relaxed">Yes, we provide full support and guidance for the installation of the equipment via call or video.</p>
               </div>
             </div>
          </div>

        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-20 max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Similar Products</h2>
              </div>
              <Link href={\`/category/\${(product.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}\`} className="hidden md:inline-flex items-center justify-center px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-full transition-colors text-sm">
                View All
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {relatedProducts.slice(0, 5).map((p) => (
                <ProductCard 
                  key={p.id}
                  id={p.id}
                  slug={p.slug || p.id}
                  name={p.name}
                  image={p.image ? (p.image.startsWith('http') || p.image.startsWith('/') ? p.image : \`/backend-media/\${p.image}\`) : '/backend-media/images/placeholder.png'}
                  price={p.price}
                  mrp={p.mrp}
                  isNew={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Modal - Simplified Premium Design */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl relative">
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            <h2 className="text-2xl font-black text-slate-900 mb-6">Write a Review</h2>
            
            {reviewStatus === 'success' ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-check text-2xl"></i>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Thank you!</h3>
                <p className="text-slate-500 text-sm">Your review has been successfully submitted for approval.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-5">
                <div>
                  <input 
                    type="text" 
                    required 
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all outline-none font-medium bg-slate-50 focus:bg-white"
                    placeholder="Your Name"
                  />
                </div>
                <div className="flex items-center gap-4 py-2">
                  <label className="text-sm font-bold text-slate-700">Rating</label>
                  <div className="flex gap-1 text-2xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className={\`transition-transform hover:scale-110 \${star <= reviewForm.rating ? 'text-slate-900' : 'text-slate-200'}\`}
                      >
                        <i className="fas fa-star"></i>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <textarea 
                    required 
                    rows={4}
                    value={reviewForm.review_text}
                    onChange={(e) => setReviewForm({...reviewForm, review_text: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all outline-none resize-none font-medium bg-slate-50 focus:bg-white"
                    placeholder="Share your experience..."
                  ></textarea>
                </div>
                {reviewStatus === 'error' && (
                  <p className="text-red-500 text-sm font-bold text-center">Failed to submit review. Please try again.</p>
                )}
                <button 
                  type="submit" 
                  disabled={reviewStatus === 'submitting'}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-md disabled:opacity-70"
                >
                  {reviewStatus === 'submitting' ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync(filePath, content);
console.log('Successfully rewrote ProductClient.tsx to ultra premium layout!');
