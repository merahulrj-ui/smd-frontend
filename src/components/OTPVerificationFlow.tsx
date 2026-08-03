"use client";
import React, { useState } from 'react';
import { useOTPAuth } from '@/hooks/useOTPAuth';

interface OTPVerificationFlowProps {
    onVerified: (user: { name: string; email: string; phone: string }) => void;
    title?: string;
    description?: string;
    compact?: boolean;
    prefilledData?: { name: string; phone: string; email: string };
    hideInputs?: boolean;
}

export default function OTPVerificationFlow({ onVerified, title = "Verification Required", description = "Please verify your email to proceed.", compact = false, prefilledData, hideInputs = false }: OTPVerificationFlowProps) {
    const { login } = useOTPAuth();
    
    const [view, setView] = useState<'email' | 'otp'>('email');
    const [name, setName] = useState(prefilledData?.name || '');
    const [phone, setPhone] = useState(prefilledData?.phone || '');
    const [email, setEmail] = useState(prefilledData?.email || '');
    const [otp, setOtp] = useState('');
    
    // Sync with prefilledData changes
    React.useEffect(() => {
        if (prefilledData) {
            setName(prefilledData.name);
            setPhone(prefilledData.phone);
            setEmail(prefilledData.email);
        }
    }, [prefilledData]);

    const [errorMsg, setErrorMsg] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone || !email) {
            setErrorMsg('All fields are required.');
            return;
        }
        setIsSending(true);
        setErrorMsg('');

        try {
            const res = await fetch('/api/jayanti/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, email })
            });
            const data = await res.json();
            if (data.success) {
                setView('otp');
            } else {
                setErrorMsg(data.message || 'Error sending OTP');
            }
        } catch (err) {
            setErrorMsg('Network error. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp) return;
        setIsVerifying(true);
        setErrorMsg('');

        try {
            const res = await fetch('/api/jayanti/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp, email })
            });
            const data = await res.json();
            if (data.success) {
                const user = { name, email, phone, isVerified: true };
                login(user);
                onVerified(user);
            } else {
                setErrorMsg(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setErrorMsg('Network error. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className={`w-full ${compact ? '' : 'p-6 bg-slate-50 border border-slate-200 rounded-2xl'}`}>
            <h3 className={`font-bold text-slate-800 ${compact ? 'text-lg mb-2' : 'text-xl mb-1'}`}>{title}</h3>
            <p className="text-sm text-slate-500 mb-6">{description}</p>
            
            {errorMsg && (
                <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-lg border border-rose-100 mb-4 animate-fade-in">
                    <i className="fas fa-exclamation-circle mr-2"></i>{errorMsg}
                </div>
            )}

            {view === 'email' ? (
                <div className="space-y-4">
                    {!hideInputs && (
                        <>
                            <div className={compact ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Your Name*</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Phone Number*</label>
                                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="+91 99999 88888" className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Email Address*</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="john@example.com" className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                            </div>
                        </>
                    )}
                    <button type="button" onClick={handleSendOtp} disabled={isSending} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-70 mt-2">
                        {isSending ? 'Sending OTP...' : 'Get Verification Code'}
                    </button>
                </div>
            ) : (
                <div className="space-y-4 animate-fade-in">
                    <div className="bg-white p-4 border border-slate-200 rounded-xl mb-4 flex justify-between items-center">
                        <div className="text-sm">
                            <p className="text-slate-500 mb-0.5">OTP sent to</p>
                            <p className="font-semibold text-slate-800">{email}</p>
                        </div>
                        <button type="button" onClick={() => setView('email')} className="text-xs font-bold text-blue-600 hover:underline">Change</button>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Enter 6-Digit OTP*</label>
                        <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required placeholder="••••••" maxLength={6} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-center text-xl tracking-[0.5em] font-bold" />
                    </div>
                    <button type="button" onClick={handleVerifyOtp} disabled={isVerifying || otp.length < 5} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-70">
                        {isVerifying ? 'Verifying...' : 'Verify & Continue'}
                    </button>
                </div>
            )}
        </div>
    );
}
