import { NextResponse } from 'next/server';
import { otpStore } from '@/lib/otpStore';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { otp, email } = body;

        if (!otp || !email) {
            return NextResponse.json({ success: false, message: 'OTP and email are required' }, { status: 400 });
        }

        const sessionData = otpStore.get(email);
        
        if (!sessionData || Date.now() > sessionData.expires) {
            return NextResponse.json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        if (sessionData.otp === otp) {
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

        return NextResponse.json({ success: false, message: 'Invalid OTP.' });
    } catch (e) {
        return NextResponse.json({ success: false, message: 'Failed to verify OTP' }, { status: 500 });
    }
}
