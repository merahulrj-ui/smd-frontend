import { NextResponse } from 'next/server';
import { otpStore } from '@/lib/otpStore';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, email } = body;

        if (!name || !phone || !email) {
            return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
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
