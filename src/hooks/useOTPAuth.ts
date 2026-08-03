"use client";
import { useState, useEffect } from 'react';

type UserSession = {
    name: string;
    email: string;
    phone: string;
    isVerified: boolean;
};

export function useOTPAuth() {
    const [user, setUser] = useState<UserSession | null>(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('smd_verified_user');
            if (saved) {
                setUser(JSON.parse(saved));
            } else {
                // Check legacy Jayanti AI verified state
                const jayantiVerified = localStorage.getItem('jayanti_verified') === 'true';
                if (jayantiVerified) {
                    setUser({ name: '', email: '', phone: '', isVerified: true });
                }
            }
        } catch (e) {
            console.error(e);
        }
    }, []);

    const login = (session: UserSession) => {
        localStorage.setItem('smd_verified_user', JSON.stringify(session));
        localStorage.setItem('jayanti_verified', 'true');
        setUser(session);
    };

    const logout = () => {
        localStorage.removeItem('smd_verified_user');
        localStorage.removeItem('jayanti_verified');
        setUser(null);
    };

    return { user, login, logout, isVerified: user?.isVerified || false };
}
