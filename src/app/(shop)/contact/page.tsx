import Link from 'next/link';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact Us | SMD MEDICARE - Wholesale Medical Supplies Inquiry',
  description: 'Get in touch with SMD Medicare for wholesale inquiries on medical equipment, hospital furniture, diagnostic reagents, and bulk dealer supplies in India.',
  openGraph: {
    title: 'Contact Us | SMD MEDICARE - Wholesale Medical Supplies Inquiry',
    description: 'Get in touch with SMD Medicare for wholesale inquiries on medical equipment, hospital furniture, diagnostic reagents, and bulk dealer supplies in India.',
    url: 'https://www.smdmedicare.in/contact',
    siteName: 'SMD MEDICARE',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | SMD MEDICARE - Wholesale Medical Supplies Inquiry',
    description: 'Get in touch with SMD Medicare for wholesale inquiries on medical equipment, hospital furniture, diagnostic reagents, and bulk dealer supplies in India.',
  },
  alternates: {
    canonical: 'https://www.smdmedicare.in/contact',
  }
};

export default function ContactPage() {
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
        name: 'Contact Us',
        item: 'https://www.smdmedicare.in/contact',
      },
    ],
  };

  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact SMD MEDICARE',
    description: 'Wholesale medical equipment, hospital furniture, and diagnostic kit inquiries.',
    url: 'https://www.smdmedicare.in/contact',
    mainEntity: {
      '@type': 'MedicalBusiness',
      name: 'SMD MEDICARE',
      alternateName: ['SMD Medicare', 'SMD MEDICARE INDIA'],
      url: 'https://www.smdmedicare.in/',
      logo: 'https://www.smdmedicare.in/icon-512.png',
      image: 'https://www.smdmedicare.in/icon-512.png',
      telephone: '+91-9555422455',
      email: 'info@smdmedicare.in',
      priceRange: '₹₹ - ₹₹₹₹',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Shakumbari Vihar, Phase 2, Ganeshpur',
        addressLocality: 'Roorkee',
        addressRegion: 'Uttarakhand',
        postalCode: '247667',
        addressCountry: 'IN'
      },
      areaServed: [
        { '@type': 'Country', name: 'Worldwide' },
        { '@type': 'Country', name: 'India' },
        { '@type': 'City', name: 'Delhi NCR' },
        { '@type': 'City', name: 'Mumbai' },
        { '@type': 'City', name: 'Pune' },
        { '@type': 'City', name: 'Bengaluru' },
        { '@type': 'City', name: 'Hyderabad' },
        { '@type': 'City', name: 'Chennai' },
        { '@type': 'City', name: 'Kolkata' },
        { '@type': 'City', name: 'Ahmedabad' },
        { '@type': 'City', name: 'Dehradun' },
        { '@type': 'City', name: 'Lucknow' },
        { '@type': 'City', name: 'Chandigarh' }
      ],
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 29.8543,
        longitude: 77.8880
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '19:00'
        }
      ],
      sameAs: [
        'https://g.page/r/CXI_hn0yUh7JEAI',
        'https://www.indiamart.com/smd-medicare-roorkee/',
        'https://facebook.com/smdmedicare',
        'https://linkedin.com/company/smdmedicare',
        'https://www.instagram.com/smd_medicare',
        'https://x.com/smd_medicare'
      ]
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-[76px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap custom-scrollbar pb-2">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="mx-2 text-slate-300">»</span>
            <span className="text-slate-900 font-semibold">Contact Us</span>
        </div>
      </div>

      {/* Premium Dark Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-16 lg:py-20 mb-12 border-y border-slate-800">
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[100%] rounded-full bg-gradient-to-br from-teal-500/20 to-blue-600/20 blur-[100px]"></div>
            <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[80%] rounded-full bg-gradient-to-tl from-indigo-500/20 to-purple-600/20 blur-[120px]"></div>
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block py-1.5 px-4 rounded-full bg-teal-500/10 text-teal-400 font-semibold text-sm mb-4 border border-teal-500/20">
              <i className="fas fa-headset mr-2"></i> 24/7 SUPPORT
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Get In Touch
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto font-medium">
              We are here to support you with your diagnostic and medical supply needs. Reach out to our dedicated team today.
            </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
              {/* Left details card */}
              <div className="flex-1 flex flex-col bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-500 to-blue-600"></div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <i className="fas fa-headset text-xl"></i>
                    </div>
                    Contact Information
                  </h2>
                  
                  <div className="space-y-6 flex-grow flex flex-col">
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                              <i className="fas fa-map-marker-alt text-lg"></i>
                          </div>
                          <div>
                              <strong className="block text-slate-900 text-sm tracking-wide uppercase mb-1">Official Address</strong>
                              <span className="text-slate-600 font-medium leading-relaxed block text-[15px]">
                                  Shakumbari Vihar Phase 2, behind Nambardar Farmhouse, Ganeshpur, Rajendra Nagar, Roorkee, Uttarakhand 247667
                              </span>
                          </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                          <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-1">
                              <i className="fas fa-phone-alt text-lg"></i>
                          </div>
                          <div>
                              <strong className="block text-slate-900 text-sm tracking-wide uppercase mb-1">Phone / WhatsApp</strong>
                              <a href="tel:+919555422455" className="text-teal-600 font-bold hover:text-teal-700 transition-colors text-lg">
                                  095554 22455
                              </a>
                          </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-1">
                              <i className="fas fa-envelope text-lg"></i>
                          </div>
                          <div>
                              <strong className="block text-slate-900 text-sm tracking-wide uppercase mb-1">Email ID</strong>
                              <a href="mailto:info@smdmedicare.in" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors text-lg">
                                  info@smdmedicare.in
                              </a>
                          </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-1">
                              <i className="fas fa-clock text-lg"></i>
                          </div>
                          <div>
                              <strong className="block text-slate-900 text-sm tracking-wide uppercase mb-1">Working Hours</strong>
                              <span className="text-slate-600 font-medium leading-relaxed block text-sm">
                                  Monday — Saturday: 10:00 AM — 7:00 PM<br/>
                                  <span className="text-rose-500 text-xs font-semibold mt-1 inline-block bg-rose-50 px-2 py-0.5 rounded">Closed on Sundays</span>
                              </span>
                          </div>
                      </div>

                      {/* SEO Keyword Filler Block */}
                      <div className="pt-4 border-t border-slate-100 mt-2">
                          <strong className="block text-slate-900 text-sm tracking-wide uppercase mb-3 text-center md:text-left">Core Supply Expertise</strong>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600 font-medium">
                              <p className="flex items-center gap-2"><i className="fas fa-check-circle text-teal-500 text-xs"></i> Hospital Furniture</p>
                              <p className="flex items-center gap-2"><i className="fas fa-check-circle text-teal-500 text-xs"></i> X-Ray & Imaging</p>
                              <p className="flex items-center gap-2"><i className="fas fa-check-circle text-teal-500 text-xs"></i> Surgical Instruments</p>
                              <p className="flex items-center gap-2"><i className="fas fa-check-circle text-teal-500 text-xs"></i> Clinical Diagnostics</p>
                          </div>
                      </div>

                      {/* Quick Route & Review Buttons */}
                      <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3">
                        <a 
                          href="https://www.google.com/maps/dir/?api=1&destination=SMD+MEDICARE+Shakumbari+Vihar+Phase+2+behind+Nambardar+Farmhouse+Ganeshpur+Rajendra+Nagar+Roorkee+Uttarakhand+247667" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm text-center transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                          <i className="fas fa-directions text-base"></i> Get Route / Directions
                        </a>
                        <a 
                          href="https://g.page/r/CXI_hn0yUh7JEAI/review" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl font-bold text-sm text-center transition-all border border-amber-200 shadow-sm flex items-center justify-center gap-2"
                        >
                          <i className="fas fa-star text-amber-500 text-base"></i> Write a Google Review
                        </a>
                      </div>
                  </div>
              </div>

              {/* Right form */}
              <div className="flex-[1.2] flex flex-col bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <i className="fas fa-paper-plane text-lg"></i>
                      </div>
                      Send an Enquiry
                  </h2>
                  <p className="text-sm text-slate-500 mb-6 font-medium">
                      ⏱️ Get a detailed bulk quotation from our procurement experts within <strong className="text-slate-700">2-4 business hours</strong>.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-slate-100">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                          <i className="fas fa-certificate"></i> ISO Certified Quality
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                          <i className="fas fa-shield-alt"></i> 100% Genuine Products
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                          <i className="fas fa-truck-fast"></i> Pan-India Logistics
                      </span>
                  </div>

                  <div className="bg-white rounded-xl flex-grow flex flex-col">
                      <ContactForm />
                  </div>
              </div>
          </div>

          {/* Areas We Serve - Local SEO Booster */}
          <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10 mb-12">
              <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      <i className="fas fa-globe-asia text-teal-600 mr-2"></i> Pan-India Wholesale Supply Network
                  </h3>
                  <p className="text-slate-600 font-medium max-w-3xl mx-auto">
                      SMD Medicare is a trusted supplier of medical equipment, hospital furniture, and surgical instruments across all major cities and healthcare hubs in India.
                  </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-slate-700 font-medium">
                  <div className="space-y-2">
                      <strong className="block text-slate-900 mb-3 pb-2 border-b border-slate-100">North India</strong>
                      <p className="hover:text-blue-600 transition-colors cursor-default"><i className="fas fa-check text-teal-500 mr-2 text-xs"></i> Delhi NCR</p>
                      <p className="hover:text-blue-600 transition-colors cursor-default"><i className="fas fa-check text-teal-500 mr-2 text-xs"></i> Dehradun, Uttarakhand</p>
                      <p className="hover:text-blue-600 transition-colors cursor-default"><i className="fas fa-check text-teal-500 mr-2 text-xs"></i> Lucknow, UP</p>
                      <p className="hover:text-blue-600 transition-colors cursor-default"><i className="fas fa-check text-teal-500 mr-2 text-xs"></i> Chandigarh & Punjab</p>
                  </div>
                  <div className="space-y-2">
                      <strong className="block text-slate-900 mb-3 pb-2 border-b border-slate-100">West & Central India</strong>
                      <p className="hover:text-blue-600 transition-colors cursor-default"><i className="fas fa-check text-teal-500 mr-2 text-xs"></i> Mumbai, Maharashtra</p>
                      <p className="hover:text-blue-600 transition-colors cursor-default"><i className="fas fa-check text-teal-500 mr-2 text-xs"></i> Pune & Nagpur</p>
                      <p className="hover:text-blue-600 transition-colors cursor-default"><i className="fas fa-check text-teal-500 mr-2 text-xs"></i> Ahmedabad, Gujarat</p>
                      <p className="hover:text-blue-600 transition-colors cursor-default"><i className="fas fa-check text-teal-500 mr-2 text-xs"></i> Bhopal & Indore, MP</p>
                  </div>
                  <div className="space-y-2">
                      <strong className="block text-slate-900 mb-3 pb-2 border-b border-slate-100">South India</strong>
                      <p className="hover:text-blue-600 transition-colors cursor-default"><i className="fas fa-check text-teal-500 mr-2 text-xs"></i> Bengaluru, Karnataka</p>
                      <p className="hover:text-blue-600 transition-colors cursor-default"><i className="fas fa-check text-teal-500 mr-2 text-xs"></i> Chennai, Tamil Nadu</p>
                      <p className="hover:text-blue-600 transition-colors cursor-default"><i className="fas fa-check text-teal-500 mr-2 text-xs"></i> Hyderabad, Telangana</p>
                      <p className="hover:text-blue-600 transition-colors cursor-default"><i className="fas fa-check text-teal-500 mr-2 text-xs"></i> Kochi, Kerala</p>
                  </div>
                  <div className="space-y-2">
                      <strong className="block text-slate-900 mb-3 pb-2 border-b border-slate-100">East & North East</strong>
                      <p className="hover:text-blue-600 transition-colors cursor-default"><i className="fas fa-check text-teal-500 mr-2 text-xs"></i> Kolkata, West Bengal</p>
                      <p className="hover:text-blue-600 transition-colors cursor-default"><i className="fas fa-check text-teal-500 mr-2 text-xs"></i> Patna, Bihar</p>
                      <p className="hover:text-blue-600 transition-colors cursor-default"><i className="fas fa-check text-teal-500 mr-2 text-xs"></i> Bhubaneswar, Odisha</p>
                      <p className="hover:text-blue-600 transition-colors cursor-default"><i className="fas fa-check text-teal-500 mr-2 text-xs"></i> Guwahati, Assam</p>
                  </div>
              </div>
          </div>

          {/* Map iframe container with exact SMD MEDICARE Pin */}
          <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white p-2">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <i className="fas fa-map-marked-alt text-blue-600 text-lg"></i>
                  <span className="font-bold text-slate-800 text-sm">SMD MEDICARE — Live Google Maps Location &amp; Route</span>
                </div>
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=SMD+MEDICARE+Shakumbari+Vihar+Phase+2+behind+Nambardar+Farmhouse+Ganeshpur+Rajendra+Nagar+Roorkee+Uttarakhand+247667" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  Open in Google Maps <i className="fas fa-external-link-alt text-[10px]"></i>
                </a>
              </div>
              <div className="h-[420px] w-full rounded-xl overflow-hidden">
                <iframe 
                    src="https://maps.google.com/maps?q=SMD%20MEDICARE%2C%20Shakumbari%20Vihar%20Phase%202%2C%20behind%20Nambardar%20Farmhouse%2C%20Ganeshpur%2C%20Rajendra%20Nagar%2C%20Roorkee%2C%20Uttarakhand%20247667&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                    allowFullScreen={false} 
                    loading="lazy" 
                    className="w-full h-full border-none"
                    title="SMD MEDICARE Official Location Map">
                </iframe>
              </div>
          </div>
      </div>
    </div>
  );
}
