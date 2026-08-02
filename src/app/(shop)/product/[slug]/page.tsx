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
                <div style={{ overflowX: 'auto', marginTop: '15px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                        <tbody>
                            {parsed.map((item: any, idx: number) => {
                                const label = (item.name || item.label || '').replace(/:$/, '');
                                const value = item.description || item.value || '';
                                return (
                                    <tr key={idx} style={{ background: idx % 2 === 0 ? '#f8fafc' : '#ffffff', borderBottom: idx !== parsed.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                                        <th style={{ padding: '14px 16px', color: '#334155', fontWeight: '600', width: '35%', borderRight: '1px solid #e2e8f0' }}>{label}</th>
                                        <td style={{ padding: '14px 16px', color: '#475569' }}>{value}</td>
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
    return <div style={{color: '#475569', lineHeight: '1.7', fontSize: '1.05rem', padding: '0 10px'}} dangerouslySetInnerHTML={{__html: specString.replace(/\n/g, '<br/>')}} />;
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
      <div style={{minHeight: '50vh', textAlign: 'center', padding: '100px 20px', color: '#64748b'}}>
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

      <section className="section" style={{paddingTop: '20px'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '40px', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--slate-200)'}}>
              
              {/* Product Image */}
              <div style={{flex: '1 1 400px', textAlign: 'center', padding: '20px', border: '1px solid var(--slate-100)', borderRadius: '8px', background: '#fff', position: 'relative'}}>
                  <img 
                    src={imageUrl} 
                    alt={product.name} 
                    style={{width: '100%', maxHeight: '400px', objectFit: 'contain'}} 
                  />
                  {product.mrp > product.price && (
                      <div style={{position:'absolute', top:'20px', left:'20px', background:'#ef4444', color:'white', fontWeight:'700', padding:'5px 10px', borderRadius:'6px'}}>
                          {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                      </div>
                  )}
              </div>

              {/* Product Details */}
              <div style={{flex: '1.5 1 500px', textAlign: 'left'}}>
                  <h1 style={{fontSize: '2.2rem', color: '#0f172a', marginBottom: '10px', lineHeight: 1.2}}>{product.name}</h1>
                  <p style={{color: 'var(--color-primary)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '20px'}}>Brand: {product.brand || 'SMD Medicare'}</p>
                  
                  <div style={{background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '30px'}}>
                      <div className="mb-6 flex items-center gap-3">
                          {product.price > 0 ? (
                              <PriceDisplay price={product.price} mrp={product.mrp} className="text-3xl" />
                          ) : (
                              <span className="text-3xl text-blue-700 font-bold tracking-tight">Ask for Price</span>
                          )}
                      </div>
                      <p style={{color: '#10b981', fontWeight: 600, fontSize: '0.9rem', marginTop: '5px'}}>Inclusive of all taxes</p>
                  </div>

                  <div style={{display: 'flex', gap: '15px', marginBottom: '40px'}}>
                      <AddToCartButton product={product} />
                      <div style={{flex: 1, display: 'flex'}}>
                        <InquireButton productName={product.name} />
                      </div>
                  </div>

                  <div style={{borderTop: '1px solid #e2e8f0', paddingTop: '20px'}}>
                      <h3 style={{fontSize: '1.2rem', color: '#0f172a', marginBottom: '15px'}}>Key Specifications</h3>
                      <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem'}}>
                          <tbody>
                              <tr style={{borderBottom: '1px solid #f1f5f9'}}>
                                  <td style={{padding: '12px 0', color: '#64748b', width: '40%'}}>Category</td>
                                  <td style={{padding: '12px 0', color: '#0f172a', fontWeight: 600}}>{product.category}</td>
                              </tr>
                              {product.brand && (
                                  <tr style={{borderBottom: '1px solid #f1f5f9'}}>
                                      <td style={{padding: '12px 0', color: '#64748b'}}>Brand</td>
                                      <td style={{padding: '12px 0', color: '#0f172a', fontWeight: 600}}>{product.brand}</td>
                                  </tr>
                              )}
                              {product.packaging && (
                                  <tr style={{borderBottom: '1px solid #f1f5f9'}}>
                                      <td style={{padding: '12px 0', color: '#64748b'}}>Packaging</td>
                                      <td style={{padding: '12px 0', color: '#0f172a', fontWeight: 600}}>{product.packaging}</td>
                                  </tr>
                              )}
                              {product.warranty && (
                                  <tr style={{borderBottom: '1px solid #f1f5f9'}}>
                                      <td style={{padding: '12px 0', color: '#64748b'}}>Warranty</td>
                                      <td style={{padding: '12px 0', color: '#0f172a', fontWeight: 600}}>{product.warranty}</td>
                                  </tr>
                              )}
                              {product.shelf_life && (
                                  <tr style={{borderBottom: '1px solid #f1f5f9'}}>
                                      <td style={{padding: '12px 0', color: '#64748b'}}>Shelf Life</td>
                                      <td style={{padding: '12px 0', color: '#0f172a', fontWeight: 600}}>{product.shelf_life}</td>
                                  </tr>
                              )}
                              <tr style={{borderBottom: '1px solid #f1f5f9'}}>
                                  <td style={{padding: '12px 0', color: '#64748b'}}>SKU / Reference</td>
                                  <td style={{padding: '12px 0', color: '#0f172a', fontWeight: 600}}>{product.slug.split('-').slice(-2).join('-').toUpperCase()}</td>
                              </tr>
                              <tr>
                                  <td style={{padding: '12px 0', color: '#64748b'}}>Stock Status</td>
                                  <td style={{padding: '12px 0', color: '#10b981', fontWeight: 600}}>In Stock</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
          
          {/* Extra Details Sections */}
          <div style={{marginTop: '40px', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--slate-200)'}}>
              
              {product.description && (
                  <div style={{marginBottom: '30px'}}>
                      <h3 style={{fontSize: '1.4rem', color: '#0f172a', marginBottom: '15px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px'}}>Product Description</h3>
                      <div style={{color: '#475569', lineHeight: '1.7', fontSize: '1.05rem'}} dangerouslySetInnerHTML={{__html: product.description.replace(/\n/g, '<br/>')}} />
                  </div>
              )}

              {product.features && (
                  <div style={{marginBottom: '30px'}}>
                      <h3 style={{fontSize: '1.4rem', color: '#0f172a', marginBottom: '15px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px'}}>Key Features</h3>
                      <div style={{color: '#475569', lineHeight: '1.7', fontSize: '1.05rem'}} dangerouslySetInnerHTML={{__html: product.features.replace(/\n/g, '<br/>')}} />
                  </div>
              )}

              {product.specification && (
                  <div style={{marginBottom: '30px'}}>
                      <h3 style={{fontSize: '1.4rem', color: '#0f172a', marginBottom: '15px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px'}}>Technical Specifications</h3>
                      {renderSpecification(product.specification)}
                  </div>
              )}

              {product.usage && (
                  <div style={{marginBottom: '30px'}}>
                      <h3 style={{fontSize: '1.4rem', color: '#0f172a', marginBottom: '15px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px'}}>Usage & Directions</h3>
                      <div style={{color: '#475569', lineHeight: '1.7', fontSize: '1.05rem'}} dangerouslySetInnerHTML={{__html: product.usage.replace(/\n/g, '<br/>')}} />
                  </div>
              )}
          </div>
      </section>
    </>
  );
}
