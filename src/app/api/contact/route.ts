import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendMail } from '@/lib/mail';
import { checkRateLimit } from '@/lib/rateLimit';
import DOMPurify from 'isomorphic-dompurify';

export async function POST(req: Request) {
  try {
    // 1. IP-based Rate Limiting (Max 5 submissions per 15 mins)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(`contact_ip_${ip}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const data = await req.json();
    const { name, email, phone, message } = data;

    // 2. Validate inputs
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    // 3. Backend Verification (Ensure OTP flow was actually completed)
    const [verifiedRows] = await pool.query(
      'SELECT id FROM verified_users WHERE email = ? AND phone = ? LIMIT 1',
      [email, phone]
    ) as any[];

    if (verifiedRows.length === 0) {
      return NextResponse.json({ success: false, message: 'Unauthorized. Please verify your email and phone number again.' }, { status: 401 });
    }

    // 4. Input Sanitization (XSS Protection)
    const safeName = DOMPurify.sanitize(name);
    const safeMessage = DOMPurify.sanitize(message);
    
    // Insert into enquiries table as a general contact
    await pool.query(
      'INSERT INTO enquiries (name, email, phone, message, type) VALUES (?, ?, ?, ?, ?)',
      [safeName, email, phone, safeMessage, 'Contact Us']
    );
    
    // Send email
    const emailHtml = `
      <h3>New Contact Us Message</h3>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage.replace(/\n/g, '<br>')}</p>
    `;
    
    await sendMail({
      subject: `New Contact Request from ${safeName}`,
      html: emailHtml,
    });
    
    return NextResponse.json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to send message' }, { status: 500 });
  }
}
