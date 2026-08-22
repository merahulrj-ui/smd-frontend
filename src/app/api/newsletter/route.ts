import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/mail';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(`newsletter_ip_${ip}`, 10, 15 * 60 * 1000); // 10 subscriptions per 15 mins
    
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Valid email is required' }, { status: 400 });
    }

    // Send notification email to admin
    await sendMail({
      to: 'info@smdmedicare.in',
      subject: 'New Newsletter Subscription!',
      html: `
        <h2>New Newsletter Subscription</h2>
        <p>A new user has subscribed to the newsletter.</p>
        <p><strong>Email:</strong> ${email}</p>
        <br/>
        <p><em>SMD Medicare System</em></p>
      `
    });

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
