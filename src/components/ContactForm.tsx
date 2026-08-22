"use client";
import { useState, useEffect, useRef } from 'react';
import { useOTPAuth } from '@/hooks/useOTPAuth';
import OTPVerificationFlow from '@/components/OTPVerificationFlow';

export default function ContactForm() {
  const { user, isVerified, login } = useOTPAuth();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    
    if (!isVerified) {
      setShowOtpModal(true);
      return;
    }

    setLoading(true);
    setStatus('');
    
    const data = {
      name, email, phone, message: formRef.current?.message.value || ''
    };
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('success');
        if (formRef.current) formRef.current.reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = (verifiedUser: any) => {
      login({ ...verifiedUser, isVerified: true });
      setShowOtpModal(false);
      // Automatically submit after successful verification
      setTimeout(() => {
          handleSubmit();
      }, 500);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5 flex-grow">
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Full Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="name" 
              required 
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              maxLength={100}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={isVerified}
              placeholder="E.g., john@example.com" 
              className={`w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 font-medium ${isVerified ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
            />
        </div>
        
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number <span className="text-red-500">*</span></label>
            <input 
              type="tel" 
              name="phone" 
              required 
              maxLength={20}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              readOnly={isVerified}
              placeholder="E.g., +91 98765 43210" 
              className={`w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 font-medium ${isVerified ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
            />
        </div>
        
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Message / Requirements <span className="text-red-500">*</span></label>
            <textarea 
              name="message" 
              rows={4} 
              required 
              maxLength={1000}
              placeholder="How can we help you?"
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 font-medium resize-none"
            ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-auto w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
        >
          {loading ? (
             <><i className="fas fa-spinner fa-spin"></i> Sending...</>
          ) : (
             <><i className="fas fa-paper-plane"></i> Send Message</>
          )}
        </button>

        {showOtpModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative animate-in fade-in zoom-in duration-200">
                    <button 
                      type="button" 
                      onClick={() => setShowOtpModal(false)}
                      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-800 transition-colors z-10"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                    <div className="p-6 md:p-8">
                        <OTPVerificationFlow 
                            onVerified={handleVerified} 
                            title="Verify Your Details" 
                            description="Please verify your email or phone to send this inquiry." 
                            prefilledData={{ name, email, phone }}
                            hideInputs={true}
                            context="SMD Medicare Contact Form"
                        />
                    </div>
                </div>
            </div>
        )}
        
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
