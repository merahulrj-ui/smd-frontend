import { NextResponse } from 'next/server';
import { otpStore } from '@/lib/otpStore';
import nodemailer from 'nodemailer';
import { checkRateLimit } from '@/lib/rateLimit';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        // 1. IP-based Rate Limiting (Prevent OTP Bombing/Spamming)
        // Extract IP (in Next.js App Router, headers are usually available)
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        
        // Allow max 3 OTP sends per IP per 5 minutes
        const rateLimit = checkRateLimit(`send_otp_ip_${ip}`, 3, 5 * 60 * 1000);
        if (!rateLimit.allowed) {
            return NextResponse.json({ success: false, message: 'Too many requests. Please wait a few minutes before trying again.' }, { status: 429 });
        }

        const body = await request.json();
        const { name, phone, email } = body;

        if (!name || !phone || !email) {
            return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
        }

        // Additional: Rate Limit per Email (Max 3 sends per 15 minutes per email)
        const emailLimit = checkRateLimit(`send_otp_email_${email}`, 3, 15 * 60 * 1000);
        if (!emailLimit.allowed) {
            return NextResponse.json({ success: false, message: 'Too many OTP requests for this email. Please wait 15 minutes.' }, { status: 429 });
        }

        // 3. Database Combination Check
        try {
            const [rows]: any = await pool.query('SELECT phone FROM verified_users WHERE email = ?', [email]);
            if (rows.length > 0) {
                const registeredPhone = rows[0].phone;
                if (registeredPhone !== phone) {
                    return NextResponse.json({ 
                        success: false, 
                        message: 'This email is already registered with a different phone number. Please use the original number or try a new email.' 
                    }, { status: 400 });
                }
            }
        } catch (dbErr) {
            console.error("DB Error checking verified_users:", dbErr);
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        otpStore.set(email, {
            otp,
            name,
            phone,
            expires: Date.now() + 10 * 60 * 1000
        });

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT) || 465,
            secure: process.env.MAIL_ENCRYPTION === 'ssl' || process.env.MAIL_PORT == '465',
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to: email,
            subject: 'Your OTP for Jayanti AI',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Verify Your Email</h2>
                    <p>Hi ${name},</p>
                    <p>Your one-time password (OTP) for Jayanti AI is:</p>
                    <h3 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 2px;">${otp}</h3>
                    <p>This OTP is valid for 10 minutes.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'OTP sent successfully' });
    } catch (e) {
        console.error("OTP Send Error:", e);
        return NextResponse.json({ success: false, message: 'Failed to send OTP email.' }, { status: 500 });
    }
}
