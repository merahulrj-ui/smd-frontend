"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUI } from '@/context/UIContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ProductCard from '@/components/ProductCard';
import { useTypewriterPlaceholder } from '@/hooks/useTypewriterPlaceholder';
import { useOTPAuth } from '@/hooks/useOTPAuth';
import OTPVerificationFlow from '@/components/OTPVerificationFlow';

export default function GlobalModals() {
  const router = useRouter();
  const typewriterPlaceholder = useTypewriterPlaceholder();
  const { user, isVerified } = useOTPAuth();
  const { 
    isSearchOpen, setSearchOpen, 
    isSellerModalOpen, setSellerModalOpen,
    inquiryState, closeInquiryModal,
    isQuoteModalOpen, setQuoteModalOpen,
    catalog, clearCatalog, removeFromCatalog
  } = useUI();

  // Local state for forms
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [sellerSuccess, setSellerSuccess] = useState(false);
  const [isSubmittingSeller, setIsSubmittingSeller] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Controlled inputs for OTP syncing
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');

  useEffect(() => {
    if (user) {
      if (user.name) {
        setInquiryName(user.name);
        setSellerName(user.name);
      }
      if (user.email) {
        setInquiryEmail(user.email);
        setSellerEmail(user.email);
      }
      if (user.phone) {
        setInquiryPhone(user.phone);
        setSellerPhone(user.phone);
      }
    }
  }, [user]);
  
  // Default Search State (Zero State)
  const [defaultSearches, setDefaultSearches] = useState<string[]>([]);
  const [defaultProducts, setDefaultProducts] = useState<any[]>([]);
  const [defaultBrands, setDefaultBrands] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (isSearchOpen || isSellerModalOpen || isQuoteModalOpen || inquiryState.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSearchOpen, isSellerModalOpen, isQuoteModalOpen, inquiryState.isOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      // Load recent searches
      try {
        const stored = localStorage.getItem('smd_recent_searches');
        if (stored) setRecentSearches(JSON.parse(stored));
      } catch (e) {}

      if (defaultSearches.length === 0) {
        fetch('/api/search-defaults')
          .then(res => res.json())
          .then(data => {
            setDefaultSearches(data.topSearches || []);
            setDefaultBrands(data.brands || []);
            setDefaultProducts(data.topProducts || []);
          })
          .catch(err => console.error("Failed to load search defaults", err));
      }
    }
  }, [isSearchOpen]);

  const saveRecentSearch = (query: string) => {
    if (!query || query.length < 2) return;
    try {
      let searches = [...recentSearches];
      searches = searches.filter(s => s !== query);
      searches.unshift(query);
      if (searches.length > 5) searches = searches.slice(0, 5);
      setRecentSearches(searches);
      localStorage.setItem('smd_recent_searches', JSON.stringify(searches));
    } catch (e) {}
  };

  const executeSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      saveRecentSearch(query);
    }
    handleSearchChange({ target: { value: query } } as any);
  };

  const submitSearch = (query: string) => {
    if (query.length >= 2) {
      saveRecentSearch(query);
      router.push(`/search/${encodeURIComponent(query)}`);
      setSearchOpen(false);
    }
  };

  const handleGlobalInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingInquiry(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setInquirySuccess(true);
        setTimeout(() => {
            closeInquiryModal();
            setInquirySuccess(false);
        }, 3000);
      } else {
        alert('Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  const handleSellerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingSeller(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const res = await fetch('/api/seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSellerSuccess(true);
        setTimeout(() => {
            setSellerModalOpen(false);
            setSellerSuccess(false);
        }, 3000);
      } else {
        alert('Failed to submit seller request. Please try again.');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmittingSeller(false);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (catalog.length === 0) {
      alert('Please add products to your catalog first.');
      return;
    }
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Add product list to inquiry
    data.message = `Quotation Request for ${catalog.length} items:\n` + catalog.map(p => `- ${p.name}`).join('\n');
    data.inquiry_type = 'Quotation';
    data.product_name = 'Multiple Products';
    
    try {
      await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      alert('Quotation Request Submitted!');
      clearCatalog();
      setQuoteModalOpen(false);
    } catch(err) {
      alert('Error submitting quotation');
    }
  };

  const handleGeneratePDF = () => {
    if (catalog.length === 0) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('SMD Medicare - Product Catalog', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    const tableColumn = ["Product Name", "Category", "MRP", "Price"];
    const tableRows = catalog.map(p => [
      p.name, 
      p.category || 'N/A', 
      p.mrp ? `Rs. ${p.mrp}` : '-', 
      p.price ? `Rs. ${p.price}` : 'On Request'
    ]);
    
    (doc as any).autoTable({
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [15, 23, 42] }
    });
    
    doc.save('SMD_Medicare_Catalog.pdf');
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      {/* Search Overlay */}
      <div 
        id="searchOverlay" 
        onClick={() => setSearchOpen(false)}
        className={`fixed inset-0 bg-slate-900/50 z-[10000] flex items-start justify-center md:pt-24 transition-opacity duration-300 ${isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`w-full h-full md:h-auto md:max-w-[900px] md:mx-4 transition-all duration-300 transform flex flex-col ${isSearchOpen ? 'translate-y-0 scale-100' : '-translate-y-10 scale-95'}`}
          >
              <div className="bg-white md:rounded-3xl shadow-2xl overflow-hidden relative md:border md:border-slate-200 flex flex-col flex-1 h-full md:h-auto">
                  
                  {/* Header with Search Input */}
                  <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-20 flex items-center gap-3 shrink-0">
                      <button onClick={() => setSearchOpen(false)} aria-label="Close Search" className="text-slate-500 hover:text-slate-800 p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
                          <i className="fas fa-arrow-left text-lg"></i>
                      </button>
                      
                      <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all shadow-inner">
                          <input 
                              type="text" 
                              id="liveSearchInput"
                              value={searchQuery}
                              onChange={handleSearchChange}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  submitSearch(searchQuery);
                                }
                              }}
                              placeholder={typewriterPlaceholder || "Search..."} 
                              className="bg-transparent border-none outline-none w-full text-slate-700 text-[15px] placeholder-slate-400 font-medium"
                              autoFocus
                          />
                          {searchQuery && (
                            <button onClick={() => {setSearchQuery(''); setSearchResults([]);}} aria-label="Clear Search" className="text-slate-400 hover:text-slate-600 mr-2">
                                <i className="fas fa-times-circle"></i>
                            </button>
                          )}
                          <button onClick={() => submitSearch(searchQuery)} aria-label="Submit Search" className="text-slate-600 ml-1 font-bold text-lg cursor-pointer hover:text-blue-600 transition-colors">
                              <i className="fas fa-search"></i>
                          </button>
                      </div>
                  </div>
                  
                  <div className="p-4 md:p-8 flex-1 overflow-y-auto md:max-h-[70vh] custom-scrollbar bg-white">
                      {searchQuery.length < 2 ? (
                          <div className="animate-fade-in">
                              {/* Zero State UI */}
                              
                              {recentSearches.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-bold text-slate-800">
                                            Recently Browsed
                                        </h4>
                                        <button 
                                          onClick={() => {
                                            setRecentSearches([]);
                                            localStorage.removeItem('smd_recent_searches');
                                          }}
                                          className="text-blue-600 font-bold text-sm hover:text-blue-700"
                                        >
                                          Clear
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((term: string, idx: number) => (
                                            <button 
                                                key={idx}
                                                onClick={() => executeSearch(term)}
                                                className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors bg-white flex items-center gap-2"
                                            >
                                                <i className="fas fa-history text-slate-400"></i> {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                              )}

                              {defaultSearches.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="flex items-center text-sm font-bold text-slate-800 mb-4">
                                        <i className="fas fa-chart-line text-blue-600 mr-2"></i> Top Searches
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {defaultSearches.map((term: string, idx: number) => (
                                            <button 
                                                key={idx}
                                                onClick={() => executeSearch(term)}
                                                className="px-4 py-1.5 rounded-full border border-blue-200 text-blue-500 text-sm hover:bg-blue-50 transition-colors bg-white"
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                              )}

                              {defaultProducts.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="text-sm font-bold text-slate-800 mb-4">Top Products</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {defaultProducts.map((p: any) => (
                                            <ProductCard 
                                              key={p.id}
                                              id={p.id}
                                              slug={p.slug || p.id}
                                              name={p.name}
                                              image={p.image}
                                              price={p.price}
                                              mrp={p.mrp}
                                              isNew={false}
                                            />
                                        ))}
                                    </div>
                                </div>
                              )}

                              {defaultBrands.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-4">Top Brands</h4>
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                        {defaultBrands.map((brand: any, idx: number) => (
                                            <div key={idx} className="border border-slate-200 rounded-xl h-16 flex items-center justify-center p-2 bg-white hover:border-blue-500 transition-colors">
                                                {brand.logo ? (
                                                  <img src={brand.logo} alt={brand.name} className="max-h-[30px] max-w-[80px] object-contain" />
                                                ) : (
                                                  <span className="text-xs font-bold text-slate-600 text-center">{brand.name}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                              )}
                          </div>
                      ) : isSearching ? (
                          <div className="flex items-center justify-center h-[300px]">
                              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                          </div>
                      ) : searchResults.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fade-in">
                              {searchResults.map((p: any) => (
                                  <ProductCard 
                                    key={p.id}
                                    id={p.id}
                                    slug={p.slug || p.id}
                                    name={p.name}
                                    image={p.image}
                                    price={p.price}
                                    mrp={p.mrp}
                                    isNew={false}
                                  />
                              ))}
                          </div>
                      ) : (
                          <div className="flex flex-col items-center justify-center h-[300px] text-slate-500 animate-fade-in">
                             <i className="fas fa-box-open text-5xl mb-4 text-slate-200"></i>
                             <p className="text-lg">No products found matching "{searchQuery}"</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>

      {/* Quote Details Modal */}
      <div 
        id="quoteModal" 
        onClick={() => setQuoteModalOpen(false)}
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10005] flex items-center justify-center p-4 transition-opacity duration-300 ${isQuoteModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300 transform flex flex-col ${isQuoteModalOpen ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'}`}
          >
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 flex items-center justify-between shrink-0">
                  <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Generate Quotation</h2>
                      <p className="text-blue-100 text-sm">Download a formal PDF quotation for your selected items.</p>
                  </div>
                  <button onClick={() => setQuoteModalOpen(false)} aria-label="Close" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                      <i className="fas fa-times text-xl"></i>
                  </button>
              </div>
              
              <div className="p-6 md:p-8">
                  <form onSubmit={handleQuoteSubmit} className="space-y-6">
                      <input type="hidden" name="product_ids" />
                      
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <i className="fas fa-file-pdf text-blue-600 text-lg"></i>
                          </div>
                          <div>
                              <h4 className="font-semibold text-slate-800">Ready to Generate</h4>
                              <p className="text-slate-600 text-sm mt-1">You have <span className="font-bold text-blue-700">{catalog.length}</span> items in your quotation cart. Click below to download the official PDF.</p>
                          </div>
                      </div>

                      <div className="flex gap-4 pt-2">
                          <button type="button" onClick={() => setQuoteModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition-colors">
                              Cancel
                          </button>
                          <button type="submit" className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-full shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                              <i className="fas fa-download"></i>
                              Download
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      </div>

      {/* Global Unified Inquiry / Pricing Modal */}
      <div 
        id="inquiryModal" 
        onClick={closeInquiryModal}
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10005] flex items-center justify-center p-4 transition-opacity duration-300 ${inquiryState.isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transition-all duration-300 transform flex flex-col max-h-[90vh] ${inquiryState.isOpen ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'}`}
          >
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 flex items-center justify-between shrink-0">
                  <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                          {inquiryState.type === 'Pricing Request' ? `Get Pricing for ${inquiryState.productName}` : `Inquire about ${inquiryState.productName}`}
                      </h2>
                      <p className="text-blue-100 text-sm">
                          {inquiryState.type === 'Pricing Request' ? "Provide your details to request an official wholesale pricing quote." : "Have questions about specifications or availability? Ask us below."}
                      </p>
                  </div>
                  <button onClick={closeInquiryModal} aria-label="Close" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                      <i className="fas fa-times text-xl"></i>
                  </button>
              </div>
              
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                {!inquirySuccess ? (
                    <form id="globalInquiryForm" onSubmit={handleGlobalInquirySubmit} className="space-y-5">
                        <input type="hidden" name="inquiry_type" value={inquiryState.type} />
                        <input type="hidden" name="product_name" value={inquiryState.productName} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Name*</label>
                                <input type="text" name="name" required value={inquiryName} onChange={e => setInquiryName(e.target.value)} placeholder="John Doe" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Official Email ID*</label>
                                <input type="email" name="email" required value={inquiryEmail} onChange={e => setInquiryEmail(e.target.value)} readOnly={isVerified} placeholder="john@example.com" className={`w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isVerified ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 focus:bg-white'}`} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Number*</label>
                                <input type="tel" name="phone" required value={inquiryPhone} onChange={e => setInquiryPhone(e.target.value)} readOnly={isVerified} placeholder="+91 98765 43210" className={`w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isVerified ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 focus:bg-white'}`} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company Name*</label>
                                <input type="text" name="company" required placeholder="MediTech Solutions" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Message / Requirements*</label>
                            <textarea name="message" rows={4} required placeholder="Enter details..." 
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            defaultValue={inquiryState.type === 'Pricing Request' ? `Hello, I would like to request wholesale pricing and packaging details for "${inquiryState.productName}".` : `Hello, I would like to get more information regarding the product "${inquiryState.productName}".`}></textarea>
                        </div>

                        {!isVerified ? (
                            <div className="pt-2 border-t border-slate-100 mt-4">
                                <OTPVerificationFlow 
                                    onVerified={() => {}} 
                                    title="Verify to Send Inquiry" 
                                    description="We need to verify your email before sending the inquiry to prevent spam." 
                                    compact={true} 
                                    prefilledData={{ name: inquiryName, phone: inquiryPhone, email: inquiryEmail }}
                                    hideInputs={true}
                                />
                            </div>
                        ) : (
                            <button type="submit" disabled={isSubmittingInquiry} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg py-3 rounded-full shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none">
                                {isSubmittingInquiry ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : "Submit Inquiry"}
                            </button>
                        )}
                    </form>
                ) : (
                    <div id="inquiry-success-message" className="text-center py-10">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-6">
                            <i className="fas fa-check text-4xl text-blue-600 animate-bounce"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-blue-700 mb-3">Inquiry Submitted!</h3>
                        <p className="text-slate-600">Thank you for your interest. Our team will contact you shortly regarding the pricing.</p>
                    </div>
                )}
              </div>
          </div>
      </div>

      {/* Become a Seller Modal */}
      <div 
        id="sell-modal" 
        onClick={() => setSellerModalOpen(false)}
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10005] flex items-center justify-center p-4 transition-opacity duration-300 ${isSellerModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transition-all duration-300 transform flex flex-col max-h-[90vh] ${isSellerModalOpen ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'}`}
          >
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 flex items-center justify-between shrink-0">
                  <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Become a Seller</h2>
                      <p className="text-blue-100 text-sm">Partner with India's leading diagnostic platform.</p>
                  </div>
                  <button onClick={() => setSellerModalOpen(false)} aria-label="Close" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                      <i className="fas fa-times text-xl"></i>
                  </button>
              </div>
              
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                  {!sellerSuccess ? (
                    <form id="seller-form" onSubmit={handleSellerSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company Name*</label>
                                <input type="text" name="company_name" required placeholder="E.g., SMD Medicare" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Official Email ID*</label>
                                <input type="email" name="email" required value={sellerEmail} onChange={e => setSellerEmail(e.target.value)} readOnly={isVerified} placeholder="partner@smd.com" className={`w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isVerified ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 focus:bg-white'}`} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Representative Name*</label>
                                <input type="text" name="rep_name" required value={sellerName} onChange={e => setSellerName(e.target.value)} placeholder="E.g., Rahul Singh" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Representative Designation*</label>
                                <input type="text" name="rep_designation" required placeholder="E.g., Director" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">GST Number*</label>
                                <input type="text" name="gst" required placeholder="GSTIN1234567890" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Number*</label>
                                <input type="tel" name="contact" required value={sellerPhone} onChange={e => setSellerPhone(e.target.value)} readOnly={isVerified} placeholder="+91 99999 88888" className={`w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isVerified ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 focus:bg-white'}`} />
                            </div>
                        </div>
                        
                        <div className="h-[120px] overflow-y-auto border border-slate-200 p-4 rounded-xl mt-6 bg-slate-50 text-slate-600 text-sm custom-scrollbar">
                            <h4 className="font-bold text-slate-800 mb-2">SMD Medicare: Our Business Policies</h4>
                            <h5 className="font-semibold text-slate-700 mt-3 mb-1">Your Responsibility to Provide Info</h5>
                            <p>To partner with us, you must provide complete and accurate KYC details for your business. Falsification of documents will result in immediate termination of the seller agreement.</p>
                        </div>

                        <div className="flex items-start gap-3 mt-4">
                            <input type="checkbox" id="agree-terms" name="agree_terms" required className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" />
                            <label htmlFor="agree-terms" className="text-sm text-slate-600 cursor-pointer">
                                I have read and agree to the <span className="font-semibold text-slate-700">SMD Medicare Business Policies</span>.
                            </label>
                        </div>

                        {!isVerified ? (
                            <div className="pt-2 border-t border-slate-100 mt-4">
                                <OTPVerificationFlow 
                                    onVerified={() => {}} 
                                    title="Verify to Submit Application" 
                                    description="Please verify your email to become a registered seller." 
                                    compact={true} 
                                    prefilledData={{ name: sellerName, phone: sellerPhone, email: sellerEmail }}
                                    hideInputs={true}
                                />
                            </div>
                        ) : (
                            <button type="submit" disabled={isSubmittingSeller} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg py-3 rounded-full shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none">
                                {isSubmittingSeller ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : "Submit Application"}
                            </button>
                        )}
                    </form>
                  ) : (
                    <div id="seller-success-message" className="text-center py-10 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-6">
                            <i className="fas fa-handshake text-4xl text-blue-600 animate-bounce"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-blue-700 mb-3">Seller Request Submitted!</h3>
                        <p className="text-slate-600">Thank you for your interest in partnering with SMD Medicare. Our onboarding team will contact you shortly.</p>
                    </div>
                  )}
              </div>
          </div>
      </div>

      {/* Global Floating Catalog & Quote Bar */}
      {catalog.length > 0 && (
        <div id="catalog-bar" className="fixed bottom-[30px] left-1/2 -translate-x-1/2 z-[10005] bg-white px-5 py-3 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.15)] border border-slate-200 flex items-center gap-3">
            <span className="font-semibold text-blue-600 text-base cursor-pointer whitespace-nowrap" title="Click to Manage">
              <i className="fas fa-shopping-cart"></i> {catalog.length} {catalog.length === 1 ? 'Item' : 'Items'} in Quote
            </span>
            <div className="w-[1px] h-[20px] bg-slate-200"></div>
            <button type="button" onClick={handleGeneratePDF} className="bg-blue-600 text-white border-none py-2 px-4 rounded-full font-semibold text-[0.88rem] cursor-pointer transition-colors hover:bg-blue-700">PDF Catalog</button>
            <button type="button" onClick={() => setQuoteModalOpen(true)} className="bg-slate-900 text-white border-none py-2 px-4 rounded-full font-semibold text-[0.88rem] cursor-pointer transition-colors hover:bg-slate-800">Get Quotation</button>
            <button type="button" onClick={clearCatalog} aria-label="Clear Cart" className="bg-transparent text-red-500 border-none text-[1.2rem] cursor-pointer px-1 hover:text-red-600 transition-colors">
                <i className="fas fa-trash-alt"></i>
            </button>
        </div>
      )}
    </>
  );
}
