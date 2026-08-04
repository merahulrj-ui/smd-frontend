"use client";

import { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useUI } from '@/context/UIContext';
import InquireButton from '@/components/InquireButton';
import AddToCartButton from '@/components/AddToCartButton';

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
  if (product.image) mainImages.push(`/backend-media/${product.image}`);
  if (product.image2) mainImages.push(`/backend-media/${product.image2}`);
  if (product.image3) mainImages.push(`/backend-media/${product.image3}`);
  
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
      title: `${product.name} - SMD MEDICARE`,
      text: `Check out ${product.name} on SMD MEDICARE!`,
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
        <tr key={`spec-${idx}`} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
          <th className="py-4 px-4 font-bold text-slate-700 w-1/3 bg-slate-50/50">{spec.name || spec.label}</th>
          <td className="py-4 px-4 text-slate-600 font-medium">{spec.description || spec.value}</td>
        </tr>
      ));
    }
    if (typeof product.specification === 'string' && product.specification.trim() !== '') {
      return (
        <tr className="border-b border-slate-100">
          <td colSpan={2} className="py-4 px-4 text-slate-600 font-medium">
            <div dangerouslySetInnerHTML={{__html: product.specification.replace(/\n/g, '<br/>')}} />
          </td>
        </tr>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-[100px] pb-16">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap custom-scrollbar pb-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="mx-2 text-slate-300">»</span>
          <Link href="/categories" className="hover:text-blue-600 transition-colors">Categories</Link>
          <span className="mx-2 text-slate-300">»</span>
          <Link href={`/category/${(product.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="hover:text-blue-600 transition-colors">{product.category}</Link>
          <span className="mx-2 text-slate-300">»</span>
          <span className="text-slate-800">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Images & Sidebar */}
          <div className="w-full lg:w-[480px] xl:w-[540px] shrink-0">
            {/* Image Gallery */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative mb-8">
              <button 
                onClick={shareProduct}
                className="absolute top-4 right-4 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all z-10 shadow-sm"
                title="Share Product"
              >
                <i className="fas fa-share-alt"></i>
              </button>
              
              <div className="aspect-square flex items-center justify-center bg-white rounded-2xl mb-4 p-4 border border-slate-100 overflow-hidden">
                <img 
                  src={activeImage} 
                  alt={product.name} 
                  className="max-w-full max-h-full object-contain transition-all duration-300"
                />
              </div>
              
              {mainImages.length > 1 && (
                <div className="flex justify-center gap-3">
                  {mainImages.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-20 h-20 rounded-xl border-2 flex items-center justify-center p-2 transition-all bg-white ${activeImage === img ? 'border-blue-600 shadow-sm' : 'border-slate-200 hover:border-blue-300'}`}
                    >
                      <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Sidebars */}
            <div className="hidden lg:block space-y-6 sticky top-24 pb-8">
              <div className="bg-[#e8f5e9] rounded-xl p-6 border border-[#c8e6c9] shadow-sm">
                <div className="inline-block border-b-2 border-[#2e7d32] pb-1 mb-5">
                  <h3 className="text-[22px] font-bold text-[#1b5e20] tracking-tight">
                    Why Choose Us?
                  </h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center text-[#2e7d32] font-medium text-[15px]">
                    <i className="fas fa-check-circle text-lg mr-2"></i> 100% Genuine Products
                  </li>
                  <li className="flex items-center text-[#2e7d32] font-medium text-[15px]">
                    <i className="fas fa-check-circle text-lg mr-2"></i> Best Prices in Market
                  </li>
                  <li className="flex items-center text-[#2e7d32] font-medium text-[15px]">
                    <i className="fas fa-check-circle text-lg mr-2"></i> Fast & Safe Delivery
                  </li>
                </ul>
              </div>

              <div className="bg-[#e3f2fd] rounded-xl p-6 border border-[#bbdefb] shadow-sm">
                <div className="inline-block border-b-2 border-[#1565c0] pb-1 mb-5">
                  <h3 className="text-[22px] font-bold text-[#0d47a1] tracking-tight">
                    Need Help?
                  </h3>
                </div>
                <div className="space-y-4">
                  <a href="tel:+919555422455" className="flex items-center text-[#1565c0] hover:text-[#0d47a1] transition-colors font-medium text-[15px]">
                    <i className="fas fa-phone-alt text-lg mr-2"></i> +91 95554 22455
                  </a>
                  <a href="mailto:info@smdmedicare.com" className="flex items-center text-[#1565c0] hover:text-[#0d47a1] transition-colors font-medium text-[15px]">
                    <i className="fas fa-envelope text-lg mr-2"></i> info@smdmedicare.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="flex-1 w-full">
            <div className="mb-6">
              <div className="inline-flex px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full font-bold text-sm mb-4 border border-blue-100 shadow-sm items-center gap-2">
                <i className="fas fa-layer-group text-blue-500"></i> {product.category}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                {reviews.length > 0 ? (
                  <div className="flex items-center text-amber-400 text-lg">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i key={star} className={`fas ${star <= Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) ? 'fa-star' : 'fa-star text-slate-300'}`}></i>
                    ))}
                    <span className="text-slate-700 font-bold ml-2 text-sm">
                      {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                    </span>
                    <span className="text-slate-400 font-medium ml-1 text-sm">({reviews.length} Reviews)</span>
                  </div>
                ) : (
                  <div className="flex items-center text-slate-300 text-lg">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <span className="text-slate-400 font-medium ml-2 text-sm">No reviews yet</span>
                  </div>
                )}
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <span className="text-teal-600 font-bold text-sm bg-teal-50 px-3 py-1 rounded-md">Premium Quality</span>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm mb-8">
              {price > 0 ? (
                <div className="mb-6">
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{formatPrice(price)}</span>
                    {discount > 0 && (
                      <span className="text-xl text-slate-400 font-medium line-through mb-1">{formatPrice(mrp)}</span>
                    )}
                  </div>
                  {discount > 0 && (
                    <div className="inline-flex items-center px-3 py-1 rounded-lg bg-red-100 text-red-700 font-bold text-sm border border-red-200">
                      {discount}% OFF
                    </div>
                  )}
                  <p className="text-emerald-500 font-semibold text-sm mt-2">Inclusive of all taxes</p>
                </div>
              ) : (
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-blue-600 tracking-tight">Price on Request</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-teal-600 font-semibold mb-8 bg-teal-50/50 p-4 rounded-2xl border border-teal-100">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <i className="fas fa-shipping-fast text-lg"></i>
                </div>
                <span>Fastest Delivery Available Nationwide</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <AddToCartButton product={product} />
                  <div className="flex-1 flex">
                      <InquireButton 
                        productName={product.name} 
                        className="w-full flex-1 py-4 px-5 text-[1.1rem] font-bold rounded-xl text-blue-600 bg-blue-50 border-2 border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm flex items-center justify-center gap-2"
                      />
                  </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                <i className="fas fa-shield-check text-2xl text-teal-500 mb-2"></i>
                <p className="font-bold text-slate-700 text-sm">100% Genuine</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                <i className="fas fa-truck-fast text-2xl text-blue-500 mb-2"></i>
                <p className="font-bold text-slate-700 text-sm">Fast Delivery</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                <i className="fas fa-lock text-2xl text-amber-500 mb-2"></i>
                <p className="font-bold text-slate-700 text-sm">Secure Payment</p>
              </div>
            </div>

            {product.catalogue_pdf && (
              <a 
                href={product.catalogue_pdf.startsWith('http') ? product.catalogue_pdf : `/backend-media/${product.catalogue_pdf}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl transition-colors mb-10 gap-3"
              >
                <i className="fas fa-file-pdf text-red-500 text-xl"></i> Download Official Catalogue
              </a>
            )}

            {/* Tabs content */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-10">
              <div className="flex overflow-x-auto border-b border-slate-200 custom-scrollbar">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 min-w-[150px] py-4 px-6 font-bold text-sm transition-colors border-b-2 ${activeTab === 'overview' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  Overview
                </button>
                {(product.features || product.usage) && (
                  <button 
                    onClick={() => setActiveTab('features')}
                    className={`flex-1 min-w-[150px] py-4 px-6 font-bold text-sm transition-colors border-b-2 ${activeTab === 'features' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                  >
                    Features & Usage
                  </button>
                )}
                <button 
                  onClick={() => setActiveTab('specs')}
                  className={`flex-1 min-w-[150px] py-4 px-6 font-bold text-sm transition-colors border-b-2 ${activeTab === 'specs' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  Specifications
                </button>
              </div>

              <div className="p-6 md:p-8">
                {activeTab === 'overview' && (
                  <div className="prose prose-slate max-w-none">
                    <style dangerouslySetInnerHTML={{__html: `
                      .prose h1, .prose h2, .prose h3 { color: #0f172a; margin-bottom: 1rem; margin-top: 1.5rem; font-weight: 800; }
                      .prose p { margin-bottom: 1rem; color: #475569; line-height: 1.7; }
                      .prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; color: #475569; }
                      .prose li { margin-bottom: 0.5rem; }
                      .prose strong { color: #1e293b; font-weight: 700; }
                    `}} />
                    {product.description ? (
                      <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
                    ) : (
                      <p className="text-slate-500 italic">No description available for this product.</p>
                    )}
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="prose prose-slate max-w-none space-y-8">
                    {product.features && (
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><i className="fas fa-star text-blue-500"></i> Key Features</h3>
                        <div dangerouslySetInnerHTML={{ __html: product.features.replace(/\n/g, '<br/>') }} />
                      </div>
                    )}
                    {product.usage && (
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><i className="fas fa-hands-helping text-blue-500"></i> Usage</h3>
                        <div dangerouslySetInnerHTML={{ __html: product.usage.replace(/\n/g, '<br/>') }} />
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <th className="py-4 px-4 font-bold text-slate-700 w-1/3 bg-slate-50/50">SKU / Reference</th>
                            <td className="py-4 px-4 text-slate-600 font-medium">{(product.slug || '').split('-').slice(-2).join('-').toUpperCase()}</td>
                        </tr>
                        {product.brand && (
                          <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <th className="py-4 px-4 font-bold text-slate-700 w-1/3 bg-slate-50/50">Brand</th>
                            <td className="py-4 px-4 text-slate-600 font-medium">
                              {brandLogo ? (
                                <img src={brandLogo} alt={product.brand} className="max-h-8 object-contain" />
                              ) : (
                                product.brand
                              )}
                            </td>
                          </tr>
                        )}
                        {product.packaging && (
                          <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <th className="py-4 px-4 font-bold text-slate-700 w-1/3 bg-slate-50/50">Packaging</th>
                            <td className="py-4 px-4 text-slate-600 font-medium">{product.packaging}</td>
                          </tr>
                        )}
                        {product.shelf_life && (
                          <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <th className="py-4 px-4 font-bold text-slate-700 w-1/3 bg-slate-50/50">Shelf Life</th>
                            <td className="py-4 px-4 text-slate-600 font-medium">{product.shelf_life}</td>
                          </tr>
                        )}
                        {product.warranty && (
                          <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <th className="py-4 px-4 font-bold text-slate-700 w-1/3 bg-slate-50/50">Warranty</th>
                            <td className="py-4 px-4 text-slate-600 font-medium">{product.warranty}</td>
                          </tr>
                        )}
                        {renderSpecs()}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Sidebars */}
            <div className="lg:hidden space-y-6 mt-8">
              <div className="bg-[#e8f5e9] rounded-xl p-6 border border-[#c8e6c9] shadow-sm">
                <div className="inline-block border-b-2 border-[#2e7d32] pb-1 mb-5">
                  <h3 className="text-[22px] font-bold text-[#1b5e20] tracking-tight">
                    Why Choose Us?
                  </h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center text-[#2e7d32] font-medium text-[15px]">
                    <i className="fas fa-check-circle text-lg mr-2"></i> 100% Genuine Products
                  </li>
                  <li className="flex items-center text-[#2e7d32] font-medium text-[15px]">
                    <i className="fas fa-check-circle text-lg mr-2"></i> Best Prices in Market
                  </li>
                  <li className="flex items-center text-[#2e7d32] font-medium text-[15px]">
                    <i className="fas fa-check-circle text-lg mr-2"></i> Fast & Safe Delivery
                  </li>
                </ul>
              </div>

              <div className="bg-[#e3f2fd] rounded-xl p-6 border border-[#bbdefb] shadow-sm">
                <div className="inline-block border-b-2 border-[#1565c0] pb-1 mb-5">
                  <h3 className="text-[22px] font-bold text-[#0d47a1] tracking-tight">
                    Need Help?
                  </h3>
                </div>
                <div className="space-y-4">
                  <a href="tel:+919555422455" className="flex items-center text-[#1565c0] hover:text-[#0d47a1] transition-colors font-medium text-[15px]">
                    <i className="fas fa-phone-alt text-lg mr-2"></i> +91 95554 22455
                  </a>
                  <a href="mailto:info@smdmedicare.com" className="flex items-center text-[#1565c0] hover:text-[#0d47a1] transition-colors font-medium text-[15px]">
                    <i className="fas fa-envelope text-lg mr-2"></i> info@smdmedicare.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-slate-200 pt-16">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Related Products</h2>
              <p className="text-slate-500">More products from the {product.category} range.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
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
        )}

        {/* Customer Reviews Section */}
        <div className="mt-16 border-t border-slate-200 pt-16 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Customer Reviews</h2>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-slate-800">
                  {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                </span>
                <div>
                  <div className="text-amber-400 flex text-lg gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i key={star} className={`fas ${star <= (reviews.length > 0 ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 0) ? 'fa-star' : 'fa-star text-slate-300'}`}></i>
                    ))}
                  </div>
                  <span className="text-sm text-slate-500 font-medium">Based on {reviews.length} reviews</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowReviewModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-sm active:scale-95"
            >
              Write a Review
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <i className="fas fa-comment-alt text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">No reviews yet</h3>
              <p className="text-slate-500">Be the first to share your experience with this product!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-800">{review.name}</h4>
                      <div className="text-amber-400 flex gap-0.5 text-sm mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i key={star} className={`fas ${star <= review.rating ? 'fa-star' : 'fa-star text-slate-200'}`}></i>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                      {new Date(review.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-slate-600 italic">"{review.review_text}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FAQs & Bulk Order Banner */}
        <div className="grid lg:grid-cols-3 gap-8 mt-12 mb-8">
          
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <h4 className="font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  What is the warranty period?
                </h4>
                <p className="text-slate-600 mt-2 text-sm pl-11">The warranty period is based on the manufacturing company's policy for this specific product.</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <h4 className="font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <i className="fas fa-truck"></i>
                  </div>
                  How fast is the delivery?
                </h4>
                <p className="text-slate-600 mt-2 text-sm pl-11">We process and dispatch the delivery within 24 hours of successful payment confirmation.</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <h4 className="font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <i className="fas fa-tools"></i>
                  </div>
                  Do you provide installation support?
                </h4>
                <p className="text-slate-600 mt-2 text-sm pl-11">Yes, we provide full support and guidance for the installation of the equipment.</p>
              </div>
            </div>
          </div>

          {/* Bulk Order Banner */}
          <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-8 shadow-lg text-white flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
            
            <i className="fas fa-hospital text-4xl text-blue-300 mb-5 relative z-10"></i>
            <h3 className="text-2xl font-bold mb-3 relative z-10 leading-tight">Hospital Setup or Bulk Order?</h3>
            <p className="text-slate-300 mb-8 text-sm leading-relaxed relative z-10">
              Get customized quotations, exclusive B2B pricing, and priority support for large scale medical requirements.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-6 py-3.5 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 hover:shadow-xl relative z-10 w-full"
            >
              Contact Sales <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          
        </div>

      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative">
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Write a Review</h2>
            <p className="text-slate-500 mb-6">Your review will be submitted for moderation.</p>
            
            {reviewStatus === 'success' ? (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
                <i className="fas fa-check-circle text-xl"></i>
                <span className="font-medium">Thank you! Your review has been submitted for approval.</span>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Your Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Your Rating *</label>
                  <div className="flex gap-2 text-2xl">
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
                  <label className="block text-sm font-bold text-slate-700 mb-2">Your Review *</label>
                  <textarea 
                    required 
                    rows={4}
                    value={reviewForm.review_text}
                    onChange={(e) => setReviewForm({...reviewForm, review_text: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                    placeholder="Share your experience..."
                  ></textarea>
                </div>
                {reviewStatus === 'error' && (
                  <p className="text-red-500 text-sm font-medium">Failed to submit review. Please try again.</p>
                )}
                <button 
                  type="submit" 
                  disabled={reviewStatus === 'submitting'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
