import Navbar from '@/components/Navbar';
import Link from 'next/link';
import pool from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let products = [];
  try {
    const [rows] = await pool.query('SELECT id, name, slug, image, price, mrp FROM products LIMIT 8') as any[];
    products = rows || [];
  } catch (error) {
    console.error("Error fetching live data:", error);
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      
      {/* Next-Gen Tailwind Hero Section */}
      <section className="relative bg-slate-900 overflow-hidden rounded-b-[40px] mb-12">
        {/* Abstract Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[80%] rounded-full bg-teal-500/10 blur-[100px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[80%] rounded-full bg-sky-500/10 blur-[100px]"></div>
        </div>

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/90 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            INDIA'S #1 MEDICAL & DIAGNOSTIC SUPPLIES PLATFORM
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight max-w-4xl mx-auto tracking-tight">
            Trusted Medical Equipment & Medical Supplies Provider in India
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Your reliable partner for hospital equipment, surgical instruments, and diagnostic solutions with fast delivery nationwide.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/categories" className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] flex items-center gap-2">
              <i className="fas fa-boxes"></i> Explore Products
            </Link>
            <a href="#" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-semibold rounded-xl transition-all flex items-center gap-2">
              <i className="fas fa-handshake"></i> Become a Partner
            </a>
          </div>

          {/* Floating Glassmorphism Hero Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-5 text-left transform transition-transform hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-2xl shadow-lg shrink-0">
                <i className="fas fa-microscope"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">10,000+</div>
                <div className="text-sm text-teal-100 font-medium">Quality Products</div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-5 text-left transform transition-transform hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white text-2xl shadow-lg shrink-0">
                <i className="fas fa-hospital-user"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">5,000+</div>
                <div className="text-sm text-sky-100 font-medium">Hospitals & Labs</div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-5 text-left transform transition-transform hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg shrink-0">
                <i className="fas fa-shipping-fast"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-indigo-100 font-medium">Express Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Featured Products</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Sourced from certified manufacturers, serving laboratories, clinics, and hospitals.</p>
        </div>
        
        {/* Tailwind Horizontal Scroll Snap Container */}
        <div className="relative group">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {products.map((product: any) => (
              <div key={product.id} className="snap-start shrink-0 w-[200px] md:w-[220px]">
                <ProductCard 
                  id={product.id}
                  slug={product.slug || product.id}
                  name={product.name}
                  price={product.price}
                  mrp={product.mrp}
                  image={product.image ? `/backend-media/${product.image}` : '/backend-media/images/placeholder.png'}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise & One-Stop Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Your One-Stop Medical Equipment Store</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We supply clinical-grade diagnostics kits, surgical instruments, and biochemical raw materials.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow border border-slate-100 group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-2xl mb-6 shadow-md group-hover:scale-110 transition-transform">
                <i className="fas fa-notes-medical"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Rapid Test Kits</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Quick and accurate rapid diagnostic solutions for clinical parameters.</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow border border-slate-100 group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl mb-6 shadow-md group-hover:scale-110 transition-transform">
                <i className="fas fa-vials"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">ELISA Kits</h3>
              <p className="text-slate-600 text-sm leading-relaxed">High-sensitivity ELISA kits for immunology and pathology facilities.</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow border border-slate-100 group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-2xl mb-6 shadow-md group-hover:scale-110 transition-transform">
                <i className="fas fa-flask"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Biochemistry</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Reagents and products supporting comprehensive laboratory analysis.</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow border border-slate-100 group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-2xl mb-6 shadow-md group-hover:scale-110 transition-transform">
                <i className="fas fa-heartbeat"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Diagnostic Equipment</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Advanced digital machinery for reliable hospital results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Why Choose SMD MEDICARE?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Decade-long experience, serving wholesale and bulk order demands with quality focus.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-16 h-16 mx-auto rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-2xl mb-6">
                <i className="fas fa-award"></i>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Trusted Supplier</h3>
              <p className="text-slate-600 text-sm">A trusted medical equipment partner serving hospitals nationwide.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-6">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">High-Quality Certified</h3>
              <p className="text-slate-600 text-sm">Premium medical supplies meeting ISO & CE quality benchmarks.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mb-6">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Regulatory Compliant</h3>
              <p className="text-slate-600 text-sm">Your go-to source for wholesale medical supplies and bulk orders.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
