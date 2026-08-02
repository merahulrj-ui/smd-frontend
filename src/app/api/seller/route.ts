import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendMail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // data format matching GlobalModals form
    const { company_name, rep_name, rep_designation, email, gst, contact, agree_terms } = data;
    
    if (!agree_terms) {
      return NextResponse.json({ success: false, error: 'Must agree to terms' }, { status: 400 });
    }

    await pool.query(
      'INSERT INTO seller_inquiries (company_name, rep_name, rep_designation, email, gst_number, contact_no) VALUES (?, ?, ?, ?, ?, ?)',
      [company_name, rep_name, rep_designation, email, gst, contact]
    );
    
    // Send email
    const emailHtml = `
      <h3>New Partner / Seller Request</h3>
      <p><strong>Company:</strong> ${company_name}</p>
      <p><strong>Representative:</strong> ${rep_name} (${rep_designation})</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${contact}</p>
      <p><strong>GST:</strong> ${gst || 'N/A'}</p>
    `;
    
    await sendMail({
      subject: `New Seller Request from ${company_name}`,
      html: emailHtml,
    });
    
    return NextResponse.json({ success: true, message: 'Seller inquiry submitted successfully.' });
  } catch (error) {
    console.error('Seller Inquiry API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit seller inquiry' }, { status: 500 });
  }
}
