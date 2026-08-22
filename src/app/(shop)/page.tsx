import Link from 'next/link';
import Image from 'next/image';
import pool from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import ClientCategoryImage from '@/components/ClientCategoryImage';
import ClientCarousel from '@/components/ClientCarousel';
import HeroPartnerButton from '@/components/HeroPartnerButton';
import NewsletterForm from '@/components/NewsletterForm';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let products = [];
  let categories = [];
  let latest_blogs = [];
  let dbBrands = [];
  try {
    const [rows] = await pool.query('SELECT id, name, slug, image, price, mrp FROM products LIMIT 8') as any[];
    products = rows || [];
    
    const [catRows] = await pool.query(`
      SELECT c.id, c.name, c.slug, c.image, 
             (SELECT p.image FROM products p WHERE p.category = c.name AND p.image IS NOT NULL AND p.image != '' LIMIT 1) as prod_image 
      FROM categories c 
      WHERE c.status = 1 
        AND EXISTS (SELECT 1 FROM products p WHERE p.category = c.name) 
      LIMIT 12
    `) as any[];
    categories = catRows || [];

    const [blogRows] = await pool.query('SELECT id, title, slug, blog_image, author_name, read_time, created_at FROM blog ORDER BY created_at DESC LIMIT 3') as any[];
    latest_blogs = blogRows || [];

    const [brandRows] = await pool.query('SELECT id, name, logo FROM brands WHERE status = 1 LIMIT 6') as any[];
    dbBrands = brandRows || [];
  } catch (error) {
    console.error("Error fetching live data:", error);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: 'SMD MEDICARE',
    alternateName: ['SMD Medicare', 'SMD MEDICARE INDIA', 'smdmedicare.in'],
    url: 'https://www.smdmedicare.in/',
    logo: 'https://www.smdmedicare.in/icon-512.png',
    image: 'https://www.smdmedicare.in/icon-512.png',
    description: 'Trusted wholesale supplier of premium medical equipment, surgical instruments, hospital furniture, and diagnostic kits in India.',
    sameAs: [
      'https://g.page/r/CXI_hn0yUh7JEAI',
      'https://www.indiamart.com/smd-medicare-roorkee/',
      'https://facebook.com/smdmedicare',
      'https://linkedin.com/company/smdmedicare',
      'https://www.instagram.com/smd_medicare',
      'https://x.com/smd_medicare'
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shakumbari Vihar, Phase 2, Ganeshpur',
      addressLocality: 'Roorkee',
      addressRegion: 'Uttarakhand',
      postalCode: '247667',
      addressCountry: 'IN'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9555422455',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi']
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Next-Gen Tailwind Hero Section */}
      <section className="relative mt-[76px] bg-gradient-to-br from-blue-900 via-slate-900 to-blue-950 md:rounded-b-[40px] mb-4 md:mb-6 border-b border-blue-800/30 shadow-xl md:shadow-2xl overflow-hidden transform-gpu w-full">
        {/* Abstract Background Gradients (Hidden on mobile to prevent WebKit blur glitches) */}
        <div className="absolute top-0 inset-x-0 h-full pointer-events-none hidden md:block">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[80%] rounded-full bg-blue-500/20 blur-[100px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[80%] rounded-full bg-sky-500/20 blur-[100px]"></div>
        </div>

        <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:pt-10 md:pb-8 text-center flex flex-col items-center justify-center min-h-[250px] md:min-h-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full bg-white/10 border border-white/10 text-white/90 text-xs md:text-sm font-medium mb-4 md:mb-5">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-400 animate-pulse"></span>
            #1 B2B MEDICAL SUPPLIES
          </div>
          
          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-3 md:mb-4 leading-tight w-full max-w-4xl mx-auto tracking-tight drop-shadow-sm">
            Trusted Medical Equipment & Supplies in India
          </h1>
          <p className="text-sm md:text-base text-blue-50/80 mb-6 md:mb-6 w-full max-w-2xl mx-auto font-light leading-relaxed px-2">
            Your reliable partner for hospital equipment, surgical instruments, and diagnostic solutions with fast delivery.
          </p>
          
          <div className="flex flex-row items-center justify-center gap-3 w-full mb-2 md:mb-4">
            <Link href="/categories" className="px-5 py-2.5 md:px-8 md:py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm md:text-base font-semibold rounded-lg md:rounded-xl transition-all shadow-lg md:shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-2 flex-1 md:flex-none justify-center">
              <i className="fas fa-boxes"></i> Explore
            </Link>
            <HeroPartnerButton />
          </div>

        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-6 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Featured Medical Products & Supplies</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Sourced from certified medical manufacturers, serving laboratories, clinics, and hospitals.</p>
        </div>
        
        {/* Interactive Tailwind Horizontal Carousel */}
        <ClientCarousel>
          {products.map((product: any, index: number) => (
            <div key={product.id} className="snap-start shrink-0 w-[200px] md:w-[220px]">
              <ProductCard 
                id={product.id}
                slug={product.slug || product.id}
                name={product.name}
                price={product.price}
                mrp={product.mrp}
                image={product.image ? `/backend-media/${product.image}` : '/backend-media/images/placeholder.png'}
                priority={index < 2}
              />
            </div>
          ))}
        </ClientCarousel>
      </section>

      {/* Browse by Category Section */}
      <section className="py-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Browse Medical Equipment by Category</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Search through our dedicated categories of diagnostic kits and medical equipment.</p>
          </div>
          
          <ClientCarousel>
            {categories.map((cat: any, index: number) => {
              const colors = ['bg-blue-600', 'bg-sky-500', 'bg-indigo-500', 'bg-teal-500', 'bg-emerald-500', 'bg-cyan-500'];
              const bgColor = colors[index % colors.length];
              const initials = cat.name.split(' ').map((w: string) => w[0]).join('').substring(0,2).toUpperCase();
              const catSlug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
              
              const finalImage = cat.image || cat.prod_image;
              
              return (
                <Link key={cat.id} href={`/category/${catSlug}`} className="snap-start shrink-0 flex flex-col items-center group w-[120px]">
                  <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm border border-slate-100 ${finalImage ? 'bg-white p-3' : bgColor + ' text-white text-2xl font-bold'}`}>
                    <ClientCategoryImage 
                      primaryImage={cat.image} 
                      fallbackImage={cat.prod_image} 
                      alt={cat.name} 
                      initials={initials} 
                    />
                  </div>
                  <span className="text-[13px] font-semibold text-slate-700 text-center group-hover:text-blue-600 transition-colors line-clamp-2">{cat.name}</span>
                </Link>
              );
            })}
          </ClientCarousel>
        </div>
      </section>

      {/* Brands We Carry Section */}
      {dbBrands && dbBrands.length > 0 && (
        <section className="py-10 bg-white border-b border-slate-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Top Medical Brands We Carry</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Providing genuine medical equipment from the most trusted manufacturers.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {dbBrands.map((brand: any) => (
                <div key={brand.id} className="relative min-w-[120px] h-[60px] md:min-w-[160px] md:h-[80px] bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center p-3 hover:shadow-md transition-shadow cursor-pointer group">
                  {brand.logo ? (
                    <Image 
                      src={brand.logo.startsWith('images/') ? `/backend-media/${brand.logo}` : `/backend-media/images/${brand.logo}`} 
                      alt={brand.name} 
                      fill
                      sizes="(max-width: 768px) 120px, 160px"
                      className="object-contain filter group-hover:brightness-110 transition-all p-2" 
                    />
                  ) : (
                    <span className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors text-center">{brand.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Expertise & One-Stop Section */}
      <section className="py-6 bg-white border-y border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Your One-Stop Medical Equipment Store</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We supply clinical-grade diagnostics kits, surgical instruments, and biochemical raw materials.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-slate-100 group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-2xl mb-6 shadow-md group-hover:scale-110 transition-transform">
                <i className="fas fa-notes-medical"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Rapid Test Kits</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Quick and accurate rapid diagnostic solutions for clinical parameters.</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-slate-100 group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl mb-6 shadow-md group-hover:scale-110 transition-transform">
                <i className="fas fa-vials"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">ELISA Kits</h3>
              <p className="text-slate-600 text-sm leading-relaxed">High-sensitivity ELISA kits for immunology and pathology facilities.</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-slate-100 group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-2xl mb-6 shadow-md group-hover:scale-110 transition-transform">
                <i className="fas fa-flask"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Biochemistry</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Reagents and products supporting comprehensive laboratory analysis.</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-slate-100 group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-2xl mb-6 shadow-md group-hover:scale-110 transition-transform">
                <i className="fas fa-heartbeat"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Diagnostic Equipment</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Advanced digital machinery for reliable hospital results.</p>
            </div>
          </div>
        </div>
      </section>



      {/* Why Healthcare Providers Choose SMD MEDICARE */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-900 font-bold text-xs mb-3 shadow-sm">
              <i className="fas fa-certificate text-blue-600"></i> Trusted Healthcare Partner
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Why Healthcare Providers Choose SMD MEDICARE</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm">Direct wholesale supplier of certified hospital equipment, diagnostic kits, and surgical tools.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-4">
            {/* Card 1 */}
            <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-200 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl mb-4">
                <i className="fas fa-headset"></i>
              </div>
              <div className="text-purple-600 text-sm font-bold mb-2">Expert Guidance</div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Technical &amp; Installation Support</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">Dedicated pre-purchase assistance and technical guidance for hospital equipment setup and operations.</p>
              <span className="text-xs font-semibold text-slate-500 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">Full Setup Assistance</span>
            </div>
            
            {/* Card 2 */}
            <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-200 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center text-xl mb-4">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="text-teal-600 text-sm font-bold mb-2">100% Certified</div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Medical Grade Standards</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">All equipment and SS 304 surgical instruments meet rigorous clinical quality, accuracy, and hospital safety standards.</p>
              <span className="text-xs font-semibold text-slate-500 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">ISO &amp; CE Compliant</span>
            </div>
            
            {/* Card 3 */}
            <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-200 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl mb-4">
                <i className="fas fa-truck-fast"></i>
              </div>
              <div className="text-blue-600 text-sm font-bold mb-2">Nationwide Coverage</div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Pan-India Insured Dispatch</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">Safe, damage-proof packaging with insured courier logistics delivering across all states and union territories.</p>
              <span className="text-xs font-semibold text-slate-500 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">24hr Order Dispatch</span>
            </div>
            
            {/* Card 4 */}
            <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-200 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl mb-4">
                <i className="fas fa-file-invoice-dollar"></i>
              </div>
              <div className="text-indigo-600 text-sm font-bold mb-2">B2B Wholesale</div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Direct Manufacturer Rates</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">Institutional wholesale pricing, compliant GST billing, and dedicated quotation assistance for hospitals and dealers.</p>
              <span className="text-xs font-semibold text-slate-500 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">GST Invoice Provided</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bulk Order / Wholesale CTA Banner */}
      <section className="py-10 md:py-12 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 md:mb-3">Looking for Bulk Supplies for your Hospital?</h2>
            <p className="text-blue-100/80 text-sm md:text-base">Get a customized wholesale quote within 24 hours. Partner with us for reliable, fast, and high-quality medical equipment procurement.</p>
          </div>
          <div className="shrink-0 w-full md:w-auto flex justify-center md:justify-end">
            <Link href="/contact" className="px-6 py-3 bg-white text-blue-900 font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all flex items-center gap-2 whitespace-nowrap">
              <i className="fas fa-envelope"></i> Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Latest From Our Blog */}
      {latest_blogs.length > 0 && (
        <section className="py-6 bg-slate-50 border-t border-slate-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Latest From Our Blog</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Updates, guides, and diagnostic sector insights.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latest_blogs.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow group text-left">
                  <div className="h-48 overflow-hidden bg-slate-100 relative">
                    <Image src={post.blog_image ? (post.blog_image.startsWith('http') ? post.blog_image : `/backend-media/${post.blog_image}`) : '/backend-media/images/placeholder.png'} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                      <span><i className="far fa-user mr-1 text-blue-500"></i> {post.author_name || 'SMD MEDICARE Team'}</span>
                      <span><i className="far fa-clock mr-1 text-blue-500"></i> {post.read_time || '5'} mins read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      <section className="py-10 bg-white" id="faqs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500">General details about services, shipping, and inquiries.</p>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "What types of medical equipment does SMD MEDICARE offer?", a: "SMD MEDICARE offers a wide range of medical equipment including hospital equipment, diagnostic equipment, medical instruments, and surgical equipment for hospitals, laboratories, and clinics." },
              { q: "Do you provide medical supplies online?", a: "Yes, we showcase medical supplies online, allowing healthcare professionals to send pricing queries and request quotes easily for delivery across India." },
              { q: "Are wholesale medical supplies available?", a: "Yes, we specialize in wholesale medical supplies for hospitals, distributors, diagnostic manufacturers, and research centers at competitive rates." },
              { q: "Is SMD MEDICARE a medical supply store near me?", a: "SMD MEDICARE serves customers across India through its online medical equipment portal, making premium medical supplies easily accessible." },
              { q: "Do you supply surgical instruments and surgical equipment?", a: "Yes, we supply high-quality medical surgical instruments and surgical equipment that meet clinical standards and regulatory requirements." }
            ].map((faq, index) => (
              <details key={index} className="group bg-slate-50 border border-slate-200 rounded-xl">
                <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-slate-800">
                  <span>{faq.q}</span>
                  <span className="transition group-open:rotate-180">
                    <i className="fas fa-chevron-down text-blue-500"></i>
                  </span>
                </summary>
                <div className="text-slate-600 mt-0 px-6 pb-6 pt-2 border-t border-slate-100 leading-relaxed text-sm">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="pt-6 pb-2 md:pt-10 md:pb-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Desktop Version (Cards) */}
          <div className="hidden md:grid grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5 text-left transform-gpu transition-transform hover:-translate-y-1 hover:shadow-lg shadow-sm">
              <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-2xl shrink-0">
                <i className="fas fa-shield-check"></i>
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900 mb-1">100% Certified</div>
                <div className="text-sm text-slate-500 font-medium">ISO &amp; CE Standards</div>
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5 text-left transform-gpu transition-transform hover:-translate-y-1 hover:shadow-lg shadow-sm">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl shrink-0">
                <i className="fas fa-truck-fast"></i>
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900 mb-1">Pan-India Delivery</div>
                <div className="text-sm text-slate-500 font-medium">Insured Safe Shipping</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5 text-left transform-gpu transition-transform hover:-translate-y-1 hover:shadow-lg shadow-sm">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl shrink-0">
                <i className="fas fa-medal"></i>
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900 mb-1">Factory Warranty</div>
                <div className="text-sm text-slate-500 font-medium">Direct OEM Spares Support</div>
              </div>
            </div>
          </div>

          {/* Mobile Version (Unified Strip) */}
          <div className="md:hidden flex items-center justify-between w-full max-w-sm mx-auto bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
             <div className="flex flex-col items-center flex-1">
                <i className="fas fa-shield-check text-teal-500 text-2xl mb-1.5 drop-shadow-sm"></i>
                <div className="text-slate-900 font-extrabold text-[14px] tracking-tight">100%</div>
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Certified</div>
             </div>
             
             <div className="w-[1px] h-12 bg-slate-200"></div>
             
             <div className="flex flex-col items-center flex-1">
                <i className="fas fa-truck-fast text-blue-500 text-2xl mb-1.5 drop-shadow-sm"></i>
                <div className="text-slate-900 font-extrabold text-[14px] tracking-tight">Pan-India</div>
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Delivery</div>
             </div>
             
             <div className="w-[1px] h-12 bg-slate-200"></div>
             
             <div className="flex flex-col items-center flex-1">
                <i className="fas fa-medal text-indigo-500 text-2xl mb-1.5 drop-shadow-sm"></i>
                <div className="text-slate-900 font-extrabold text-[14px] tracking-tight">Direct</div>
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Warranty</div>
             </div>
          </div>

        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-10 lg:py-12 border-t border-slate-800 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 drop-shadow-sm">Never Miss an Update</h2>
          <p className="text-slate-300 text-sm md:text-base mb-6 max-w-2xl mx-auto font-light leading-relaxed">
            Subscribe to our newsletter to get the latest medical equipment reviews, industry news, and exclusive offers delivered straight to your inbox.
          </p>
          <NewsletterForm />
          <p className="text-slate-500 text-xs mt-6">We care about your data in our <Link href="#" className="underline hover:text-slate-300 transition-colors">privacy policy</Link>.</p>
        </div>
      </section>
    </div>
  );
}
