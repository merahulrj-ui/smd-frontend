"use client";
import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus('idle');
    
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStatus('success');
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address" 
          className="flex-grow px-5 py-4 rounded-xl bg-white/5 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 text-white placeholder-slate-400 shadow-inner backdrop-blur-sm transition-all"
          required
          maxLength={100}
          disabled={loading || status === 'success'}
        />
        <button 
          type="submit" 
          disabled={loading || status === 'success'}
          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)] whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {status === 'success' && (
        <p className="text-emerald-400 text-sm mt-3 font-medium animate-in fade-in slide-in-from-bottom-1"><i className="fas fa-check-circle mr-1"></i> {message}</p>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-3 font-medium animate-in fade-in slide-in-from-bottom-1"><i className="fas fa-exclamation-circle mr-1"></i> {message}</p>
      )}
    </div>
  );
}
