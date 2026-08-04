import Link from 'next/link';
import InquireButton from '@/components/InquireButton';
import AddToCartButton from '@/components/AddToCartButton';
import PriceDisplay from '@/components/PriceDisplay';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let title = 'Product Not Found - SMD MEDICARE';
  
  try {
    const [rows] = await pool.query('SELECT name FROM products WHERE slug = ?', [resolvedParams.slug]) as any[];
    if (rows && rows.length > 0) {
        title = `${rows[0].name} - SMD MEDICARE`;
    }
  } catch (err) {}

  return {
    title,
    description: 'Buy premium medical equipment at best prices in India.',
  };
}

const renderSpecification = (specString: string) => {
    try {
        const parsed = JSON.parse(specString);
        if (Array.isArray(parsed) && parsed.length > 0 && (parsed[0].name || parsed[0].label)) {
            return (
                <div className="overflow-x-auto mt-4 border border-slate-200 rounded-lg">
                    <table className="w-full border-collapse text-left text-[0.95rem]">
                        <tbody>
                            {parsed.map((item: any, idx: number) => {
                                const label = (item.name || item.label || '').replace(/:$/, '');
                                const value = item.description || item.value || '';
                                return (
                                    <tr key={idx} className={`${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'} ${idx !== parsed.length - 1 ? 'border-b border-slate-200' : ''}`}>
                                        <th className="p-3.5 text-slate-700 font-semibold w-[35%] border-r border-slate-200">{label}</th>
                                        <td className="p-3.5 text-slate-600">{value}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            );
        }
    } catch (e) {
        // Fallback for non-JSON content
    }
    return <div className="text-slate-600 leading-relaxed text-[1.05rem] px-2.5" dangerouslySetInnerHTML={{__html: specString.replace(/\n/g, '<br/>')}} />;
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let product: any = null;
  
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.slug = ?
    `, [resolvedParams.slug]) as any[];
    
    if (rows && rows.length > 0) {
      product = rows[0];
      // Map category_name to category for backward compatibility with UI
      product.category = product.category_name || 'Uncategorized';
    }
  } catch (err) {
    console.error("Failed to fetch product", err);
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] text-center px-5 py-24 text-slate-500">
        <h2>Product not found</h2>
      </div>
    );
  }

  const imageUrl = `/backend-media/${product.image}`;

  return (
    <>
      <div className="breadcrumbs">
          <Link href="/">Home</Link> &raquo; <Link href="/categories">Products</Link> &raquo; <span>{product.name}</span>
      </div>

      <section className="section pt-5">
          <div className="flex flex-wrap gap-10 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              
              {/* Product Image */}
              <div className="flex-[1_1_400px] text-center p-5 border border-slate-100 rounded-lg bg-white relative">
                  <img 
                    src={imageUrl} 
                    alt={product.name} 
                    className="w-full max-h-[400px] object-contain"
                  />
                  {product.mrp > product.price && (
                      <div className="absolute top-5 left-5 bg-red-500 text-white font-bold px-2.5 py-1 rounded-md">
                          {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                      </div>
                  )}
              </div>

              {/* Product Details */}
              <div className="flex-[1.5_1_500px] text-left">
                  <h1 className="text-[2.2rem] text-slate-900 mb-2.5 leading-tight">{product.name}</h1>
                  <p className="text-primary font-semibold text-[1.1rem] mb-5">Brand: {product.brand || 'SMD Medicare'}</p>
                  
                  <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 mb-8">
                      <div className="mb-6 flex items-center gap-3">
                          {product.price > 0 ? (
                              <PriceDisplay price={product.price} mrp={product.mrp} className="text-3xl" />
                          ) : (
                              <span className="text-3xl text-blue-700 font-bold tracking-tight">Ask for Price</span>
                          )}
                      </div>
                      <p className="text-emerald-500 font-semibold text-sm mt-1">Inclusive of all taxes</p>
                  </div>

                  <div className="flex gap-4 mb-10">
                      <AddToCartButton product={product} />
                      <div className="flex-1 flex">
                        <InquireButton productName={product.name} />
                      </div>
                  </div>

                  <div className="border-t border-slate-200 pt-5">
                      <h3 className="text-[1.2rem] text-slate-900 mb-4">Key Specifications</h3>
                      <table className="w-full border-collapse text-[0.95rem]">
                          <tbody>
                              <tr className="border-b border-slate-100">
                                  <td className="py-3 text-slate-500 w-[40%]">Category</td>
                                  <td className="py-3 text-slate-900 font-semibold">{product.category}</td>
                              </tr>
                              {product.brand && (
                                  <tr className="border-b border-slate-100">
                                      <td className="py-3 text-slate-500">Brand</td>
                                      <td className="py-3 text-slate-900 font-semibold">{product.brand}</td>
                                  </tr>
                              )}
                              {product.packaging && (
                                  <tr className="border-b border-slate-100">
                                      <td className="py-3 text-slate-500">Packaging</td>
                                      <td className="py-3 text-slate-900 font-semibold">{product.packaging}</td>
                                  </tr>
                              )}
                              {product.warranty && (
                                  <tr className="border-b border-slate-100">
                                      <td className="py-3 text-slate-500">Warranty</td>
                                      <td className="py-3 text-slate-900 font-semibold">{product.warranty}</td>
                                  </tr>
                              )}
                              {product.shelf_life && (
                                  <tr className="border-b border-slate-100">
                                      <td className="py-3 text-slate-500">Shelf Life</td>
                                      <td className="py-3 text-slate-900 font-semibold">{product.shelf_life}</td>
                                  </tr>
                              )}
                              <tr className="border-b border-slate-100">
                                  <td className="py-3 text-slate-500">SKU / Reference</td>
                                  <td className="py-3 text-slate-900 font-semibold">{product.slug.split('-').slice(-2).join('-').toUpperCase()}</td>
                              </tr>
                              <tr>
                                  <td className="py-3 text-slate-500">Stock Status</td>
                                  <td className="py-3 text-emerald-500 font-semibold">In Stock</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
          
          {/* Extra Details Sections */}
          <div className="mt-10 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              
              {product.description && (
                  <div className="mb-8">
                      <h3 className="text-[1.4rem] text-slate-900 mb-4 border-b-2 border-slate-200 pb-2.5">Product Description</h3>
                      <div className="text-slate-600 leading-relaxed text-[1.05rem]" dangerouslySetInnerHTML={{__html: product.description.replace(/\n/g, '<br/>')}} />
                  </div>
              )}

              {product.features && (
                  <div className="mb-8">
                      <h3 className="text-[1.4rem] text-slate-900 mb-4 border-b-2 border-slate-200 pb-2.5">Key Features</h3>
                      <div className="text-slate-600 leading-relaxed text-[1.05rem]" dangerouslySetInnerHTML={{__html: product.features.replace(/\n/g, '<br/>')}} />
                  </div>
              )}

              {product.specification && (
                  <div className="mb-8">
                      <h3 className="text-[1.4rem] text-slate-900 mb-4 border-b-2 border-slate-200 pb-2.5">Technical Specifications</h3>
                      {renderSpecification(product.specification)}
                  </div>
              )}

              {product.usage && (
                  <div className="mb-8">
                      <h3 className="text-[1.4rem] text-slate-900 mb-4 border-b-2 border-slate-200 pb-2.5">Usage & Directions</h3>
                      <div className="text-slate-600 leading-relaxed text-[1.05rem]" dangerouslySetInnerHTML={{__html: product.usage.replace(/\n/g, '<br/>')}} />
                  </div>
              )}
          </div>
      </section>
    </>
  );
}
