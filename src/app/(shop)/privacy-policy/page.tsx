import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | SMD MEDICARE',
  description: 'Learn how SMD Medicare collects, uses, and safeguards your hospital procurement and customer data.',
  alternates: {
    canonical: 'https://www.smdmedicare.in/privacy-policy',
  }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen pt-[76px] pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-12 md:py-16 text-white text-center px-4">
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
            <i className="fas fa-shield-alt text-teal-400"></i> Legal & Compliance
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-blue-100/90 text-sm md:text-base max-w-2xl mx-auto">
            Your trust is our priority. Discover how SMD MEDICARE protects and manages your institutional and personal information.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="text-slate-300">»</span>
          <span className="text-slate-800 font-semibold">Privacy Policy</span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-12 space-y-8 text-slate-700 leading-relaxed text-sm md:text-base">
          
          <div>
            <p className="text-xs text-slate-500 mb-4 font-semibold uppercase tracking-wider">Last Updated: January 2026</p>
            <p>
              At <strong>SMD MEDICARE</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), accessible via <strong>https://www.smdmedicare.in</strong>, we are committed to protecting the privacy, confidentiality, and security of our customers, healthcare institutions, doctors, and wholesale buyers.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fas fa-user-shield text-blue-600"></i> 1. Information We Collect
            </h2>
            <p className="mb-3">When you visit our platform, submit quotation inquiries, or place institutional orders, we may collect the following details:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Contact Information:</strong> Full name, hospital/clinic name, GST number, email address, phone/WhatsApp number.</li>
              <li><strong>Delivery & Billing Details:</strong> Clinic/hospital shipping address, billing address, PIN code, state.</li>
              <li><strong>Procurement Details:</strong> Medical equipment inquiries, requested quantity, custom technical specifications.</li>
              <li><strong>Technical Data:</strong> IP address, device type, browser information, and referral URLs via standard secure server logs.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fas fa-tasks text-blue-600"></i> 2. How We Use Your Information
            </h2>
            <p className="mb-3">We utilize your information strictly for legitimate commercial and healthcare procurement purposes, including:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Providing customized B2B price quotations, GST proforma invoices, and equipment catalogues.</li>
              <li>Processing, packing, and dispatching medical supplies and hospital furniture via insured courier partners.</li>
              <li>Providing technical installation support, warranty assistance, and post-purchase service.</li>
              <li>Complying with statutory medical device trade regulations, taxation (GST), and auditing mandates in India.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fas fa-lock text-blue-600"></i> 3. Data Protection & Security
            </h2>
            <p>
              We implement industry-standard SSL (TLS 1.3) 256-bit encryption for all data transmissions. We do not sell, rent, or trade your institutional or personal information to third-party advertisers. Information is only shared with authorized logistics handlers and payment gateway providers solely to fulfill your orders.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fas fa-cookie-bite text-blue-600"></i> 4. Cookies & Analytics
            </h2>
            <p>
              Our website uses basic session cookies and Google Analytics to understand navigation flow, optimize page load performance, and ensure smooth catalog browsing. You may disable cookies through your browser settings at any time without restricting core website access.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fas fa-envelope-open-text text-blue-600"></i> 5. Contact Information
            </h2>
            <p className="mb-3">If you have any questions or data requests regarding this Privacy Policy, please contact our Compliance Office:</p>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm space-y-1.5">
              <p><strong>SMD MEDICARE</strong></p>
              <p><strong>Address:</strong> Shakumbari Vihar, Phase 2, behind Nambardar Farmhouse, Ganeshpur, Roorkee, Uttarakhand 247667</p>
              <p><strong>Email:</strong> <a href="mailto:info@smdmedicare.in" className="text-blue-600 hover:underline">info@smdmedicare.in</a></p>
              <p><strong>Phone:</strong> <a href="tel:+919555422455" className="text-blue-600 hover:underline">+91 95554 22455</a></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
