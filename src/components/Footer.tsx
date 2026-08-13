import Link from 'next/link';
import Image from 'next/image';
import pool from '@/lib/db';

export default async function Footer() {
  let categories: any[] = [];
  try {
    const [catRows] = await pool.query(`
      SELECT DISTINCT c.name, c.slug 
      FROM categories c 
      JOIN products p ON c.name = p.category 
      WHERE p.status = 'live' 
      LIMIT 5
    `) as any[];
    categories = catRows;
  } catch (error) {
    console.error('Error fetching footer categories:', error);
  }

  return (
    <footer className="bg-slate-950 text-slate-300 pt-8 pb-8 border-t-4 border-blue-600">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-10 md:mb-12">
            <div className="flex flex-col">
                <Image src="/images/img_68ae826eb6cc47.12112340_logo.webp" alt="SMD Medicare" width={121} height={69} className="h-[50px] w-auto bg-white p-2 rounded-lg object-contain mb-5 self-start" />
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Over a decade of trust, innovation, and diagnostic supply excellence. Serving healthcare providers across India.
                </p>
                <div className="flex items-center gap-3">
                    <a href="https://facebook.com/smdmedicare" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-[#1877F2] hover:scale-110 transition-transform">
                        <i className="fab fa-facebook-f text-lg" aria-hidden="true"></i>
                    </a>
                    <a href="https://twitter.com/smdmedicare" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-[#1DA1F2] hover:scale-110 transition-transform">
                        <i className="fab fa-twitter text-lg" aria-hidden="true"></i>
                    </a>
                    <a href="https://instagram.com/smdmedicare" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-[#E4405F] hover:scale-110 transition-transform">
                        <i className="fab fa-instagram text-lg" aria-hidden="true"></i>
                    </a>
                    <a href="https://linkedin.com/company/smdmedicare" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-[#0A66C2] hover:scale-110 transition-transform">
                        <i className="fab fa-linkedin-in text-lg" aria-hidden="true"></i>
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5 md:gap-10 col-span-1 md:col-span-2 lg:col-span-2">
                <div className="flex flex-col">
                    <h3 className="text-white text-lg font-bold mb-5 tracking-wide">Quick Links</h3>
                    <ul className="flex flex-col gap-3">
                        <li><Link href="/" className="text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-2"><i className="fas fa-angle-right text-[0.7em]"></i> Home</Link></li>
                        <li><Link href="/categories" className="text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-2"><i className="fas fa-angle-right text-[0.7em]"></i> Product Categories</Link></li>
                        <li><Link href="/about" className="text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-2"><i className="fas fa-angle-right text-[0.7em]"></i> About Us</Link></li>
                        <li><Link href="/contact" className="text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-2"><i className="fas fa-angle-right text-[0.7em]"></i> Contact Us</Link></li>
                        <li><Link href="/blog" className="text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-2"><i className="fas fa-angle-right text-[0.7em]"></i> Our Blogs</Link></li>
                    </ul>
                </div>

                <div className="flex flex-col">
                    <h3 className="text-white text-lg font-bold mb-5 tracking-wide">Our Categories</h3>
                    <ul className="flex flex-col gap-3">
                        {categories.length > 0 ? categories.map((cat) => (
                          <li key={cat.slug}>
                            <Link href={`/category/${cat.slug}`} className="text-slate-400 hover:text-blue-400 transition-colors text-[13px] sm:text-sm flex items-center gap-2">
                              <i className="fas fa-angle-right text-[0.7em] shrink-0"></i> <span className="line-clamp-1">{cat.name}</span>
                            </Link>
                          </li>
                        )) : (
                          <li><span className="text-slate-500 text-sm">Loading categories...</span></li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="flex flex-col">
                <h3 className="text-white text-lg font-bold mb-5 tracking-wide">Contact Info</h3>
                <div className="flex flex-col gap-4">
                    <p className="flex items-start gap-3 text-slate-400 text-sm">
                        <i className="fas fa-phone-alt mt-1 text-blue-500"></i>
                        <a href="tel:+919555422455" className="hover:text-blue-400 transition-colors">+91 95554 22455</a>
                    </p>
                    <p className="flex items-start gap-3 text-slate-400 text-sm break-all">
                        <i className="fas fa-envelope mt-1 text-blue-500"></i>
                        <a href="mailto:info@smdmedicare.in" className="hover:text-blue-400 transition-colors">info@smdmedicare.in</a>
                    </p>
                    <p className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed">
                        <i className="fas fa-map-marker-alt mt-1 text-blue-500"></i>
                        India's Trusted Diagnostic & Healthcare Supplier
                    </p>
                </div>
            </div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
                &copy; {new Date().getFullYear()} SMD MEDICARE. All Rights Reserved.
            </p>
            <div className="flex gap-4 text-sm text-slate-500">
                <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
        </div>
    </footer>
  );
}
