import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | SMD MEDICARE',
  description: 'Terms of service, wholesale procurement conditions, warranty, and dispatch policies of SMD Medicare.',
  alternates: {
    canonical: 'https://www.smdmedicare.in/terms',
  }
};

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen pt-[76px] pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-12 md:py-16 text-white text-center px-4">
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
            <i className="fas fa-file-contract text-teal-400"></i> Legal & Procurement
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-blue-100/90 text-sm md:text-base max-w-2xl mx-auto">
            Review the wholesale procurement conditions, warranty terms, and institutional supply guidelines of SMD MEDICARE.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="text-slate-300">»</span>
          <span className="text-slate-800 font-semibold">Terms of Service</span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-12 space-y-8 text-slate-700 leading-relaxed text-sm md:text-base">
          
          <div>
            <p className="text-xs text-slate-500 mb-4 font-semibold uppercase tracking-wider">Effective Date: January 2026</p>
            <p>
              Welcome to <strong>SMD MEDICARE</strong> (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;). By accessing <strong>https://www.smdmedicare.in</strong> or purchasing medical equipment, diagnostic kits, or hospital supplies from us, you agree to comply with and be bound by the following Terms of Service.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fas fa-handshake text-blue-600"></i> 1. Commercial Quotations & Orders
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>All product prices displayed on the website are institutional wholesale benchmarks and are subject to official GST invoice billing.</li>
              <li>Official formal quotations provided via email or WhatsApp remain valid for 15 days from issuance unless specified otherwise.</li>
              <li>Purchase orders submitted by hospitals, diagnostic labs, government agencies, and clinical dealers are confirmed upon payment receipt or agreed credit terms.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fas fa-truck-moving text-blue-600"></i> 2. Pan-India Dispatch & Transit Insurance
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>In-stock orders are processed and dispatched within 24 to 48 business hours from our Roorkee fulfillment facility.</li>
              <li>Heavy hospital furniture and critical devices (OT tables, anesthesia machines, ICU beds) are shipped in custom heavy-duty wooden crate packaging with transit insurance.</li>
              <li>Estimated delivery timelines across India range between 3 to 7 business days depending on destination PIN code.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fas fa-certificate text-blue-600"></i> 3. Quality Standards & Warranty
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>All biomedical equipment, diagnostic analyzers, and surgical instruments meet applicable ISO, CE, and Indian regulatory benchmarks.</li>
              <li>Equipment items are backed by standard 1 to 2 Years Manufacturer Warranty covering manufacturing defects and technical component support.</li>
              <li>Consumable items (diagnostic test kits, electrodes, thermal paper rolls) are supplied with minimum 12 to 24 months shelf-life guarantee.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fas fa-ban text-red-600"></i> 4. Strict No Return Policy &amp; Warranty Claim Process
            </h2>
            <div className="bg-red-50/80 border-l-4 border-red-500 p-4 rounded-r-xl mb-4 text-sm text-red-950">
              <strong>Important Policy Notice:</strong> All sales made through SMD MEDICARE are final. We maintain a strict <strong>NO RETURN &amp; NO REFUND POLICY</strong> for all medical equipment, surgical instruments, diagnostic kits, and hospital supplies.
            </div>
            <p className="mb-3 text-sm md:text-base">
              Due to medical device sterility, patient safety mandates, clinical hygiene protocols, and wholesale B2B pricing models:
            </p>
            <ul className="list-disc pl-6 space-y-2.5 text-slate-600 text-sm md:text-base">
              <li><strong>No Returns / No Cancellations:</strong> Once an order is confirmed, packed, or dispatched, returns or cancellations are strictly not accepted.</li>
              <li><strong>Reporting Transit Damage / Defect:</strong> In the event of physical transit damage or manufacturing defect observed upon delivery, the buyer must notify us within <strong>48 hours</strong> of delivery with clear unboxing images/videos and invoice details at <code>info@smdmedicare.in</code> or WhatsApp <code>+91 95554 22455</code>.</li>
              <li><strong>Manufacturer Evaluation &amp; Decision:</strong> SMD MEDICARE acts as the authorized distribution partner. Upon receiving your claim, we will forward all photos, videos, and technical reports directly to the respective <strong>OEM Manufacturer / Brand</strong>. The manufacturer&apos;s technical inspection team will evaluate the claim and determine the appropriate resolution (such as component replacement, repair, or service) strictly under their official warranty terms.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fas fa-gavel text-blue-600"></i> 5. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms of Service and any commercial transactions shall be governed by and construed in accordance with the laws of India. Any legal proceedings or disputes arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in <strong>Roorkee / Haridwar, Uttarakhand</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fas fa-headset text-blue-600"></i> 6. Support & Inquiries
            </h2>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm space-y-1.5">
              <p><strong>SMD MEDICARE Customer & Legal Support</strong></p>
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
