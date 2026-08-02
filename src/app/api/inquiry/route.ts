import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendMail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // data format matching GlobalModals form
    const { name, email, phone, company, message, inquiry_type, product_name } = data;
    
    // Append product name and company to message for context
    const fullMessage = `Product: ${product_name}\nCompany: ${company || 'N/A'}\n\n${message}`;
    
    await pool.query(
      'INSERT INTO enquiries (name, email, phone, message, type) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, fullMessage, inquiry_type || 'enquiry']
    );
    
    // Send email
    const emailHtml = `
      <h3>New ${inquiry_type || 'Inquiry'} received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
      <p><strong>Product:</strong> ${product_name}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;
    
    await sendMail({
      subject: `New Inquiry: ${product_name} - from ${name}`,
      html: emailHtml,
    });
    
    return NextResponse.json({ success: true, message: 'Inquiry submitted successfully.' });
  } catch (error) {
    console.error('Inquiry API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
