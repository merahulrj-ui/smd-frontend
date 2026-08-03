import { NextResponse } from 'next/server';
import { otpStore } from '@/lib/otpStore';
import pool from '@/lib/db';
import { checkRateLimit, emailLockoutStore } from '@/lib/rateLimit';

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        
        // 1. IP-based Rate Limiting (Prevent DDoS/Flooding)
        // Max 20 verification requests per minute per IP
        const rateLimit = checkRateLimit(`verify_otp_ip_${ip}`, 20, 60 * 1000);
        if (!rateLimit.allowed) {
            return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
        }

        const body = await request.json();
        const { otp, email } = body;

        if (!otp || !email) {
            return NextResponse.json({ success: false, message: 'OTP and email are required' }, { status: 400 });
        }

        // 2. Email Lockout Check (Prevent Brute-forcing a specific email's OTP)
        const now = Date.now();
        const lockout = emailLockoutStore.get(email);
        if (lockout && lockout.lockedUntil > now) {
            const minutesLeft = Math.ceil((lockout.lockedUntil - now) / 60000);
            return NextResponse.json({ success: false, message: `Account locked due to too many failed attempts. Try again in ${minutesLeft} minutes.` }, { status: 429 });
        }

        const sessionData = otpStore.get(email);
        
        if (!sessionData || Date.now() > sessionData.expires) {
            return NextResponse.json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        if (sessionData.otp === otp) {
            // Success! Clear any existing lockout
            emailLockoutStore.delete(email);

            // Insert into verified_users permanently
            try {
                await pool.query(
                    'INSERT IGNORE INTO verified_users (email, phone, name) VALUES (?, ?, ?)',
                    [email, sessionData.phone, sessionData.name]
                );
            } catch (dbErr) {
                console.error("DB Error saving verified_user:", dbErr);
            }

            // Log as Enquiry in DB like the Laravel backend does
            try {
                const [existing]: any = await pool.query(
                    'SELECT id FROM enquiries WHERE email = ? AND type = "Jayanti AI Chat" AND DATE(created_at) = CURDATE()',
                    [email]
                );
                
                if (existing.length === 0) {
                    await pool.query(
                        'INSERT INTO enquiries (name, email, phone, message, type, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
                        [sessionData.name, email, sessionData.phone, 'User initiated a chat session with Jayanti AI.', 'Jayanti AI Chat']
                    );
                }
            } catch (dbErr) {
                console.error("DB Error saving enquiry:", dbErr);
            }
            
            // Clean up OTP
            otpStore.delete(email);

            return NextResponse.json({ success: true, message: 'Verified successfully' });
        }

        // 3. Failed Attempt Logging
        let attempts = lockout ? lockout.attempts + 1 : 1;
        if (attempts >= 5) {
            // Lock for 15 minutes after 5 failed attempts
            emailLockoutStore.set(email, { attempts: 0, lockedUntil: now + 15 * 60 * 1000 });
            return NextResponse.json({ success: false, message: 'Too many failed attempts. Account locked for 15 minutes.' }, { status: 429 });
        } else {
            emailLockoutStore.set(email, { attempts, lockedUntil: 0 });
            return NextResponse.json({ success: false, message: `Invalid OTP. ${5 - attempts} attempts remaining.` });
        }
    } catch (e) {
        return NextResponse.json({ success: false, message: 'Failed to verify OTP' }, { status: 500 });
    }
}
