import pool from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';

export const revalidate = 3600; // Edge Cache for 1 hour with ISR

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
      const brandStr = product.brand && product.brand !== '0' ? ` (${product.brand})` : '';
      const title = `${product.name}${brandStr} Price, Specs & Buy Online India | SMD Medicare`;
      
      // Extract clean plain text for SEO meta description
      let cleanDesc = `Buy ${product.name} online at wholesale B2B price in India. 100% Genuine with OEM Warranty, GST invoice & fast insured dispatch from SMD Medicare.`;
      if (product.short_description) {
        const text = product.short_description.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
        if (text.length > 20) cleanDesc = text.substring(0, 155) + (text.length > 155 ? '...' : '');
      } else if (product.description) {
        const text = product.description.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
        if (text.length > 20) cleanDesc = text.substring(0, 155) + (text.length > 155 ? '...' : '');
      }
      
      const description = cleanDesc;
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

      const keywords = [
        product.name,
        `${product.name} price`,
        `${product.name} specifications`,
        `buy ${product.name} online india`,
        product.brand,
        product.category_name,
        'medical equipment supplier delhi',
        'hospital equipment wholesale india',
        'SMD Medicare'
      ].filter(Boolean);
      
      return {
        title,
        description,
        keywords: keywords.join(', '),
        alternates: {
          canonical: url,
        },
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
              alt: `${product.name} - SMD MEDICARE Medical Equipment`,
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
        robots: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        }
      };
    }
  } catch(e) {
    console.error('generateMetadata error:', e);
  }
  
  return {
    title: 'Medical Equipment & Hospital Supplies | SMD MEDICARE',
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  let product: any = null;
  let relatedProducts: any[] = [];
  let reviews: any[] = [];
  let brandLogo: string | null = null;
  let relatedBlogs: any[] = [];
  
  try {
    // 1. Fetch main product
    const [prodRows] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug, sc.name as sub_category_name
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN sub_categories sc ON p.sub_category_id = sc.id
      WHERE p.slug = ? LIMIT 1
    `, [slug]) as any[];
    
    if (!prodRows || prodRows.length === 0) {
      return notFound();
    }
    product = prodRows[0];
    product.category = product.category || product.category_name || 'Medical Equipment';
    
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

    // 3. Fetch Related Products
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

    // 5. Fetch Strictly Matching Clinical Blogs / Buying Guides (No Unrelated Fallback)
    try {
      const catKeyword = (product.category_name || product.category || '').toLowerCase().trim();
      const nameKeyword = (product.name || '').toLowerCase().trim();
      
      const stopWords = new Set([
        'equipment', 'hospital', 'medical', 'care', 'supplies', 'device', 'devices', 
        'products', 'general', 'machine', 'machines', 'portable', 'channel', 'digital', 
        'single', 'double', 'twelve', 'three', 'six', 'with', 'gold', 'plus', 'pro', 
        'mini', 'model', 'series', 'system', 'india', 'best', 'top', 'buy', 'online',
        'critical', 'icu', 'delhi', 'wholesale'
      ]);
      
      const rawTokens = [
        ...catKeyword.replace(/[^a-z0-9]+/g, ' ').split(/\s+/),
        ...nameKeyword.replace(/[^a-z0-9]+/g, ' ').split(/\s+/)
      ];
      
      const keywords = Array.from(new Set(rawTokens)).filter(k => k.length >= 3 && !stopWords.has(k));
      
      if (keywords.length > 0) {
        const conditions = keywords.map(() => "(LOWER(title) LIKE ? OR LOWER(slug) LIKE ?)").join(" OR ");
        const params = keywords.flatMap(k => [`%${k}%`, `%${k}%`]);
        
        const [rows] = await pool.query(
          `SELECT * FROM blog WHERE status = 'published' AND (${conditions}) ORDER BY created_at DESC LIMIT 3`,
          params
        ) as any[];
        
        relatedBlogs = rows || [];
      } else {
        relatedBlogs = [];
      }
    } catch (e) {
      console.error("Error fetching related blogs for product:", e);
      relatedBlogs = [];
    }

  } catch (err) {
    console.error("Failed to fetch product", err);
    return notFound();
  }

  const productUrl = `https://www.smdmedicare.in/product/${slug}`;
  const imageUrl = product.image ? `https://www.smdmedicare.in/backend-media/${product.image}` : 'https://www.smdmedicare.in/images/img_68ae826eb6cc47.12112340_logo.webp';
  const catSlug = product.category_slug || (product.category ? product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'categories');
  const catName = product.category_name || product.category || 'Medical Equipment';

  // Plain text description for schema
  const plainDescription = (product.short_description || product.description || `Buy ${product.name} at wholesale prices from SMD Medicare.`)
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 1. Breadcrumbs Schema
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

  // 2. Product Schema with Rich Snippet Attributes
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [imageUrl],
    description: plainDescription.substring(0, 300),
    sku: product.sku || ('SMD-' + String(product.id).padStart(3, '0')),
    mpn: product.sku || ('SMD-' + String(product.id).padStart(3, '0')),
    category: catName,
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
      seller: {
        '@type': 'Organization',
        name: 'SMD Medicare',
        url: 'https://www.smdmedicare.in'
      },
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
          name: r.name || 'Verified Biomedical Buyer'
        },
        datePublished: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '2026-01-01',
        reviewBody: r.review_text || 'Verified medical product review.',
        reviewRating: {
          '@type': 'Rating',
          bestRating: '5',
          ratingValue: (r.rating || 5).toString(),
          worstRating: '1'
        }
      }))
    } : {}),
    ...(relatedBlogs && relatedBlogs.length > 0 ? {
      subjectOf: {
        '@type': 'Article',
        headline: relatedBlogs[0].title,
        url: `https://www.smdmedicare.in/blog/${relatedBlogs[0].slug}`
      }
    } : {})
  };

  // 3. FAQPage Schema for Rich SERP Accordion Snippets
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What warranty and support is provided with the ${product.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `All medical equipment carries official 1 to 2 Years OEM Manufacturer Warranty covering manufacturing defects and factory biomedical engineering evaluation.`
        }
      },
      {
        '@type': 'Question',
        name: `How is the ${product.name} packed and delivered?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `We use damage-proof wooden crate packaging and insured freight logistics delivering across all Indian states with real-time tracking within 3 to 7 business days.`
        }
      },
      {
        '@type': 'Question',
        name: `Do you provide official GST Invoices for ${product.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, 100% compliant GST invoices with standard HSN codes are provided for hospitals, clinics, and dealers to claim full Input Tax Credit (ITC).`
        }
      },
      {
        '@type': 'Question',
        name: `How is installation and clinical setup handled for ${product.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `We provide pre-installation technical checklists, complete user operating manuals, and video/on-site biomedical engineer guidance for seamless clinical deployment.`
        }
      }
    ]
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ProductClient 
        product={product} 
        relatedProducts={relatedProducts} 
        reviews={reviews}
        brandLogo={brandLogo} 
        relatedBlogs={relatedBlogs}
      />
    </>
  );
}
