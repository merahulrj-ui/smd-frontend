"use client";

import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import SidebarFilter from '@/components/SidebarFilter';

export default function SearchClient({
  query,
  products,
  availableCategories,
  availableBrands,
  recommendedProducts,
  topBrands
}: {
  query: string;
  products: any[];
  availableCategories: string[];
  availableBrands: string[];
  recommendedProducts: any[];
  topBrands: { name: string; logo: string | null }[];
}) {
  
  const mappedCategories = availableCategories.map((c, i) => ({
    id: i + 1,
    name: c,
    slug: c
  }));

  return (
    <div className="min-h-screen bg-slate-50 pt-[76px] pb-16">
      {/* Breadcrumb Banner */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap custom-scrollbar pb-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="mx-2 text-slate-300">»</span>
          <span className="text-slate-500">Search</span>
          <span className="mx-2 text-slate-300">»</span>
          <span className="text-slate-900 font-semibold">{query}</span>
        </div>
      </div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar Filter (using the shared SidebarFilter component) */}
          <div className="w-full lg:w-[280px] shrink-0 sticky top-24">
            <SidebarFilter 
              subcategories={mappedCategories} 
              brands={availableBrands} 
              isSearch={true} 
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full">
            
            <div className="hidden lg:block mb-6">
              <h1 className="text-3xl font-extrabold text-slate-900">Search results for "{query}"</h1>
              <p className="text-slate-500 mt-2">Showing {products.length} products</p>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((p) => (
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
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-50 mb-6">
                  <i className="fas fa-box-open text-4xl text-slate-300"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Products Found</h3>
                <p className="text-slate-500 mb-6">We couldn't find anything matching your filters. Try adjusting them or clear all filters to see more results.</p>
                <Link href={typeof window !== 'undefined' ? window.location.pathname : '#'} className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-colors inline-block">
                  Clear All Filters
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Recommendations */}
        <div className="mt-20 border-t border-slate-200 pt-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Top Recommended Products</h2>
            <p className="text-slate-500">Handpicked selections based on current trends and availability.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {recommendedProducts.map((p) => (
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

        {/* Top Brands Strip */}
        {topBrands.length > 0 && (
          <div className="mt-16 text-center">
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Top Brands Available</h3>
            <p className="text-slate-500 text-sm mb-8">We partner with the best in the medical industry.</p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {topBrands.map((brand, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl px-6 py-3 flex items-center justify-center hover:border-blue-500 hover:shadow-md transition-all cursor-pointer min-w-[120px] h-[60px]">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="font-bold text-slate-700">{brand.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
