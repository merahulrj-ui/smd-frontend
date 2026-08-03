import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendMail } from '@/lib/mail';
import { checkRateLimit } from '@/lib/rateLimit';
import DOMPurify from 'isomorphic-dompurify';

export async function POST(req: Request) {
  try {
    // 1. IP-based Rate Limiting (Max 3 inquiries per IP per 10 minutes)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(`seller_ip_${ip}`, 3, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
        return NextResponse.json({ success: false, error: 'Too many requests. Please wait a few minutes before trying again.' }, { status: 429 });
    }

    const data = await req.json();
    
    // data format matching GlobalModals form
    const { company_name, rep_name, rep_designation, email, gst, contact, agree_terms } = data;
    
    if (!agree_terms) {
      return NextResponse.json({ success: false, error: 'Must agree to terms' }, { status: 400 });
    }

    // 2. Backend Verification - Check if email exists in verified_users
    try {
        const [rows]: any = await pool.query('SELECT phone FROM verified_users WHERE email = ?', [email]);
        if (rows.length === 0 || rows[0].phone !== contact) {
            return NextResponse.json({ success: false, error: 'Unauthorized submission. Please verify your email and phone combination first.' }, { status: 401 });
        }
    } catch (dbErr) {
        console.error("DB Error verifying user:", dbErr);
        return NextResponse.json({ success: false, error: 'Server error during verification.' }, { status: 500 });
    }

    // 3. Input Sanitization (XSS Prevention)
    const safeCompanyName = DOMPurify.sanitize(company_name || '');
    const safeRepName = DOMPurify.sanitize(rep_name || '');
    const safeRepDesignation = DOMPurify.sanitize(rep_designation || '');
    const safeGst = DOMPurify.sanitize(gst || '');

    await pool.query(
      'INSERT INTO seller_inquiries (company_name, rep_name, rep_designation, email, gst_number, contact_no) VALUES (?, ?, ?, ?, ?, ?)',
      [safeCompanyName, safeRepName, safeRepDesignation, email, safeGst, contact]
    );
    
    // Send email
    const emailHtml = `
      <h3>New Partner / Seller Request</h3>
      <p><strong>Company:</strong> ${safeCompanyName}</p>
      <p><strong>Representative:</strong> ${safeRepName} (${safeRepDesignation})</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${contact}</p>
      <p><strong>GST:</strong> ${safeGst || 'N/A'}</p>
    `;
    
    await sendMail({
      subject: `New Seller Request from ${safeCompanyName}`,
      html: emailHtml,
    });
    
    return NextResponse.json({ success: true, message: 'Seller inquiry submitted successfully.' });
  } catch (error) {
    console.error('Seller Inquiry API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit seller inquiry' }, { status: 500 });
  }
}
