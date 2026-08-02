import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t-4 border-teal-600">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="flex flex-col">
                <img src="/images/img_68ae826eb6cc47.12112340_logo.webp" alt="SMD Medicare" className="h-[50px] w-auto bg-white p-2 rounded-lg object-contain mb-5 self-start" />
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Over a decade of trust, innovation, and diagnostic supply excellence. Serving healthcare providers across India.
                </p>
                <div className="flex items-center gap-3">
                    <a href="https://facebook.com/smdmedicare" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors">
                        <i className="fab fa-facebook-f" aria-hidden="true"></i>
                    </a>
                    <a href="https://twitter.com/smdmedicare" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors">
                        <i className="fab fa-twitter" aria-hidden="true"></i>
                    </a>
                    <a href="https://instagram.com/smdmedicare" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors">
                        <i className="fab fa-instagram" aria-hidden="true"></i>
                    </a>
                    <a href="https://linkedin.com/company/smdmedicare" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors">
                        <i className="fab fa-linkedin-in" aria-hidden="true"></i>
                    </a>
                </div>
            </div>

            <div className="flex flex-col">
                <h3 className="text-white text-lg font-bold mb-5 tracking-wide">Quick Links</h3>
                <ul className="flex flex-col gap-3">
                    <li><Link href="/" className="text-slate-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2"><i className="fas fa-angle-right text-[0.7em]"></i> Home</Link></li>
                    <li><Link href="/categories" className="text-slate-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2"><i className="fas fa-angle-right text-[0.7em]"></i> Product Categories</Link></li>
                    <li><Link href="/about" className="text-slate-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2"><i className="fas fa-angle-right text-[0.7em]"></i> About Us</Link></li>
                    <li><Link href="/contact" className="text-slate-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2"><i className="fas fa-angle-right text-[0.7em]"></i> Contact Us</Link></li>
                    <li><Link href="/blog" className="text-slate-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2"><i className="fas fa-angle-right text-[0.7em]"></i> Our Blogs</Link></li>
                </ul>
            </div>

            <div className="flex flex-col">
                <h3 className="text-white text-lg font-bold mb-5 tracking-wide">Our Categories</h3>
                <ul className="flex flex-col gap-3">
                    <li><Link href="/category/rapid-test-kits" className="text-slate-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2"><i className="fas fa-angle-right text-[0.7em]"></i> Rapid Test Kits</Link></li>
                    <li><Link href="/category/elisa-kits" className="text-slate-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2"><i className="fas fa-angle-right text-[0.7em]"></i> ELISA Kits</Link></li>
                    <li><Link href="/category/surgical-instruments" className="text-slate-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2"><i className="fas fa-angle-right text-[0.7em]"></i> Surgical Instruments</Link></li>
                    <li><Link href="/category/diagnostic-equipment" className="text-slate-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2"><i className="fas fa-angle-right text-[0.7em]"></i> Diagnostic Equipment</Link></li>
                </ul>
            </div>

            <div className="flex flex-col">
                <h3 className="text-white text-lg font-bold mb-5 tracking-wide">Contact Info</h3>
                <div className="flex flex-col gap-4">
                    <p className="flex items-start gap-3 text-slate-400 text-sm">
                        <i className="fas fa-phone-alt mt-1 text-teal-500"></i>
                        <a href="tel:+919555422455" className="hover:text-teal-400 transition-colors">+91 95554 22455</a>
                    </p>
                    <p className="flex items-start gap-3 text-slate-400 text-sm">
                        <i className="fas fa-envelope mt-1 text-teal-500"></i>
                        <a href="mailto:info@smdmedicare.com" className="hover:text-teal-400 transition-colors">info@smdmedicare.com</a>
                    </p>
                    <p className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed">
                        <i className="fas fa-map-marker-alt mt-1 text-teal-500"></i>
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
