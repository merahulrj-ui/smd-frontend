"use client";

import { useState } from 'react';
import { loginAction } from './actions';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    
    if (result?.error) {
        setErrorMsg(result.error);
        setLoading(false);
    } else if (result?.success) {
        router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased relative bg-[#f8fafc] text-slate-800">
        
        {/* Background Gradients */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/5 blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]"></div>
        </div>

        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-4 flex items-center justify-center">
            <a href="/"><img src="/images/img_68ae826eb6cc47.12112340_logo.webp" alt="SMD MEDICARE" className="h-10 object-contain rounded" /></a>
        </header>

        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
            <div className="w-full max-w-md">
                
                {/* Glassy Card */}
                <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-transparent rounded-bl-full pointer-events-none"></div>

                    <div className="text-center mb-8 relative z-10">
                        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm border border-teal-100">
                            <i className="fas fa-user-shield"></i>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Portal</h2>
                        <p className="text-slate-500 mt-2 text-sm font-medium">Enter your credentials to access the dashboard.</p>
                    </div>

                    {errorMsg && (
                        <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm mb-6 flex items-start gap-3 border border-rose-100 shadow-sm animate-[pulse_0.5s_ease-in-out]">
                            <i className="fas fa-exclamation-circle mt-0.5"></i> 
                            <span className="font-semibold">{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="relative z-10">
                        <div className="mb-5">
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Username</label>
                            <div className="relative">
                                <input type="text" name="username" placeholder="admin" required className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-slate-800 font-medium" />
                                <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" required className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-slate-800 font-medium tracking-widest" />
                                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-8 px-1">
                            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-600 group">
                                <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 transition-all cursor-pointer" /> 
                                <span className="group-hover:text-teal-600 transition-colors">Show Password</span>
                            </label>
                            <a href="#" className="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors">Forgot?</a>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-[15px] font-bold shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer">
                            {loading ? (
                                <><i className="fas fa-circle-notch fa-spin"></i> Authenticating...</>
                            ) : (
                                <><i className="fas fa-sign-in-alt"></i> Secure Login</>
                            )}
                        </button>
                    </form>
                </div>
                
                {/* Trust Badges below card */}
                <div className="flex justify-center items-center gap-6 mt-8 text-slate-400 text-xs font-semibold">
                    <span className="flex items-center gap-1"><i className="fas fa-lock"></i> 256-bit Encrypted</span>
                    <span className="flex items-center gap-1"><i className="fas fa-shield-alt"></i> ISO Certified</span>
                </div>
            </div>
        </div>
    </div>
  );
}
