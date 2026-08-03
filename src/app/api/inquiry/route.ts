import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendMail } from '@/lib/mail';
import { checkRateLimit } from '@/lib/rateLimit';
import DOMPurify from 'isomorphic-dompurify';

export async function POST(req: Request) {
  try {
    // 1. IP-based Rate Limiting (Max 5 inquiries per IP per 10 minutes)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(`inquiry_ip_${ip}`, 5, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
        return NextResponse.json({ success: false, error: 'Too many requests. Please wait a few minutes before trying again.' }, { status: 429 });
    }

    const data = await req.json();
    
    // data format matching GlobalModals form
    const { name, email, phone, company, message, inquiry_type, product_name } = data;
    
    // 2. Backend Verification - Check if email exists in verified_users
    try {
        const [rows]: any = await pool.query('SELECT phone FROM verified_users WHERE email = ?', [email]);
        if (rows.length === 0 || rows[0].phone !== phone) {
            return NextResponse.json({ success: false, error: 'Unauthorized submission. Please verify your email and phone combination first.' }, { status: 401 });
        }
    } catch (dbErr) {
        console.error("DB Error verifying user:", dbErr);
        return NextResponse.json({ success: false, error: 'Server error during verification.' }, { status: 500 });
    }

    // 3. Input Sanitization (XSS Prevention)
    const safeName = DOMPurify.sanitize(name || '');
    const safeCompany = DOMPurify.sanitize(company || '');
    const safeMessage = DOMPurify.sanitize(message || '');
    const safeProductName = DOMPurify.sanitize(product_name || '');
    const safeInquiryType = DOMPurify.sanitize(inquiry_type || 'enquiry');

    // Append product name and company to message for context
    const fullMessage = `Product: ${safeProductName}\nCompany: ${safeCompany || 'N/A'}\n\n${safeMessage}`;
    
    await pool.query(
      'INSERT INTO enquiries (name, email, phone, message, type) VALUES (?, ?, ?, ?, ?)',
      [safeName, email, phone, fullMessage, safeInquiryType]
    );
    
    // Send email
    const emailHtml = `
      <h3>New ${safeInquiryType || 'Inquiry'} received</h3>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Company:</strong> ${safeCompany || 'N/A'}</p>
      <p><strong>Product:</strong> ${safeProductName}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage.replace(/\n/g, '<br>')}</p>
    `;
    
    await sendMail({
      subject: `New Inquiry: ${safeProductName} - from ${safeName}`,
      html: emailHtml,
    });
    
    return NextResponse.json({ success: true, message: 'Inquiry submitted successfully.' });
  } catch (error) {
    console.error('Inquiry API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
