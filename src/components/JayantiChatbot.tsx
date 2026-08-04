"use client";

import React, { useState, useEffect, useRef } from 'react';
import './JayantiChatbot.css';
import { useOTPAuth } from '@/hooks/useOTPAuth';
import OTPVerificationFlow from '@/components/OTPVerificationFlow';
import DOMPurify from 'isomorphic-dompurify';

const AnimatedBotIcon = ({ className = "w-[28px] h-[28px]" }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="botGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="botEar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
        </defs>
        
        {/* Antenna */}
        <path d="M 50 25 L 50 10" stroke="url(#botEar)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="8" r="6" fill="#f43f5e">
            <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
        </circle>
        
        {/* Ear pieces */}
        <path d="M 15 45 Q 8 45 8 55 Q 8 65 15 65" fill="none" stroke="url(#botEar)" strokeWidth="5" strokeLinecap="round" />
        <path d="M 85 45 Q 92 45 92 55 Q 92 65 85 65" fill="none" stroke="url(#botEar)" strokeWidth="5" strokeLinecap="round" />
        
        {/* Face */}
        <rect x="15" y="25" width="70" height="60" rx="20" fill="url(#botGrad)" />
        
        {/* Screen/Glass inside */}
        <rect x="25" y="38" width="50" height="26" rx="8" fill="#1e293b" />
        
        {/* Glowing Eyes */}
        <g fill="#38bdf8">
            <rect x="33" y="46" width="12" height="10" rx="5">
                <animate attributeName="height" values="10;0;10;10;10;10;10" dur="4s" repeatCount="indefinite" keyTimes="0;0.05;0.1;0.2;0.5;0.8;1" />
                <animate attributeName="y" values="46;51;46;46;46;46;46" dur="4s" repeatCount="indefinite" keyTimes="0;0.05;0.1;0.2;0.5;0.8;1" />
            </rect>
            <rect x="55" y="46" width="12" height="10" rx="5">
                <animate attributeName="height" values="10;0;10;10;10;10;10" dur="4s" repeatCount="indefinite" keyTimes="0;0.05;0.1;0.2;0.5;0.8;1" />
                <animate attributeName="y" values="46;51;46;46;46;46;46" dur="4s" repeatCount="indefinite" keyTimes="0;0.05;0.1;0.2;0.5;0.8;1" />
            </rect>
        </g>
        
        {/* Mouth/Smile line */}
        <path d="M 40 73 Q 50 78 60 73" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
);

