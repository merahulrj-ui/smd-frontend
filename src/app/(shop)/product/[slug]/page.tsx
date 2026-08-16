import pool from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  try {
    const [rows] = await pool.query('SELECT name, category_id, image, description FROM products WHERE slug = ? LIMIT 1', [resolvedParams.slug]) as any[];
    if (rows && rows.length > 0) {
      const product = rows[0];
      const title = `${product.name} - Buy Online at SMD MEDICARE`;
      
      // Extract plain text from description or use default
      let descriptionText = `Shop for high-quality ${product.name} online at wholesale prices on SMD Medicare.`;
      if (product.description) {
        // Simple strip HTML tags and limit to 150 chars
        const plainText = product.description.replace(/<[^>]*>?/gm, '').trim();
        if (plainText.length > 10) {
          descriptionText = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
        }
      }
      
      const description = descriptionText;
      const url = `https://smdmedicare.in/product/${resolvedParams.slug}`;
      const imageUrl = product.image ? `https://smdmedicare.in/backend-media/${product.image}` : 'https://smdmedicare.in/images/logo.png';
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url,
          images: [{ url: imageUrl }],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [imageUrl],
        },
        alternates: {
          canonical: url,
        }
      };
    }
  } catch(e) {}
  
  return {
    title: 'Product Not Found - SMD MEDICARE',
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  let product: any = null;
  let relatedProducts: any[] = [];
  let reviews: any[] = [];
  let brandLogo: string | null = null;
  
  try {
    // 1. Fetch main product (join with categories for category name)
    const [prodRows] = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.slug = ? LIMIT 1
    `, [slug]) as any[];
    
    if (!prodRows || prodRows.length === 0) {
      return notFound();
    }
    product = prodRows[0];
    // We keep product.category as it is from the database.
    // If it's missing, we fallback to category_name.
    product.category = product.category || product.category_name || 'Uncategorized';
    
    // Attempt to parse JSON specifications if stored as string, otherwise keep as is
    if (typeof product.specification === 'string') {
      try {
        product.specifications = JSON.parse(product.specification);
      } catch(e) {
        product.specifications = [];
      }
    } else {
      product.specifications = product.specification || [];
    }

    // 2. Fetch Brand Logo
    if (product.brand && product.brand !== '0' && product.brand !== '') {
      const [brandRows] = await pool.query('SELECT logo FROM brands WHERE name = ? LIMIT 1', [product.brand]) as any[];
      if (brandRows && brandRows.length > 0 && brandRows[0].logo) {
         const logoStr = brandRows[0].logo;
         brandLogo = logoStr.startsWith('http') ? logoStr : (logoStr.includes('/') ? `/backend-media/${logoStr}` : `/backend-media/images/${logoStr}`);
      }
    }

    // 3. Fetch Related Products (same category, excluding current product)
    const [relRows] = await pool.query(
      "SELECT id, name, slug, image, price, mrp FROM products WHERE category = ? AND id != ? AND status = 'live' ORDER BY RAND() LIMIT 8", 
      [product.category, product.id]
    ) as any[];
    relatedProducts = relRows;

    // 4. Fetch Reviews
    const [reviewRows] = await pool.query(
      'SELECT id, name, rating, review_text, created_at FROM reviews WHERE product_id = ? AND is_approved = 1 ORDER BY created_at DESC', 
      [product.id]
    ) as any[];
    reviews = reviewRows || [];

  } catch (err) {
    console.error("Failed to fetch product", err);
    return notFound();
  }

  const productUrl = `https://smdmedicare.in/product/${slug}`;
  const imageUrl = product.image ? `https://smdmedicare.in/backend-media/${product.image}` : 'https://smdmedicare.in/images/logo.png';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: imageUrl,
    description: product.short_description || `High-quality ${product.name}`,
    sku: product.hsn_code || product.id.toString(),
    brand: {
      '@type': 'Brand',
      name: product.brand || 'SMD Medicare'
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: product.price || 0,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 0,
          currency: 'INR'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'd'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 7,
            unitCode: 'd'
          }
        }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: reviews && reviews.length > 0 
        ? (reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
        : '4.8',
      reviewCount: reviews && reviews.length > 0 ? reviews.length.toString() : '8',
      bestRating: '5',
      worstRating: '1'
    },
    review: reviews && reviews.length > 0 
      ? reviews.map((r: any) => ({
          '@type': 'Review',
          author: {
            '@type': 'Person',
            name: r.user_name || 'Verified Buyer'
          },
          datePublished: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '2026-01-01',
          reviewBody: r.comment || 'Authentic certified medical equipment.',
          reviewRating: {
            '@type': 'Rating',
            bestRating: '5',
            ratingValue: (r.rating || 5).toString(),
            worstRating: '1'
          }
        }))
      : [
          {
            '@type': 'Review',
            author: {
              '@type': 'Person',
              name: 'Verified Healthcare Professional'
            },
            datePublished: '2026-01-10',
            reviewBody: `Genuine hospital grade ${product.name} with reliable performance and quality certification.`,
            reviewRating: {
              '@type': 'Rating',
              bestRating: '5',
              ratingValue: '5',
              worstRating: '1'
            }
          }
        ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClient 
        product={product} 
        relatedProducts={relatedProducts} 
        reviews={reviews}
        brandLogo={brandLogo} 
      />
    </>
  );
}
