import Link from 'next/link';

export const metadata = {
  title: 'About Us - SMD MEDICARE',
  description: 'Learn about SMD Medicare\'s decade-long journey in diagnostic excellence, our mission, vision, and the team dedicated to providing quality healthcare solutions in India.'
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
            <i className="fas fa-chevron-right text-[0.6rem]"></i>
            <span className="text-slate-800">About Us</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white mb-16 border-y border-slate-200">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-blue-50 opacity-70"></div>
          {/* Decorative blur blobs */}
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[150%] bg-teal-200/40 blur-3xl rounded-full mix-blend-multiply"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[30%] h-[150%] bg-blue-200/40 blur-3xl rounded-full mix-blend-multiply"></div>
          
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">SMD Medicare</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium">
                  A Decade of Innovation, Reliability, and Diagnostic Excellence in India.
              </p>
          </div>
      </section>

      {/* Company intro */}
      <section className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 inline-block pb-3 border-b-4 border-teal-500">Our Story</h2>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            At SMD Medicare, we believe that access to quality healthcare should not be a privilege, but a right. Established with a vision to revolutionize the way medical products and services reach people, SMD Medicare has grown into a trusted name in the healthcare and medical distribution industry. Headquartered in India, we are committed to making world-class healthcare solutions affordable, reliable, and accessible to hospitals, clinics, medical professionals, and individual customers alike.
          </p>
      </section>

      {/* Mission & Vision blocks */}
      <section className="bg-white border-y border-slate-200 py-20 mb-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Mission, Vision & Core Values</h2>
                  <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-slate-50 p-10 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-xl transition-all duration-300 group text-center">
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-4xl text-teal-600 group-hover:scale-110 transition-transform">🎯</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">Our Mission</h3>
                      <p className="text-slate-600 leading-relaxed font-medium">To make quality healthcare products accessible, affordable, and trustworthy for everyone.</p>
                  </div>
                  <div className="bg-slate-50 p-10 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 group text-center">
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-4xl text-blue-600 group-hover:scale-110 transition-transform">👁️‍🗨️</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">Our Vision</h3>
                      <p className="text-slate-600 leading-relaxed font-medium">To become a leading healthcare solutions provider in India and beyond, known for our integrity and innovation.</p>
                  </div>
                  <div className="bg-slate-50 p-10 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 group text-center">
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-4xl text-indigo-600 group-hover:scale-110 transition-transform">💎</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">Core Values</h3>
                      <p className="text-slate-600 leading-relaxed font-medium">Our work is guided by integrity, customer-centricity, quality, affordability, and collaboration.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* What We Do */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">What We Do – Products & Services</h2>
              <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 relative z-10">Recombinant Antigen</h3>
                  <p className="text-slate-600 text-sm leading-relaxed relative z-10">Providing high-quality antigens for various diagnostic kits and research purposes.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 relative z-10">Surgical Instruments</h3>
                  <p className="text-slate-600 text-sm leading-relaxed relative z-10">A comprehensive range of precision-engineered instruments for all surgical needs.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 relative z-10">Diagnostics</h3>
                  <p className="text-slate-600 text-sm leading-relaxed relative z-10">Reliable and accurate diagnostic kits and equipment for labs and clinics.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 relative z-10">Consumables</h3>
                  <p className="text-slate-600 text-sm leading-relaxed relative z-10">A wide variety of medical consumables to support daily healthcare operations.</p>
              </div>
          </div>
      </section>

      {/* Leadership section */}
      <section className="bg-slate-900 text-white py-20 mb-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold mb-4">Our Team & Leadership</h2>
                  <p className="text-slate-400 font-medium max-w-2xl mx-auto">Behind every fulfilled order is a team that believes in diagnostic excellence.</p>
                  <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full mt-6"></div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 max-w-[800px] mx-auto p-10 md:p-14 rounded-3xl text-center shadow-2xl">
                  <div className="relative inline-block mb-6">
                      <img src="https://ui-avatars.com/api/?name=Rahul+Kumar&background=0D9488&color=fff&size=200&font-size=0.35&bold=true" alt="Rahul Kumar, Founder" className="w-40 h-40 rounded-full object-cover border-4 border-slate-700 shadow-xl" />
                      <div className="absolute -bottom-3 -right-3 bg-teal-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-800">
                          <i className="fas fa-quote-right text-white text-sm"></i>
                      </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">Rahul Kumar</h3>
                  <p className="text-teal-400 font-semibold mb-6 tracking-wider uppercase text-sm">Founder & CEO</p>
                  
                  <p className="text-slate-300 leading-relaxed text-lg italic mb-8 max-w-2xl mx-auto">"Rahul Kumar sets the strategic direction, champions customer obsession, and drives brand trust. His founding vision was simple and bold—build a healthcare supply ecosystem where quality and affordability meet, at scale."</p>
                  
                  <a href="https://linkedin.com/in/merahulrj" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0077b5] text-white hover:bg-[#005e93] hover:scale-110 transition-all shadow-lg">
                      <i className="fab fa-linkedin-in text-xl"></i>
                  </a>
              </div>
          </div>
      </section>

      {/* Who We Serve Section */}
      <section className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-slate-200">
          <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4 inline-block pb-3 border-b-4 border-teal-500">Who We Serve</h2>
              <p className="text-slate-600 font-medium max-w-2xl mx-auto mt-4">SMD Medicare is exclusively a business-to-business (B2B) platform. To maintain regulatory compliance, we supply only to verified entities.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                      <i className="fas fa-hospital"></i>
                  </div>
                  <div className="text-sm text-slate-700">Wholesalers, Retailers, and Hospitals with a valid <strong className="text-slate-900">Drug License</strong></div>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <i className="fas fa-user-md"></i>
                  </div>
                  <div className="text-sm text-slate-700">Doctors with a valid <strong className="text-slate-900">MCI Registration</strong></div>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <i className="fas fa-tooth"></i>
                  </div>
                  <div className="text-sm text-slate-700">Dentists with a valid <strong className="text-slate-900">DCI Registration</strong></div>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <i className="fas fa-paw"></i>
                  </div>
                  <div className="text-sm text-slate-700">Veterinarians with a valid <strong className="text-slate-900">VCI Registration</strong></div>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100 md:col-span-2">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <i className="fas fa-microscope"></i>
                  </div>
                  <div className="text-sm text-slate-700">Laboratories and Diagnostic Centers</div>
              </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
              <i className="fas fa-info-circle text-amber-500 text-xl mt-0.5"></i>
              <p className="text-amber-800 text-sm font-medium leading-relaxed">
                  A valid license or registration proof is mandatory to create an account and place orders. This is a crucial part of our commitment to safety and professional healthcare standards.
              </p>
          </div>
      </section>
    </div>
  );
}
