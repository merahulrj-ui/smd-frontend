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
        <tr key={\`spec-\${idx}\`} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
          <th className="py-4 px-4 font-bold text-slate-700 w-1/3 bg-slate-50/50">{spec.name || spec.label}</th>
          <td className="py-4 px-4 text-slate-600 font-medium">{spec.description || spec.value}</td>
        </tr>
      ));
    }
    if (typeof product.specification === 'string' && product.specification.trim() !== '') {
      return (
        <tr className="border-b border-slate-100">
          <td colSpan={2} className="py-4 px-4 text-slate-600 font-medium">
            <div dangerouslySetInnerHTML={{__html: product.specification.replace(/\\n/g, '<br/>')}} />
          </td>
        </tr>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-[90px] pb-16 font-sans">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap custom-scrollbar pb-2 flex items-center">
          <Link href="/" className="hover:text-blue-600 transition-colors"><i className="fas fa-home"></i> Home</Link>
          <span className="mx-3 text-slate-300">/</span>
          <Link href="/categories" className="hover:text-blue-600 transition-colors">Categories</Link>
          <span className="mx-3 text-slate-300">/</span>
          <Link href={\`/category/\${(product.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}\`} className="hover:text-blue-600 transition-colors">{product.category}</Link>
          <span className="mx-3 text-slate-300">/</span>
          <span className="text-slate-800 truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column: Image Gallery ONLY */}
          <div className="w-full lg:w-[45%] xl:w-[50%] shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm relative mb-4">
              <button 
                onClick={shareProduct}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all z-10 shadow-sm"
                title="Share Product"
              >
                <i className="fas fa-share-alt"></i>
              </button>
              
              <div className="aspect-[4/3] flex items-center justify-center bg-transparent rounded-2xl mb-6 p-2 overflow-hidden relative">
                <img 
                  src={activeImage} 
                  alt={\`\${product.name} - SMD MEDICARE\`} 
                  className="max-w-full max-h-full object-contain transition-all duration-300"
                />
              </div>
              
              {mainImages.length > 1 && (
                <div className="flex justify-center gap-4">
                  {mainImages.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={\`w-20 h-20 rounded-2xl flex items-center justify-center p-2 transition-all bg-white shadow-sm \${activeImage === img ? 'ring-2 ring-blue-600 shadow-md' : 'border border-slate-100 hover:border-blue-300'}\`}
                    >
                      <img src={img} alt={\`\${product.name} thumbnail \${idx + 1}\`} className="max-w-full max-h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details & Pricing */}
          <div className="flex-1 w-full">
            <div className="mb-6">
              <div className="inline-flex px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md font-bold text-xs uppercase tracking-wider mb-3 items-center gap-2">
                {product.category}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 flex-wrap mb-4">
                {reviews.length > 0 ? (
                  <div className="flex items-center text-amber-500 text-sm">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i key={star} className={\`fas \${star <= Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) ? 'fa-star' : 'fa-star text-slate-200'}\`}></i>
                    ))}
                    <span className="text-slate-800 font-bold ml-2">
                      {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                    </span>
                    <span className="text-slate-500 font-medium ml-1">({reviews.length} Reviews)</span>
                  </div>
                ) : (
                  <div className="flex items-center text-sm">
                    <div className="text-slate-300 flex">
                      <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                    </div>
                    <span className="text-slate-500 font-medium ml-2">No reviews</span>
                  </div>
                )}
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <i className="fas fa-check-circle"></i> Premium Quality
                </span>
              </div>
            </div>

            {/* Price & Action Box (Clean, shadow only) */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm mb-6">
              {price > 0 ? (
                <div className="mb-6">
                  <div className="flex items-end gap-3 mb-1">
                    <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">{formatPrice(price)}</span>
                    {discount > 0 && (
                      <span className="text-xl text-slate-400 font-bold line-through mb-1.5">{formatPrice(mrp)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    {discount > 0 && (
                      <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-red-50 text-red-600 font-extrabold text-sm uppercase tracking-wide">
                        {discount}% OFF
                      </div>
                    )}
                    <p className="text-slate-500 font-medium text-sm">Inclusive of all taxes</p>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <span className="text-3xl md:text-4xl font-black text-blue-600 tracking-tight">Price on Request</span>
                  <p className="text-slate-500 font-medium text-sm mt-2">Contact our sales team for the best quotation.</p>
                </div>
              )}

              <div className="flex items-center gap-3 text-emerald-700 font-semibold mb-8 bg-emerald-50/80 p-4 rounded-xl">
                <i className="fas fa-truck-fast text-xl"></i>
                <span>Fastest Delivery Available Nationwide</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                  <AddToCartButton product={product} />
                  <div className="flex-1 flex">
                      <InquireButton 
                        productName={product.name} 
                        className="w-full flex-1 py-4 px-5 text-lg font-bold rounded-xl text-slate-800 bg-slate-100 hover:bg-slate-200 hover:text-blue-700 transition-all shadow-sm flex items-center justify-center gap-2"
                      />
                  </div>
              </div>
            </div>

            {/* Clean Info Badges */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <i className="fas fa-shield-check text-2xl text-indigo-500 mb-2"></i>
                <p className="font-bold text-slate-700 text-xs sm:text-sm">100% Genuine</p>
              </div>
              <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <i className="fas fa-box-open text-2xl text-blue-500 mb-2"></i>
                <p className="font-bold text-slate-700 text-xs sm:text-sm">Safe Packaging</p>
              </div>
              <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <i className="fas fa-lock text-2xl text-teal-500 mb-2"></i>
                <p className="font-bold text-slate-700 text-xs sm:text-sm">Secure Payment</p>
              </div>
            </div>
            
            {/* Horizontal Trust / Help Bar instead of boxed vertical sidebars */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-blue-50/50 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                  <i className="fas fa-headset text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Need Buying Help?</h4>
                  <a href="tel:+919555422455" className="text-blue-600 font-bold hover:underline">+91 95554 22455</a>
                </div>
              </div>
              {product.catalogue_pdf && (
                <a 
                  href={product.catalogue_pdf.startsWith('http') ? product.catalogue_pdf : \`/backend-media/\${product.catalogue_pdf}\`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-slate-900 rounded-2xl p-5 flex items-center gap-4 group hover:bg-slate-800 transition-colors"
                >
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-red-400 shrink-0 group-hover:scale-110 transition-transform">
                    <i className="fas fa-file-pdf text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">Brochure</h4>
                    <span className="text-slate-300 text-xs">Download PDF</span>
                  </div>
                </a>
              )}
            </div>

          </div>
        </div>

        {/* Tabs content - Now Full Width and seamlessly integrated */}
        <div className="mt-12 bg-white rounded-3xl shadow-sm overflow-hidden mb-12">
          <div className="flex overflow-x-auto border-b border-slate-100 custom-scrollbar">
            <button 
              onClick={() => setActiveTab('overview')}
              className={\`flex-1 min-w-[150px] py-5 px-6 font-bold text-[15px] transition-all border-b-2 \${activeTab === 'overview' ? 'border-blue-600 text-blue-700 bg-blue-50/30' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}\`}
            >
              Overview
            </button>
            {(product.features || product.usage) && (
              <button 
                onClick={() => setActiveTab('features')}
                className={\`flex-1 min-w-[150px] py-5 px-6 font-bold text-[15px] transition-all border-b-2 \${activeTab === 'features' ? 'border-blue-600 text-blue-700 bg-blue-50/30' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}\`}
              >
                Features & Usage
              </button>
            )}
            <button 
              onClick={() => setActiveTab('specs')}
              className={\`flex-1 min-w-[150px] py-5 px-6 font-bold text-[15px] transition-all border-b-2 \${activeTab === 'specs' ? 'border-blue-600 text-blue-700 bg-blue-50/30' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}\`}
            >
              Specifications
            </button>
          </div>

          <div className="p-8 md:p-10">
            {activeTab === 'overview' && (
              <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                <style dangerouslySetInnerHTML={{__html: \`
                  .prose p { margin-bottom: 1.2rem; line-height: 1.8; }
                  .prose strong { color: #0f172a; font-weight: 700; }
                \`}} />
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\\n/g, '<br/>') }} />
                ) : (
                  <p className="italic">No description available for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'features' && (
              <div className="prose prose-slate prose-lg max-w-none space-y-10">
                {product.features && (
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><i className="fas fa-star text-amber-500"></i> Key Features</h3>
                    <div className="text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.features.replace(/\\n/g, '<br/>') }} />
                  </div>
                )}
                {product.usage && (
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><i className="fas fa-hands-helping text-blue-500"></i> Usage Guidelines</h3>
                    <div className="text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.usage.replace(/\\n/g, '<br/>') }} />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <th className="py-5 px-6 font-bold text-slate-800 w-1/3 bg-slate-50/50 rounded-tl-xl">SKU / Reference</th>
                        <td className="py-5 px-6 text-slate-600 font-medium">{(product.slug || '').split('-').slice(-2).join('-').toUpperCase()}</td>
                    </tr>
                    {product.brand && (
                      <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <th className="py-5 px-6 font-bold text-slate-800 w-1/3 bg-slate-50/50">Brand</th>
                        <td className="py-5 px-6 text-slate-600 font-medium">
                          {brandLogo ? (
                            <img src={brandLogo} alt={product.brand} className="max-h-10 object-contain" />
                          ) : (
                            product.brand
                          )}
                        </td>
                      </tr>
                    )}
                    {product.packaging && (
                      <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <th className="py-5 px-6 font-bold text-slate-800 w-1/3 bg-slate-50/50">Packaging</th>
                        <td className="py-5 px-6 text-slate-600 font-medium">{product.packaging}</td>
                      </tr>
                    )}
                    {product.shelf_life && (
                      <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <th className="py-5 px-6 font-bold text-slate-800 w-1/3 bg-slate-50/50">Shelf Life</th>
                        <td className="py-5 px-6 text-slate-600 font-medium">{product.shelf_life}</td>
                      </tr>
                    )}
                    {product.warranty && (
                      <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <th className="py-5 px-6 font-bold text-slate-800 w-1/3 bg-slate-50/50">Warranty</th>
                        <td className="py-5 px-6 text-slate-600 font-medium">{product.warranty}</td>
                      </tr>
                    )}
                    {renderSpecs()}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Related Products - Removed massive margin gaps */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-8 mb-16">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Similar Products</h2>
                <p className="text-slate-500 mt-1">Explore more in {product.category}</p>
              </div>
              <Link href={\`/category/\${(product.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}\`} className="hidden md:flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors">
                View All <i className="fas fa-arrow-right ml-2"></i>
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

        {/* Customer Reviews Section */}
        <div className="mt-8 mb-16 bg-white rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 border-b border-slate-100 pb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Customer Reviews</h2>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-slate-900">
                  {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                </span>
                <div>
                  <div className="text-amber-500 flex text-lg gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i key={star} className={\`fas \${star <= (reviews.length > 0 ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 0) ? 'fa-star' : 'fa-star text-slate-200'}\`}></i>
                    ))}
                  </div>
                  <span className="text-sm text-slate-500 font-medium">Based on {reviews.length} reviews</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowReviewModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-sm active:scale-95"
            >
              Write a Review
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <i className="fas fa-comment-alt text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">No reviews yet</h3>
              <p className="text-slate-500">Be the first to share your experience with this product!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review, idx) => (
                <div key={idx} className="bg-slate-50 p-6 rounded-2xl">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900">{review.name}</h4>
                      <div className="text-amber-500 flex gap-0.5 text-sm mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i key={star} className={\`fas \${star <= review.rating ? 'fa-star' : 'fa-star text-slate-200'}\`}></i>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400 bg-white px-2.5 py-1 rounded-md shadow-sm">
                      {new Date(review.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">"{review.review_text}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FAQs & Bulk Order Banner */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8 mb-12">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <i className="fas fa-shield-alt text-lg"></i>
                  </div>
                  What is the warranty period?
                </h4>
                <p className="text-slate-600 mt-3 text-[15px] pl-13 leading-relaxed">The warranty period is based on the manufacturing company's policy for this specific product.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <i className="fas fa-truck text-lg"></i>
                  </div>
                  How fast is the delivery?
                </h4>
                <p className="text-slate-600 mt-3 text-[15px] pl-13 leading-relaxed">We process and dispatch the delivery within 24 hours of successful payment confirmation.</p>
              </div>
            </div>
          </div>

          {/* Bulk Order Banner */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 shadow-lg text-white flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
            
            <i className="fas fa-hospital text-4xl text-indigo-300 mb-5 relative z-10"></i>
            <h3 className="text-2xl font-bold mb-3 relative z-10 leading-tight">Hospital Setup or Bulk Order?</h3>
            <p className="text-slate-300 mb-8 text-[15px] leading-relaxed relative z-10">
              Get customized quotations, exclusive B2B pricing, and priority support for large scale medical requirements.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-950 px-6 py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-md relative z-10 w-full"
            >
              Contact Sales <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>

      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 rounded-full transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Write a Review</h2>
            <p className="text-slate-500 mb-8 font-medium">Your review will be submitted for moderation.</p>
            
            {reviewStatus === 'success' ? (
              <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl flex items-center gap-4">
                <i className="fas fa-check-circle text-3xl text-emerald-500"></i>
                <span className="font-bold">Thank you! Your review has been successfully submitted for approval.</span>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Your Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium bg-slate-50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Your Rating *</label>
                  <div className="flex gap-2 text-3xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className={\`transition-transform hover:scale-110 \${star <= reviewForm.rating ? 'text-amber-400' : 'text-slate-200'}\`}
                      >
                        <i className="fas fa-star"></i>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Your Review *</label>
                  <textarea 
                    required 
                    rows={4}
                    value={reviewForm.review_text}
                    onChange={(e) => setReviewForm({...reviewForm, review_text: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none font-medium bg-slate-50 focus:bg-white"
                    placeholder="Share your experience..."
                  ></textarea>
                </div>
                {reviewStatus === 'error' && (
                  <p className="text-red-500 text-sm font-bold flex items-center gap-2">
                    <i className="fas fa-exclamation-circle"></i> Failed to submit review. Please try again.
                  </p>
                )}
                <button 
                  type="submit" 
                  disabled={reviewStatus === 'submitting'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-lg rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {reviewStatus === 'submitting' ? 'Submitting...' : 'Submit Review'}
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
