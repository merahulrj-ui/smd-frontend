import Link from 'next/link';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact Us | SMD MEDICARE',
  description: 'Contact SMD Medicare for inquiries about hospital equipment, reagents, and medical supplies.',
  openGraph: {
    title: 'Contact Us | SMD MEDICARE',
    description: 'Contact SMD Medicare for inquiries about hospital equipment, reagents, and medical supplies.',
    url: 'https://smdmedicare.in/contact',
  },
  alternates: {
    canonical: 'https://smdmedicare.in/contact',
  }
};

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-[76px]">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap custom-scrollbar pb-2">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="mx-2 text-slate-300">»</span>
            <span className="text-slate-900 font-semibold">Contact Us</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white mb-12 border-y border-slate-200">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-blue-50 opacity-70"></div>
          {/* Decorative blur blobs */}
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[150%] bg-teal-200/40 blur-3xl rounded-full mix-blend-multiply"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[30%] h-[150%] bg-blue-200/40 blur-3xl rounded-full mix-blend-multiply"></div>
          
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Touch</span></h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                  We are here to support you with your diagnostic and medical supply needs. Reach out to our dedicated team today.
              </p>
          </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
              {/* Left details card */}
              <div className="flex-1 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-500 to-blue-600"></div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <i className="fas fa-headset text-xl"></i>
                    </div>
                    Contact Information
                  </h2>
                  
                  <div className="space-y-6">
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                              <i className="fas fa-map-marker-alt text-lg"></i>
                          </div>
                          <div>
                              <strong className="block text-slate-900 text-sm tracking-wide uppercase mb-1">Address</strong>
                              <span className="text-slate-600 font-medium leading-relaxed block">
                                  Shakumbari Vihar, Phase 2, Ganeshpur,<br/>
                                  Roorkee, Haridwar — 247667,<br/>
                                  Uttarakhand, India
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
                                  +91-95554 22455
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
                              <span className="text-slate-600 font-medium leading-relaxed block">
                                  Monday — Saturday: 9:00 AM — 6:00 PM<br/>
                                  <span className="text-rose-500 text-sm font-semibold mt-1 inline-block bg-rose-50 px-2 py-0.5 rounded">Closed on Sundays</span>
                              </span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Right form */}
              <div className="flex-[1.2] bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <i className="fas fa-paper-plane text-lg"></i>
                      </div>
                      Send an Enquiry
                  </h2>
                  <div className="bg-white rounded-xl">
                      <ContactForm />
                  </div>
              </div>
          </div>

          {/* Map iframe container */}
          <div className="h-[450px] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative group">
              <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors pointer-events-none"></div>
              <iframe 
                  src="https://maps.google.com/maps?q=Shakumbari%20Vihar%2C%20Phase%202%2C%20Ganeshpur%2C%20Roorkee%2C%20Haridwar&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  allowFullScreen={false} 
                  loading="lazy" 
                  className="w-full h-full border-none grayscale-[0.2] contrast-[1.05]"
                  title="SMD Medicare Location Map">
              </iframe>
          </div>
      </div>
    </div>
  );
}
