import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendMail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, phone, message } = data;
    
    // Insert into enquiries table as a general contact
    await pool.query(
      'INSERT INTO enquiries (name, email, phone, message, type) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, message, 'Contact Us']
    );
    
    // Send email
    const emailHtml = `
      <h3>New Contact Us Message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;
    
    await sendMail({
      subject: `New Contact Request from ${name}`,
      html: emailHtml,
    });
    
    return NextResponse.json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}
