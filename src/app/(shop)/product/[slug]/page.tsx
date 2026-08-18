import pool from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params;
    const rawSlug = resolvedParams?.slug || '';
    const slug = decodeURIComponent(rawSlug).trim();
    
    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.slug = ? OR p.slug = ? OR p.id = ? LIMIT 1`,
      [rawSlug, slug, isNaN(Number(slug)) ? 0 : Number(slug)]
    ) as any[];

    if (rows && rows.length > 0) {
      const product = rows[0];
      const title = `${product.name} - Buy at Wholesale Price`;
      
      // Extract plain text from description or use default
      let descriptionText = `Buy ${product.name} online at wholesale prices in India. Certified medical equipment & supplies with nationwide delivery and warranty from SMD Medicare.`;
      if (product.short_description) {
        descriptionText = product.short_description.replace(/<[^>]*>?/gm, '').trim();
      } else if (product.description) {
        const plainText = product.description.replace(/<[^>]*>?/gm, '').trim();
        if (plainText.length > 10) {
          descriptionText = plainText.substring(0, 155) + (plainText.length > 155 ? '...' : '');
        }
      }
      
      const description = descriptionText;
      const url = `https://www.smdmedicare.in/product/${slug}`;
      
      let imageUrl = 'https://www.smdmedicare.in/icon-512.png';
      if (product.image) {
        const cleanImg = product.image.trim();
        if (cleanImg.startsWith('http://') || cleanImg.startsWith('https://')) {
          imageUrl = cleanImg;
        } else if (cleanImg.startsWith('/')) {
          imageUrl = `https://www.smdmedicare.in${cleanImg}`;
        } else if (cleanImg.startsWith('backend-media/')) {
          imageUrl = `https://www.smdmedicare.in/${cleanImg}`;
        } else {
          imageUrl = `https://www.smdmedicare.in/backend-media/${cleanImg}`;
        }
      }
      
      return {
        title,
        description,
        openGraph: {
          title: `${product.name} - Wholesale Price in India | SMD MEDICARE`,
          description,
          url,
          siteName: 'SMD MEDICARE',
          locale: 'en_IN',
          images: [
            {
              url: imageUrl,
              secureUrl: imageUrl,
              width: 800,
              height: 800,
              alt: `${product.name} - SMD MEDICARE`,
              type: 'image/jpeg',
            }
          ],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${product.name} - Buy Online | SMD MEDICARE`,
          description,
          images: [imageUrl],
        },
        alternates: {
          canonical: url,
        }
      };
    }
  } catch(e) {
    console.error('generateMetadata error:', e);
  }
  
  return {
    title: 'Product - SMD MEDICARE',
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
    // 1. Fetch main product (join with categories for category name & slug)
    const [prodRows] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug 
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

  const productUrl = `https://www.smdmedicare.in/product/${slug}`;
  const imageUrl = product.image ? `https://www.smdmedicare.in/backend-media/${product.image}` : 'https://www.smdmedicare.in/images/img_68ae826eb6cc47.12112340_logo.webp';
  const catSlug = product.category_slug || (product.category ? product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'categories');
  const catName = product.category_name || product.category || 'Medical Equipment';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.smdmedicare.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: catName,
        item: `https://www.smdmedicare.in/category/${catSlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };

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
      validFrom: '2026-01-01',
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
      }
    },
    ...(reviews && reviews.length > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1),
        reviewCount: reviews.length.toString(),
        bestRating: '5',
        worstRating: '1'
      },
      review: reviews.map((r: any) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: r.user_name || 'Verified Customer'
        },
        datePublished: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '2026-01-01',
        reviewBody: r.comment || 'Verified product review.',
        reviewRating: {
          '@type': 'Rating',
          bestRating: '5',
          ratingValue: (r.rating || 5).toString(),
          worstRating: '1'
        }
      }))
    } : {})
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
