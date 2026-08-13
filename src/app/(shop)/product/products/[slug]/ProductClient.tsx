"use client";

import { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useUI } from '@/context/UIContext';

export default function ProductClient({ 
  product, 
  relatedProducts,
  brandLogo
}: { 
  product: any;
  relatedProducts: any[];
  brandLogo: string | null;
}) {
  const { openInquiryModal, currencySymbol } = useUI();
  
  // Image handling
  const mainImages = [];
  if (product.image) mainImages.push(`/backend-media/${product.image}`);
  if (product.image2) mainImages.push(`/backend-media/${product.image2}`);
  if (product.image3) mainImages.push(`/backend-media/${product.image3}`);
  
  const [activeImage, setActiveImage] = useState(mainImages[0] || '/backend-media/images/placeholder.png');

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

  return (
    <div className="bg-slate-50 min-h-screen pt-[100px] pb-16">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap custom-scrollbar pb-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="mx-2 text-slate-300">»</span>
          <Link href="/categories" className="hover:text-blue-600 transition-colors">Categories</Link>
          <span className="mx-2 text-slate-300">»</span>
          <Link href={`/category/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="hover:text-blue-600 transition-colors">{product.category}</Link>
          <span className="mx-2 text-slate-300">»</span>
          <span className="text-slate-800">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Images & Sidebar */}
          <div className="w-full lg:w-[480px] xl:w-[540px] shrink-0">
            {/* Image Gallery */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative mb-8 sticky top-24">
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
            <div className="hidden lg:block space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-star text-amber-400"></i> Why Choose Us?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-600 font-medium"><i className="fas fa-check-circle text-teal-500 text-lg"></i> 100% Genuine Products</li>
                  <li className="flex items-center gap-3 text-slate-600 font-medium"><i className="fas fa-check-circle text-teal-500 text-lg"></i> Best Prices in Market</li>
                  <li className="flex items-center gap-3 text-slate-600 font-medium"><i className="fas fa-check-circle text-teal-500 text-lg"></i> Fast & Safe Delivery</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-sm text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                  <i className="fas fa-headset text-blue-400"></i> Need Help?
                </h3>
                <div className="space-y-4 relative z-10">
                  <a href="tel:+919555422455" className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium mb-0.5">Call Us Now</p>
                      <p className="font-bold text-white tracking-wide">+91 95554 22455</p>
                    </div>
                  </a>
                  <a href="mailto:info@smdmedicare.in" className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium mb-0.5">Email Support</p>
                      <p className="font-bold text-white tracking-wide">info@smdmedicare.in</p>
                    </div>
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
                <div className="flex items-center text-amber-400 text-lg">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                  <span className="text-slate-700 font-bold ml-2 text-sm">4.5</span>
                  <span className="text-slate-400 font-medium ml-1 text-sm">(12 Reviews)</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <span className="text-teal-600 font-bold text-sm bg-teal-50 px-3 py-1 rounded-md">Premium Quality</span>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm mb-8">
              {price > 0 ? (
                <div className="mb-6">
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{currencySymbol}{price.toLocaleString('en-IN')}</span>
                    {discount > 0 && (
                      <span className="text-xl text-slate-400 font-medium line-through mb-1">{currencySymbol}{mrp.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  {discount > 0 && (
                    <div className="inline-flex items-center px-3 py-1 rounded-lg bg-red-100 text-red-700 font-bold text-sm border border-red-200">
                      {discount}% OFF
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-blue-600 tracking-tight">Get Best Price</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-teal-600 font-semibold mb-8 bg-teal-50/50 p-4 rounded-2xl border border-teal-100">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <i className="fas fa-shipping-fast text-lg"></i>
                </div>
                <span>Fastest Delivery Available Nationwide</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => openInquiryModal(product.id, product.name)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
                >
                  <i className="fas fa-paper-plane"></i> Get Best Price
                </button>
                <button 
                  className="sm:w-[70px] h-[60px] bg-white border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-2xl font-bold transition-all flex items-center justify-center active:scale-[0.95]"
                  title="Add to Catalog"
                >
                  <i className="fas fa-folder-plus text-2xl"></i>
                </button>
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
                      <div dangerouslySetInnerHTML={{ __html: product.description }} />
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
                        <div dangerouslySetInnerHTML={{ __html: product.features }} />
                      </div>
                    )}
                    {product.usage && (
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><i className="fas fa-hands-helping text-blue-500"></i> Usage</h3>
                        <div dangerouslySetInnerHTML={{ __html: product.usage }} />
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <tbody>
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
                        {Array.isArray(product.specifications) && product.specifications.map((spec: any, idx: number) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <th className="py-4 px-4 font-bold text-slate-700 w-1/3 bg-slate-50/50">{spec.name}</th>
                            <td className="py-4 px-4 text-slate-600 font-medium">{spec.description || spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Sidebars */}
            <div className="lg:hidden space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-star text-amber-400"></i> Why Choose Us?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-600 font-medium"><i className="fas fa-check-circle text-teal-500 text-lg"></i> 100% Genuine Products</li>
                  <li className="flex items-center gap-3 text-slate-600 font-medium"><i className="fas fa-check-circle text-teal-500 text-lg"></i> Best Prices in Market</li>
                  <li className="flex items-center gap-3 text-slate-600 font-medium"><i className="fas fa-check-circle text-teal-500 text-lg"></i> Fast & Safe Delivery</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-sm text-white">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <i className="fas fa-headset text-blue-400"></i> Need Help?
                </h3>
                <div className="space-y-4">
                  <a href="tel:+919555422455" className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium mb-0.5">Call Us Now</p>
                      <p className="font-bold tracking-wide">+91 95554 22455</p>
                    </div>
                  </a>
                  <a href="mailto:info@smdmedicare.in" className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium mb-0.5">Email Support</p>
                      <p className="font-bold tracking-wide">info@smdmedicare.in</p>
                    </div>
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

      </div>
    </div>
  );
}
