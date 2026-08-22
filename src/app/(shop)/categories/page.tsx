import pool from '@/lib/db';
import Link from 'next/link';
import CategoriesClient from '@/components/CategoriesClient';

export const metadata = {
  title: 'Medical Equipment Categories & Supplies List | SMD MEDICARE',
  description: 'Explore our complete list of medical equipment categories. Wholesale hospital supplies, ICU equipment, surgical instruments, and diagnostic test kits in India.',
  openGraph: {
    title: 'Medical Equipment Categories & Supplies List | SMD MEDICARE',
    description: 'Explore our complete list of medical equipment categories. Wholesale hospital supplies, ICU equipment, surgical instruments, and diagnostic test kits in India.',
    url: 'https://www.smdmedicare.in/categories',
    siteName: 'SMD MEDICARE',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medical Equipment Categories & Supplies List | SMD MEDICARE',
    description: 'Explore our complete list of medical equipment categories. Wholesale hospital supplies, ICU equipment, surgical instruments, and diagnostic test kits in India.',
  },
  alternates: {
    canonical: 'https://www.smdmedicare.in/categories',
  }
};

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  let categoriesData: any[] = [];
  
  try {
    const [categories] = await pool.query(`
      SELECT DISTINCT c.id, c.name, c.slug 
      FROM categories c 
      INNER JOIN products p ON (p.category_id = c.id OR p.category = c.name)
      WHERE c.status = 1 AND p.status = 'live'
      ORDER BY c.name ASC
    `) as any[];
    const [subCategories] = await pool.query(`
      SELECT DISTINCT s.id, s.category_id, s.name, s.slug 
      FROM sub_categories s
      INNER JOIN products p ON p.sub_category_id = s.id
      WHERE s.status = 1 AND p.status = 'live'
      ORDER BY s.name ASC
    `) as any[];

    categoriesData = categories.map((cat: any) => {
      const subs = subCategories.filter((sub: any) => sub.category_id === cat.id);
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
        subcategories: subs.map((sub: any) => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug || sub.name.toLowerCase().replace(/\s+/g, '-')
        }))
      };
    });
  } catch (error) {
    console.error("Error fetching live data for categories page:", error);
  }

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
        name: 'All Categories',
        item: 'https://www.smdmedicare.in/categories',
      },
    ],
  };

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Medical Equipment Categories & Supplies List | SMD MEDICARE',
    description: 'Explore our complete list of medical equipment categories. Wholesale hospital supplies, ICU equipment, surgical instruments, and diagnostic test kits in India.',
    url: 'https://www.smdmedicare.in/categories',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: categoriesData.map((cat: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://www.smdmedicare.in/category/${cat.slug}`,
        name: cat.name,
      })),
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-6 pt-[76px]">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      {/* Breadcrumbs Banner */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1400px] mx-auto text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap custom-scrollbar pb-2">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link> 
              <span className="mx-2 text-slate-300">»</span>
              <span className="text-slate-900 font-semibold">All Categories</span>
          </div>
      </div>

      {/* Main Content */}
      <CategoriesClient categories={categoriesData} />

      {/* Additional SEO Content */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 text-center max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Comprehensive Medical Equipment Categories</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                  SMD Medicare provides a comprehensive medical equipment category list designed to support hospitals, clinics, laboratories, and healthcare professionals. Our platform offers a wide range of categories of medical equipment, making it easier to explore and source reliable medical equipments for sale from a trusted supplier.
              </p>
              <p className="text-slate-600 leading-relaxed">
                  We cover essential medical device categories and categories of surgical instruments, ensuring quality, safety, and compliance with healthcare standards. Each category is structured to help buyers quickly find suitable medical solutions for their professional needs.
              </p>
          </div>
      </section>
    </div>
  );
}
