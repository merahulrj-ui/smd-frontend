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
        const { name, phone, email, context = 'SMD Medicare' } = body;

        if (!name || !phone || !email) {
            return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
        }

        if (name.length > 100 || email.length > 100 || phone.length > 20 || (context && context.length > 100)) {
            return NextResponse.json({ success: false, message: 'Input length exceeds maximum allowed limit' }, { status: 400 });
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
            subject: `Your Verification Code - ${context}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 20px; text-align: center;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                        
                        <!-- Header -->
                        <div style="background-color: #0d9488; padding: 30px 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">SMD Medicare</h1>
                        </div>

                        <!-- Body -->
                        <div style="padding: 40px 30px; text-align: left;">
                            <h2 style="color: #0f172a; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Verify Your Identity</h2>
                            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                Hi <strong style="color: #0f172a;">${name}</strong>,<br><br>
                                We received a request to access ${context}. Please use the verification code below to securely log in to your account.
                            </p>

                            <!-- OTP Box -->
                            <div style="text-align: center; margin: 35px 0;">
                                <div style="display: inline-block; background-color: #f0fdfa; border: 2px dashed #14b8a6; border-radius: 12px; padding: 15px 30px;">
                                    <h3 style="color: #0f766e; font-size: 32px; letter-spacing: 8px; margin: 0; font-family: monospace;">${otp}</h3>
                                </div>
                            </div>

                            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 30px;">
                                This code is valid for <strong>10 minutes</strong>.<br>If you didn't request this code, you can safely ignore this email.
                            </p>
                        </div>

                        <!-- Footer -->
                        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center;">
                            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                                &copy; ${new Date().getFullYear()} SMD Medicare. All rights reserved.<br>
                                This is an automated message, please do not reply.
                            </p>
                        </div>

                    </div>
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
