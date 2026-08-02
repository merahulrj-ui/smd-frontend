"use client";
import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Full Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="E.g., John Doe" 
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 font-medium"
            />
        </div>
        
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address <span className="text-red-500">*</span></label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="E.g., john@example.com" 
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 font-medium"
            />
        </div>
        
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number <span className="text-red-500">*</span></label>
            <input 
              type="tel" 
              name="phone" 
              required 
              placeholder="E.g., +91 98765 43210" 
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 font-medium"
            />
        </div>
        
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Message / Requirements <span className="text-red-500">*</span></label>
            <textarea 
              name="message" 
              rows={4} 
              required 
              placeholder="How can we help you?"
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 font-medium resize-none"
            ></textarea>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="mt-2 w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
        >
          {loading ? (
             <><i className="fas fa-spinner fa-spin"></i> Sending...</>
          ) : (
             <><i className="fas fa-paper-plane"></i> Send Message</>
          )}
        </button>
        
        {status === 'success' && (
          <div className="mt-2 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
            <div className="text-emerald-500 mt-0.5"><i className="fas fa-check-circle text-lg"></i></div>
            <p className="text-sm font-medium text-emerald-800">Message sent successfully! Our team will get back to you shortly.</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="mt-2 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
            <div className="text-red-500 mt-0.5"><i className="fas fa-exclamation-circle text-lg"></i></div>
            <p className="text-sm font-medium text-red-800">Failed to send message. Please try again or contact us directly.</p>
          </div>
        )}
    </form>
  );
}