export default function JayantiChatbot() {
    const { user, isVerified, login } = useOTPAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'email' | 'otp' | 'chat'>('email');
    
    // Legacy states, kept for chat logic if needed
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [email, setEmail] = useState(user?.email || '');
    const [otp, setOtp] = useState('');
    
    const [emailError, setEmailError] = useState('');
    const [otpError, setOtpError] = useState('');
    
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    
    const [chatHistory, setChatHistory] = useState<{role: string, content: string, raw_content?: string}[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

    useEffect(() => {
        if (isVerified) {
            setView('chat');
            loadHistory();
        }
        
        // Hide tooltip after 6 seconds
        const timer = setTimeout(() => {
            setShowTooltip(false);
        }, 6000);
        return () => clearTimeout(timer);
    }, [isVerified]);

    useEffect(() => {
        if (view === 'chat') {
            scrollToBottom();
        }
    }, [chatHistory, isTyping, view]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadHistory = () => {
        const saved = localStorage.getItem('jayanti_history');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.length > 0) {
                    setChatHistory(parsed);
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    const saveHistory = (history: {role: string, content: string}[]) => {
        localStorage.setItem('jayanti_history', JSON.stringify(history));
    };

    const toggleJayanti = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setShowTooltip(false);
        }
    };

    const clearChat = () => {
        if(window.confirm('Are you sure you want to clear the chat history?')) {
            setChatHistory([]);
            localStorage.removeItem('jayanti_history');
        }
    };

    const sendOtp = async () => {
        if (!name || !phone || !email) {
            setEmailError('Please fill all details.');
            return;
        }
        setIsSendingOtp(true);
        setEmailError('');

        try {
            const res = await fetch(`${API_BASE_URL}/jayanti/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name, phone, email })
            });
            const data = await res.json();
            if (data.success) {
                setView('otp');
            } else {
                setEmailError(data.message || 'Error sending OTP');
            }
        } catch (e) {
            setEmailError('Failed to request OTP.');
        } finally {
            setIsSendingOtp(false);
        }
    };

    const verifyOtp = async () => {
        if (!otp) return;
        setIsVerifyingOtp(true);
        setOtpError('');

        try {
            const res = await fetch(`${API_BASE_URL}/jayanti/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ otp, email })
            });
            const data = await res.json();
            if (data.success) {
                const userObj = { name, email, phone, isVerified: true };
                login(userObj);
                setView('chat');
            } else {
                setOtpError(data.message || 'Invalid OTP');
            }
        } catch (e) {
            setOtpError('Failed to verify OTP.');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const sendMessage = async (text: string) => {
        const msg = text.trim();
        if (!msg) return;

        const newUserMsg = {role: 'user', content: msg};
        const updatedHistory = [...chatHistory, newUserMsg];
        setChatHistory(updatedHistory);
        setChatInput('');
        setIsTyping(true);

        try {
            const minDelay = new Promise(resolve => setTimeout(resolve, 900));
            const resPromise = fetch(`${API_BASE_URL}/jayanti/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ message: msg, history: chatHistory.map(m => ({role: m.role, content: m.raw_content || m.content})) })
            });

            const [res] = await Promise.all([resPromise, minDelay]);
            const data = await res.json();

            setIsTyping(false);

            if (data.success) {
                const newAiMsg = {role: 'ai', content: data.reply || data.raw_reply, raw_content: data.raw_reply || data.reply};
                let newHistory = [...updatedHistory, newAiMsg];
                if (newHistory.length > 6) {
                    newHistory = newHistory.slice(-6);
                }
                setChatHistory(newHistory);
                saveHistory(newHistory);
            } else {
                const errorMsg = {role: 'ai', content: 'Error: ' + (data.reply || data.message || 'Unknown error occurred')};
                setChatHistory([...updatedHistory, errorMsg]);
            }
        } catch (error) {
            setIsTyping(false);
            const fallbackMsg = "I'm having a little trouble connecting to the network right now. Could you please send your message again? Or you can <a href='https://wa.me/919555422455' target='_blank' class='text-blue-500 underline font-semibold' style='color:#25d366;'><i class='fab fa-whatsapp'></i> Chat with a human on WhatsApp</a>.";
            const fallbackObj = {role: 'ai', content: fallbackMsg};
            const newHistory = [...updatedHistory, fallbackObj];
            setChatHistory(newHistory);
            saveHistory(newHistory);
        }
    };

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage(chatInput);
        }
    };

    const startVoice = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser doesn't support voice input. Please use Google Chrome.");
            return;
        }

        if (isRecording) {
            recognitionRef.current?.stop();
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;
            recognition.lang = 'en-IN';
            recognition.interimResults = false;

            recognition.onstart = () => {
                setIsRecording(true);
            };

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setChatInput(transcript);
                sendMessage(transcript);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech error", event.error);
                setIsRecording(false);
                if (event.error === 'not-allowed') {
                    alert("Microphone permission denied! Browser ne mic block kar diya hai. Kripya URL bar mein lock icon par click karke Mic allow karein.");
                } else if (event.error === 'network') {
                    alert("Voice feature requires active internet connection.");
                } else {
                    alert("Voice input error: " + event.error);
                }
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognition.start();
        } catch (e) {
            alert("Mic start failed. Are you running on HTTP? Modern browsers require HTTPS or 'localhost' for voice input.");
        }
    };

    const renderMessage = (text: string) => {
        let parsedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        parsedText = parsedText.replace(/\n/g, '<br>');
        
        // Sanitize the HTML to prevent Self-XSS
        parsedText = DOMPurify.sanitize(parsedText, { ADD_ATTR: ['target'] });
        
        parsedText = parsedText.replace(
            /Talk to a Human on WhatsApp/gi,
            '<a href="https://wa.me/919555422455" target="_blank" class="text-[#25d366] font-semibold underline"><i class="fab fa-whatsapp"></i> Talk to a Human on WhatsApp</a>'
        );
        return { __html: parsedText };
    };

    return (
        <div className="fixed bottom-[70px] md:bottom-6 right-4 md:right-6 z-[99999] font-sans text-slate-800">
            {!isOpen && (
                <button 
                    onClick={toggleJayanti} 
                    className="relative w-16 h-16 cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 drop-shadow-[0_8px_15px_rgba(37,99,235,0.4)] animate-bounce"
                    style={{ animationDuration: '3s' }}
                >
                    <div className={`absolute bottom-[75px] right-2 bg-blue-600 text-white py-2 px-4 rounded-full text-[13px] font-semibold whitespace-nowrap shadow-lg pointer-events-none before:content-[''] before:absolute before:-bottom-1.5 before:right-[20px] before:w-0 before:h-0 before:border-x-[8px] before:border-x-transparent before:border-t-[8px] before:border-t-blue-600 transition-opacity duration-1000 ${showTooltip ? 'opacity-100' : 'opacity-0'}`}>
                        Hi, I'm Jayanti AI 👋
                    </div>
                    <span className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center border-2 border-white shadow-sm z-10">1</span>
                    <AnimatedBotIcon className="w-full h-full" />
                </button>
            )}

            <div className={`fixed sm:absolute bottom-0 right-0 sm:bottom-[80px] sm:right-0 w-full h-full sm:w-[360px] sm:h-[520px] bg-[#f0f4f8] backdrop-blur-md sm:border border-white/50 sm:rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.1),0_5px_15px_rgba(37,99,235,0.05)] flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right z-[100000] sm:z-auto ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75 translate-y-5 pointer-events-none'}`}>
                {/* Header */}
                <div className="bg-gradient-to-br from-white/90 to-slate-50/80 px-5 py-4 flex justify-between items-center border-b border-slate-200/60 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <AnimatedBotIcon className="w-[30px] h-[30px]" />
                        <div>
                            <h4 className="m-0 text-[15px] text-slate-800 font-semibold">Jayanti AI</h4>
                            <span className="text-[11px] text-emerald-500 font-medium">● Online</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <button onClick={clearChat} className="bg-transparent border-none text-slate-500 text-base cursor-pointer transition-colors hover:text-red-500" title="Clear Chat History">
                            <i className="fas fa-trash-alt"></i>
                        </button>
                        <a href="https://wa.me/919555422455" target="_blank" rel="noreferrer" title="Talk to a Human on WhatsApp" className="text-[#25d366] text-lg hover:scale-110 transition-transform">
                            <i className="fab fa-whatsapp"></i>
                        </a>
                        <button onClick={toggleJayanti} className="bg-transparent border-none text-slate-500 text-base cursor-pointer transition-colors hover:text-slate-900"><i className="fas fa-times"></i></button>
                    </div>
                </div>

                {/* View 1: Email Request */}
                <div className={`flex-col flex-1 min-h-0 ${view === 'email' ? 'flex' : 'hidden'}`}>
                    <div className="p-6 bg-white m-[15px] rounded-xl shadow-[0_2px_5px_rgba(0,0,0,0.05)]">
                        <h5 className="m-0 mb-2.5 text-base text-slate-900 font-bold">Hi, I'm Jayanti AI 👋</h5>
                        <p className="m-0 text-[13px] text-slate-600 leading-relaxed">To prevent spam and provide personalized assistance, please enter your details to start chatting. Or <a href="https://wa.me/919555422455" target="_blank" rel="noreferrer" className="text-blue-600 font-medium underline">Talk to a human on WhatsApp</a>.</p>
                    </div>
                    <div className="px-[15px] flex flex-col gap-2.5">
                        <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required className="px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-600 transition-colors bg-white" />
                        <input type="text" placeholder="Mobile Number" value={phone} onChange={e => setPhone(e.target.value)} required className="px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-600 transition-colors bg-white" />
                        <input type="email" placeholder="Email ID" value={email} onChange={e => setEmail(e.target.value)} required className="px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-600 transition-colors bg-white" />
                        <button onClick={sendOtp} disabled={isSendingOtp} className="p-3 bg-blue-600 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-blue-700 disabled:opacity-50">
                            {isSendingOtp ? 'Sending...' : <>Send OTP <i className="fas fa-paper-plane ml-1"></i></>}
                        </button>
                    </div>
                    {emailError && <p className="text-red-500 text-xs text-center mt-2.5">{emailError}</p>}
                </div>

                {/* View 2: OTP Verification */}
                <div className={`flex-col flex-1 min-h-0 ${view === 'otp' ? 'flex' : 'hidden'}`}>
                    <div className="p-6 bg-white m-[15px] rounded-xl shadow-[0_2px_5px_rgba(0,0,0,0.05)]">
                        <h5 className="m-0 mb-2.5 text-base text-slate-900 font-bold">Check your inbox 📩</h5>
                        <p className="m-0 text-[13px] text-slate-600 leading-relaxed">We've sent a 6-digit OTP to <strong>{email}</strong>.</p>
                    </div>
                    <div className="px-[15px] flex flex-col gap-2.5">
                        <input type="number" placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} required className="px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-600 transition-colors bg-white" />
                        <button onClick={verifyOtp} disabled={isVerifyingOtp} className="p-3 bg-blue-600 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-blue-700 disabled:opacity-50">
                            {isVerifyingOtp ? 'Verifying...' : <>Verify <i className="fas fa-check-circle ml-1"></i></>}
                        </button>
                    </div>
                    {otpError && <p className="text-red-500 text-xs text-center mt-2.5">{otpError}</p>}
                </div>

                {/* View 3: Chat Interface */}
                <div className={`flex-col flex-1 min-h-0 bg-transparent ${view === 'chat' ? 'flex' : 'hidden'}`}>
                    <div className="flex-1 overflow-y-auto p-[15px] flex flex-col gap-2.5 custom-scrollbar">
                        {chatHistory.length === 0 && (
                            <>
                                <div className="mb-3 px-4 py-3 rounded-[18px] max-w-[85%] break-words text-[13.5px] leading-relaxed tracking-wide shadow-[0_2px_5px_rgba(0,0,0,0.02)] bg-white/90 border border-white self-start rounded-bl-sm text-slate-700">
                                    Hi! I'm Jayanti, your procurement assistant. What are you looking for today?
                                </div>
                                <div className="flex flex-col gap-2 mb-[15px]">
                                    <button className="bg-sky-100 text-sky-700 border border-sky-200 px-3 py-2 rounded-2xl text-xs cursor-pointer transition-all hover:bg-sky-200 hover:text-sky-900 text-left" onClick={() => sendMessage('How can I order medical supplies?')}>How can I order medical supplies?</button>
                                    <button className="bg-sky-100 text-sky-700 border border-sky-200 px-3 py-2 rounded-2xl text-xs cursor-pointer transition-all hover:bg-sky-200 hover:text-sky-900 text-left" onClick={() => sendMessage('What are the delivery charges?')}>What are the delivery charges?</button>
                                    <button className="bg-sky-100 text-sky-700 border border-sky-200 px-3 py-2 rounded-2xl text-xs cursor-pointer transition-all hover:bg-sky-200 hover:text-sky-900 text-left" onClick={() => sendMessage('Do you offer bulk discounts?')}>Do you offer bulk discounts?</button>
                                </div>
                            </>
                        )}
                        
                        {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`mb-3 px-4 py-3 rounded-[18px] max-w-[85%] break-words text-[13.5px] leading-relaxed tracking-wide shadow-[0_2px_5px_rgba(0,0,0,0.02)] ${msg.role === 'ai' ? 'bg-white/90 border border-white self-start rounded-bl-sm text-slate-700' : 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white self-end rounded-br-sm shadow-[0_4px_10px_rgba(59,130,246,0.2)]'} [&>strong]:font-semibold ${msg.role === 'ai' ? '[&>strong]:text-slate-900' : '[&>strong]:text-white'}`} dangerouslySetInnerHTML={renderMessage(msg.content)} />
                        ))}

                        {isTyping && (
                            <div className="flex items-center gap-2 text-slate-600 text-[13px] font-medium ml-[15px] mb-2.5">
                                <div className="ai-wave-loader">
                                    <div className="bar"></div><div className="bar"></div><div className="bar"></div><div className="bar"></div>
                                </div>
                                <span className="typing-text">Jayanti is thinking</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex gap-2.5 px-[15px] py-2.5 bg-slate-50 border-t border-slate-200 overflow-x-auto whitespace-nowrap custom-scrollbar">
                        <button onClick={() => sendMessage('Show me your top offers')} className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all hover:bg-blue-600 hover:text-white hover:border-blue-600 shrink-0">🎁 Top Offers</button>
                        <button onClick={() => sendMessage('I want to talk to an expert')} className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all hover:bg-blue-600 hover:text-white hover:border-blue-600 shrink-0">📞 Talk to Expert</button>
                    </div>
                    <div className="px-4 py-3 bg-white/80 flex gap-2.5 border-t border-slate-200/60 items-center">
                        <button 
                            className={`w-11 h-11 rounded-full border border-slate-300 cursor-pointer flex items-center justify-center shrink-0 transition-all ${isRecording ? 'bg-red-500 text-white border-red-500' : 'bg-slate-100 text-slate-500 hover:bg-red-500 hover:text-white hover:border-red-500'}`} 
                            onClick={startVoice} 
                            title="Speak"
                        >
                            <i className="fas fa-microphone"></i>
                        </button>
                        <input 
                            type="text" 
                            placeholder={isTyping ? "Assistant is replying..." : (isRecording ? "Listening... Bolna shuru karein" : "Ask for products, prices...")} 
                            value={chatInput} 
                            onChange={e => setChatInput(e.target.value)} 
                            onKeyDown={handleEnter}
                            disabled={isTyping}
                            className="flex-1 px-4 py-3 border border-slate-200 rounded-3xl outline-none text-[13.5px] bg-white/90 shadow-inner transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] w-full"
                        />
                        <button 
                            onClick={() => sendMessage(chatInput)} 
                            disabled={isTyping}
                            className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white border-none cursor-pointer flex items-center justify-center shrink-0 transition-all hover:-translate-y-0.5 shadow-[0_4px_10px_rgba(99,102,241,0.2)] hover:shadow-[0_6px_15px_rgba(99,102,241,0.3)] disabled:opacity-50"
                        >
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
