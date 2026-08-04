import pool from '@/lib/db';
import Link from 'next/link';
import CategoriesClient from '@/components/CategoriesClient';

export const metadata = {
  title: 'Medical Equipment Categories - SMD MEDICARE',
  description: 'Explore a wide range of hospital equipment categories. Find reliable and high-quality medical equipment designed for hospitals, clinics, and healthcare facilities.'
};

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  let categoriesData: any[] = [];
  
  try {
    const [categories] = await pool.query('SELECT id, name, slug FROM categories WHERE status = 1 ORDER BY name ASC') as any[];
    const [subCategories] = await pool.query('SELECT id, category_id, name, slug FROM sub_categories WHERE status = 1 ORDER BY name ASC') as any[];

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

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-[76px]">
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
